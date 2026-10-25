'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Alert, CircularProgress } from '@mui/material';
import { EventForm } from './EventForm';
import { useEvent, useUpdateEvent } from '../../hooks/api/useEvents';
import { EventFormData } from '../../lib/validation/eventValidation';
import { getErrorMessage } from '../../lib/utils/errorHandler';
import { ROUTES } from '../../lib/constants/routes';

interface EditEventPageProps {
  eventId: string;
}

export function EditEventPage({ eventId }: EditEventPageProps) {
  const router = useRouter();
  const { data: event, isLoading, error: loadError } = useEvent(eventId);
  const updateEvent = useUpdateEvent();
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleSubmit = async (data: EventFormData) => {
    try {
      setUpdateError(null);

      await updateEvent.mutateAsync({
        id: eventId,
        data: {
          title: data.title,
          description: data.description,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          categoryId: data.categoryId,
        },
      });

      router.push(ROUTES.DASHBOARD.EVENTS.DETAIL(eventId));
    } catch (err) {
      setUpdateError(getErrorMessage(err));
      console.error('Error updating event:', err);
    }
  };

  const handleCancel = () => {
    router.push(ROUTES.DASHBOARD.EVENTS.DETAIL(eventId));
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (loadError || !event) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load event. The event may not exist or you don&apos;t have permission to edit it.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {updateError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setUpdateError(null)}>
          {updateError}
        </Alert>
      )}

      <EventForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={event}
        isSubmitting={updateEvent.isPending}
        mode="edit"
      />
    </Container>
  );
}
