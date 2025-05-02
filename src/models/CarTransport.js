const mongoose = require('mongoose');

const CarTransportSchema = new mongoose.Schema({
  cartransport_id: {
    type: String,
    required: [true, 'Please add a car transport ID'],
    unique: true,
    trim: true
  },
  licence_plate: {
    type: String,
    required: [true, 'Please add a license plate'],
    unique: true
  },
  capacity_kg: {
    type: Number,
    required: [true, 'Please add capacity in kg']
  },
  driver_name: {
    type: String,
    required: [true, 'Please add driver name']
  },
  assigned_group: {
    type: mongoose.Schema.ObjectId,
    ref: 'GroupOrder'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CarTransport', CarTransportSchema); 