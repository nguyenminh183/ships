const express = require('express');
const {
  createTracking,
  getTrackings,
  getTracking,
  updateTracking,
  deleteTracking
} = require('../controllers/trackingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createTracking)
  .get(protect, authorize('admin'), getTrackings);

router
  .route('/:id')
  .get(protect, getTracking)
  .put(protect, authorize('admin'), updateTracking)
  .delete(protect, authorize('admin'), deleteTracking);

module.exports = router; 