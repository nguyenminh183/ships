const mongoose = require('mongoose');

const CouponUsageSchema = new mongoose.Schema({
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  used_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index to ensure one customer can only use a coupon once
CouponUsageSchema.index({ coupon: 1, customer: 1 }, { unique: true });

module.exports = mongoose.model('CouponUsage', CouponUsageSchema); 