const express = require('express');
const {
  createOrderItem,
  getOrderItems,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem
} = require('../controllers/orderItemController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createOrderItem)
  .get(protect, authorize('admin'), getOrderItems);

router
  .route('/:id')
  .get(protect, authorize('admin'), getOrderItem)
  .put(protect, authorize('admin'), updateOrderItem)
  .delete(protect, authorize('admin'), deleteOrderItem);

module.exports = router; 