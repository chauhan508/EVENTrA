// ─── EVENTRA Admin Service (Static Demo Data Layer) ──────────────────────────
// Direct browser verification without external backend or database calls.

import {
  DEMO_ADMIN,
  verifyAdminLogin,
  getDashboardStats,
  getStoredEvents,
  getStoredRegistrations,
  deleteRegistration
} from '../data/mockData';

export const adminLogin = async ({ email, username, password }) => {
  await new Promise((resolve) => setTimeout(resolve, 80));

  const cred = email || username || '';
  const result = verifyAdminLogin(cred, password);

  return {
    success: true,
    token: result.token,
    admin: result.admin
  };
};

export const fetchAdminProfile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 40));

  const token = localStorage.getItem('eventra_admin_token');
  if (!token) {
    throw new Error('Not authenticated');
  }

  return {
    success: true,
    admin: {
      id: 'admin_demo_01',
      username: DEMO_ADMIN.username,
      email: DEMO_ADMIN.email,
      name: DEMO_ADMIN.name,
      role: 'Super Administrator'
    }
  };
};

export const fetchDashboardStats = async () => {
  await new Promise((resolve) => setTimeout(resolve, 60));

  const stats = getDashboardStats();
  return {
    success: true,
    data: stats
  };
};

export const fetchAdminEvents = async () => {
  await new Promise((resolve) => setTimeout(resolve, 60));

  const events = getStoredEvents();
  return {
    success: true,
    data: events
  };
};

export const createAdminEvent = async () => {
  return {
    success: false,
    message: 'Event management is in read-only mode. Demo events are fixed for this college submission.'
  };
};

export const updateAdminEvent = async () => {
  return {
    success: false,
    message: 'Event editing is disabled. Demo events are fixed for this college submission.'
  };
};

export const deleteAdminEvent = async () => {
  return {
    success: false,
    message: 'Event deletion is disabled. Demo events are fixed for this college submission.'
  };
};

export const fetchAdminRegistrations = async (params = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 60));

  const events = getStoredEvents();
  let registrations = getStoredRegistrations();

  // Enrich with event object
  registrations = registrations.map((r) => {
    const matchedEvent = events.find((e) => String(e._id) === String(r.eventId));
    return {
      ...r,
      eventId: matchedEvent
        ? { _id: matchedEvent._id, name: matchedEvent.name, category: matchedEvent.category }
        : { name: 'Campus Event' }
    };
  });

  // Filter by event
  if (params.eventId && params.eventId !== 'All') {
    registrations = registrations.filter(
      (r) => String(r.eventId?._id) === String(params.eventId) || String(r.eventId) === String(params.eventId)
    );
  }

  // Filter by year
  if (params.year && params.year !== 'All') {
    registrations = registrations.filter((r) => r.year === params.year);
  }

  // Search by student name, email, college, phone, or event name
  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    registrations = registrations.filter(
      (r) =>
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.college && r.college.toLowerCase().includes(q)) ||
        (r.phone && r.phone.includes(q)) ||
        (r.eventId?.name && r.eventId.name.toLowerCase().includes(q))
    );
  }

  const total = registrations.length;
  const page = parseInt(params.page, 10) || 1;
  const limit = parseInt(params.limit, 10) || 15;
  const start = (page - 1) * limit;
  const paginated = registrations.slice(start, start + limit);
  const pages = Math.ceil(total / limit) || 1;

  return {
    success: true,
    data: paginated,
    pagination: {
      total,
      page,
      limit,
      pages
    }
  };
};

export const deleteAdminRegistration = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  deleteRegistration(id);
  return {
    success: true,
    message: 'Registration deleted successfully'
  };
};
