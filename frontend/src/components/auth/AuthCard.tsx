"use client";

import { Box, Card as MuiCard, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface AuthCardProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <MuiCard
        sx={{
          width: "100%",
          maxWidth: 450,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          <Box sx={{ textAlign: "center", marginBottom: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 600, marginBottom: 1 }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {children}
        </CardContent>
      </MuiCard>
    </Box>
  );
}
