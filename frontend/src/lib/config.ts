export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
} as const;


export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ems_access_token',
  REFRESH_TOKEN: 'ems_refresh_token',
  USER: 'ems_user',
} as const;


export const MAPS_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  DEFAULT_CENTER: {
    lat: 40.7128, // New York City
    lng: -74.006,
  },
  DEFAULT_ZOOM: 13,
} as const;
