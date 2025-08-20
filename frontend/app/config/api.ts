// Environment configuration for API base URL
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Helper function to get API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.apiBaseUrl}${endpoint}`;
};
