"use client";
import React from "react";
import { clientEnvConfig } from "../config/env";
import { config } from "../config/api";

export default function EnvironmentStatus() {
  // Only show in development
  if (clientEnvConfig.isProduction) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-1">Environment Status</div>
      <div className="text-green-400 mb-1">
        ✅ Client environment configured
      </div>
      <div className="text-xs text-gray-300">
        Using secure API routes - no exposed credentials
      </div>
      <div className="mt-2 text-xs text-gray-400">
        API Base: {config.apiBaseUrl}
      </div>
    </div>
  );
}
