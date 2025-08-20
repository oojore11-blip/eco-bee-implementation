import { NextRequest, NextResponse } from "next/server";
import { serverEnvConfig, validateServerEnvironment } from "../../config/env";
import { submitToLeaderboard } from "../../../lib/supabase";

interface SubmitScoreRequest {
  user_id: string;
  pseudonym: string;
  composite_score: number;
  boundary_scores: Record<string, number>;
  campus_affiliation: string;
  quiz_responses?: any[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitScoreRequest = await request.json();
    const { 
      user_id, 
      pseudonym, 
      composite_score, 
      boundary_scores, 
      campus_affiliation, 
      quiz_responses 
    } = body;

    // Validate required fields
    if (!user_id || !pseudonym || composite_score === undefined || !boundary_scores || !campus_affiliation) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: user_id, pseudonym, composite_score, boundary_scores, campus_affiliation",
      }, { status: 400 });
    }

    // Validate environment configuration
    const envValidation = validateServerEnvironment();
    
    if (!envValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: "Database not configured - cannot submit to leaderboard",
        message: envValidation.message,
      }, { status: 500 });
    }

    // Submit to database
    const result = await submitToLeaderboard({
      user_id,
      pseudonym,
      composite_score,
      boundary_scores,
      campus_affiliation,
      quiz_responses,
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Score submitted to leaderboard successfully",
    });

  } catch (error) {
    console.error("Submit score API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit score to leaderboard",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
