const express = require('express');
const {
  createWarehouse,
  getWarehouses,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse
} = require('../controllers/warehouseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createWarehouse)
  .get(protect, authorize('admin', 'staff'), getWarehouses);

router
  .route('/:id')
  .get(protect, authorize('admin', 'staff'), getWarehouse)
  .put(protect, authorize('admin'), updateWarehouse)
  .delete(protect, authorize('admin'), deleteWarehouse);

module.exports = router; 