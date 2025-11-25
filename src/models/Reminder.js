const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  reminderTime: {
    type: Date,
    required: [true, 'Thời gian nhắc nhở là bắt buộc'],
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index để query nhanh các reminder cần gửi
reminderSchema.index({ reminderTime: 1, isSent: 1 });
reminderSchema.index({ user: 1, event: 1 });

// Validation: Mỗi user chỉ được tạo tối đa 3 reminder cho 1 event
reminderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments({
      user: this.user,
      event: this.event,
    });
    
    if (count >= 3) {
      throw new Error('Bạn chỉ có thể đặt tối đa 3 lời nhắc cho mỗi sự kiện');
    }
  }
  next();
});

module.exports = mongoose.model('Reminder', reminderSchema);