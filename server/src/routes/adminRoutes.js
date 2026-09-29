const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  adminLogin,
  getAdminProfile,
  getDashboardStats,
  getAdminRegistrations
} = require('../controllers/adminController');
const {
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Public admin route
router.post('/login', adminLogin);

// Protected admin routes
router.use(authMiddleware);

router.get('/me', getAdminProfile);
router.get('/stats', getDashboardStats);

// Event management
router.get('/events', getAdminEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Registrations management
router.get('/registrations', getAdminRegistrations);

module.exports = router;
