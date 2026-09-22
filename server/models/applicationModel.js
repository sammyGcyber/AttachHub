const db = require('../config/db');

const applicationModel = {
  async findByStudentId(studentId) {
    const res = await db.query(
      `SELECT a.*, l.title, l.department, c.company_name, c.location
       FROM applications a
       JOIN listings l ON a.listing_id = l.listing_id
       JOIN companies c ON l.company_id = c.company_id
       WHERE a.student_id = $1
       ORDER BY a.applied_at DESC`,
      [studentId]
    );
    return res.rows;
  },

  async findByListingId(listingId) {
    const res = await db.query(
      `SELECT a.*, s.full_name, s.institution, s.course, s.skills, s.cv_url
       FROM applications a
       JOIN students s ON a.student_id = s.student_id
       WHERE a.listing_id = $1
       ORDER BY a.match_score DESC, a.applied_at DESC`,
      [listingId]
    );
    return res.rows;
  },

  async create({ studentId, listingId, coverNote, matchScore }) {
    const res = await db.query(
      `INSERT INTO applications (student_id, listing_id, cover_note, match_score)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [studentId, listingId, coverNote, matchScore]
    );
    return res.rows[0];
  },

  async updateStatus(applicationId, status) {
    const res = await db.query(
      `UPDATE applications 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE application_id = $2
       RETURNING *`,
      [status, applicationId]
    );
    return res.rows[0];
  }
};

module.exports = applicationModel;
