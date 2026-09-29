import { apiClient } from './client';

export const adminLogin = async (credentials) => {
  return apiClient('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const fetchAdminProfile = async () => {
  return apiClient('/admin/me');
};

export const fetchDashboardStats = async () => {
  return apiClient('/admin/stats');
};

export const fetchAdminEvents = async () => {
  return apiClient('/admin/events');
};

export const createAdminEvent = async (eventData) => {
  return apiClient('/admin/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  });
};

export const updateAdminEvent = async (id, eventData) => {
  return apiClient(`/admin/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData)
  });
};

export const deleteAdminEvent = async (id) => {
  return apiClient(`/admin/events/${id}`, {
    method: 'DELETE'
  });
};

export const fetchAdminRegistrations = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.eventId && params.eventId !== 'All') query.append('eventId', params.eventId);
  if (params.year && params.year !== 'All') query.append('year', params.year);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return apiClient(`/admin/registrations${qs}`);
};
