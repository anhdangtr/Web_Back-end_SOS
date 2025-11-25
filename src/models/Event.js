const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề sự kiện là bắt buộc'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Nội dung sự kiện là bắt buộc'],
  },
  bannerUrl: {
    type: String,
    default: '',
  },
  registrationFormUrl: {
    type: String,
    trim: true,
  },
  formSubmissionDeadline: {
    type: Date,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  startDate: {
    type: Date,
    required: [true, 'Ngày bắt đầu là bắt buộc'],
  },
  endDate: {
    type: Date,
    required: [true, 'Ngày kết thúc là bắt buộc'],
  },
  location: {
    type: String,
    required: [true, 'Địa điểm là bắt buộc'],
    trim: true,
  },
  organizer: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventCategory',
    required: [true, 'Danh mục là bắt buộc'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index để tìm kiếm nhanh
eventSchema.index({ title: 'text', content: 'text' });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ category: 1 });

module.exports = mongoose.model('Event', eventSchema);