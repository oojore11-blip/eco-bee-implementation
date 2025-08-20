import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quiz_responses, items, session_id, user_id } = body;

    // For now, create a mock scoring result
    // Later, you can integrate with Mistral API and Supabase here
    const mockScoringResult = createMockScoringResult(quiz_responses);

    return NextResponse.json({
      success: true,
      scoring_result: mockScoringResult,
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

function createMockScoringResult(responses: any[]) {
  // Simple scoring based on responses
  let totalScore = 50; // baseline

  responses.forEach((response) => {
    if (response.question_id === "food_today") {
      switch (response.answer) {
        case "plant-based":
          totalScore -= 20;
          break;
        case "mixed":
          totalScore -= 5;
          break;
        case "meat-heavy":
          totalScore += 15;
          break;
        case "packaged":
          totalScore += 10;
          break;
      }
    }
    if (response.question_id === "transport_today") {
      switch (response.answer) {
        case "walk":
        case "bike":
          totalScore -= 15;
          break;
        case "public":
          totalScore -= 5;
          break;
        case "electric":
          totalScore += 5;
          break;
        case "car":
          totalScore += 20;
          break;
      }
    }
  });

  totalScore = Math.max(0, Math.min(100, totalScore));

  // Use deterministic values to prevent hydration mismatch
  const boundaryScores = {
    climate: Math.max(0, Math.min(100, totalScore + 2)),
    biosphere: Math.max(0, Math.min(100, totalScore - 3)),
    biogeochemical: Math.max(0, Math.min(100, totalScore + 1)),
    freshwater: Math.max(0, Math.min(100, totalScore - 2)),
    aerosols: Math.max(0, Math.min(100, totalScore + 3)),
  };

  return {
    items: [],
    per_boundary_averages: boundaryScores,
    composite: totalScore,
    grade:
      totalScore <= 30
        ? "A"
        : totalScore <= 50
        ? "B"
        : totalScore <= 70
        ? "C"
        : "D",
    recommendations: [
      {
        action: "Choose more plant-based meals",
        impact: "Reduce climate impact by 50%",
        boundary: "Climate Change",
        current_score: boundaryScores.climate,
      },
      {
        action: "Use public transport or walk more",
        impact: "Lower your carbon footprint",
        boundary: "Climate Change",
        current_score: boundaryScores.climate,
      },
    ],
    boundary_details: {},
  };
}
