const Tracking = require('../models/Tracking');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create new tracking
// @route   POST /api/trackings
// @access  Private/Admin
exports.createTracking = async (req, res, next) => {
  try {
    // Check if order exists
    const order = await Order.findById(req.body.order);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if shipper exists and is a shipper
    const shipper = await User.findById(req.body.shipper);
    if (!shipper || shipper.role !== 'shipper') {
      return res.status(404).json({
        success: false,
        message: 'Shipper not found or not a shipper'
      });
    }

    const tracking = await Tracking.create(req.body);

    res.status(201).json({
      success: true,
      data: tracking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all trackings
// @route   GET /api/trackings
// @access  Private/Admin
exports.getTrackings = async (req, res, next) => {
  try {
    const trackings = await Tracking.find()
      .populate({
        path: 'order',
        select: 'order_id customer'
      })
      .populate({
        path: 'shipper',
        select: 'name email'
      });

    res.status(200).json({
      success: true,
      count: trackings.length,
      data: trackings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single tracking
// @route   GET /api/trackings/:id
// @access  Private
exports.getTracking = async (req, res, next) => {
  try {
    const tracking = await Tracking.findById(req.params.id)
      .populate({
        path: 'order',
        select: 'order_id customer'
      })
      .populate({
        path: 'shipper',
        select: 'name email'
      });

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: 'Tracking not found'
      });
    }

    // Make sure user is order owner or admin
    if (
      tracking.order.customer.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this tracking'
      });
    }

    res.status(200).json({
      success: true,
      data: tracking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update tracking
// @route   PUT /api/trackings/:id
// @access  Private/Admin
exports.updateTracking = async (req, res, next) => {
  try {
    let tracking = await Tracking.findById(req.params.id);

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: 'Tracking not found'
      });
    }

    tracking = await Tracking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: tracking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete tracking
// @route   DELETE /api/trackings/:id
// @access  Private/Admin
exports.deleteTracking = async (req, res, next) => {
  try {
    const tracking = await Tracking.findById(req.params.id);

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: 'Tracking not found'
      });
    }

    await tracking.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 