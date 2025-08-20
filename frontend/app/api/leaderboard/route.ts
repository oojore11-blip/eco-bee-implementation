import { NextRequest, NextResponse } from "next/server";
import { serverEnvConfig, validateServerEnvironment } from "../../config/env";
import { getLeaderboard } from "../../../lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    // Validate environment configuration
    const envValidation = validateServerEnvironment();

    if (!envValidation.isValid) {
      // Return mock data if database not configured
      const mockLeaderboard = [
        {
          id: 1,
          user_name: "EcoChampion",
          eco_score: 95,
          rank: 1,
          environmental_actions_taken: 47,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          user_name: "GreenGuru",
          eco_score: 88,
          rank: 2,
          environmental_actions_taken: 35,
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          user_name: "SustainableStar",
          eco_score: 82,
          rank: 3,
          environmental_actions_taken: 28,
          created_at: new Date().toISOString(),
        },
      ];

      return NextResponse.json({
        success: true,
        leaderboard: mockLeaderboard,
        total_users: mockLeaderboard.length,
        message: "Mock leaderboard data - database not configured",
        warning: envValidation.message,
      });
    }

    // Get real leaderboard data
    const result = await getLeaderboard();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          leaderboard: [],
        },
        { status: 500 }
      );
    }

    // Transform data to match expected format
    const leaderboard = (result.data || []).map((entry, index) => ({
      id: index + 1,
      user_name: entry.pseudonym,
      eco_score: 100 - entry.composite_score, // Invert score (lower is better in our system)
      rank: index + 1,
      environmental_actions_taken: Math.floor(Math.random() * 50) + 10, // Mock for now
      created_at: entry.created_at || new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      leaderboard,
      total_users: leaderboard.length,
      message: "Leaderboard retrieved successfully",
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch leaderboard",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
