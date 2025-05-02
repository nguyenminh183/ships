const express = require('express');
const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createCoupon)
  .get(protect, authorize('admin', 'staff'), getCoupons);

router
  .route('/validate')
  .post(protect, authorize('customer'), validateCoupon);

router
  .route('/:id')
  .get(protect, authorize('admin', 'staff'), getCoupon)
  .put(protect, authorize('admin'), updateCoupon)
  .delete(protect, authorize('admin'), deleteCoupon);

module.exports = router; 