'use client';

import { Box, Alert, AlertTitle, AlertProps } from '@mui/material';

interface ErrorMessageProps extends Omit<AlertProps, 'children'> {
  message: string;
  title?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  onDismiss?: () => void;
}

export function ErrorMessage({
  message,
  title = 'Error',
  severity = 'error',
  onDismiss,
  ...props
}: ErrorMessageProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <Alert 
        severity={severity} 
        onClose={onDismiss}
        sx={{ width: '100%' }}
        {...props}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  );
}
