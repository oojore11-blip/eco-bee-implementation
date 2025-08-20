// Environment configuration for the EcoBee application
// SECURITY NOTE: API keys should NEVER be exposed to client-side code!

// Server-side only configuration (for API routes)
export const serverEnvConfig = {
  // API Keys (server-side only)
  mistralApiKey: process.env.MISTRAL_API_KEY,

  // Supabase Configuration (server-side only)
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,

  // Environment checks
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Check if all required environment variables are configured
  get isConfigured() {
    return (
      this.mistralApiKey &&
      this.supabaseUrl &&
      this.supabaseKey &&
      this.mistralApiKey !== "production" &&
      this.supabaseUrl !== "production" &&
      this.supabaseKey !== "production"
    );
  },
};

// Client-side safe configuration (for React components)
export const clientEnvConfig = {
  // API Base URL (safe to expose)
  apiBaseUrl: "/api", // Always use internal API routes for security

  // Environment checks (safe to expose)
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};

// Helper function to validate server environment configuration
export function validateServerEnvironment() {
  const missing = [];

  if (!serverEnvConfig.mistralApiKey || serverEnvConfig.mistralApiKey === "production") {
    missing.push("MISTRAL_API_KEY");
  }

  if (!serverEnvConfig.supabaseUrl || serverEnvConfig.supabaseUrl === "production") {
    missing.push("SUPABASE_URL");
  }

  if (!serverEnvConfig.supabaseKey || serverEnvConfig.supabaseKey === "production") {
    missing.push("SUPABASE_KEY");
  }

  return {
    isValid: missing.length === 0,
    missing,
    message:
      missing.length > 0
        ? `Missing or invalid environment variables: ${missing.join(", ")}`
        : "All environment variables are configured",
  };
}

// Helper function to validate client environment configuration
export function validateClientEnvironment() {
  return {
    isValid: true,
    missing: [],
    message: "Client environment is configured (using secure API routes)",
  };
}

// Backward compatibility (deprecated - use serverEnvConfig in API routes)
export const envConfig = serverEnvConfig;
export const validateEnvironment = validateServerEnvironment;
