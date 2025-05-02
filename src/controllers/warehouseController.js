const Warehouse = require('../models/Warehouse');
const mongoose = require('mongoose');

// @desc    Create new warehouse
// @route   POST /api/warehouses
// @access  Private/Admin
exports.createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.create(req.body);

    res.status(201).json({
      success: true,
      data: warehouse
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all warehouses
// @route   GET /api/warehouses
// @access  Private
exports.getWarehouses = async (req, res, next) => {
  try {
    let query = Warehouse.find({ is_deleted: false });

    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Warehouse.countDocuments({ is_deleted: false });

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const warehouses = await query;

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
      count: warehouses.length,
      pagination,
      data: warehouses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single warehouse
// @route   GET /api/warehouses/:id
// @access  Private
exports.getWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findOne({ 
      _id: req.params.id,
      is_deleted: false
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    res.status(200).json({
      success: true,
      data: warehouse
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update warehouse
// @route   PUT /api/warehouses/:id
// @access  Private/Admin
exports.updateWarehouse = async (req, res, next) => {
  try {
    // Validate if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid warehouse ID format'
      });
    }

    let warehouse = await Warehouse.findOne({ 
      _id: req.params.id,
      is_deleted: false
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    // Chỉ admin mới có thể cập nhật kho
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update warehouse'
      });
    }

    warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: warehouse
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete warehouse
// @route   DELETE /api/warehouses/:id
// @access  Private/Admin
exports.deleteWarehouse = async (req, res, next) => {
  try {
    // Validate if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid warehouse ID format'
      });
    }

    const warehouse = await Warehouse.findOne({ 
      _id: req.params.id,
      is_deleted: false
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    // Chỉ admin mới có thể xóa kho
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete warehouse'
      });
    }

    // Thực hiện xóa mềm
    await Warehouse.findByIdAndUpdate(
      req.params.id,
      { $set: { is_deleted: true } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 