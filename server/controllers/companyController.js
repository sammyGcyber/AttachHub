const companyModel = require('../models/companyModel');

const getProfile = async (req, res, next) => {
  try {
    const profile = await companyModel.findByUserId(req.user.userId);
    if (!profile) {
      return res.status(404).json({ message: 'Company profile not found.' });
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updated = await companyModel.update(req.user.userId, req.body);
    res.json({ message: 'Company profile updated successfully.', profile: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
