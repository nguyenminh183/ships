const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
  warehouse_id: {
    type: String,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Please add a warehouse name'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  capacity: {
    type: Number,
    required: [true, 'Please add capacity']
  },
  current_stock: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  notes: {
    type: String
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate warehouse_id before saving
WarehouseSchema.pre('save', function(next) {
  if (!this.warehouse_id) {
    this.warehouse_id = 'WH' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Warehouse', WarehouseSchema); 