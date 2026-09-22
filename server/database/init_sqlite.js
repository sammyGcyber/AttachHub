const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'attachhub.sqlite');
const schemaPath = path.join(__dirname, 'schema_sqlite.sql');

try {
  const db = new DatabaseSync(dbPath);
  console.log('Connected to SQLite database at:', dbPath);

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
  console.log('AttachHub SQLite database initialized successfully! ✅');
  db.close();
} catch (err) {
  console.error('Failed to initialize SQLite database:', err);
}
