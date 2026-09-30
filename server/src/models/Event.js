const { query } = require('../config/db');

// Helper: map a DB row to the normalized object shape controllers expect
const toEvent = (row) => {
  if (!row) return null;
  const now = new Date();
  const isPastDeadline = now > new Date(row.registration_deadline);
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    category: row.category,
    date: row.date,
    time: row.time,
    venue: row.venue,
    shortDescription: row.short_description,
    description: row.description,
    registrationDeadline: row.registration_deadline,
    isFeatured: row.is_featured,
    registrationOpen: row.registration_open,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isPastDeadline,
    isRegistrationAvailable: row.registration_open && !isPastDeadline
  };
};

const VALID_CATEGORIES = [
  'Coding Competition',
  'Hackathon',
  'Workshop',
  'Competition',
  'Technical Session'
];

const VALID_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const Event = {
  VALID_CATEGORIES,

  /**
   * Find all events with optional filters and sorting.
   */
  find: async ({ category, search, sort, featured } = {}) => {
    const conditions = [];
    const params = [];
    let p = 1;

    if (category && category !== 'All') {
      conditions.push(`category = $${p++}`);
      params.push(category);
    }
    if (search && search.trim()) {
      conditions.push(`name ILIKE $${p++}`);
      params.push(`%${search.trim()}%`);
    }
    if (featured === 'true' || featured === true) {
      conditions.push(`is_featured = TRUE`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderBy = 'ORDER BY date ASC';
    if (sort === 'newest') orderBy = 'ORDER BY created_at DESC';
    else if (sort === 'date_desc') orderBy = 'ORDER BY date DESC';

    const { rows } = await query(`SELECT * FROM events ${where} ${orderBy}`, params);
    return rows.map(toEvent);
  },

  /**
   * Find all events sorted by creation date (admin view).
   */
  findAll: async () => {
    const { rows } = await query('SELECT * FROM events ORDER BY created_at DESC');
    return rows.map(toEvent);
  },

  /**
   * Find upcoming events (date >= now).
   */
  findUpcoming: async (limit = 5) => {
    const { rows } = await query(
      'SELECT * FROM events WHERE date >= NOW() ORDER BY date ASC LIMIT $1',
      [limit]
    );
    return rows.map(toEvent);
  },

  /**
   * Find event by id.
   */
  findById: async (id) => {
    const { rows } = await query('SELECT * FROM events WHERE id = $1 LIMIT 1', [parseInt(id, 10)]);
    return toEvent(rows[0]);
  },

  /**
   * Find events whose name matches a search term (for registration search).
   */
  findByNameSearch: async (term) => {
    const { rows } = await query(
      'SELECT id FROM events WHERE name ILIKE $1',
      [`%${term.trim()}%`]
    );
    return rows.map((r) => r.id);
  },

  /**
   * Count total events.
   */
  count: async () => {
    const { rows } = await query('SELECT COUNT(*)::int AS count FROM events');
    return rows[0].count;
  },

  /**
   * Count upcoming events.
   */
  countUpcoming: async () => {
    const { rows } = await query(
      'SELECT COUNT(*)::int AS count FROM events WHERE date >= NOW()'
    );
    return rows[0].count;
  },

  /**
   * Create a new event.
   */
  create: async ({
    name, category, date, time, venue,
    shortDescription, description,
    registrationDeadline, isFeatured, registrationOpen
  }) => {
    const { rows } = await query(
      `INSERT INTO events
         (name, category, date, time, venue, short_description, description,
          registration_deadline, is_featured, registration_open)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        name.trim(), category,
        new Date(date), time.trim(), venue.trim(),
        shortDescription.trim(), description.trim(),
        new Date(registrationDeadline),
        Boolean(isFeatured),
        registrationOpen !== undefined ? Boolean(registrationOpen) : true
      ]
    );
    return toEvent(rows[0]);
  },

  /**
   * Update an event by id. Only updates provided fields.
   */
  update: async (id, fields) => {
    const setClauses = [];
    const params = [];
    let p = 1;

    const fieldMap = {
      name:                 'name',
      category:             'category',
      date:                 'date',
      time:                 'time',
      venue:                'venue',
      shortDescription:     'short_description',
      description:          'description',
      registrationDeadline: 'registration_deadline',
      isFeatured:           'is_featured',
      registrationOpen:     'registration_open'
    };

    for (const [jsKey, sqlCol] of Object.entries(fieldMap)) {
      if (fields[jsKey] !== undefined) {
        let val = fields[jsKey];
        if (jsKey === 'date' || jsKey === 'registrationDeadline') val = new Date(val);
        if (jsKey === 'isFeatured' || jsKey === 'registrationOpen') val = Boolean(val);
        if (typeof val === 'string') val = val.trim();
        setClauses.push(`${sqlCol} = $${p++}`);
        params.push(val);
      }
    }

    if (setClauses.length === 0) {
      return Event.findById(id);
    }

    setClauses.push(`updated_at = NOW()`);
    params.push(parseInt(id, 10));

    const { rows } = await query(
      `UPDATE events SET ${setClauses.join(', ')} WHERE id = $${p} RETURNING *`,
      params
    );
    return toEvent(rows[0]);
  },

  /**
   * Delete an event by id.
   */
  deleteById: async (id) => {
    await query('DELETE FROM events WHERE id = $1', [parseInt(id, 10)]);
  },

  /**
   * Insert many events (used by seeder).
   */
  insertMany: async (eventsArray) => {
    const created = [];
    for (const ev of eventsArray) {
      const result = await Event.create(ev);
      created.push(result);
    }
    return created;
  }
};

module.exports = Event;
