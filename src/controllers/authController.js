const User = require('../models/User');
const { generateToken } = require('../utils/jwtHelper');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// @desc    Đăng ký tài khoản
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 400, 'Email đã được sử dụng');
    }

    // Tạo user mới
    const user = await User.create({
      email,
      password,
      name,
      role: 'user',
    });

    // Tạo token
    const token = generateToken(user._id);

    sendSuccess(res, 201, {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    }, 'Đăng ký thành công');
  } catch (error) {
    next(error);
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email và password
    if (!email || !password) {
      return sendError(res, 400, 'Vui lòng nhập email và mật khẩu');
    }

    // Tìm user và lấy cả password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Email hoặc mật khẩu không đúng');
    }

    // Tạo token
    const token = generateToken(user._id);

    sendSuccess(res, 200, {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    }, 'Đăng nhập thành công');
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    sendSuccess(res, 200, {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }, 'Lấy thông tin thành công');
  } catch (error) {
    next(error);
  }
};