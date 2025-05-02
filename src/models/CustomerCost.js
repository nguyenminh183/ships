const mongoose = require('mongoose');

const CustomerCostSchema = new mongoose.Schema({
  cost_id: {
    type: String,
    required: [true, 'Please add a cost ID'],
    unique: true,
    trim: true
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add amount']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CustomerCost', CustomerCostSchema); 