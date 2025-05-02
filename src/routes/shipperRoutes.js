const express = require('express');
const {
  createShipper,
  getShippers,
  getShipper,
  updateShipper,
  deleteShipper
} = require('../controllers/shipperController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createShipper)
  .get(protect, authorize('admin', 'staff'), getShippers);

router
  .route('/:id')
  .get(protect, authorize('admin', 'staff'), getShipper)
  .put(protect, authorize('admin', 'staff'), updateShipper)
  .delete(protect, authorize('admin'), deleteShipper);

module.exports = router; 