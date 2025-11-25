// src/routes/eventPageRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getEventById,
  checkIfUserLiked,
  toggleLikeEvent
} = require('../controllers/eventPageController');
const authenticate = require('../middleware/authMiddleware');

// Get event by ID
router.get('/:eventId', getEventById);

// Check if user liked the event (protected route)
router.get('/:eventId/check-like', authenticate, checkIfUserLiked);

// Toggle like/unlike event (protected route)
router.post('/:eventId/toggle-like', authenticate, toggleLikeEvent);

module.exports = router;