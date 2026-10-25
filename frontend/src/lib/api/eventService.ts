import { apiClient } from "./client";
import type {
  Event,
  CreateEventDto,
  UpdateEventDto,
  EventListParams,
  GlobalResponse,
  PageResponse,
} from "../../types";

export const eventService = {
  getEvents: async (params: EventListParams): Promise<PageResponse<Event>> => {
    const response = await apiClient.get<GlobalResponse<PageResponse<Event>>>(
      "/event",
      { params },
    );

    if (!response.data.data) {
      throw new Error("No events data in response");
    }

    return response.data.data;
  },

  getEventById: async (id: string): Promise<Event> => {
    const response = await apiClient.get<GlobalResponse<Event>>(`/event/${id}`);

    if (!response.data.data) {
      throw new Error("No event data in response");
    }

    return response.data.data;
  },

  getSimilarEvents: async (id: string): Promise<Event[]> => {
    const response = await apiClient.get<GlobalResponse<Event[]>>(
      `/event/recommendation`,
      { params: { eventId: id } },
    );

    if (!response.data.data) {
      throw new Error("No similar events data in response");
    }

    return response.data.data;
  },

  createEvent: async (data: CreateEventDto): Promise<Event> => {
    const response = await apiClient.post<GlobalResponse<Event>>(
      "/event",
      data,
    );

    if (!response.data.data) {
      throw new Error("No event data in create response");
    }

    return response.data.data;
  },

  updateEvent: async (id: string, data: UpdateEventDto): Promise<Event> => {
    const response = await apiClient.patch<GlobalResponse<Event>>(
      `/event/${id}`,
      data,
    );

    if (!response.data.data) {
      throw new Error("No event data in update response");
    }

    return response.data.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`/event/${id}`);
  },
};
