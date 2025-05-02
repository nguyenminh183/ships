const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const asyncHandler = require('express-async-handler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.created_by = req.user.id;

  const coupon = await Coupon.create(req.body);

  res.status(201).json({
    success: true,
    data: coupon
  });
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin,Staff
exports.getCoupons = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Coupon.find(JSON.parse(queryStr)).populate({
    path: 'created_by',
    select: 'name email'
  });

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Coupon.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const coupons = await query;

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
    count: coupons.length,
    pagination,
    data: coupons
  });
});

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin,Staff
exports.getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id).populate({
    path: 'created_by',
    select: 'name email'
  });

  if (!coupon) {
    return next(
      new ErrorResponse(`Coupon not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: coupon
  });
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  let coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(
      new ErrorResponse(`Coupon not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is coupon creator or admin
  if (coupon.created_by.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this coupon`,
        401
      )
    );
  }

  coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: coupon
  });
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(
      new ErrorResponse(`Coupon not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is coupon creator or admin
  if (coupon.created_by.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this coupon`,
        401
      )
    );
  }

  // Soft delete
  await Coupon.findByIdAndUpdate(req.params.id, {
    is_deleted: true,
    deleted_at: Date.now()
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Validate and use coupon
// @route   POST /api/coupons/validate
// @access  Private/Customer
exports.validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, order_value } = req.body;

  if (!code || !order_value) {
    return next(
      new ErrorResponse('Please provide coupon code and order value', 400)
    );
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    is_deleted: false,
    is_active: true
  });

  if (!coupon) {
    return res.status(200).json({
      success: false,
      message: 'Invalid coupon code'
    });
  }

  // Check if coupon is expired
  const now = new Date();
  const startDate = new Date(coupon.start_date);
  const endDate = new Date(coupon.end_date);
  
  // Set time to start of day for start date
  startDate.setHours(0, 0, 0, 0);
  // Set time to end of day for end date
  endDate.setHours(23, 59, 59, 999);

  if (now < startDate) {
    return res.status(200).json({
      success: false,
      message: `Coupon is not active yet. Valid from ${startDate.toLocaleDateString()}`
    });
  }
  if (now > endDate) {
    return res.status(200).json({
      success: false,
      message: `Coupon has expired. Valid until ${endDate.toLocaleDateString()}`
    });
  }

  // Check if coupon has reached usage limit
  if (coupon.used_count >= coupon.usage_limit) {
    return res.status(200).json({
      success: false,
      message: `Coupon has reached its usage limit of ${coupon.usage_limit} times`
    });
  }

  // Check if customer has already used this coupon
  const existingUsage = await CouponUsage.findOne({
    coupon: coupon._id,
    customer: req.user.id
  });

  if (existingUsage) {
    return res.status(200).json({
      success: false,
      message: 'You have already used this coupon'
    });
  }

  // Check if order value meets minimum requirement
  if (order_value < coupon.min_order_value) {
    return res.status(200).json({
      success: false,
      message: `Minimum order value is ${coupon.min_order_value.toLocaleString()} VND`
    });
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = (order_value * coupon.discount_value) / 100;
    if (coupon.max_discount && discount > coupon.max_discount) {
      discount = coupon.max_discount;
    }
  } else {
    discount = coupon.discount_value;
  }

  // Create usage record
  await CouponUsage.create({
    coupon: coupon._id,
    customer: req.user.id
  });

  // Increment used count
  coupon.used_count += 1;
  await coupon.save();

  res.status(200).json({
    success: true,
    data: {
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order_value: coupon.min_order_value,
        max_discount: coupon.max_discount,
        start_date: startDate,
        end_date: endDate,
        usage_limit: coupon.usage_limit,
        used_count: coupon.used_count
      },
      order_value,
      discount,
      final_amount: order_value - discount
    }
  });
});

// @desc    Use coupon
// @route   POST /api/coupons/:id/use
// @access  Private/Customer
exports.useCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(200).json({
      success: false,
      message: 'Invalid coupon code'
    });
  }

  // Check if customer has already used this coupon
  const existingUsage = await CouponUsage.findOne({
    coupon: coupon._id,
    customer: req.user.id
  });

  if (existingUsage) {
    return res.status(200).json({
      success: false,
      message: 'You have already used this coupon'
    });
  }

  // Create usage record
  await CouponUsage.create({
    coupon: coupon._id,
    customer: req.user.id
  });

  // Increment used count
  coupon.used_count += 1;
  await coupon.save();

  res.status(200).json({
    success: true,
    message: 'Coupon used successfully'
  });
}); 