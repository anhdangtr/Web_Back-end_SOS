const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email không được để trống'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu không được để trống'],
    minlength: [8, 'Mật khẩu phải ít nhất 8 ký tự'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Tên không được để trống'],
    trim: true
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Hash password trước khi lưu
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error);
  }
});

// Update updated_at trước khi lưu
userSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);