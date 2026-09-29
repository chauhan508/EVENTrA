const Event = require('../models/Event');
const Registration = require('../models/Registration');

// GET /api/events (Public)
const getPublicEvents = async (req, res, next) => {
  try {
    const { category, search, sort, featured } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    let sortOption = { date: 1 }; // Default: Upcoming first
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'date_desc') {
      sortOption = { date: -1 };
    }

    const events = await Event.find(query).sort(sortOption).lean();

    // Attach registration count to each event
    const eventIds = events.map((e) => e._id);
    const counts = await Registration.aggregate([
      { $match: { eventId: { $in: eventIds } } },
      { $group: { _id: '$eventId', count: { $sum: 1 } } }
    ]);

    const countMap = counts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const eventsWithCounts = events.map((e) => {
      const now = new Date();
      const isPastDeadline = now > new Date(e.registrationDeadline);
      return {
        ...e,
        registrationCount: countMap[e._id.toString()] || 0,
        isPastDeadline,
        isRegistrationAvailable: e.registrationOpen && !isPastDeadline
      };
    });

    return res.json({
      success: true,
      count: eventsWithCounts.length,
      data: eventsWithCounts
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/events/:id (Public)
const getPublicEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const registrationCount = await Registration.countDocuments({ eventId: event._id });
    const now = new Date();
    const isPastDeadline = now > new Date(event.registrationDeadline);

    return res.json({
      success: true,
      data: {
        ...event,
        registrationCount,
        isPastDeadline,
        isRegistrationAvailable: event.registrationOpen && !isPastDeadline
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/events/:id/register (Public)
const registerForEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, college, year, phone } = req.body;

    // Backend validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'A valid email address is required' });
    }
    if (!college || !college.trim()) {
      return res.status(400).json({ success: false, message: 'College name is required' });
    }
    if (!year || !['1st Year', '2nd Year', '3rd Year', '4th Year'].includes(year)) {
      return res.status(400).json({ success: false, message: 'Valid study year is required' });
    }
    if (!phone || !/^[0-9+\-\s()]{7,15}$/.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'A valid phone number is required' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if registration is open
    if (!event.registrationOpen) {
      return res.status(400).json({
        success: false,
        message: 'Registrations are currently closed for this event.'
      });
    }

    // Check registration deadline
    const now = new Date();
    if (now > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed. New registrations are no longer accepted.'
      });
    }

    // Check for duplicate registration
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await Registration.findOne({
      eventId: event._id,
      email: normalizedEmail
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already registered for this event with this email address.'
      });
    }

    // Save registration
    const registration = await Registration.create({
      eventId: event._id,
      name: name.trim(),
      email: normalizedEmail,
      college: college.trim(),
      year,
      phone: phone.trim(),
      registeredAt: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful! See you at the event.',
      data: {
        registration: {
          id: registration._id,
          name: registration.name,
          email: registration.email,
          college: registration.college,
          year: registration.year,
          registeredAt: registration.registeredAt
        },
        event: {
          id: event._id,
          name: event.name,
          category: event.category,
          date: event.date,
          time: event.time,
          venue: event.venue
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/events (Admin)
const getAdminEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).lean();

    const eventIds = events.map((e) => e._id);
    const counts = await Registration.aggregate([
      { $match: { eventId: { $in: eventIds } } },
      { $group: { _id: '$eventId', count: { $sum: 1 } } }
    ]);

    const countMap = counts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const enriched = events.map((e) => {
      const now = new Date();
      return {
        ...e,
        registrationCount: countMap[e._id.toString()] || 0,
        isPastDeadline: now > new Date(e.registrationDeadline)
      };
    });

    return res.json({
      success: true,
      data: enriched
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/events (Admin)
const createEvent = async (req, res, next) => {
  try {
    const {
      name,
      category,
      date,
      time,
      venue,
      shortDescription,
      description,
      registrationDeadline,
      isFeatured,
      registrationOpen
    } = req.body;

    if (!name || !category || !date || !time || !venue || !shortDescription || !description || !registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'All event details including deadline are required.'
      });
    }

    // If isFeatured is true, optionally unfeature other events if single featured is desired or keep multiple
    const event = await Event.create({
      name: name.trim(),
      category,
      date: new Date(date),
      time: time.trim(),
      venue: venue.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      registrationDeadline: new Date(registrationDeadline),
      isFeatured: Boolean(isFeatured),
      registrationOpen: registrationOpen !== undefined ? Boolean(registrationOpen) : true
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/events/:id (Admin)
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      date,
      time,
      venue,
      shortDescription,
      description,
      registrationDeadline,
      isFeatured,
      registrationOpen
    } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (name !== undefined) event.name = name.trim();
    if (category !== undefined) event.category = category;
    if (date !== undefined) event.date = new Date(date);
    if (time !== undefined) event.time = time.trim();
    if (venue !== undefined) event.venue = venue.trim();
    if (shortDescription !== undefined) event.shortDescription = shortDescription.trim();
    if (description !== undefined) event.description = description.trim();
    if (registrationDeadline !== undefined) event.registrationDeadline = new Date(registrationDeadline);
    if (isFeatured !== undefined) event.isFeatured = Boolean(isFeatured);
    if (registrationOpen !== undefined) event.registrationOpen = Boolean(registrationOpen);

    await event.save();

    return res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/events/:id (Admin)
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await Event.findByIdAndDelete(id);
    // Delete registrations associated with this event
    await Registration.deleteMany({ eventId: id });

    return res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicEvents,
  getPublicEventById,
  registerForEvent,
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
