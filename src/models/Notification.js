const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    trim: true
  },
  type: {
    type: String,
    enum: ['order', 'promotion', 'system', 'other'],
    default: 'system'
  },
  is_read: {
    type: Boolean,
    default: false
  },
  related_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'type'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  deleted_at: {
    type: Date
  }
});

// Create index for faster queries
NotificationSchema.index({ user: 1, created_at: -1 });
NotificationSchema.index({ user: 1, is_read: 1 });

// Drop old notification_id index if exists
mongoose.connection.on('connected', async () => {
  try {
    const collection = mongoose.connection.db.collection('notifications');
    const indexes = await collection.indexes();
    const hasOldIndex = indexes.some(index => index.name === 'notification_id_1');
    
    if (hasOldIndex) {
      await collection.dropIndex('notification_id_1');
      console.log('Successfully dropped old notification_id index');
    }
  } catch (err) {
    // Silently ignore any errors
  }
});

module.exports = mongoose.model('Notification', NotificationSchema); 