'use client';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '../styles/theme';
import { AuthProvider } from '../context/AuthContext';
import { GoogleMapsProvider } from '../context/GoogleMapsContex';
import '../styles/globals.css';
import { useState } from 'react';

/**
 * Root layout component with providers
 * Sets up MUI theme, React Query, Auth context, and Google Maps for the entire app
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      },
    },
  }));

  return (
    <html lang="en">
      <head>
        <title>Event Management System</title>
        <meta name="description" content="Create, manage, and discover events" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GoogleMapsProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </GoogleMapsProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
