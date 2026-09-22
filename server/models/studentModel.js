const db = require('../config/db');

const studentModel = {
  async findByUserId(userId) {
    const res = await db.query('SELECT * FROM students WHERE user_id = $1', [userId]);
    return res.rows[0];
  },

  async findById(studentId) {
    const res = await db.query('SELECT * FROM students WHERE student_id = $1', [studentId]);
    return res.rows[0];
  },

  async create(data) {
    const { userId, fullName, institution, course, yearOfStudy, phone, skills, cvUrl, availabilityStart, availabilityEnd } = data;
    const res = await db.query(
      `INSERT INTO students (user_id, full_name, institution, course, year_of_study, phone, skills, cv_url, availability_start, availability_end)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [userId, fullName, institution, course, yearOfStudy, phone, skills, cvUrl, availabilityStart, availabilityEnd]
    );
    return res.rows[0];
  },

  async update(userId, data) {
    const { fullName, institution, course, yearOfStudy, phone, skills, cvUrl, availabilityStart, availabilityEnd } = data;
    const res = await db.query(
      `UPDATE students 
       SET full_name = $1, institution = $2, course = $3, year_of_study = $4, phone = $5, skills = $6, cv_url = COALESCE($7, cv_url), availability_start = $8, availability_end = $9
       WHERE user_id = $10
       RETURNING *`,
      [fullName, institution, course, yearOfStudy, phone, skills, cvUrl, availabilityStart, availabilityEnd, userId]
    );
    return res.rows[0];
  }
};

module.exports = studentModel;
