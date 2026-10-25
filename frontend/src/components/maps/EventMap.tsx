"use client";

import { Box, Typography, Paper } from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MapWrapper } from "./MapWrapper";
import { formatCoordinates } from "../../lib/utils/coordinates";

interface EventMapProps {
  latitude: number;
  longitude: number;
  title?: string;
}

export function EventMap({ latitude, longitude, title }: EventMapProps) {
  const center = { lat: latitude, lng: longitude };

  return (
    <MapWrapper>
      <Paper elevation={2} sx={{ mt: 2, overflow: "hidden", borderRadius: 2 }}>
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "300px",
          }}
          center={center}
          zoom={15}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          <Marker position={center} title={title} />
        </GoogleMap>
        <Box sx={{ p: 1, bgcolor: "background.paper" }}>
          <Typography variant="caption" color="text.secondary">
            {formatCoordinates(latitude, longitude)}
          </Typography>
        </Box>
      </Paper>
    </MapWrapper>
  );
}
