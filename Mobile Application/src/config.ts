/**
 * Single place for API base URL and app config.
 * Change BASE_URL for dev/staging/production.
 */
export const config = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://172.20.10.4:8080',
} as const;
