const mongoose = require('mongoose');

const UserCouponSchema = new mongoose.Schema({
  usercoupon_id: {
    type: String,
    required: [true, 'Please add a user coupon ID'],
    unique: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  coupon: {
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon',
    required: true
  },
  used_at: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'used', 'expired'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserCoupon', UserCouponSchema); 