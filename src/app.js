const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/salaries', require('./routes/salaryRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));
app.use('/api/warehouses', require('./routes/warehouseRoutes'));
app.use('/api/cartransports', require('./routes/carTransportRoutes'));
app.use('/api/orderitems', require('./routes/orderItemRoutes'));
app.use('/api/transferreceipts', require('./routes/transferReceiptRoutes'));
app.use('/api/grouporders', require('./routes/groupOrderRoutes'));
app.use('/api/trackings', require('./routes/trackingRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/customercosts', require('./routes/customerCostRoutes'));
app.use('/api/shippers', require('./routes/shipperRoutes'));

module.exports = app; 