const Order = require('../models/Order');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.customer = req.user.id;

    // If coupon is provided, validate it
    if (req.body.coupon) {
      const coupon = await Coupon.findById(req.body.coupon);
      if (!coupon) {
        return res.status(404).json({
          success: false,
          message: 'Coupon not found'
        });
      }
    }

    const order = await Order.create(req.body);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    let query;

    // Phân quyền theo role
    switch (req.user.role) {
      case 'admin':
        query = Order.find();
        break;
      case 'staff':
        query = Order.find();
        break;
      case 'customer':
        query = Order.find({ customer: req.user.id });
        break;
      case 'shipper':
        query = Order.find({ shipper: req.user.id });
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
    const total = await Order.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Add populate
    query = query
      .populate({
        path: 'customer',
        select: 'name email'
      })
      .populate({
        path: 'coupon',
        select: 'code discount_type discount_value'
      });

    // Execute query
    const orders = await query;

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
      count: orders.length,
      pagination,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'customer',
        select: 'name email'
      })
      .populate({
        path: 'coupon',
        select: 'code discount_type discount_value'
      })
      .populate({
        path: 'shipper',
        select: 'name email'
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('User ID:', req.user.id);
    console.log('User Role:', req.user.role);
    console.log('Order Customer:', order.customer);
    console.log('Order Shipper:', order.shipper);

    // Phân quyền theo role
    switch (req.user.role) {
      case 'admin':
      case 'staff':
        // Admin và Staff có thể xem tất cả đơn hàng
        break;
      case 'customer':
        // Customer chỉ xem được đơn hàng của mình
        if (order.customer && order.customer._id.toString() !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to access this order'
          });
        }
        break;
      case 'shipper':
        // Shipper chỉ xem được đơn hàng được giao cho mình
        if (!order.shipper || order.shipper._id.toString() !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to access this order'
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
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
exports.updateOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id)
      .populate({
        path: 'customer',
        select: 'name email'
      })
      .populate({
        path: 'shipper',
        select: 'name email'
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Phân quyền theo role
    switch (req.user.role) {
      case 'admin':
        // Admin có thể cập nhật tất cả trạng thái
        break;
      case 'staff':
        // Staff có thể cập nhật trạng thái processing, shipping
        if (req.body.status && !['processing', 'shipping'].includes(req.body.status)) {
          return res.status(403).json({
            success: false,
            message: 'Staff can only update status to processing or shipping'
          });
        }
        break;
      case 'customer':
        // Customer chỉ có thể hủy đơn hàng của mình
        if (order.customer._id.toString() !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to update this order'
          });
        }
        if (req.body.status && req.body.status !== 'cancelled') {
          return res.status(403).json({
            success: false,
            message: 'Customer can only cancel their order'
          });
        }
        break;
      case 'shipper':
        // Shipper chỉ có thể cập nhật trạng thái completed cho đơn hàng được giao
        if (!order.shipper) {
          // Nếu đơn hàng chưa có shipper, gán shipper hiện tại
          req.body.shipper = req.user.id;
        } else if (order.shipper._id.toString() !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to update this order'
          });
        }
        if (req.body.status && req.body.status !== 'completed') {
          return res.status(403).json({
            success: false,
            message: 'Shipper can only mark order as completed'
          });
        }
        break;
      default:
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this route'
        });
    }

    // Cập nhật đơn hàng
    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate({
      path: 'customer',
      select: 'name email'
    }).populate({
      path: 'shipper',
      select: 'name email'
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user is order owner or admin
    if (order.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this order'
      });
    }

    await order.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 