import { describe, expect, it } from 'vitest';
import { ItemSubmissionSchema } from './itemSchema';
import { ItemStatus } from '../../types/index';

describe('ItemSubmissionSchema', () => {
  it('accepts a valid item submission', () => {
    const parsed = ItemSubmissionSchema.safeParse({
      title: 'Blue Backpack',
      description: 'Black backpack with one broken zipper.',
      category: 'Accessories',
      status: ItemStatus.LOST,
      location: 'Library second floor',
      userId: 1,
      userName: 'John Doe',
      userEmail: 'john@example.com',
      userPhone: '09171234567',
    });

    expect(parsed.success).toBe(true);
  });

  it('rejects missing or invalid values', () => {
    const parsed = ItemSubmissionSchema.safeParse({
      title: 'A',
      description: 'Short',
      category: '',
      status: '',
      location: '',
      userId: 0,
      userName: '',
      userEmail: 'bad-email',
      userPhone: '123',
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((issue) => issue.path.includes('title'))).toBe(true);
      expect(parsed.error.issues.some((issue) => issue.path.includes('description'))).toBe(true);
      expect(parsed.error.issues.some((issue) => issue.path.includes('userPhone'))).toBe(true);
    }
  });
});
