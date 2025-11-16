export const APP_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8080',
  FILE_SERVER_URL: process.env.NEXT_PUBLIC_FILE_SERVER_URL || 'http://localhost:6969',
  APP_NAME: 'ThamRoi',
  APP_DESCRIPTION: 'Find your perfect travel companion',
  FEATURES: [
    { icon: 'Heart', label: 'Connect', description: 'Connect with fellow travelers' },
    { icon: 'MapPin', label: 'Explore', description: 'Discover amazing destinations' },
    { icon: 'Camera', label: 'Create', description: 'Create unforgettable memories' },
  ],
  STATS: [
    { value: '50K+', label: 'Travelers' },
    { value: '120+', label: 'Countries' },
    { value: '1M+', label: 'Matches' },
  ],
  NAV_LINKS: [
    { label: 'Blog', href: '/blogfeed' },
  ],
} as const;
