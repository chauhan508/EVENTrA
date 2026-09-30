// ─── EVENTRA Events Service (Static Demo Data Layer) ─────────────────────────
// Reads from fixed event definitions and persists registrations in localStorage.

import {
  getStoredEvents,
  getStoredEventById,
  saveRegistration
} from '../data/mockData';

export const fetchEvents = async (params = {}) => {
  // Simulated asynchronous resolution for consistent UI loading states
  await new Promise((resolve) => setTimeout(resolve, 60));

  let events = getStoredEvents();

  if (params.category && params.category !== 'All') {
    events = events.filter((e) => e.category === params.category);
  }

  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    events = events.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.shortDescription && e.shortDescription.toLowerCase().includes(q)) ||
        (e.venue && e.venue.toLowerCase().includes(q))
    );
  }

  if (params.featured) {
    events = events.filter((e) => e.isFeatured);
  }

  return {
    success: true,
    data: events,
    count: events.length
  };
};

export const fetchEventById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const event = getStoredEventById(id);
  if (!event) {
    return {
      success: false,
      message: 'Event not found'
    };
  }

  return {
    success: true,
    data: event
  };
};

export const registerForEvent = async (id, registrationData) => {
  await new Promise((resolve) => setTimeout(resolve, 80));

  const saved = saveRegistration(id, registrationData);
  return {
    success: true,
    message: 'Registration confirmed successfully!',
    data: saved
  };
};
