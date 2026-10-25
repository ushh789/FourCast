/**
 * Event Metadata Component
 * Displays creation/update timestamps and creator information
 */

import { Paper, Stack, Box, Typography, Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';
import { UserProfile } from '../../../types';
import { formatFullDateTime } from '../../../lib/utils/dateFormatter';

interface EventMetadataProps {
  createdAt: string;
  updatedAt: string;
  createdBy?: UserProfile;
}

export function EventMetadata({
  createdAt,
  updatedAt,
  createdBy,
}: EventMetadataProps) {
  return (
    <Box>
      {createdBy && (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Created by
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {createdBy.firstName} {createdBy.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {createdBy.email}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Timestamps */}
      <Box>
        <Typography variant="caption" color="text.secondary" display="block">
          Created: {formatFullDateTime(createdAt)}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Last updated: {formatFullDateTime(updatedAt)}
        </Typography>
      </Box>
    </Box>
  );
}

