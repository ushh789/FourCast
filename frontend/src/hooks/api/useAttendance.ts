import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../../lib/api';
import type {
  CreateAttendanceDto,
  UpdateAttendanceDto,
  AttendanceFilterParams,
} from '../../types';

export const attendanceKeys = {
  all: ['attendances'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (params: AttendanceFilterParams) => [...attendanceKeys.lists(), params] as const,
  details: () => [...attendanceKeys.all, 'detail'] as const,
  detail: (id: string) => [...attendanceKeys.details(), id] as const,
  byEvent: (eventId: string) => [...attendanceKeys.all, 'event', eventId] as const,
  byUser: (userId: string) => [...attendanceKeys.all, 'user', userId] as const,
};

export function useAttendances(params: AttendanceFilterParams = {}) {
  return useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: () => attendanceService.getAttendances(params),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAttendance(id: string) {
  return useQuery({
    queryKey: attendanceKeys.detail(id),
    queryFn: () => attendanceService.getAttendanceById(id),
    enabled: !!id,
  });
}

export function useEventAttendances(eventId: string) {
  return useQuery({
    queryKey: attendanceKeys.byEvent(eventId),
    queryFn: () => attendanceService.getAttendancesByEvent(eventId),
    enabled: !!eventId,
  });
}

export function useUserAttendances(userId: string) {
  return useQuery({
    queryKey: attendanceKeys.byUser(userId),
    queryFn: () => attendanceService.getAttendancesByUser(userId),
    enabled: !!userId,
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttendanceDto) => attendanceService.createAttendance(data),
    onSuccess: (newAttendance) => {
      // Invalidate attendance lists
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      // Invalidate event-specific and user-specific attendances
      queryClient.invalidateQueries({ queryKey: attendanceKeys.byEvent(newAttendance.eventId) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.byUser(newAttendance.userId) });
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAttendanceDto }) =>
      attendanceService.updateAttendance(id, data),
    onSuccess: (updatedAttendance) => {
      // Invalidate lists and specific attendance detail
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.detail(updatedAttendance.id) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.byEvent(updatedAttendance.eventId) });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.byUser(updatedAttendance.userId) });
    },
  });
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => attendanceService.deleteAttendance(id),
    onSuccess: () => {
      // Invalidate attendance lists to refetch
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
  });
}

