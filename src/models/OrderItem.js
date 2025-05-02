const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  item_id: {
    type: String,
    required: [true, 'Please add an item ID'],
    unique: true,
    trim: true
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true
  },
  warehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  image_analysis: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OrderItem', OrderItemSchema); 