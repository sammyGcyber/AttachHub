const db = require('../config/db');

const listingModel = {
  async findAll({ industry, location, status = 'open' }) {
    let query = `
      SELECT l.*, c.company_name, c.industry, c.location 
      FROM listings l
      JOIN companies c ON l.company_id = c.company_id
      WHERE l.status = $1
    `;
    const params = [status];

    if (industry) {
      params.push(`%${industry}%`);
      query += ` AND c.industry ILIKE $${params.length}`;
    }
    if (location) {
      params.push(`%${location}%`);
      query += ` AND c.location ILIKE $${params.length}`;
    }

    query += ' ORDER BY l.posted_at DESC';
    const res = await db.query(query, params);
    return res.rows;
  },

  async findById(listingId) {
    const res = await db.query(
      `SELECT l.*, c.company_name, c.industry, c.location, c.description AS company_description
       FROM listings l
       JOIN companies c ON l.company_id = c.company_id
       WHERE l.listing_id = $1`,
      [listingId]
    );
    return res.rows[0];
  },

  async findByCompanyId(companyId) {
    const res = await db.query('SELECT * FROM listings WHERE company_id = $1 ORDER BY posted_at DESC', [companyId]);
    return res.rows;
  },

  async create(data) {
    const { companyId, title, department, description, requirements, slotsAvailable, startDate, endDate } = data;
    const res = await db.query(
      `INSERT INTO listings (company_id, title, department, description, requirements, slots_available, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [companyId, title, department, description, requirements, slotsAvailable, startDate, endDate]
    );
    return res.rows[0];
  },

  async update(listingId, companyId, data) {
    const { title, department, description, requirements, slotsAvailable, startDate, endDate, status } = data;
    const res = await db.query(
      `UPDATE listings
       SET title = $1, department = $2, description = $3, requirements = $4, slots_available = $5, start_date = $6, end_date = $7, status = $8
       WHERE listing_id = $9 AND company_id = $10
       RETURNING *`,
      [title, department, description, requirements, slotsAvailable, startDate, endDate, status, listingId, companyId]
    );
    return res.rows[0];
  }
};

module.exports = listingModel;
