const Salary = require('../models/Salary');
const User = require('../models/User');

// @desc    Create new salary
// @route   POST /api/salaries
// @access  Private/Admin
exports.createSalary = async (req, res, next) => {
  try {
    // Check if user exists
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Make sure user is staff or shipper
    if (!['staff', 'shipper'].includes(user.role)) {
      return res.status(400).json({
        success: false,
        message: 'Salary can only be created for staff or shipper'
      });
    }

    const salary = await Salary.create(req.body);

    res.status(201).json({
      success: true,
      data: salary
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all salaries
// @route   GET /api/salaries
// @access  Private/Admin
exports.getSalaries = async (req, res, next) => {
  try {
    const salaries = await Salary.find()
      .populate({
        path: 'user',
        select: 'name email role'
      });

    res.status(200).json({
      success: true,
      count: salaries.length,
      data: salaries
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single salary
// @route   GET /api/salaries/:id
// @access  Private
exports.getSalary = async (req, res, next) => {
  try {
    const salary = await Salary.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email role'
      });

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary not found'
      });
    }

    // Make sure user is salary owner or admin
    if (salary.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this salary'
      });
    }

    res.status(200).json({
      success: true,
      data: salary
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update salary
// @route   PUT /api/salaries/:id
// @access  Private/Admin
exports.updateSalary = async (req, res, next) => {
  try {
    let salary = await Salary.findById(req.params.id);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary not found'
      });
    }

    // Check if user exists if user field is being updated
    if (req.body.user) {
      const user = await User.findById(req.body.user);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Make sure user is staff or shipper
      if (!['staff', 'shipper'].includes(user.role)) {
        return res.status(400).json({
          success: false,
          message: 'Salary can only be assigned to staff or shipper'
        });
      }
    }

    salary = await Salary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: salary
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete salary
// @route   DELETE /api/salaries/:id
// @access  Private/Admin
exports.deleteSalary = async (req, res, next) => {
  try {
    const salary = await Salary.findById(req.params.id);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary not found'
      });
    }

    await salary.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 