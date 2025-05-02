const mongoose = require('mongoose');

const ShipperSchema = new mongoose.Schema({
  shipper_id: {
    type: String,
    unique: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [/^[0-9]{10}$/, 'Please add a valid phone number']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  id_card: {
    type: String,
    required: [true, 'Please add an ID card number'],
    unique: true,
    match: [/^[0-9]{12}$/, 'ID card must be exactly 12 digits'],
    validate: {
      validator: function(v) {
        return /^[0-9]{12}$/.test(v);
      },
      message: props => `${props.value} is not a valid ID card number! Must be exactly 12 digits.`
    }
  },
  license_plate: {
    type: String,
    required: [true, 'Please add a license plate'],
    unique: true
  },
  vehicle_type: {
    type: String,
    required: [true, 'Please add a vehicle type'],
    enum: ['motorcycle', 'car', 'truck']
  },
  status: {
    type: String,
    required: [true, 'Please add a status'],
    enum: ['active', 'inactive', 'suspended', 'busy'],
    default: 'active'
  },
  current_location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate shipper_id before saving
ShipperSchema.pre('save', function(next) {
  if (!this.shipper_id) {
    this.shipper_id = 'SP' + Date.now();
  }
  next();
});

// Create index for geospatial queries
ShipperSchema.index({ current_location: '2dsphere' });

module.exports = mongoose.model('Shipper', ShipperSchema); 