const Payment = require('../models/Payment');
const Order = require('../models/Order');

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res, next) => {
  try {
    // Check if order exists
    const order = await Order.findById(req.body.order);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user is order owner
    if (order.customer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to create payment for this order'
      });
    }

    // Generate payment_id
    req.body.payment_id = 'PAY' + Date.now();

    const payment = await Payment.create(req.body);

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res, next) => {
  try {
    let query;

    // Phân quyền theo role
    switch (req.user.role) {
      case 'admin':
      case 'staff':
        // Admin và Staff có thể xem tất cả thanh toán
        query = Payment.find({ is_deleted: false });
        break;
      case 'customer':
        // Customer chỉ xem được thanh toán của mình
        const orders = await Order.find({ customer: req.user.id });
        const orderIds = orders.map(order => order._id);
        query = Payment.find({ 
          order: { $in: orderIds },
          is_deleted: false
        });
        break;
      default:
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this route'
        });
    }

    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Payment.countDocuments({ is_deleted: false });

    query = query.skip(startIndex).limit(limit);

    // Add populate
    query = query.populate({
      path: 'order',
      select: 'order_id customer'
    });

    // Execute query
    const payments = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      pagination,
      data: payments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ 
      payment_id: req.params.id,
      is_deleted: false
    }).populate({
      path: 'order',
      select: 'order_id customer'
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Phân quyền theo role
    switch (req.user.role) {
      case 'admin':
      case 'staff':
        // Admin và Staff có thể xem tất cả thanh toán
        break;
      case 'customer':
        // Customer chỉ xem được thanh toán của mình
        if (!payment.order || payment.order.customer.toString() !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to access this payment'
          });
        }
        break;
      default:
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this route'
        });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private
exports.updatePayment = async (req, res, next) => {
  try {
    let payment = await Payment.findOne({ 
      payment_id: req.params.id,
      is_deleted: false
    }).populate({
      path: 'order',
      select: 'order_id customer'
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Phân quyền theo role
    switch (req.user.role) {
      case 'admin':
        // Admin có thể cập nhật tất cả thông tin thanh toán
        break;
      case 'staff':
        // Staff chỉ có thể cập nhật trạng thái thanh toán
        if (req.body.status && !['completed', 'failed'].includes(req.body.status)) {
          return res.status(403).json({
            success: false,
            message: 'Staff can only update status to completed or failed'
          });
        }
        // Chỉ cho phép cập nhật trạng thái và ghi chú
        const allowedFields = ['status', 'notes'];
        Object.keys(req.body).forEach(key => {
          if (!allowedFields.includes(key)) {
            delete req.body[key];
          }
        });
        break;
      case 'customer':
        // Customer không thể cập nhật thanh toán
        return res.status(403).json({
          success: false,
          message: 'Customer cannot update payment'
        });
      default:
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this route'
        });
    }

    // Nếu cập nhật trạng thái thành completed, thêm thời gian thanh toán
    if (req.body.status === 'completed') {
      req.body.paid_at = Date.now();
    }

    // Cập nhật thanh toán
    payment = await Payment.findOneAndUpdate(
      { payment_id: req.params.id },
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'order',
      select: 'order_id customer'
    });

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
exports.deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ 
      payment_id: req.params.id,
      is_deleted: false
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Chỉ admin mới có thể xóa thanh toán
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete payment'
      });
    }

    // Thực hiện xóa mềm
    await Payment.findOneAndUpdate(
      { payment_id: req.params.id },
      { $set: { is_deleted: true } }
    );

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 