// Environment configuration for the EcoBee application
export const envConfig = {
  // API Keys
  mistralApiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY,

  // Supabase Configuration
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,

  // API Base URL
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE ||
    (process.env.NODE_ENV === "production" ? "" : "http://localhost:8000"),

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

// Helper function to validate environment configuration
export function validateEnvironment() {
  const missing = [];

  if (!envConfig.mistralApiKey || envConfig.mistralApiKey === "production") {
    missing.push("NEXT_PUBLIC_MISTRAL_API_KEY");
  }

  if (!envConfig.supabaseUrl || envConfig.supabaseUrl === "production") {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!envConfig.supabaseKey || envConfig.supabaseKey === "production") {
    missing.push("NEXT_PUBLIC_SUPABASE_KEY");
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
