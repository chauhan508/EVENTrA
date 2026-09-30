// ─── EVENTRA Demo Data Layer (Self-Contained Frontend Store) ───────────────
// No MongoDB, Neon, or backend server required.
// Persists student registrations and admin session in browser localStorage.

export const FIXED_EVENTS = [
  {
    _id: '1',
    id: '1',
    name: 'CodeSprint',
    category: 'Coding Competition',
    date: '2026-10-10T10:00:00.000Z',
    time: '10:00 AM',
    venue: 'Ramanujan Auditorium',
    shortDescription: 'Competitive programming challenge for students.',
    description: 'Competitive programming challenge for students. Test your algorithmic thinking, problem-solving skills, and coding speed across curated algorithmic challenges. Individual and team participation welcome.',
    registrationDeadline: '2026-10-09T23:59:59.000Z',
    isFeatured: true,
    registrationOpen: true
  },
  {
    _id: '2',
    id: '2',
    name: 'BuildVerse',
    category: 'Hackathon',
    date: '2026-10-15T11:00:00.000Z',
    time: '11:00 AM',
    venue: 'Ramanujan Auditorium',
    shortDescription: 'Build and showcase innovative technology projects.',
    description: 'Build and showcase innovative technology projects. Collaborate with fellow students to engineer prototypes, modern web applications, AI tools, and creative software solutions under expert mentorship.',
    registrationDeadline: '2026-10-14T23:59:59.000Z',
    isFeatured: false,
    registrationOpen: true
  },
  {
    _id: '3',
    id: '3',
    name: 'WebCraft Workshop',
    category: 'Workshop',
    date: '2026-10-20T14:00:00.000Z',
    time: '2:00 PM',
    venue: 'Ramanujan Auditorium',
    shortDescription: 'Hands-on workshop covering modern web development.',
    description: 'Hands-on workshop covering modern web development. Learn full-stack principles, responsive user interfaces, React architecture, API integration, and production deployment workflows.',
    registrationDeadline: '2026-10-19T23:59:59.000Z',
    isFeatured: false,
    registrationOpen: true
  },
  {
    _id: '4',
    id: '4',
    name: 'TechTalk',
    category: 'Technical Session',
    date: '2026-10-25T12:00:00.000Z',
    time: '12:00 PM',
    venue: 'Ramanujan Auditorium',
    shortDescription: 'Interactive technology and career discussion.',
    description: 'Interactive technology and career discussion. Engage with experienced industry professionals, discuss emerging tech trends, open-source roadmaps, and career opportunities in modern software engineering.',
    registrationDeadline: '2026-10-24T23:59:59.000Z',
    isFeatured: false,
    registrationOpen: true
  },
  {
    _id: '5',
    id: '5',
    name: 'Algorithm Arena',
    category: 'Competition',
    date: '2026-10-30T10:00:00.000Z',
    time: '10:00 AM',
    venue: 'Ramanujan Auditorium',
    shortDescription: 'Problem-solving and algorithmic thinking competition.',
    description: 'Problem-solving and algorithmic thinking competition. Compete against the best campus programmers solving advanced mathematical puzzles, dynamic programming challenges, and graph theory problems.',
    registrationDeadline: '2026-10-29T23:59:59.000Z',
    isFeatured: false,
    registrationOpen: true
  }
];

// Initial starter registrations for immediate dashboard presentation
export const INITIAL_REGISTRATIONS = [
  {
    _id: 'reg_demo_001',
    id: 'reg_demo_001',
    eventId: '1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    college: 'Institute of Engineering & Technology',
    year: '3rd Year',
    phone: '9876543210',
    registeredAt: '2026-09-28T09:30:00.000Z'
  },
  {
    _id: 'reg_demo_002',
    id: 'reg_demo_002',
    eventId: '2',
    name: 'Priya Verma',
    email: 'priya.verma@college.edu',
    college: 'Institute of Engineering & Technology',
    year: '2nd Year',
    phone: '9812345678',
    registeredAt: '2026-09-29T14:15:00.000Z'
  },
  {
    _id: 'reg_demo_003',
    id: 'reg_demo_003',
    eventId: '3',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@college.edu',
    college: 'Faculty of Computer Applications',
    year: '1st Year',
    phone: '9923456789',
    registeredAt: '2026-09-30T11:45:00.000Z'
  }
];

// Demo Admin Credentials
export const DEMO_ADMIN = {
  username: 'admin',
  email: 'admin@eventra.dev',
  password: 'Eventra@2026',
  name: 'EVENTRA Admin'
};

const REGISTRATIONS_KEY = 'eventra_registrations';

/**
 * Get all registrations from localStorage (initializes with demo data on first load)
 */
export const getStoredRegistrations = () => {
  try {
    const raw = localStorage.getItem(REGISTRATIONS_KEY);
    if (!raw) {
      localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
      return INITIAL_REGISTRATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse registrations from localStorage:', err);
    return INITIAL_REGISTRATIONS;
  }
};

/**
 * Save a new registration into localStorage
 */
export const saveRegistration = (eventId, studentData) => {
  const registrations = getStoredRegistrations();
  
  // Validate duplicate registration for same event + email
  const existing = registrations.find(
    (r) => String(r.eventId) === String(eventId) && r.email?.toLowerCase() === studentData.email?.toLowerCase()
  );
  if (existing) {
    throw new Error('You have already registered for this event with this email address.');
  }

  const newReg = {
    _id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    eventId: String(eventId),
    name: studentData.name.trim(),
    email: studentData.email.trim().toLowerCase(),
    college: studentData.college.trim(),
    year: studentData.year,
    phone: studentData.phone.trim(),
    registeredAt: new Date().toISOString()
  };

  const updated = [newReg, ...registrations];
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));
  return newReg;
};

/**
 * Delete a registration from localStorage
 */
export const deleteRegistration = (id) => {
  const registrations = getStoredRegistrations();
  const filtered = registrations.filter((r) => r._id !== id && r.id !== id);
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(filtered));
  return true;
};

/**
 * Get events enriched with real-time registration counts from localStorage
 */
export const getStoredEvents = () => {
  const registrations = getStoredRegistrations();
  
  return FIXED_EVENTS.map((evt) => {
    const count = registrations.filter((r) => String(r.eventId) === String(evt._id)).length;
    return {
      ...evt,
      registrationCount: count
    };
  });
};

/**
 * Get a single event by ID enriched with registration count
 */
export const getStoredEventById = (id) => {
  const events = getStoredEvents();
  return events.find((e) => String(e._id) === String(id) || String(e.id) === String(id)) || null;
};

/**
 * Compute real-time admin dashboard metrics from localStorage
 */
export const getDashboardStats = () => {
  const events = getStoredEvents();
  const registrations = getStoredRegistrations();

  const enrichedUpcoming = events.map((e) => ({
    _id: e._id,
    name: e.name,
    category: e.category,
    date: e.date,
    time: e.time,
    venue: e.venue,
    isFeatured: e.isFeatured,
    registrationCount: e.registrationCount
  }));

  const enrichedRecent = registrations.slice(0, 8).map((r) => {
    const matchedEvent = events.find((e) => String(e._id) === String(r.eventId));
    return {
      ...r,
      eventId: matchedEvent ? { _id: matchedEvent._id, name: matchedEvent.name } : { name: 'Campus Event' }
    };
  });

  return {
    totalEvents: events.length,
    upcomingEvents: events.length,
    totalRegistrations: registrations.length,
    thisMonthRegistrations: registrations.length,
    upcomingEventsList: enrichedUpcoming,
    recentRegistrations: enrichedRecent
  };
};

/**
 * Verify demo admin credentials
 */
export const verifyAdminLogin = (usernameOrEmail, password) => {
  const cleaned = usernameOrEmail.trim().toLowerCase();
  const isMatch =
    (cleaned === DEMO_ADMIN.username.toLowerCase() || cleaned === DEMO_ADMIN.email.toLowerCase()) &&
    password === DEMO_ADMIN.password;

  if (!isMatch) {
    throw new Error('Invalid credentials. For this demo, use: admin / Eventra@2026');
  }

  const token = `eventra_demo_session_${Date.now()}`;
  return {
    token,
    admin: {
      id: 'admin_demo_01',
      username: DEMO_ADMIN.username,
      email: DEMO_ADMIN.email,
      name: DEMO_ADMIN.name,
      role: 'Super Administrator'
    }
  };
};
