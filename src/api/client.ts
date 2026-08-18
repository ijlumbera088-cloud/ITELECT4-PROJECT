export interface Item {
  id: number;
  name: string;
  description?: string;
  found: boolean;
  createdAt: string; // ISO
}

export interface NewItem {
  name: string;
  description?: string;
  found?: boolean;
}

export interface EventItem {
  id: number;
  title: string;
  date: string; // ISO
  location?: string;
}

const API_BASE = 'http://localhost:4000';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  getItems: () => getJson<Item[]>('/items'),
  getItem: (id: number) => getJson<Item>(`/items/${id}`),
  createItem: (payload: NewItem) => fetch(`${API_BASE}/items`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then((r) => r.json() as Promise<Item>),

  getEvents: () => getJson<EventItem[]>('/events'),
  getEvent: (id: number) => getJson<EventItem>(`/events/${id}`),
  createEvent: (payload: Omit<EventItem, 'id'>) => fetch(`${API_BASE}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then((r) => r.json() as Promise<EventItem>),
};
