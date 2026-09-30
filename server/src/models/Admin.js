const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

const Admin = {
  /**
   * Find admin by email (case-insensitive).
   */
  findByEmail: async (email) => {
    const { rows } = await query(
      'SELECT * FROM admins WHERE email = $1 LIMIT 1',
      [email.trim().toLowerCase()]
    );
    const row = rows[0];
    if (!row) return null;
    return {
      ...row,
      _id: row.id,
      passwordHash: row.password_hash,
      comparePassword: async (password) => bcrypt.compare(password, row.password_hash)
    };
  },

  /**
   * Find admin by id.
   */
  findById: async (id) => {
    const { rows } = await query(
      'SELECT id, name, email, created_at FROM admins WHERE id = $1 LIMIT 1',
      [parseInt(id, 10)]
    );
    const row = rows[0];
    if (!row) return null;
    return { ...row, _id: row.id };
  },

  /**
   * Count total admins.
   */
  count: async () => {
    const { rows } = await query('SELECT COUNT(*)::int AS count FROM admins');
    return rows[0].count;
  },

  /**
   * Create a new admin.
   */
  create: async ({ name, email, passwordHash }) => {
    const { rows } = await query(
      `INSERT INTO admins (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name || 'Club Lead', email.trim().toLowerCase(), passwordHash]
    );
    return { ...rows[0], _id: rows[0].id };
  }
};

module.exports = Admin;
