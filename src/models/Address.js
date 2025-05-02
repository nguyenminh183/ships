const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  full_name: {
    type: String,
    required: [true, 'Please add a full name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please add a valid phone number']
  },
  province: {
    type: String,
    required: [true, 'Please add a province'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'Please add a district'],
    trim: true
  },
  ward: {
    type: String,
    required: [true, 'Please add a ward'],
    trim: true
  },
  street: {
    type: String,
    required: [true, 'Please add a street'],
    trim: true
  },
  is_default: {
    type: Boolean,
    default: false
  },
  address_type: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  deleted_at: {
    type: Date
  }
});

// Create index for faster queries
AddressSchema.index({ user: 1, is_deleted: 1 });
AddressSchema.index({ user: 1, is_default: 1 });

// Middleware to ensure only one default address per user
AddressSchema.pre('save', async function(next) {
  if (this.isModified('is_default') && this.is_default) {
    await this.constructor.updateMany(
      { 
        user: this.user,
        _id: { $ne: this._id },
        is_deleted: false
      },
      { is_default: false }
    );
  }
  next();
});

module.exports = mongoose.model('Address', AddressSchema); 