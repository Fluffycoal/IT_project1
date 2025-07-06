const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const Review = require('../models/Review');
const Venue = require('../models/Venue');
const User = require('../models/user'); 
const Sequelize = require('sequelize');
const { fn, col } = Sequelize;

// ✅ Submit a review
router.post('/', authenticateUser, async (req, res) => {
  const { venueName, rating, comment } = req.body;

  if (!venueName || !rating) {
    return res.status(400).json({ message: 'Venue name and rating are required' });
  }

  try {
    // ✅ Case-insensitive search for venue
    const venue = await Venue.findOne({
      where: Sequelize.where(
        fn('LOWER', col('name')),
        venueName.toLowerCase()
      )
    });

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found with that name' });
    }

    const review = await Review.create({
      clientId: req.user.id,
      venueId: venue.id,
      rating,
      comment
    });

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('❌ Error submitting review:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ✅ Fetch reviews for a venue
router.get('/venue/:venueName/reviews', async (req, res) => {
  const { venueName } = req.params;

  try {
    const venue = await Venue.findOne({
      where: Sequelize.where(
        fn('LOWER', col('name')),
        venueName.toLowerCase()
      )
    });

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const reviews = await Review.findAll({
      where: { venueId: venue.id },
      include: { model: User, attributes: ['username'] },
      order: [['createdAt', 'DESC']]
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      username: r.User?.username || 'Anonymous'
    }));

    res.json(formatted);
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
