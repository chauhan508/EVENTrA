import { apiClient } from './client';

export const fetchEvents = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.search) query.append('search', params.search);
  if (params.sort) query.append('sort', params.sort);
  if (params.featured) query.append('featured', params.featured);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return apiClient(`/events${qs}`);
};

export const fetchEventById = async (id) => {
  return apiClient(`/events/${id}`);
};

export const registerForEvent = async (id, registrationData) => {
  return apiClient(`/events/${id}/register`, {
    method: 'POST',
    body: JSON.stringify(registrationData)
  });
};
