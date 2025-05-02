const Address = require('../models/Address');
const asyncHandler = require('express-async-handler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private/Customer
exports.createAddress = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const address = await Address.create(req.body);

  res.status(201).json({
    success: true,
    data: address
  });
});

// @desc    Get all addresses
// @route   GET /api/addresses
// @access  Private/Customer,Admin,Staff,Shipper
exports.getAddresses = asyncHandler(async (req, res, next) => {
  let query;

  // If user is customer, only show their addresses
  if (req.user.role === 'customer') {
    query = Address.find({
      user: req.user.id,
      is_deleted: false
    });
  } 
  // If user is admin/staff/shipper, they can see all addresses
  else {
    query = Address.find({ is_deleted: false });
  }

  // Add pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Address.countDocuments(query._conditions);

  query = query
    .sort('-is_default -created_at')
    .skip(startIndex)
    .limit(limit)
    .populate({
      path: 'user',
      select: 'name email phone'
    });

  const addresses = await query;

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
    count: addresses.length,
    pagination,
    data: addresses
  });
});

// @desc    Get single address
// @route   GET /api/addresses/:id
// @access  Private/Customer,Admin,Staff,Shipper
exports.getAddress = asyncHandler(async (req, res, next) => {
  let query;

  // If user is customer, only show their address
  if (req.user.role === 'customer') {
    query = Address.findOne({
      _id: req.params.id,
      user: req.user.id,
      is_deleted: false
    });
  } 
  // If user is admin/staff/shipper, they can see any address
  else {
    query = Address.findOne({
      _id: req.params.id,
      is_deleted: false
    });
  }

  const address = await query.populate({
    path: 'user',
    select: 'name email phone'
  });

  if (!address) {
    return res.status(200).json({
      success: false,
      message: 'Không tìm thấy địa chỉ'
    });
  }

  res.status(200).json({
    success: true,
    data: address
  });
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private/Customer
exports.updateAddress = asyncHandler(async (req, res, next) => {
  let address = await Address.findOne({
    _id: req.params.id,
    user: req.user.id,
    is_deleted: false
  });

  if (!address) {
    return res.status(200).json({
      success: false,
      message: 'Không tìm thấy địa chỉ'
    });
  }

  address = await Address.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: address
  });
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private/Customer
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user.id,
    is_deleted: false
  });

  if (!address) {
    return res.status(200).json({
      success: false,
      message: 'Không tìm thấy địa chỉ'
    });
  }

  // Soft delete
  address.is_deleted = true;
  address.deleted_at = Date.now();
  await address.save();

  res.status(200).json({
    success: true,
    message: 'Xóa địa chỉ thành công'
  });
});

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private/Customer
exports.setDefaultAddress = asyncHandler(async (req, res, next) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user.id,
    is_deleted: false
  });

  if (!address) {
    return res.status(200).json({
      success: false,
      message: 'Không tìm thấy địa chỉ'
    });
  }

  address.is_default = true;
  await address.save();

  res.status(200).json({
    success: true,
    data: address
  });
}); 