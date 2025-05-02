const express = require('express');
const {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All notification routes require authentication

router
  .route('/')
  .post(authorize('admin'), createNotification)
  .get(getNotifications)
  .delete(deleteAllNotifications);

router.get('/unread/count', getUnreadCount);
router.put('/read-all', markAllAsRead);

router
  .route('/:id')
  .delete(deleteNotification);

router.put('/:id/read', markAsRead);

module.exports = router; 