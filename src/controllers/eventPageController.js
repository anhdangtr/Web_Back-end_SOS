// src/controllers/eventPageController.js
const Event = require('../models/Event');
const User = require('../models/User');

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Validate eventId format
    if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(eventId).populate('category');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Check if user liked the event
exports.checkIfUserLiked = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id; // From authenticate middleware

    // Validate eventId format
    if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isLiked = user.interestingEvents.some(
      (item) => item.event.toString() === eventId
    );

    res.status(200).json({
      success: true,
      isLiked: isLiked
    });
  } catch (error) {
    console.error('Check like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Toggle like/unlike event
exports.toggleLikeEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id; // From authenticate middleware

    // Validate eventId format
    if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user already liked this event
    const alreadyLiked = user.interestingEvents.some(
      (item) => item.event.toString() === eventId
    );

    let isLiked;

    if (alreadyLiked) {
      // Unlike event: remove from user's interestingEvents and decrease counter
      user.interestingEvents = user.interestingEvents.filter(
        (item) => item.event.toString() !== eventId
      );
      event.interestingCount = Math.max(0, event.interestingCount - 1);
      isLiked = false;
    } else {
      // Like event: add to user's interestingEvents and increase counter
      user.interestingEvents.push({
        event: eventId,
        likedAt: new Date()
      });
      event.interestingCount = event.interestingCount + 1;
      isLiked = true;
    }

    // Save both user and event
    await user.save();
    await event.save();

    res.status(200).json({
      success: true,
      isLiked: isLiked,
      interestingCount: event.interestingCount,
      message: alreadyLiked ? 'Event unliked' : 'Event liked'
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};