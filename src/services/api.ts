const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Если API_URL пустой, используем относительный путь
const BASE_URL = API_URL ? API_URL : '';

export const api = {
  // Get all visited cities
  async getVisits() {
    const response = await fetch(`${BASE_URL}/api/visits`);
    if (!response.ok) throw new Error('Failed to fetch visits');
    return response.json();
  },

  // Add visit
  async addVisit(cityId: string, notes = '') {
    const response = await fetch(`${BASE_URL}/api/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityId, notes })
    });
    if (!response.ok) throw new Error('Failed to add visit');
    return response.json();
  },

  // Remove visit
  async removeVisit(cityId: string) {
    const response = await fetch(`${BASE_URL}/api/visits/${cityId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove visit');
    return response.json();
  },

  // Check if visited
  async isVisited(cityId: string) {
    const response = await fetch(`${BASE_URL}/api/visits/${cityId}`);
    if (!response.ok) throw new Error('Failed to check visit');
    const data = await response.json();
    return data.visited;
  }
};
