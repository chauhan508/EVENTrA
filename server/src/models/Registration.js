const { query } = require('../config/db');

// Map DB row to the shape controllers expect
const toRegistration = (row) => {
  if (!row) return null;
  const result = {
    _id: row.id,
    id: row.id,
    eventId: row.event_id,
    name: row.name,
    email: row.email,
    college: row.college,
    year: row.year,
    phone: row.phone,
    registeredAt: row.registered_at
  };
  // Attach populated event data if joined
  if (row.event_name) {
    result.eventId = {
      _id: row.event_id,
      id: row.event_id,
      name: row.event_name,
      category: row.event_category,
      date: row.event_date,
      venue: row.event_venue
    };
  }
  return result;
};

const Registration = {
  /**
   * Count registrations matching optional filters.
   */
  count: async ({ eventId, year, search, eventIds } = {}) => {
    const { sql, params } = buildQuery({ eventId, year, search, eventIds });
    const { rows } = await query(`SELECT COUNT(*)::int AS count FROM registrations r ${sql}`, params);
    return rows[0].count;
  },

  /**
   * Count registrations from a date (for "this month" stat).
   */
  countSince: async (date) => {
    const { rows } = await query(
      'SELECT COUNT(*)::int AS count FROM registrations WHERE registered_at >= $1',
      [date]
    );
    return rows[0].count;
  },

  /**
   * Find registrations with event join, filters, pagination.
   */
  find: async ({ eventId, year, search, eventIds, skip = 0, limit = 20 } = {}) => {
    const { sql, params } = buildQuery({ eventId, year, search, eventIds });
    const p = params.length;
    const { rows } = await query(
      `SELECT r.*,
              e.name AS event_name, e.category AS event_category,
              e.date AS event_date, e.venue AS event_venue
       FROM registrations r
       LEFT JOIN events e ON e.id = r.event_id
       ${sql}
       ORDER BY r.registered_at DESC
       LIMIT $${p + 1} OFFSET $${p + 2}`,
      [...params, limit, skip]
    );
    return rows.map(toRegistration);
  },

  /**
   * Find the most recent registrations (for dashboard).
   */
  findRecent: async (limit = 6) => {
    const { rows } = await query(
      `SELECT r.*,
              e.name AS event_name, e.category AS event_category,
              e.date AS event_date, e.venue AS event_venue
       FROM registrations r
       LEFT JOIN events e ON e.id = r.event_id
       ORDER BY r.registered_at DESC
       LIMIT $1`,
      [limit]
    );
    return rows.map(toRegistration);
  },

  /**
   * Find a single registration by eventId + email (duplicate check).
   */
  findOne: async ({ eventId, email }) => {
    const { rows } = await query(
      'SELECT * FROM registrations WHERE event_id = $1 AND email = $2 LIMIT 1',
      [parseInt(eventId, 10), email.trim().toLowerCase()]
    );
    return toRegistration(rows[0]);
  },

  /**
   * Get registration counts grouped by event_id (for a list of event ids).
   */
  countByEventIds: async (eventIds) => {
    if (!eventIds || eventIds.length === 0) return {};
    const placeholders = eventIds.map((_, i) => `$${i + 1}`).join(',');
    const { rows } = await query(
      `SELECT event_id, COUNT(*)::int AS count
       FROM registrations
       WHERE event_id IN (${placeholders})
       GROUP BY event_id`,
      eventIds.map((id) => parseInt(id, 10))
    );
    return rows.reduce((acc, r) => {
      acc[r.event_id] = r.count;
      return acc;
    }, {});
  },

  /**
   * Create a registration.
   */
  create: async ({ eventId, name, email, college, year, phone }) => {
    const { rows } = await query(
      `INSERT INTO registrations (event_id, name, email, college, year, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [parseInt(eventId, 10), name.trim(), email.trim().toLowerCase(), college.trim(), year, phone.trim()]
    );
    return toRegistration(rows[0]);
  },

  /**
   * Delete all registrations for an event (cascade on event delete).
   */
  deleteByEventId: async (eventId) => {
    await query('DELETE FROM registrations WHERE event_id = $1', [parseInt(eventId, 10)]);
  },

  /**
   * Insert many registrations (used by seeder).
   */
  insertMany: async (regsArray) => {
    for (const reg of regsArray) {
      await Registration.create(reg);
    }
  }
};

/**
 * Build WHERE clause and params for filtered queries.
 */
function buildQuery({ eventId, year, search, eventIds } = {}) {
  const conditions = [];
  const params = [];
  let p = 1;

  if (eventId && eventId !== 'All') {
    conditions.push(`r.event_id = $${p++}`);
    params.push(parseInt(eventId, 10));
  }
  if (year && year !== 'All') {
    conditions.push(`r.year = $${p++}`);
    params.push(year);
  }
  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    conditions.push(`(r.name ILIKE $${p} OR r.email ILIKE $${p + 1})`);
    params.push(term, term);
    p += 2;
  }
  if (eventIds && eventIds.length > 0) {
    const placeholders = eventIds.map(() => `$${p++}`).join(',');
    conditions.push(`r.event_id IN (${placeholders})`);
    params.push(...eventIds.map((id) => parseInt(id, 10)));
  }

  const sql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { sql, params };
}

module.exports = Registration;
