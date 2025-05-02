const express = require('express');
const {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require('../controllers/addressController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All address routes require authentication

router
  .route('/')
  .post(authorize('customer'), createAddress)
  .get(authorize('customer', 'admin', 'staff', 'shipper'), getAddresses);

router
  .route('/:id')
  .get(authorize('customer', 'admin', 'staff', 'shipper'), getAddress)
  .put(authorize('customer'), updateAddress)
  .delete(authorize('customer'), deleteAddress);

router.put('/:id/default', authorize('customer'), setDefaultAddress);

module.exports = router; 