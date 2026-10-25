'use client';

import { Box, AppBar, Toolbar, Typography, Container, Menu, MenuItem, IconButton } from '@mui/material';
import { useAuth } from '../../hooks';
import { useLogout } from '../../hooks/api';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Header/Navigation */}
      <AppBar position="sticky" sx={{ width: '100%' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo/Brand */}
            <Link href="/dashboard" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                EMS
              </Typography>
            </Link>

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* User Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user && (
                <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {user.firstName} {user.lastName}
                </Typography>
              )}

              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                size="small"
              >
                <AccountCircleIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  {user?.email}
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1, backgroundColor: '#f5f5f5', paddingY: 4 }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>

      {/* Footer (optional) */}
      <Box component="footer" sx={{ backgroundColor: '#f5f5f5', borderTop: '1px solid #e0e0e0', paddingY: 2 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
            © 2025 Event Management System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
