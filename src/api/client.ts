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

const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

interface JsonServerUser {
  id: number;
  email: string;
  password?: string;
  name: string;
}

function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.token ?? null;
  } catch {
    return null;
  }
}

function fallbackPath(path: string): string {
  return path.startsWith('/api/') ? path.replace(/^\/api/, '') : path;
}

async function fetchWithFallback<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const primaryUrl = `${API_BASE}${path}`;
  const response = await fetch(primaryUrl, init);

  if (response.ok) {
    return response.json() as Promise<T>;
  }

  if (response.status === 404 && path.startsWith('/api/')) {
    const fallbackUrl = `${API_BASE}${fallbackPath(path)}`;
    const fallbackResponse = await fetch(fallbackUrl, init);

    if (fallbackResponse.ok) {
      return fallbackResponse.json() as Promise<T>;
    }

    const message = await fallbackResponse.text();
    throw new Error(message || `API error ${fallbackResponse.status}`);
  }

  const message = await response.text();
  throw new Error(message || `API error ${response.status}`);
}

function getJson<T>(path: string, token?: string): Promise<T> {
  return fetchWithFallback<T>(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export const api = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      return response.json() as Promise<AuthResponse>;
    }

    if (response.status !== 404) {
      const message = await response.text();
      throw new Error(message || 'Invalid email or password');
    }

    const usersResponse = await fetch(
      `${API_BASE}/users?email=${encodeURIComponent(email.toLowerCase())}`,
    );

    if (!usersResponse.ok) {
      const message = await usersResponse.text();
      throw new Error(message || 'Invalid email or password');
    }

    const users = (await usersResponse.json()) as JsonServerUser[];
    const user = users.find(
      (candidate) => candidate.email.toLowerCase() === email.toLowerCase() && candidate.password === password,
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token: `mock-token-${user.id}-${Date.now()}`,
    };
  },

  signup: async (email: string, name: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      return response.json() as Promise<AuthResponse>;
    }

    if (response.status !== 404) {
      const message = await response.text();
      throw new Error(message || 'Signup failed');
    }

    const existingUsersResponse = await fetch(
      `${API_BASE}/users?email=${encodeURIComponent(email.toLowerCase())}`,
    );

    if (existingUsersResponse.ok) {
      const users = (await existingUsersResponse.json()) as JsonServerUser[];
      if (users.length > 0) {
        throw new Error('An account with this email already exists.');
      }
    }

    const createUserResponse = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Date.now(),
        email,
        name,
        password,
      }),
    });

    if (!createUserResponse.ok) {
      const message = await createUserResponse.text();
      throw new Error(message || 'Signup failed');
    }

    const newUser = (await createUserResponse.json()) as JsonServerUser;

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      token: `mock-token-${newUser.id}-${Date.now()}`,
    };
  },

  getItems: () => getJson<LostFoundItem[]>('/api/items', getStoredToken() || undefined),
  getItem: (id: number) => getJson<LostFoundItem>(`/api/items/${id}`, getStoredToken() || undefined),
  createItem: async (payload: CreateLostFoundItemDto) => {
    const token = getStoredToken();
    return fetchWithFallback<LostFoundItem>('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ...payload, createdAt: new Date().toISOString(), resolved: false }),
    });
  },

  updateItem: async (id: number, payload: Partial<CreateLostFoundItemDto>) => {
    const token = getStoredToken();
    return fetchWithFallback<LostFoundItem>(`/api/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
  },

  deleteItem: async (id: number) => {
    const token = getStoredToken();
    return fetchWithFallback<unknown>(`/api/items/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  },

  getLostItems: () => getJson<LostFoundItem[]>('/api/items?status=LOST', getStoredToken() || undefined),
  getFoundItems: () => getJson<LostFoundItem[]>('/api/items?status=FOUND', getStoredToken() || undefined),

  getEvents: () => getJson<EventItem[]>('/events'),
  getEvent: (id: number) => getJson<EventItem>(`/events/${id}`),
  createEvent: (payload: Omit<EventItem, 'id'>) => fetch(`${API_BASE}/events`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then((r) => r.json() as Promise<EventItem>),
};
