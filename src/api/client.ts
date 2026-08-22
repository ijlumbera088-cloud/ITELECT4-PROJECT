import { LostFoundItem, CreateLostFoundItemDto, ItemStatus } from '../../types/index';

export interface AuthResponse {
  id: number;
  email: string;
  name: string;
  token: string;
}

export interface Item {
  id: number;
  name: string;
  description?: string;
  found: boolean;
  createdAt: string;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  location?: string;
}

const API_BASE = 'http://localhost:4000';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  // Authentication
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const users = await getJson<any[]>('/users');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    // Generate a simple token (in production, use JWT)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token: btoa(`${user.id}:${Date.now()}`)
    };
  },

  signup: async (email: string, name: string, password: string): Promise<AuthResponse> => {
    const users = await getJson<any[]>('/users');
    const exists = users.find(u => u.email === email);
    if (exists) throw new Error('Email already registered');
    
    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      email,
      name,
      password
    };

    await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      token: btoa(`${newUser.id}:${Date.now()}`)
    };
  },

  // Lost & Found Items
  getItems: () => getJson<LostFoundItem[]>('/items'),
  getItem: (id: number) => getJson<LostFoundItem>(`/items/${id}`),
  createItem: (payload: CreateLostFoundItemDto) => 
    fetch(`${API_BASE}/items`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ ...payload, createdAt: new Date().toISOString(), resolved: false }) 
    }).then((r) => r.json() as Promise<LostFoundItem>),
  
  updateItem: (id: number, payload: Partial<CreateLostFoundItemDto>) =>
    fetch(`${API_BASE}/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then((r) => r.json() as Promise<LostFoundItem>),

  deleteItem: (id: number) =>
    fetch(`${API_BASE}/items/${id}`, { method: 'DELETE' }).then((r) => r.json()),

  // Get items by status
  getLostItems: () => getJson<LostFoundItem[]>('/items?status=LOST'),
  getFoundItems: () => getJson<LostFoundItem[]>('/items?status=FOUND'),

  // Events (legacy - kept for compatibility)
  getEvents: () => getJson<EventItem[]>('/events'),
  getEvent: (id: number) => getJson<EventItem>(`/events/${id}`),
  createEvent: (payload: Omit<EventItem, 'id'>) => fetch(`${API_BASE}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then((r) => r.json() as Promise<EventItem>),
};
