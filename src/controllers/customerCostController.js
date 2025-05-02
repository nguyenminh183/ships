const CustomerCost = require('../models/CustomerCost');
const Order = require('../models/Order');

// @desc    Create new customer cost
// @route   POST /api/customercosts
// @access  Private/Admin
exports.createCustomerCost = async (req, res, next) => {
  try {
    // Check if order exists
    const order = await Order.findById(req.body.order);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const customerCost = await CustomerCost.create(req.body);

    res.status(201).json({
      success: true,
      data: customerCost
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all customer costs
// @route   GET /api/customercosts
// @access  Private/Admin
exports.getCustomerCosts = async (req, res, next) => {
  try {
    const customerCosts = await CustomerCost.find()
      .populate({
        path: 'order',
        select: 'order_id customer'
      });

    res.status(200).json({
      success: true,
      count: customerCosts.length,
      data: customerCosts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single customer cost
// @route   GET /api/customercosts/:id
// @access  Private/Admin
exports.getCustomerCost = async (req, res, next) => {
  try {
    const customerCost = await CustomerCost.findById(req.params.id)
      .populate({
        path: 'order',
        select: 'order_id customer'
      });

    if (!customerCost) {
      return res.status(404).json({
        success: false,
        message: 'Customer cost not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customerCost
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update customer cost
// @route   PUT /api/customercosts/:id
// @access  Private/Admin
exports.updateCustomerCost = async (req, res, next) => {
  try {
    let customerCost = await CustomerCost.findById(req.params.id);

    if (!customerCost) {
      return res.status(404).json({
        success: false,
        message: 'Customer cost not found'
      });
    }

    customerCost = await CustomerCost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: customerCost
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete customer cost
// @route   DELETE /api/customercosts/:id
// @access  Private/Admin
exports.deleteCustomerCost = async (req, res, next) => {
  try {
    const customerCost = await CustomerCost.findById(req.params.id);

    if (!customerCost) {
      return res.status(404).json({
        success: false,
        message: 'Customer cost not found'
      });
    }

    await customerCost.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 