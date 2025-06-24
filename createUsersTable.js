// createUsersTable.js
const { pool } = require("./db");

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        uid VARCHAR PRIMARY KEY,
        firstname VARCHAR,
        lastname VARCHAR,
        email VARCHAR UNIQUE NOT NULL,
        school VARCHAR,
        bio VARCHAR,
        imgs VARCHAR[],
        token VARCHAR[],
        password VARCHAR NOT NULL
      );
    `);
    console.log("✅ Users table created successfully.");
  } catch (err) {
    console.error("❌ Error creating users table:", err);
  } finally {
    process.exit();
  }
})();
