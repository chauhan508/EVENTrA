const { Pool } = require('pg');

let pool = null;

const getPool = () => {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set.');
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }, // Required for Neon
      max: 5,                             // Keep low for serverless
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000
    });
  }
  return pool;
};

/**
 * Execute a SQL query.
 * @param {string} text   - SQL string (use $1, $2, ... for parameters)
 * @param {Array}  params - Parameter values
 */
const query = async (text, params) => {
  const client = getPool();
  return client.query(text, params);
};

const connectDB = async () => {
  // Verify connectivity and create schema
  await query('SELECT 1');
  console.log('PostgreSQL (Neon) connected successfully');
};

module.exports = { query, connectDB };
