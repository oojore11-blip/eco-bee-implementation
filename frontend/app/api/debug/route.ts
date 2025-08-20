import { NextRequest, NextResponse } from "next/server";
import { serverEnvConfig, validateServerEnvironment } from "../../config/env";

export async function GET(request: NextRequest) {
  try {
    // Get environment validation
    const envValidation = validateServerEnvironment();
    
    // Check which environment variables are available (without exposing values)
    const envStatus = {
      MISTRAL_API_KEY: !!process.env.MISTRAL_API_KEY ? "✅ Set" : "❌ Missing",
      SUPABASE_URL: !!process.env.SUPABASE_URL ? "✅ Set" : "❌ Missing", 
      SUPABASE_KEY: !!process.env.SUPABASE_KEY ? "✅ Set" : "❌ Missing",
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL ? "✅ Running on Vercel" : "❌ Not on Vercel",
      
      // Show first/last 4 characters of API key for verification (safe)
      MISTRAL_KEY_PREVIEW: process.env.MISTRAL_API_KEY 
        ? `${process.env.MISTRAL_API_KEY.substring(0, 4)}...${process.env.MISTRAL_API_KEY.substring(process.env.MISTRAL_API_KEY.length - 4)}`
        : "Not set",
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envStatus,
      validation: envValidation,
      serverConfig: {
        isDevelopment: serverEnvConfig.isDevelopment,
        isProduction: serverEnvConfig.isProduction,
        isConfigured: serverEnvConfig.isConfigured,
      }
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Debug endpoint failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request); // Same response for POST
}
