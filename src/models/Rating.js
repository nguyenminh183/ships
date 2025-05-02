const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  rating_id: {
    type: String,
    unique: true,
    trim: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  shipper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipper',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  images: [{
    type: String,
    trim: true
  }],
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate rating_id before saving
RatingSchema.pre('save', function(next) {
  if (!this.rating_id) {
    this.rating_id = 'RT' + Date.now();
  }
  next();
});

// Create compound index for unique rating per order
RatingSchema.index({ order: 1, customer: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema); 