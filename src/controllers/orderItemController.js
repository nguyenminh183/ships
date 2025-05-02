const OrderItem = require('../models/OrderItem');
const Order = require('../models/Order');
const Warehouse = require('../models/Warehouse');

// @desc    Create new order item
// @route   POST /api/orderitems
// @access  Private/Admin
exports.createOrderItem = async (req, res, next) => {
  try {
    // Check if order exists
    const order = await Order.findById(req.body.order);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if warehouse exists
    const warehouse = await Warehouse.findById(req.body.warehouse);
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    const orderItem = await OrderItem.create(req.body);

    res.status(201).json({
      success: true,
      data: orderItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all order items
// @route   GET /api/orderitems
// @access  Private/Admin
exports.getOrderItems = async (req, res, next) => {
  try {
    const orderItems = await OrderItem.find()
      .populate({
        path: 'order',
        select: 'order_id customer'
      })
      .populate({
        path: 'warehouse',
        select: 'warehouse_id location'
      });

    res.status(200).json({
      success: true,
      count: orderItems.length,
      data: orderItems
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order item
// @route   GET /api/orderitems/:id
// @access  Private/Admin
exports.getOrderItem = async (req, res, next) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id)
      .populate({
        path: 'order',
        select: 'order_id customer'
      })
      .populate({
        path: 'warehouse',
        select: 'warehouse_id location'
      });

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: orderItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order item
// @route   PUT /api/orderitems/:id
// @access  Private/Admin
exports.updateOrderItem = async (req, res, next) => {
  try {
    let orderItem = await OrderItem.findById(req.params.id);

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      });
    }

    // Check if order exists
    if (req.body.order) {
      const order = await Order.findById(req.body.order);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
    }

    // Check if warehouse exists
    if (req.body.warehouse) {
      const warehouse = await Warehouse.findById(req.body.warehouse);
      if (!warehouse) {
        return res.status(404).json({
          success: false,
          message: 'Warehouse not found'
        });
      }
    }

    orderItem = await OrderItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: orderItem
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete order item
// @route   DELETE /api/orderitems/:id
// @access  Private/Admin
exports.deleteOrderItem = async (req, res, next) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id);

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found'
      });
    }

    await orderItem.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 