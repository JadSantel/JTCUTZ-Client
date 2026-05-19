const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sendServerError = (res, error, context) => {
  console.error(`${context} error:`, error);

  const response = {
    success: false,
    message: 'Server error. Please try again.',
  };

  if (process.env.NODE_ENV !== 'production') {
    response.error = error.message;
  }

  return res.status(500).json(response);
};

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const normalizedEmail = email?.toLowerCase().trim();

  if (!name || !normalizedEmail || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const role = normalizedEmail === process.env.ADMIN_EMAIL?.toLowerCase().trim() ? 'admin' : 'user';
    const user = await User.create({ name, email: normalizedEmail, password, phone, role });
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }

    return sendServerError(res, error, 'Register');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.toLowerCase().trim();

  if (!normalizedEmail || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return sendServerError(res, error, 'Login');
  }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    },
  });
};

module.exports = { register, login, getMe };
