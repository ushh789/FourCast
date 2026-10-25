"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Container, Box, Typography, Button, Alert } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { EventFilters } from "./EventFilters";
import { EventList } from "./EventList";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { useEvents, useDeleteEvent } from "../../hooks/api/useEvents";
import { EventFilters as EventFiltersType, EventListParams } from "../../types";
import { parseEventFilters, updateQueryParams } from "../../lib/utils/queryParams";
import { ROUTES } from "../../lib/constants/routes";

export function EventsPageContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const deleteEvent = useDeleteEvent();

  const [filters, setFilters] = useState<EventListParams>(() => {
    const parsed = parseEventFilters(searchParams);
    return {
      ...parsed,
      pageNumber: parsed.pageNumber || 1,
      pageSize: parsed.pageSize || 12,
    };
  });

  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isLoading, error } = useEvents(filters);

  const updateFiltersAndUrl = useCallback(
    (newFilters: EventListParams) => {
      setFilters(newFilters);
      const url = updateQueryParams(pathname, newFilters);
      window.history.pushState({}, "", url);
    },
    [pathname],
  );

  const handleFiltersChange = useCallback(
    (newFilters: EventFiltersType) => {
      updateFiltersAndUrl({
        ...filters,
        ...newFilters,
        pageNumber: 1,
      });
    },
    [filters, updateFiltersAndUrl],
  );

  const handleClearFilters = useCallback(() => {
    updateFiltersAndUrl({
      pageNumber: 1,
      pageSize: filters.pageSize,
    });
  }, [filters.pageSize, updateFiltersAndUrl]);

  const handlePageChange = useCallback(
    (page: number) => {
      updateFiltersAndUrl({
        ...filters,
        pageNumber: page,
      });
    },
    [filters, updateFiltersAndUrl],
  );

  const handleDeleteEvent = useCallback((id: string) => {
    setEventToDelete(id);
    setDeleteError(null);
  }, []);

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      await deleteEvent.mutateAsync(eventToDelete);
      setEventToDelete(null);
    } catch (err) {
      setDeleteError("Failed to delete event. Please try again.");
      console.error("Error deleting event:", err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Events
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push(ROUTES.DASHBOARD.EVENTS.CREATE)}
          size="large"
        >
          Add Event
        </Button>
      </Box>

      <EventFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load events. Please try again later.
        </Alert>
      )}

      {deleteError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setDeleteError(null)}
        >
          {deleteError}
        </Alert>
      )}

      <EventList
        events={data?.content || []}
        loading={isLoading}
        currentPage={filters.pageNumber || 1}
        totalPages={data?.pageCount || 1}
        onPageChange={handlePageChange}
        onViewEvent={(id) => router.push(ROUTES.DASHBOARD.EVENTS.DETAIL(id))}
        onEditEvent={(id) => router.push(ROUTES.DASHBOARD.EVENTS.EDIT(id))}
        onDeleteEvent={handleDeleteEvent}
      />

      <ConfirmationDialog
        open={!!eventToDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setEventToDelete(null)}
        isLoading={deleteEvent.isPending}
        severity="error"
      />
    </Container>
  );
}
