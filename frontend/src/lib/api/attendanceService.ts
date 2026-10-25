import { apiClient } from './client';
import type {
  Attendance,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  AttendanceFilterParams,
  GlobalResponse,
} from '../../types';

export const attendanceService = {
  getAttendances: async (params: AttendanceFilterParams = {}): Promise<Attendance[]> => {
    const response = await apiClient.get<GlobalResponse<Attendance[]>>(
      '/attendance',
      { params },
    );

    if (!response.data.data) {
      throw new Error('No attendance data in response');
    }

    return response.data.data;
  },

  getAttendanceById: async (id: string): Promise<Attendance> => {
    const response = await apiClient.get<GlobalResponse<Attendance>>(
      `/attendance/${id}`,
    );

    if (!response.data.data) {
      throw new Error('No attendance data in response');
    }

    return response.data.data;
  },

  getAttendancesByEvent: async (eventId: string): Promise<Attendance[]> => {
    const response = await apiClient.get<GlobalResponse<Attendance[]>>(
      `/attendance/event/${eventId}`,
    );

    if (!response.data.data) {
      throw new Error('No attendance data in response');
    }

    return response.data.data;
  },

  getAttendancesByUser: async (userId: string): Promise<Attendance[]> => {
    const response = await apiClient.get<GlobalResponse<Attendance[]>>(
      `/attendance/user/${userId}`,
    );

    if (!response.data.data) {
      throw new Error('No attendance data in response');
    }

    return response.data.data;
  },

  createAttendance: async (data: CreateAttendanceDto): Promise<Attendance> => {
    const response = await apiClient.post<GlobalResponse<Attendance>>(
      '/attendance',
      data,
    );

    if (!response.data.data) {
      throw new Error('No attendance data in create response');
    }

    return response.data.data;
  },

  updateAttendance: async (id: string, data: UpdateAttendanceDto): Promise<Attendance> => {
    const response = await apiClient.patch<GlobalResponse<Attendance>>(
      `/attendance/${id}`,
      data,
    );

    if (!response.data.data) {
      throw new Error('No attendance data in update response');
    }

    return response.data.data;
  },

  deleteAttendance: async (id: string): Promise<void> => {
    await apiClient.delete(`/attendance/${id}`);
  },
};

