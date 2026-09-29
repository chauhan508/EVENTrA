const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// POST /api/admin/login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const secret = process.env.JWT_SECRET || 'codechef_abesec_production_secret_2026';
    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      secret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/me
const getAdminProfile = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      admin: req.admin
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalEvents, upcomingEventsCount, totalRegistrations, thisMonthCount] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: now } }),
      Registration.countDocuments(),
      Registration.countDocuments({ registeredAt: { $gte: startOfMonth } })
    ]);

    // Latest 5 registrations
    const recentRegistrations = await Registration.find()
      .populate('eventId', 'name category date venue')
      .sort({ registeredAt: -1 })
      .limit(6)
      .lean();

    // Upcoming 5 events with counts
    const upcomingEvents = await Event.find({ date: { $gte: now } })
      .sort({ date: 1 })
      .limit(5)
      .lean();

    const upcomingIds = upcomingEvents.map((e) => e._id);
    const regCounts = await Registration.aggregate([
      { $match: { eventId: { $in: upcomingIds } } },
      { $group: { _id: '$eventId', count: { $sum: 1 } } }
    ]);

    const countMap = regCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const enrichedUpcoming = upcomingEvents.map((e) => ({
      ...e,
      registrationCount: countMap[e._id.toString()] || 0
    }));

    return res.json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents: upcomingEventsCount,
        totalRegistrations,
        thisMonthRegistrations: thisMonthCount,
        recentRegistrations,
        upcomingEventsList: enrichedUpcoming
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/registrations
const getAdminRegistrations = async (req, res, next) => {
  try {
    const { search, eventId, year, page = 1, limit = 20 } = req.query;

    const query = {};

    if (eventId && eventId !== 'All') {
      query.eventId = eventId;
    }

    if (year && year !== 'All') {
      query.year = year;
    }

    let searchConditions = [];
    if (search && search.trim()) {
      const term = search.trim();
      searchConditions.push(
        { name: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } }
      );

      // Also allow searching event name
      const matchingEvents = await Event.find({ name: { $regex: term, $options: 'i' } }).select('_id');
      if (matchingEvents.length > 0) {
        searchConditions.push({ eventId: { $in: matchingEvents.map((e) => e._id) } });
      }

      query.$or = searchConditions;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, registrations] = await Promise.all([
      Registration.countDocuments(query),
      Registration.find(query)
        .populate('eventId', 'name category date venue')
        .sort({ registeredAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    return res.json({
      success: true,
      data: registrations,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  adminLogin,
  getAdminProfile,
  getDashboardStats,
  getAdminRegistrations
};
