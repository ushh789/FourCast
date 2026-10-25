"use client";

import { useState, useCallback, useRef } from "react";
import { Box, TextField, Typography, Paper } from "@mui/material";
import { MyLocation } from "@mui/icons-material";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { MAPS_CONFIG } from "../../lib/config";
import { MapWrapper } from "./MapWrapper";
import { formatCoordinates } from "../../lib/utils/coordinates";
import {
  reverseGeocode,
  getCurrentLocationAddress,
} from "../../lib/utils/geocoding";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  value?: LocationData;
  onChange: (location: LocationData) => void;
  error?: string;
}

export function LocationPicker({
  value,
  onChange,
  error,
}: LocationPickerProps) {
  const [center, setCenter] = useState({
    lat: value?.latitude || MAPS_CONFIG.DEFAULT_CENTER.lat,
    lng: value?.longitude || MAPS_CONFIG.DEFAULT_CENTER.lng,
  });

  const [markerPosition, setMarkerPosition] = useState(
    value ? { lat: value.latitude, lng: value.longitude } : null,
  );

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [address, setAddress] = useState(value?.address || "");

  // Handle place selection from autocomplete
  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formattedAddress = place.formatted_address || "";

        setMarkerPosition({ lat, lng });
        setCenter({ lat, lng });
        setAddress(formattedAddress);

        onChange({
          address: formattedAddress,
          latitude: lat,
          longitude: lng,
        });
      }
    }
  }, [onChange]);

  // Handle map click
  const onMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setMarkerPosition({ lat, lng });

        // Reverse geocode to get address
        const formattedAddress = await reverseGeocode({ lat, lng });
        if (formattedAddress) {
          setAddress(formattedAddress);
          onChange({
            address: formattedAddress,
            latitude: lat,
            longitude: lng,
          });
        }
      }
    },
    [onChange],
  );

  // Get user's current location
  const getCurrentLocation = useCallback(async () => {
    const result = await getCurrentLocationAddress();

    if (result) {
      const { coordinates, address: formattedAddress } = result;

      setMarkerPosition(coordinates);
      setCenter(coordinates);
      setAddress(formattedAddress);

      onChange({
        address: formattedAddress,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      });
    }
  }, [onChange]);

  return (
    <MapWrapper>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Event Location
        </Typography>

        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={onPlaceChanged}
        >
          <TextField
            fullWidth
            placeholder="Search for a location..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={!!error}
            helperText={
              error || "Search or click on the map to select a location"
            }
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <MyLocation
                  sx={{ cursor: "pointer", color: "primary.main" }}
                  onClick={getCurrentLocation}
                  titleAccess="Use my current location"
                />
              ),
            }}
          />
        </Autocomplete>

        <Paper elevation={2}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={MAPS_CONFIG.DEFAULT_ZOOM}
            onClick={onMapClick}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        </Paper>

        {/* Coordinates Display */}
        {markerPosition && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Coordinates:{" "}
            {formatCoordinates(markerPosition.lat, markerPosition.lng)}
          </Typography>
        )}
      </Box>
    </MapWrapper>
  );
}
