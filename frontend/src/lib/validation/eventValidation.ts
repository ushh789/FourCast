import { z } from 'zod';

export const eventFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Event title is required')
    .max(200, 'Event title must not exceed 200 characters'),
  
  description: z
    .string()
    .min(1, 'Event description is required')
    .max(1000, 'Event description must not exceed 1000 characters'),
  
  startDate: z.date().catch(() => new Date()).refine(
    (date) => date instanceof Date && !isNaN(date.getTime()),
    'Invalid start date'
  ),
  
  endDate: z.date().catch(() => new Date()).refine(
    (date) => date instanceof Date && !isNaN(date.getTime()),
    'Invalid end date'
  ),
  
  location: z
    .string()
    .min(1, 'Event location is required')
    .max(500, 'Event location must not exceed 500 characters'),
  
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  categoryId: z.string().optional(),
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
  }
);

export type EventFormData = z.infer<typeof eventFormSchema>;

