'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Alert, CircularProgress, Divider } from '@mui/material';
import { EventDetail } from './EventDetail';
import { SimilarEvents } from './SimilarEvents';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { useEvent, useSimilarEvents, useDeleteEvent } from '../../hooks/api/useEvents';
import { ROUTES } from '../../lib/constants/routes';

interface EventDetailPageProps {
  eventId: string;
}

export function EventDetailPage({ eventId }: EventDetailPageProps) {
  const router = useRouter();
  const { data: event, isLoading, error } = useEvent(eventId);
  const { data: similarEvents, isLoading: loadingSimilar } = useSimilarEvents(eventId);
  const deleteEvent = useDeleteEvent();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleEdit = () => {
    router.push(ROUTES.DASHBOARD.EVENTS.EDIT(eventId));
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEvent.mutateAsync(eventId);
      router.push(ROUTES.DASHBOARD.EVENTS.LIST);
    } catch (err) {
      setDeleteError('Failed to delete event. Please try again.');
      setShowDeleteDialog(false);
      console.error('Error deleting event:', err);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load event details. The event may not exist or you don&apos;t have permission to view it.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {deleteError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}

      <EventDetail
        event={event}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onBack={() => router.push(ROUTES.DASHBOARD.EVENTS.LIST)}
        showActions
      />

      {event.categoryId && (
        <>
          <Divider sx={{ my: 6 }} />
          <SimilarEvents
            events={similarEvents || []}
            loading={loadingSimilar}
            onViewEvent={(id) => router.push(ROUTES.DASHBOARD.EVENTS.DETAIL(id))}
          />
        </>
      )}

      <ConfirmationDialog
        open={showDeleteDialog}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone and all associated data will be permanently removed."
        confirmText="Delete Event"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteEvent.isPending}
        severity="error"
      />
    </Container>
  );
}
