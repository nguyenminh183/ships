const mongoose = require('mongoose');

const GroupOrderSchema = new mongoose.Schema({
  grouporder_id: {
    type: String,
    required: [true, 'Please add a group order ID'],
    unique: true,
    trim: true
  },
  province: {
    type: String,
    required: [true, 'Please add a province']
  },
  district: {
    type: String,
    required: [true, 'Please add a district']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  orders: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Order'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('GroupOrder', GroupOrderSchema); 