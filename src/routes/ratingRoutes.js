const express = require('express');
const {
  createRating,
  getRatings,
  getRating,
  updateRating,
  deleteRating,
  getPublicRatings
} = require('../controllers/ratingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('customer'), createRating)
  .get(protect, authorize('admin', 'staff', 'customer'), getRatings);

router
  .route('/public')
  .get(getPublicRatings);

router
  .route('/:id')
  .get(protect, authorize('admin', 'staff', 'customer'), getRating)
  .put(protect, authorize('customer'), updateRating)
  .delete(protect, authorize('admin', 'customer'), deleteRating);

module.exports = router; 