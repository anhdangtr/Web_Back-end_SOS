const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['admin', 'user'],
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Role', roleSchema);