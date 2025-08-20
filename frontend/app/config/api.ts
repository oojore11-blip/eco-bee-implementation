import { clientEnvConfig } from "./env";

// Environment configuration for API base URL (client-safe)
export const config = {
  apiBaseUrl: clientEnvConfig.apiBaseUrl,
  isDevelopment: clientEnvConfig.isDevelopment,
  isProduction: clientEnvConfig.isProduction,
};

// Helper function to get API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.apiBaseUrl}${endpoint}`;
};
