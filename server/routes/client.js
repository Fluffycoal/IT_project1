const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const Review = require('../models/Review');
const User = require('../models/user');

const { authenticateUser } = require('../middleware/authMiddleware');

// GET /api/client/bookings
router.get('/bookings', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json({ message: 'Forbidden' });

    const bookings = await Booking.findAll({
      where: { clientId: req.user.id },
      include: [Venue]
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching client bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/client/reviews
router.get('/reviews', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json({ message: 'Forbidden' });

    const reviews = await Review.findAll({
      where: { clientId: req.user.id },
      include: [Venue]
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching client reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
