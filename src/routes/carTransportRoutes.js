const express = require('express');
const {
  createCarTransport,
  getCarTransports,
  getCarTransport,
  updateCarTransport,
  deleteCarTransport
} = require('../controllers/carTransportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createCarTransport)
  .get(protect, authorize('admin'), getCarTransports);

router
  .route('/:id')
  .get(protect, authorize('admin'), getCarTransport)
  .put(protect, authorize('admin'), updateCarTransport)
  .delete(protect, authorize('admin'), deleteCarTransport);

module.exports = router; 