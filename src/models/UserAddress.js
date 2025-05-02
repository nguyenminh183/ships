const mongoose = require('mongoose');

const UserAddressSchema = new mongoose.Schema({
  useraddress_id: {
    type: String,
    required: [true, 'Please add a user address ID'],
    unique: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  label: {
    type: String,
    required: [true, 'Please add a label']
  },
  address: {
    house_number: {
      type: String,
      required: [true, 'Please add house number']
    },
    street: {
      type: String,
      required: [true, 'Please add street']
    },
    ward: {
      type: String,
      required: [true, 'Please add ward']
    },
    district: {
      type: String,
      required: [true, 'Please add district']
    },
    city: {
      type: String,
      required: [true, 'Please add city']
    }
  },
  is_default: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserAddress', UserAddressSchema); 