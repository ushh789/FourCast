import { UserProfile } from './user';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  categoryId: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
  createdBy?: UserProfile;
}

export interface EventFilters {
  search?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface EventListParams extends EventFilters {
  pageNumber?: number;
  pageSize?: number;
}


export interface CreateEventDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  latitude?: number;
  longitude?: number;
  categoryId?: string;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  categoryId?: string;
}

