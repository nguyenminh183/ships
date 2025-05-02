const Rating = require('../models/Rating');
const Order = require('../models/Order');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// @desc    Create new rating
// @route   POST /api/ratings
// @access  Private/Customer
exports.createRating = async (req, res, next) => {
  try {
    // First check if order exists
    const order = await Order.findOne({
      order_id: req.body.order
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to customer
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'This order does not belong to you'
      });
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `Cannot rate order with status: ${order.status}. Order must be completed`
      });
    }

    // Check if rating already exists for this order
    const existingRating = await Rating.findOne({
      order: order._id,
      customer: req.user.id
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this order'
      });
    }

    // Create rating
    const rating = await Rating.create({
      order: order._id,
      shipper: req.body.shipper,
      customer: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
      images: req.body.images
    });

    res.status(201).json({
      success: true,
      data: rating
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

// @desc    Get all ratings
// @route   GET /api/ratings
// @access  Private/Admin,Staff,Customer
exports.getRatings = async (req, res, next) => {
  try {
    let query;

    // If user is customer, only show their ratings
    if (req.user.role === 'customer') {
      query = Rating.find({ 
        customer: req.user.id,
        is_deleted: false 
      });
    } else {
      // Admin and staff can see all ratings
      query = Rating.find({ is_deleted: false });
    }

    // Add populate
    query = query
      .populate({
        path: 'order',
        select: 'order_id total_amount'
      })
      .populate({
        path: 'shipper',
        select: 'name phone'
      })
      .populate({
        path: 'customer',
        select: 'name email'
      });

    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get total count based on user role
    let total;
    if (req.user.role === 'customer') {
      total = await Rating.countDocuments({ 
        customer: req.user.id,
        is_deleted: false 
      });
    } else {
      total = await Rating.countDocuments({ is_deleted: false });
    }

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const ratings = await query;

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
      count: ratings.length,
      pagination,
      data: ratings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single rating
// @route   GET /api/ratings/:id
// @access  Private/Admin,Staff,Customer
exports.getRating = async (req, res, next) => {
  try {
    // Validate if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rating ID format'
      });
    }

    const rating = await Rating.findOne({
      _id: req.params.id,
      is_deleted: false
    }).populate({
      path: 'order',
      select: 'order_id total_amount'
    }).populate({
      path: 'shipper',
      select: 'name phone'
    }).populate({
      path: 'customer',
      select: 'name email'
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Check if user is authorized to view this rating
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && 
        rating.customer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this rating'
      });
    }

    res.status(200).json({
      success: true,
      data: rating
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update rating
// @route   PUT /api/ratings/:id
// @access  Private/Customer
exports.updateRating = async (req, res, next) => {
  try {
    // Validate if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rating ID format'
      });
    }

    let rating = await Rating.findOne({
      _id: req.params.id,
      is_deleted: false
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Check if user is the owner of the rating
    if (rating.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this rating'
      });
    }

    // Update rating
    rating = await Rating.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: rating
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete rating
// @route   DELETE /api/ratings/:id
// @access  Private/Admin,Customer
exports.deleteRating = async (req, res, next) => {
  try {
    // Validate if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rating ID format'
      });
    }

    const rating = await Rating.findOne({
      _id: req.params.id,
      is_deleted: false
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Check if user is authorized to delete this rating
    if (req.user.role !== 'admin' && rating.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this rating'
      });
    }

    // Soft delete
    await Rating.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          is_deleted: true,
          deleted_at: Date.now()
        } 
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Rating has been soft deleted'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public ratings (visible to all customers)
// @route   GET /api/ratings/public
// @access  Public
exports.getPublicRatings = asyncHandler(async (req, res, next) => {
  let query = Rating.find().select('rating comment createdAt updatedAt');

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Rating.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const ratings = await query;

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
    count: ratings.length,
    pagination,
    data: ratings
  });
}); 