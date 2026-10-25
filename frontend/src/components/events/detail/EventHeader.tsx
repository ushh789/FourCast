/**
 * Event Header Component
 * Displays event title, category, and action buttons
 */

import { Box, Typography, Chip, Button, Stack } from '@mui/material';
import { Edit, Delete, Category as CategoryIcon } from '@mui/icons-material';
import { Category } from '../../../types';

interface EventHeaderProps {
  title: string;
  category?: Category | null;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function EventHeader({
  title,
  category,
  onEdit,
  onDelete,
  showActions = true,
}: EventHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Category Badge */}
      {category && (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Chip
            icon={<CategoryIcon />}
            label={category.name}
            color="primary"
            variant="outlined"
          />
        </Stack>
      )}

      {/* Title */}
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        {title}
      </Typography>

      {/* Action Buttons */}
      {showActions && (onEdit || onDelete) && (
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          {onEdit && (
            <Button variant="contained" startIcon={<Edit />} onClick={onEdit}>
              Edit Event
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={onDelete}
            >
              Delete Event
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}

