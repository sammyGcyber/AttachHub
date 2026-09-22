const db = require('../config/db');

const companyModel = {
  async findByUserId(userId) {
    const res = await db.query('SELECT * FROM companies WHERE user_id = $1', [userId]);
    return res.rows[0];
  },

  async findById(companyId) {
    const res = await db.query('SELECT * FROM companies WHERE company_id = $1', [companyId]);
    return res.rows[0];
  },

  async create(data) {
    const { userId, companyName, industry, location, description, website } = data;
    const res = await db.query(
      `INSERT INTO companies (user_id, company_name, industry, location, description, website)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, companyName, industry, location, description, website]
    );
    return res.rows[0];
  },

  async update(userId, data) {
    const { companyName, industry, location, description, website } = data;
    const res = await db.query(
      `UPDATE companies 
       SET company_name = $1, industry = $2, location = $3, description = $4, website = $5
       WHERE user_id = $6
       RETURNING *`,
      [companyName, industry, location, description, website, userId]
    );
    return res.rows[0];
  }
};

module.exports = companyModel;
