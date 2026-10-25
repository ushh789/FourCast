import { format } from 'date-fns';

export function formatEventDate(date: string | Date): string {
  return format(new Date(date), 'PPP');
}
export function formatFullDateTime(date: string | Date): string {
  return format(new Date(date), 'PPP, p');
}
export function formatShortDate(date: string | Date): string {
  return format(new Date(date), 'MM/dd/yyyy');
}

export function toDateTimeLocalString(date: Date | null | undefined): string {
  if (!date) return '';
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function fromDateTimeLocalString(dateString: string): Date | undefined {
  if (!dateString) return undefined;
  return new Date(dateString);
}
