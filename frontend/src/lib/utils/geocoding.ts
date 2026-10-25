export interface Coordinates {
  lat: number;
  lng: number;
}
export async function reverseGeocode(
  coordinates: Coordinates
): Promise<string | null> {
  try {
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve) => {
      geocoder.geocode({ location: coordinates }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

export async function getCurrentPosition(): Promise<Coordinates | null> {
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve(null);
      }
    );
  });
}

export async function getCurrentLocationAddress(): Promise<{
  coordinates: Coordinates;
  address: string;
} | null> {
  const coordinates = await getCurrentPosition();
  if (!coordinates) return null;

  const address = await reverseGeocode(coordinates);
  if (!address) return null;

  return { coordinates, address };
}

