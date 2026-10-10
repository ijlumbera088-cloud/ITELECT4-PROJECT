import { describe, expect, it, vi, afterEach } from 'vitest';
import { api } from './client';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api.login', () => {
  it('falls back to the users collection when /api/auth/login is unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.includes('/api/auth/login')) {
          return {
            ok: false,
            status: 404,
            text: async () => 'Not Found',
          } as Response;
        }

        if (url.includes('/users?email=')) {
          return {
            ok: true,
            json: async () => [
              {
                id: 1,
                email: 'john@example.com',
                name: 'John Doe',
                password: 'password123',
              },
            ],
          } as Response;
        }

        return {
          ok: true,
          json: async () => ({}),
        } as Response;
      }),
    );

    const user = await api.login('john@example.com', 'password123');

    expect(user.email).toBe('john@example.com');
    expect(user.name).toBe('John Doe');
    expect(user.token).toBeTruthy();
  });
});
