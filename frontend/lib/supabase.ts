// Client-side Supabase operations using API routes
// This ensures security by keeping database credentials server-side

import { getApiUrl } from "../app/config/api";

// Database interface types
export interface LeaderboardEntry {
  id?: string;
  user_id: string;
  pseudonym: string;
  composite_score: number;
  boundary_scores: Record<string, number>;
  campus_affiliation: string;
  created_at?: string;
  quiz_responses?: any[];
}

export interface QuizSubmission {
  id?: string;
  user_id: string;
  session_id: string;
  quiz_responses: any[];
  scoring_result: any;
  created_at?: string;
}

// Client-side API operations (secure - uses API routes)
export async function submitToLeaderboard(
  entry: LeaderboardEntry
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("📊 Submitting to leaderboard:", entry);

    const response = await fetch(getApiUrl("/submit-score"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Leaderboard submission failed:", errorData);
      return { success: false, error: errorData.error || "Submission failed" };
    }

    const result = await response.json();
    console.log("✅ Leaderboard submission successful:", result);
    return { success: true };
  } catch (error) {
    console.error("Leaderboard submission error:", error);
    return { success: false, error: "Failed to submit to leaderboard" };
  }
}

export async function getLeaderboard(): Promise<{
  success: boolean;
  data?: LeaderboardEntry[];
  error?: string;
}> {
  try {
    console.log("📊 Fetching leaderboard data...");

    const response = await fetch(getApiUrl("/leaderboard"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Leaderboard fetch failed:", errorData);
      return { success: false, error: errorData.error || "Fetch failed" };
    }

    const result = await response.json();
    console.log("✅ Leaderboard fetch successful:", result);
    return { success: true, data: result.leaderboard || result.data || [] };
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return { success: false, error: "Failed to fetch leaderboard" };
  }
}

export async function saveQuizSubmission(
  submission: QuizSubmission
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("💾 Saving quiz submission:", submission);

    // For now, we'll use the intake endpoint to save quiz data
    const response = await fetch(getApiUrl("/intake"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: submission.user_id,
        session_id: submission.session_id,
        quiz_responses: submission.quiz_responses,
        scoring_result: submission.scoring_result,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Quiz submission failed:", errorData);
      return { success: false, error: errorData.error || "Submission failed" };
    }

    const result = await response.json();
    console.log("✅ Quiz submission successful:", result);
    return { success: true };
  } catch (error) {
    console.error("Quiz submission error:", error);
    return { success: false, error: "Failed to save quiz submission" };
  }
}
