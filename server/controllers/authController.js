const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const studentModel = require('../models/studentModel');
const companyModel = require('../models/companyModel');

const register = async (req, res, next) => {
  try {
    const { email, password, role, profileData } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ email, passwordHash, role });

    if (role === 'student' && profileData) {
      await studentModel.create({ userId: newUser.user_id, ...profileData });
    } else if (role === 'company' && profileData) {
      await companyModel.create({ userId: newUser.user_id, ...profileData });
    }

    const token = jwt.sign(
      { userId: newUser.user_id, role: newUser.role, isVerified: newUser.is_verified },
      process.env.JWT_SECRET || 'attachhub_jwt_super_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully.',
      user: newUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role, isVerified: user.is_verified },
      process.env.JWT_SECRET || 'attachhub_jwt_super_secret_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful.',
      user: {
        userId: user.user_id,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.userId);
    let profile = null;

    if (user.role === 'student') {
      profile = await studentModel.findByUserId(user.user_id);
    } else if (user.role === 'company') {
      profile = await companyModel.findByUserId(user.user_id);
    }

    res.json({ user, profile });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
