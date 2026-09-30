const Event = require('../models/Event');
const Registration = require('../models/Registration');

// GET /api/events (Public)
const getPublicEvents = async (req, res, next) => {
  try {
    const { category, search, sort, featured } = req.query;

    const events = await Event.find({ category, search, sort, featured });

    const eventIds = events.map((e) => e.id || e._id);
    const countMap = await Registration.countByEventIds(eventIds);

    const eventsWithCounts = events.map((e) => {
      const eid = e.id || e._id;
      return {
        ...e,
        registrationCount: countMap[eid] || 0
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
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const eid = event.id || event._id;
    const countMap = await Registration.countByEventIds([eid]);
    const registrationCount = countMap[eid] || 0;

    return res.json({
      success: true,
      data: {
        ...event,
        registrationCount
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
      eventId: event.id || event._id,
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
      eventId: event.id || event._id,
      name: name.trim(),
      email: normalizedEmail,
      college: college.trim(),
      year,
      phone: phone.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful! See you at the event.',
      data: {
        registration: {
          id: registration.id || registration._id,
          name: registration.name,
          email: registration.email,
          college: registration.college,
          year: registration.year,
          registeredAt: registration.registeredAt
        },
        event: {
          id: event.id || event._id,
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
    const events = await Event.findAll();

    const eventIds = events.map((e) => e.id || e._id);
    const countMap = await Registration.countByEventIds(eventIds);

    const enriched = events.map((e) => {
      const eid = e.id || e._id;
      return {
        ...e,
        registrationCount: countMap[eid] || 0
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

    const event = await Event.create({
      name: name.trim(),
      category,
      date,
      time: time.trim(),
      venue: venue.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      registrationDeadline,
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
    const existing = await Event.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const updated = await Event.update(id, req.body);

    return res.json({
      success: true,
      message: 'Event updated successfully',
      data: updated
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

    await Registration.deleteByEventId(id);
    await Event.deleteById(id);

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
