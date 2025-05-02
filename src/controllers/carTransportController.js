const CarTransport = require('../models/CarTransport');
const GroupOrder = require('../models/GroupOrder');

// @desc    Create new car transport
// @route   POST /api/cartransports
// @access  Private/Admin
exports.createCarTransport = async (req, res, next) => {
  try {
    // Check if group order exists
    if (req.body.assigned_group) {
      const groupOrder = await GroupOrder.findById(req.body.assigned_group);
      if (!groupOrder) {
        return res.status(404).json({
          success: false,
          message: 'Group order not found'
        });
      }
    }

    const carTransport = await CarTransport.create(req.body);

    res.status(201).json({
      success: true,
      data: carTransport
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all car transports
// @route   GET /api/cartransports
// @access  Private/Admin
exports.getCarTransports = async (req, res, next) => {
  try {
    const carTransports = await CarTransport.find()
      .populate({
        path: 'assigned_group',
        select: 'grouporder_id province district'
      });

    res.status(200).json({
      success: true,
      count: carTransports.length,
      data: carTransports
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single car transport
// @route   GET /api/cartransports/:id
// @access  Private/Admin
exports.getCarTransport = async (req, res, next) => {
  try {
    const carTransport = await CarTransport.findById(req.params.id)
      .populate({
        path: 'assigned_group',
        select: 'grouporder_id province district'
      });

    if (!carTransport) {
      return res.status(404).json({
        success: false,
        message: 'Car transport not found'
      });
    }

    res.status(200).json({
      success: true,
      data: carTransport
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update car transport
// @route   PUT /api/cartransports/:id
// @access  Private/Admin
exports.updateCarTransport = async (req, res, next) => {
  try {
    let carTransport = await CarTransport.findById(req.params.id);

    if (!carTransport) {
      return res.status(404).json({
        success: false,
        message: 'Car transport not found'
      });
    }

    // Check if group order exists
    if (req.body.assigned_group) {
      const groupOrder = await GroupOrder.findById(req.body.assigned_group);
      if (!groupOrder) {
        return res.status(404).json({
          success: false,
          message: 'Group order not found'
        });
      }
    }

    carTransport = await CarTransport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: carTransport
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete car transport
// @route   DELETE /api/cartransports/:id
// @access  Private/Admin
exports.deleteCarTransport = async (req, res, next) => {
  try {
    const carTransport = await CarTransport.findById(req.params.id);

    if (!carTransport) {
      return res.status(404).json({
        success: false,
        message: 'Car transport not found'
      });
    }

    await carTransport.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 