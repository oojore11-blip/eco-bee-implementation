import { envConfig } from "./env";

// Environment configuration for API base URL
export const config = {
  apiBaseUrl: envConfig.apiBaseUrl,
  isDevelopment: envConfig.isDevelopment,
  isProduction: envConfig.isProduction,
};

// Helper function to get API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.apiBaseUrl}${endpoint}`;
};
