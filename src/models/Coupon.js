const mongoose = require('mongoose');

// Drop the old collection if it exists
mongoose.connection.on('connected', async () => {
  try {
    await mongoose.connection.db.collection('coupons').dropIndex('coupon_id_1');
    console.log('Successfully dropped coupon_id index');
  } catch (err) {
    // Ignore error if index doesn't exist
    console.log('Index drop error (can be ignored):', err.message);
  }
});

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a coupon code'],
    unique: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  discount_type: {
    type: String,
    enum: ['percentage', 'fixed_amount'],
    required: [true, 'Please specify discount type']
  },
  discount_value: {
    type: Number,
    required: [true, 'Please add discount value'],
    min: [0, 'Discount value cannot be negative']
  },
  min_order_value: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order value cannot be negative']
  },
  max_discount: {
    type: Number,
    min: [0, 'Maximum discount cannot be negative']
  },
  start_date: {
    type: Date,
    required: [true, 'Please add start date']
  },
  end_date: {
    type: Date,
    required: [true, 'Please add end date']
  },
  usage_limit: {
    type: Number,
    default: 1,
    min: [1, 'Usage limit must be at least 1']
  },
  used_count: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  deleted_at: {
    type: Date
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Validate end_date is after start_date
CouponSchema.pre('save', function(next) {
  if (this.end_date <= this.start_date) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Validate max_discount for percentage type
CouponSchema.pre('save', function(next) {
  if (this.discount_type === 'percentage' && this.discount_value > 100) {
    next(new Error('Percentage discount cannot exceed 100%'));
  }
  next();
});

module.exports = mongoose.model('Coupon', CouponSchema); 