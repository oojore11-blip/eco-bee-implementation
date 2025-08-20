import { NextRequest, NextResponse } from "next/server";
import { serverEnvConfig, validateServerEnvironment } from "../../config/env";
import { calculateEcoScoreFromQuizResponses } from "../../../lib/ecoscore";
import { saveQuizSubmission } from "../../../lib/supabase";

interface QuizResponse {
  question_id: string;
  question_text: string;
  answer: string | string[];
  category: string;
}

interface IntakeRequest {
  quiz_responses: QuizResponse[];
  items?: any[];
  session_id?: string;
  user_id?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: IntakeRequest = await request.json();
    const { quiz_responses, items = [], session_id, user_id } = body;

    // Validate environment configuration
    const envValidation = validateServerEnvironment();
    
    if (!envValidation.isValid) {
      console.warn(`Environment validation failed: ${envValidation.message}`);
      // Still provide functionality even without full API configuration
      const scoringResult = calculateEcoScoreFromQuizResponses(quiz_responses);
      return NextResponse.json({
        success: true,
        scoring_result: scoringResult,
        message: "Quiz processed successfully (limited functionality - API keys not configured)",
        warning: envValidation.message,
      });
    }

    // Calculate EcoScore using real planetary boundaries algorithm
    const scoringResult = calculateEcoScoreFromQuizResponses(quiz_responses);

    // Save to database if session info provided
    if (session_id) {
      try {
        await saveQuizSubmission({
          user_id: user_id || `session_${session_id}`,
          session_id,
          quiz_responses,
          scoring_result: scoringResult,
        });
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue even if database save fails
      }
    }

    console.log('Quiz processed successfully:', { 
      session_id, 
      score: scoringResult.composite, 
      grade: scoringResult.grade 
    });

    return NextResponse.json({
      success: true,
      scoring_result: scoringResult,
      message: "Quiz processed successfully",
    });
  } catch (error) {
    console.error("Error processing quiz:", error);
    return NextResponse.json(
      {
        error: "Failed to process quiz",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
