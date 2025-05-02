const mongoose = require('mongoose');
const config = require('../config/config');

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Drop the coupon_id index
mongoose.connection.db.collection('coupons').dropIndex('coupon_id_1')
  .then(() => {
    console.log('Successfully dropped coupon_id index');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error dropping index:', err);
    process.exit(1);
  }); 