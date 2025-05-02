const mongoose = require('mongoose');

const TransferReceiptSchema = new mongoose.Schema({
  transferreceipt_id: {
    type: String,
    required: [true, 'Please add a transfer receipt ID'],
    unique: true,
    trim: true
  },
  from_warehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  to_warehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: true
  },
  group_order: {
    type: mongoose.Schema.ObjectId,
    ref: 'GroupOrder',
    required: true
  },
  confirmed_by: {
    type: String,
    required: [true, 'Please add who confirmed the transfer']
  },
  confirmed_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TransferReceipt', TransferReceiptSchema); 