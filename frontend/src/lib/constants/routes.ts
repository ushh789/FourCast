export const ROUTES = {
  HOME: '/',

  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },

  DASHBOARD: {
    HOME: '/dashboard',
    
    EVENTS: {
      LIST: '/dashboard',
      DETAIL: (id: string) => `/dashboard/events/${id}`,
      CREATE: '/dashboard/events/create',
      EDIT: (id: string) => `/dashboard/events/${id}/edit`,
    },
  },
} as const;

