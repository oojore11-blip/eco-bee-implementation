"use client";
import React from "react";
import { envConfig, validateEnvironment } from "../config/env";

export default function EnvironmentStatus() {
  const validation = validateEnvironment();

  // Only show in development
  if (envConfig.isProduction) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-1">Environment Status</div>
      <div
        className={`mb-1 ${
          validation.isValid ? "text-green-400" : "text-red-400"
        }`}
      >
        {validation.isValid ? "✅ All configured" : "⚠️ Configuration needed"}
      </div>
      {!validation.isValid && (
        <div className="text-xs text-gray-300">
          Missing: {validation.missing.join(", ")}
        </div>
      )}
      <div className="mt-2 text-xs text-gray-400">
        API Base: {envConfig.apiBaseUrl || "default"}
      </div>
    </div>
  );
}
