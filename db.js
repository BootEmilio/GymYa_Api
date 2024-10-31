// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Solo si la base de datos requiere SSL
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
