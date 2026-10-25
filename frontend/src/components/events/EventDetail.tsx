"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CalendarToday,
  LocationOn,
  ArrowBack,
  Description,
  PersonAdd,
  PersonRemove,
} from "@mui/icons-material";
import { Event } from "../../types";
import { formatFullDateTime } from "../../lib/utils/dateFormatter";
import { EventMap } from "../maps/EventMap";
import { EventHeader } from "./detail/EventHeader";
import { EventInfoSection } from "./detail/EventInfoSection";
import { EventMetadata } from "./detail/EventMetadata";
import {
  useEventAttendances,
  useCreateAttendance,
  useDeleteAttendance,
} from "../../hooks/api";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

interface EventDetailProps {
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  showActions?: boolean;
}

export function EventDetail({
  event,
  onEdit,
  onDelete,
  onBack,
  showActions = true,
}: EventDetailProps) {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Fetch attendances for this event
  const { data: attendances = [], isLoading: attendancesLoading } =
    useEventAttendances(event.id);

  // Mutations
  const createAttendance = useCreateAttendance();
  const deleteAttendance = useDeleteAttendance();

  // Check if current user is attending
  const userAttendance = attendances.find((a) => a.userId === user?.id);
  const isAttending = !!userAttendance;
  const attendeesCount = attendances.length;

  // Handle join event
  const handleJoinEvent = async () => {
    if (!user) {
      setError("Ви повинні увійти щоб приєднатися до події");
      return;
    }

    try {
      setError(null);
      await createAttendance.mutateAsync({
        userId: user.id,
        eventId: event.id,
      });
    } catch (err) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(
        apiError.response?.data?.message || "Не вдалося приєднатися до події",
      );
    }
  };

  // Handle leave event
  const handleLeaveEvent = async () => {
    if (!userAttendance) return;

    try {
      setError(null);
      await deleteAttendance.mutateAsync(userAttendance.id);
    } catch (err) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(
        apiError.response?.data?.message || "Не вдалося відписатися від події",
      );
    }
  };

  const isProcessing = createAttendance.isPending || deleteAttendance.isPending;

  return (
    <Box>
      {onBack && (
        <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 3 }}>
          Back to Events
        </Button>
      )}

      <Card>
        <CardContent sx={{ p: 4 }}>
          <EventHeader
            title={event.title}
            category={event.category}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={showActions}
          />

          <Divider sx={{ my: 3 }} />

          {/* Attendance section */}
          <Box sx={{ mb: 3 }}>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <Stack direction="row" spacing={2} alignItems="center">
              {attendancesLoading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Members: {attendeesCount}
                  </Typography>

                  {user &&
                    (isAttending ? (
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={
                          isProcessing ? (
                            <CircularProgress size={16} />
                          ) : (
                            <PersonRemove />
                          )
                        }
                        onClick={handleLeaveEvent}
                        disabled={isProcessing}
                      >
                        Unconnect
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={
                          isProcessing ? (
                            <CircularProgress size={16} />
                          ) : (
                            <PersonAdd />
                          )
                        }
                        onClick={handleJoinEvent}
                        disabled={isProcessing}
                      >
                        Connect
                      </Button>
                    ))}
                </>
              )}
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={3}>
            <EventInfoSection icon={CalendarToday} title="Date & Time">
              <Typography variant="body1" fontWeight="medium">
                Start: {formatFullDateTime(event.startDate)}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                End: {formatFullDateTime(event.endDate)}
              </Typography>
            </EventInfoSection>

            <EventInfoSection icon={LocationOn} title="Location">
              <Typography variant="body1" fontWeight="medium">
                {event.location}
              </Typography>
              {event.latitude && event.longitude && (
                <EventMap
                  latitude={event.latitude}
                  longitude={event.longitude}
                  title={event.title}
                />
              )}
            </EventInfoSection>

            <EventInfoSection icon={Description} title="Description">
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {event.description}
              </Typography>
            </EventInfoSection>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <EventMetadata
            createdAt={event.createdAt}
            updatedAt={event.updatedAt}
            createdBy={event.createdBy}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
