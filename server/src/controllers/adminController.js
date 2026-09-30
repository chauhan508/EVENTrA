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

    const admin = await Admin.findByEmail(email.trim().toLowerCase());
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
      { id: admin._id || admin.id, email: admin.email, name: admin.name },
      secret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id || admin.id,
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
      Event.count(),
      Event.countUpcoming(),
      Registration.count(),
      Registration.countSince(startOfMonth)
    ]);

    // Latest registrations
    const recentRegistrations = await Registration.findRecent(6);

    // Upcoming 5 events with counts
    const upcomingEvents = await Event.findUpcoming(5);
    const upcomingIds = upcomingEvents.map((e) => e.id || e._id);
    const countMap = await Registration.countByEventIds(upcomingIds);

    const enrichedUpcoming = upcomingEvents.map((e) => {
      const eid = e.id || e._id;
      return {
        ...e,
        registrationCount: countMap[eid] || 0
      };
    });

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

    let eventIds = null;
    if (search && search.trim()) {
      eventIds = await Event.findByNameSearch(search.trim());
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, registrations] = await Promise.all([
      Registration.count({ eventId, year, search, eventIds }),
      Registration.find({ eventId, year, search, eventIds, skip, limit: limitNum })
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
