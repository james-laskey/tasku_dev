require("dotenv").config();
const { pool } = require("./db");

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id VARCHAR NOT NULL,
        receiver_id VARCHAR NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Messages table created successfully.");
  } catch (err) {
    console.error("❌ Error creating messages table:", err);
  } finally {
    process.exit();
  }
})();
