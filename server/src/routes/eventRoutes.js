const express = require('express');
const router = express.Router();
const {
  getPublicEvents,
  getPublicEventById,
  registerForEvent
} = require('../controllers/eventController');

router.get('/', getPublicEvents);
router.get('/:id', getPublicEventById);
router.post('/:id/register', registerForEvent);

module.exports = router;
