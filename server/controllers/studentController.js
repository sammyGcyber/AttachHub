const studentModel = require('../models/studentModel');

const getProfile = async (req, res, next) => {
  try {
    const profile = await studentModel.findByUserId(req.user.userId);
    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updated = await studentModel.update(req.user.userId, req.body);
    res.json({ message: 'Profile updated successfully.', profile: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
