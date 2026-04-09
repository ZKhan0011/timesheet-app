/**
 * API client for communicating with the Django backend.
 * All requests go through the Vite dev proxy (/api → localhost:8000).
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }

  // DELETE returns 204 No Content
  if (response.status === 204) return null;
  return response.json();
}

// ─── Projects ────────────────────────────────────────────

export async function fetchProjects() {
  return request('/projects/');
}

export async function fetchProject(id) {
  return request(`/projects/${id}/`);
}

// ─── Time Entries ────────────────────────────────────────

export async function fetchTimeEntries(params = {}) {
  const query = new URLSearchParams();
  if (params.dateFrom) query.set('date_from', params.dateFrom);
  if (params.dateTo) query.set('date_to', params.dateTo);

  const qs = query.toString();
  return request(`/time-entries/${qs ? '?' + qs : ''}`);
}

export async function createTimeEntry(data) {
  return request('/time-entries/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTimeEntry(id, data) {
  return request(`/time-entries/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteTimeEntry(id) {
  return request(`/time-entries/${id}/`, {
    method: 'DELETE',
  });
}

export async function submitTimeEntry(id) {
  return request(`/time-entries/${id}/submit/`, {
    method: 'POST',
  });
}

// ─── Dashboard ───────────────────────────────────────────

export async function fetchDashboardSummary() {
  return request('/dashboard/summary/');
}
