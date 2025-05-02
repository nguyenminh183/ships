const express = require('express');
const {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(protect, createPayment)
  .get(protect, getPayments);

router
  .route('/:id')
  .get(protect, getPayment)
  .put(protect, updatePayment)
  .delete(protect, deletePayment);

module.exports = router; 