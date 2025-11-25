const mongoose = require('mongoose');

const eventCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên danh mục là bắt buộc'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('EventCategory', eventCategorySchema);