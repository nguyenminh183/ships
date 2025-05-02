const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    unique: true,
    trim: true
  },
  coupon: {
    type: mongoose.Schema.ObjectId,
    ref: 'Coupon'
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  shipper: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipping', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  pickup_address: {
    type: String,
    required: [true, 'Please add pickup address']
  },
  delivery_address: {
    type: String,
    required: [true, 'Please add delivery address']
  },
  weight: {
    type: Number,
    required: [true, 'Please add weight']
  },
  dimensions: {
    type: String,
    required: [true, 'Please add dimensions']
  },
  item_type: {
    type: String,
    required: [true, 'Please add item type']
  },
  service_type: {
    type: String,
    required: [true, 'Please add service type'],
    enum: ['standard', 'express', 'same_day']
  },
  total: {
    type: Number,
    required: [true, 'Please add total amount']
  },
  total_fee: {
    type: Number,
    required: [true, 'Please add total fee']
  },
  service_fee: {
    type: Number,
    required: [true, 'Please add service fee']
  },
  is_suburban: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  delivered_at: {
    type: Date
  },
  estimated_time: {
    type: Date,
    required: [true, 'Please add estimated delivery time']
  },
  pickup_time_suggestion: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate order_id before saving
OrderSchema.pre('save', function(next) {
  if (!this.order_id) {
    this.order_id = 'ORD' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema); 