export function formatCoordinates(
  lat: number,
  lng: number,
  decimals: number = 6
): string {
  return `${lat.toFixed(decimals)}, ${lng.toFixed(decimals)}`;
}
