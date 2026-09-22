const db = require('../config/db');

const userModel = {
  async findByEmail(email) {
    const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  },

  async findById(userId) {
    const res = await db.query('SELECT user_id, email, role, is_verified, created_at FROM users WHERE user_id = $1', [userId]);
    return res.rows[0];
  },

  async create({ email, passwordHash, role }) {
    const res = await db.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING user_id, email, role, is_verified, created_at',
      [email, passwordHash, role]
    );
    return res.rows[0];
  },

  async updateVerification(userId, isVerified) {
    const res = await db.query(
      'UPDATE users SET is_verified = $1 WHERE user_id = $2 RETURNING user_id, email, role, is_verified',
      [isVerified, userId]
    );
    return res.rows[0];
  }
};

module.exports = userModel;
