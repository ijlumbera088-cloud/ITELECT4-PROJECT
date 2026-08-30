import { z } from 'zod';
import { ItemStatus } from '../../types/index';

export const ItemSubmissionSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters long.').max(80, 'Title is too long.'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters long.').max(500, 'Description is too long.'),
  category: z.string().trim().min(1, 'Please select a category.'),
  status: z.nativeEnum(ItemStatus).refine((value) => value === ItemStatus.LOST || value === ItemStatus.FOUND, {
    message: 'Please choose whether the item was lost or found.',
  }),
  location: z.string().trim().min(3, 'Location must be at least 3 characters long.'),
  userId: z.number().int().positive('User details are missing.'),
  userName: z.string().trim().min(2, 'Name must be at least 2 characters long.'),
  userEmail: z.string().trim().email('Please enter a valid email address.'),
  userPhone: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits.')
    .regex(/^[0-9+()\-\s]+$/, 'Phone number may only contain numbers, spaces, +, -, and parentheses.'),
}).refine((data) => data.userPhone.replace(/\D/g, '').length >= 10, {
  message: 'Phone number must include at least 10 digits.',
  path: ['userPhone'],
});

export type ItemSubmissionFormValues = z.infer<typeof ItemSubmissionSchema>;
