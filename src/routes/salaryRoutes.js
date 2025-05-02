const express = require('express');
const {
  createSalary,
  getSalaries,
  getSalary,
  updateSalary,
  deleteSalary
} = require('../controllers/salaryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createSalary)
  .get(protect, authorize('admin'), getSalaries);

router
  .route('/:id')
  .get(protect, getSalary)
  .put(protect, authorize('admin'), updateSalary)
  .delete(protect, authorize('admin'), deleteSalary);

module.exports = router; 