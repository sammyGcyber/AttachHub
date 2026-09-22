const db = require('../config/db');
const userModel = require('../models/userModel');

const getPendingVerifications = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT u.user_id, u.email, u.role, u.is_verified, u.created_at,
              COALESCE(s.full_name, c.company_name) as entity_name
       FROM users u
       LEFT JOIN students s ON u.user_id = s.user_id
       LEFT JOIN companies c ON u.user_id = c.user_id
       WHERE u.is_verified = FALSE AND u.role != 'admin'`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

const verifyUserAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;
    const updated = await userModel.updateVerification(userId, isVerified);
    res.json({ message: `Account ${isVerified ? 'verified' : 'unverified'} successfully.`, user: updated });
  } catch (error) {
    next(error);
  }
};

const getPlatformStats = async (req, res, next) => {
  try {
    const studentsRes = await db.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
    const companiesRes = await db.query("SELECT COUNT(*) FROM users WHERE role = 'company'");
    const listingsRes = await db.query('SELECT COUNT(*) FROM listings');
    const appsRes = await db.query('SELECT COUNT(*) FROM applications');

    res.json({
      students: parseInt(studentsRes.rows[0].count, 10),
      companies: parseInt(companiesRes.rows[0].count, 10),
      listings: parseInt(listingsRes.rows[0].count, 10),
      applications: parseInt(appsRes.rows[0].count, 10),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPendingVerifications, verifyUserAccount, getPlatformStats };
