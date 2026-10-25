import { UserProfile as User } from './user';
import { Event } from './event';

export interface Attendance {
  id: string;
  userId: string;
  eventId: string;
  user?: User;
  event?: Event;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendanceDto {
  userId: string;
  eventId: string;
}

export interface UpdateAttendanceDto {
  userId?: string;
  eventId?: string;
}

export interface AttendanceFilterParams {
  userId?: string;
  eventId?: string;
  page?: number;
  limit?: number;
}

