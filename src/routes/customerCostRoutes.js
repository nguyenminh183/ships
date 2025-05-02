const express = require('express');
const {
  createCustomerCost,
  getCustomerCosts,
  getCustomerCost,
  updateCustomerCost,
  deleteCustomerCost
} = require('../controllers/customerCostController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createCustomerCost)
  .get(protect, authorize('admin'), getCustomerCosts);

router
  .route('/:id')
  .get(protect, authorize('admin'), getCustomerCost)
  .put(protect, authorize('admin'), updateCustomerCost)
  .delete(protect, authorize('admin'), deleteCustomerCost);

module.exports = router; 