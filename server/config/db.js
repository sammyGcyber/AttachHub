const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');
require('dotenv').config();

const dbType = process.env.DB_TYPE || 'sqlite';
const dbPath = path.join(__dirname, '../database/attachhub.sqlite');

if (dbType === 'sqlite') {
  // Ensure database file & tables exist on startup
  const schemaPath = path.join(__dirname, '../database/schema_sqlite.sql');
  const db = new DatabaseSync(dbPath);

  try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  } catch (e) {
    console.error('Error auto-initializing SQLite schema:', e.message);
  }

  module.exports = {
    query: async (text, params = []) => {
      // Replace $1, $2 Postgres placeholders with ? for SQLite
      let sqliteText = text.replace(/\$\d+/g, '?');

      // Remove postgres-specific RETURNING clause if present
      const hasReturning = /RETURNING/i.test(sqliteText);
      if (hasReturning) {
        sqliteText = sqliteText.replace(/RETURNING\s+[\*\w\s,]+/gi, '').trim();
      }

      const isSelect = /^\s*SELECT/i.test(sqliteText);

      if (isSelect) {
        const stmt = db.prepare(sqliteText);
        const rows = stmt.all(...params);
        return { rows };
      } else {
        const stmt = db.prepare(sqliteText);
        const info = stmt.run(...params);

        if (info.lastInsertRowid) {
          const tableMatch = text.match(/INSERT\s+INTO\s+(\w+)/i);
          const table = tableMatch ? tableMatch[1] : null;
          const pkCol = table === 'users' ? 'user_id' :
                        table === 'students' ? 'student_id' :
                        table === 'companies' ? 'company_id' :
                        table === 'listings' ? 'listing_id' :
                        table === 'applications' ? 'application_id' : 'id';

          if (table && pkCol) {
            try {
              const fetchStmt = db.prepare(`SELECT * FROM ${table} WHERE ${pkCol} = ?`);
              const row = fetchStmt.get(info.lastInsertRowid);
              return { rows: [row] };
            } catch (err) {
              return { rows: [{ id: info.lastInsertRowid }] };
            }
          }
        }
        return { rows: [] };
      }
    },
    pool: db,
  };
} else {
  // PostgreSQL / MySQL Connection Pool Fallback
  const { Pool } = require('pg');
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'attachhub_db',
  });

  module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
  };
}
