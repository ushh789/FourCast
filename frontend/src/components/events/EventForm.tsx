'use client';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Paper, Typography, CircularProgress, Stack } from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { eventFormSchema, EventFormData } from '../../lib/validation/eventValidation';
import { LocationPicker } from '../maps/LocationPicker';
import { FormField } from '../forms/FormField';
import { CategorySelector } from '../category/CategorySelector';
import { DateTimeField } from '../forms/DateTimeField';
import { FormSection } from '../common/FormSection';
import { Event } from '../../types';

interface EventFormProps {
  onSubmit: (data: EventFormData) => void | Promise<void>;
  onCancel?: () => void;
  defaultValues?: Partial<Event>;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

export function EventForm({
  onSubmit,
  onCancel,
  defaultValues,
  isSubmitting = false,
  mode = 'create',
}: EventFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      startDate: defaultValues?.startDate ? new Date(defaultValues.startDate) : undefined,
      endDate: defaultValues?.endDate ? new Date(defaultValues.endDate) : undefined,
      location: defaultValues?.location || '',
      latitude: defaultValues?.latitude || undefined,
      longitude: defaultValues?.longitude || undefined,
      categoryId: defaultValues?.categoryId || undefined,
    },
  });

  const location = useWatch({ control, name: 'location', defaultValue: '' });
  const latitude = useWatch({ control, name: 'latitude', defaultValue: undefined });
  const longitude = useWatch({ control, name: 'longitude', defaultValue: undefined });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {mode === 'create' ? 'Create New Event' : 'Edit Event'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          <FormSection title="Basic Information">
            <Stack spacing={2}>
              <FormField
                name="title"
                control={control}
                label="Event Title"
                required
                placeholder="Enter event title"
              />

              <FormField
                name="description"
                control={control}
                label="Event Description"
                required
                multiline
                rows={4}
                placeholder="Describe your event"
              />

              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <CategorySelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Stack>
          </FormSection>

          <FormSection title="Schedule" showDivider>
            <Stack spacing={2}>
              <DateTimeField
                name="startDate"
                control={control}
                label="Start Date & Time"
                required
              />

              <DateTimeField
                name="endDate"
                control={control}
                label="End Date & Time"
                required
              />
            </Stack>
          </FormSection>

          <FormSection title="Location" showDivider>
            <Controller
              name="location"
              control={control}
              render={() => (
                <LocationPicker
                  value={
                    location && latitude !== undefined && longitude !== undefined
                      ? { address: location, latitude, longitude }
                      : undefined
                  }
                  onChange={(locationData) => {
                    setValue('location', locationData.address);
                    setValue('latitude', locationData.latitude);
                    setValue('longitude', locationData.longitude);
                  }}
                />
              )}
            />
          </FormSection>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            {onCancel && (
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              startIcon={isSubmitting ? <CircularProgress size={16} /> : <SaveIcon />}
              disabled={isSubmitting}
            >
              {mode === 'create' ? 'Create Event' : 'Save Changes'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
