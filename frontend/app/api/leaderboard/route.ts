import { NextRequest, NextResponse } from "next/server";
import { serverEnvConfig } from "../../config/env";

export async function GET(request: NextRequest) {
  try {
    // For now, return mock leaderboard data
    // Later, you can integrate with Supabase to get real data using serverEnvConfig.supabaseUrl and serverEnvConfig.supabaseKey
    
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
      {
        id: 4,
        user_name: "PlanetProtector",
        eco_score: 79,
        rank: 4,
        environmental_actions_taken: 22,
        created_at: new Date().toISOString(),
      },
      {
        id: 5,
        user_name: "ClimateHero",
        eco_score: 75,
        rank: 5,
        environmental_actions_taken: 19,
        created_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      leaderboard: mockLeaderboard,
      total_users: mockLeaderboard.length,
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
