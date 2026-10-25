'use client';

import { ReactNode } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useGoogleMaps } from '../../context/GoogleMapsContex';
import { MAPS_CONFIG } from '../../lib/config';

interface MapWrapperProps {
  children: ReactNode;
  loadingSize?: number;
}

export function MapWrapper({ children, loadingSize = 30 }: MapWrapperProps) {
  const { isLoaded, loadError } = useGoogleMaps();

  if (loadError) {
    return (
      <Alert severity="error">
        Error loading Google Maps. Please check your API key configuration.
      </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress size={loadingSize} />
      </Box>
    );
  }

  if (!MAPS_CONFIG.API_KEY) {
    return (
      <Alert severity="warning">
        Google Maps API key is not configured. Please add
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.
      </Alert>
    );
  }

  return <>{children}</>;
}

