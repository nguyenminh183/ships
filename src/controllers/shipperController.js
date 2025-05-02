const Shipper = require('../models/Shipper');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Create new shipper
// @route   POST /api/shippers
// @access  Private/Admin
exports.createShipper = async (req, res, next) => {
  try {
    // Validate if user id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.body.user)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Validate ID card format
    if (!req.body.id_card || !/^[0-9]{12}$/.test(req.body.id_card)) {
      return res.status(400).json({
        success: false,
        message: 'ID card must be exactly 12 digits'
      });
    }

    // Check if user exists and is a shipper
    const user = await User.findById(req.body.user);
    if (!user || user.role !== 'shipper') {
      return res.status(400).json({
        success: false,
        message: 'User not found or not a shipper'
      });
    }

    // Check if shipper already exists for this user
    const existingShipper = await Shipper.findOne({ user: req.body.user });
    if (existingShipper) {
      return res.status(400).json({
        success: false,
        message: 'Shipper profile already exists for this user'
      });
    }

    // Check if id_card already exists
    const existingIdCard = await Shipper.findOne({ id_card: req.body.id_card });
    if (existingIdCard) {
      return res.status(400).json({
        success: false,
        message: 'ID Card number already exists'
      });
    }

    const shipper = await Shipper.create(req.body);

    res.status(201).json({
      success: true,
      data: shipper
    });
  } catch (err) {
    if (err.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      });
    }
    next(err);
  }
};

// @desc    Get all shippers
// @route   GET /api/shippers
// @access  Private/Admin,Staff
exports.getShippers = async (req, res, next) => {
  try {
    let query = Shipper.find({ is_deleted: false })
      .populate({
        path: 'user',
        select: 'name email'
      });

    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Shipper.countDocuments({ is_deleted: false });

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const shippers = await query;

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
      count: shippers.length,
      pagination,
      data: shippers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single shipper
// @route   GET /api/shippers/:id
// @access  Private/Admin,Staff
exports.getShipper = async (req, res, next) => {
  try {
    // Validate if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid shipper ID format'
      });
    }

    const shipper = await Shipper.findOne({ 
      _id: req.params.id,
      is_deleted: false
    }).populate({
      path: 'user',
      select: 'name email'
    });

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: 'Shipper not found'
      });
    }

    res.status(200).json({
      success: true,
      data: shipper
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update shipper
// @route   PUT /api/shippers/:id
// @access  Private/Admin,Staff
exports.updateShipper = async (req, res, next) => {
  try {
    // Validate if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid shipper ID format'
      });
    }

    let shipper = await Shipper.findOne({ 
      _id: req.params.id,
      is_deleted: false
    });

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: 'Shipper not found'
      });
    }

    // Check if user exists and is a shipper if user field is being updated
    if (req.body.user) {
      const user = await User.findById(req.body.user);
      if (!user || user.role !== 'shipper') {
        return res.status(400).json({
          success: false,
          message: 'User not found or not a shipper'
        });
      }
    }

    shipper = await Shipper.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: shipper
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete shipper
// @route   DELETE /api/shippers/:id
// @access  Private/Admin
exports.deleteShipper = async (req, res, next) => {
  try {
    // Validate if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid shipper ID format'
      });
    }

    const shipper = await Shipper.findOne({ 
      _id: req.params.id,
      is_deleted: false
    });

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: 'Shipper not found'
      });
    }

    // Thực hiện xóa mềm
    await Shipper.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          is_deleted: true,
          status: 'inactive',
          deleted_at: Date.now()
        } 
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Shipper has been soft deleted'
    });
  } catch (err) {
    next(err);
  }
}; 