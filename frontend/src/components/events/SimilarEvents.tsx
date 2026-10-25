"use client";

import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { Event } from "../../types";
import { EventCard } from "./EventCard";

interface SimilarEventsProps {
  events: Event[];
  loading?: boolean;
  error?: string;
  onViewEvent?: (id: string) => void;
}

export function SimilarEvents({
  events,
  loading = false,
  error,
  onViewEvent,
}: SimilarEventsProps) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        No similar events found.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Similar Events
      </Typography>
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
          <EventCard key={event.id} event={event} onView={onViewEvent} />
        ))}
      </Box>
    </Box>
  );
}
