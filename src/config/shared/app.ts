import { baseAPIUrl } from '../../lib/config';

export const APP_CONFIG = {
  API_URL: baseAPIUrl,
  APP_NAME: 'TravelMatch',
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
    { label: 'Blog', href: '/discover' },
    { label: 'My Groups', href: '/groups' },
  ],
} as const;
