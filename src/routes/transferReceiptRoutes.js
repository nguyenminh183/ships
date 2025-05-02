const express = require('express');
const {
  createTransferReceipt,
  getTransferReceipts,
  getTransferReceipt,
  updateTransferReceipt,
  deleteTransferReceipt
} = require('../controllers/transferReceiptController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createTransferReceipt)
  .get(protect, authorize('admin'), getTransferReceipts);

router
  .route('/:id')
  .get(protect, authorize('admin'), getTransferReceipt)
  .put(protect, authorize('admin'), updateTransferReceipt)
  .delete(protect, authorize('admin'), deleteTransferReceipt);

module.exports = router; 