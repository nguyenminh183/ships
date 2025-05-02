const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  payment_id: {
    type: String,
    required: [true, 'Please add a payment ID'],
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
  method: {
    type: String,
    required: [true, 'Please add payment method'],
    enum: ['cash', 'credit_card', 'bank_transfer', 'e_wallet']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paid_at: {
    type: Date
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema); 