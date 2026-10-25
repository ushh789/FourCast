/**
 * Event Info Section Component
 * Reusable section block for event details
 */

import { Paper, Stack, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { SvgIconComponent } from '@mui/icons-material';

interface EventInfoSectionProps {
  icon: SvgIconComponent;
  title: string;
  children: ReactNode;
}

export function EventInfoSection({
  icon: Icon,
  title,
  children,
}: EventInfoSectionProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Icon color="primary" />
        <Box flex={1}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          {children}
        </Box>
      </Stack>
    </Paper>
  );
}

