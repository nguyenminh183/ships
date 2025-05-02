const GroupOrder = require('../models/GroupOrder');
const Order = require('../models/Order');

// @desc    Create new group order
// @route   POST /api/grouporders
// @access  Private/Admin
exports.createGroupOrder = async (req, res, next) => {
  try {
    // Check if orders exist
    if (req.body.orders) {
      for (const orderId of req.body.orders) {
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({
            success: false,
            message: `Order ${orderId} not found`
          });
        }
      }
    }

    const groupOrder = await GroupOrder.create(req.body);

    res.status(201).json({
      success: true,
      data: groupOrder
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all group orders
// @route   GET /api/grouporders
// @access  Private/Admin
exports.getGroupOrders = async (req, res, next) => {
  try {
    const groupOrders = await GroupOrder.find()
      .populate({
        path: 'orders',
        select: 'order_id customer'
      });

    res.status(200).json({
      success: true,
      count: groupOrders.length,
      data: groupOrders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single group order
// @route   GET /api/grouporders/:id
// @access  Private/Admin
exports.getGroupOrder = async (req, res, next) => {
  try {
    const groupOrder = await GroupOrder.findById(req.params.id)
      .populate({
        path: 'orders',
        select: 'order_id customer'
      });

    if (!groupOrder) {
      return res.status(404).json({
        success: false,
        message: 'Group order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: groupOrder
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update group order
// @route   PUT /api/grouporders/:id
// @access  Private/Admin
exports.updateGroupOrder = async (req, res, next) => {
  try {
    let groupOrder = await GroupOrder.findById(req.params.id);

    if (!groupOrder) {
      return res.status(404).json({
        success: false,
        message: 'Group order not found'
      });
    }

    // Check if orders exist
    if (req.body.orders) {
      for (const orderId of req.body.orders) {
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({
            success: false,
            message: `Order ${orderId} not found`
          });
        }
      }
    }

    groupOrder = await GroupOrder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: groupOrder
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete group order
// @route   DELETE /api/grouporders/:id
// @access  Private/Admin
exports.deleteGroupOrder = async (req, res, next) => {
  try {
    const groupOrder = await GroupOrder.findById(req.params.id);

    if (!groupOrder) {
      return res.status(404).json({
        success: false,
        message: 'Group order not found'
      });
    }

    await groupOrder.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 