const express = require('express');
const {
  createGroupOrder,
  getGroupOrders,
  getGroupOrder,
  updateGroupOrder,
  deleteGroupOrder
} = require('../controllers/groupOrderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createGroupOrder)
  .get(protect, authorize('admin'), getGroupOrders);

router
  .route('/:id')
  .get(protect, authorize('admin'), getGroupOrder)
  .put(protect, authorize('admin'), updateGroupOrder)
  .delete(protect, authorize('admin'), deleteGroupOrder);

module.exports = router; 