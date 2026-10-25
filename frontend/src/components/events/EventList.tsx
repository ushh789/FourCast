/**
 * Event List Component
 * Displays a grid of event cards with pagination
 */

"use client";

import { Box, Typography, Pagination, Skeleton } from "@mui/material";
import { EventOutlined } from "@mui/icons-material";
import { Event } from "../../types";
import { EventCard } from "./EventCard";

interface EventListProps {
  events: Event[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewEvent?: (id: string) => void;
  onEditEvent?: (id: string) => void;
  onDeleteEvent?: (id: string) => void;
}

/**
 * Grid layout for event cards with pagination
 * Handles loading and empty states
 */
export function EventList({
  events,
  loading = false,
  currentPage,
  totalPages,
  onPageChange,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
}: EventListProps) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {[...Array(6)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={300}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
    );
  }

  if (!events || events.length === 0) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
          }}
        >
          <EventOutlined
            sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or create a new event
          </Typography>
        </Box>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => onPageChange(page)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </>
    );
  }

  return (
    <Box>
      {/* Event Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onView={onViewEvent}
            onEdit={onEditEvent}
            onDelete={onDeleteEvent}
          />
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
}
