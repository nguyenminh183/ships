const mongoose = require('mongoose');

const TrackingSchema = new mongoose.Schema({
  tracking_id: {
    type: String,
    required: [true, 'Please add a tracking ID'],
    unique: true,
    trim: true
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true
  },
  shipper: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'picked_up', 'in_transit', 'delivered', 'failed'],
    required: true
  },
  location: {
    type: String,
    required: [true, 'Please add location']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  smart_suggestion: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tracking', TrackingSchema); 