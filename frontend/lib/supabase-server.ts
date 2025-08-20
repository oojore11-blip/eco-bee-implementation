import { createClient } from "@supabase/supabase-js";
import { serverEnvConfig } from "../app/config/env";

// Server-side Supabase client - only use in API routes
export function createServerSupabaseClient() {
  if (!serverEnvConfig.supabaseUrl || !serverEnvConfig.supabaseKey) {
    throw new Error("Supabase configuration not available");
  }

  return createClient(serverEnvConfig.supabaseUrl, serverEnvConfig.supabaseKey);
}

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

// Server-side database operations
export async function submitToLeaderboard(
  entry: LeaderboardEntry
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase.from("leaderboard").insert([
      {
        user_id: entry.user_id,
        pseudonym: entry.pseudonym,
        composite_score: entry.composite_score,
        boundary_scores: entry.boundary_scores,
        campus_affiliation: entry.campus_affiliation,
        quiz_responses: entry.quiz_responses,
      },
    ]);

    if (error) {
      console.error("Supabase leaderboard error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Database submission error:", error);
    return { success: false, error: "Failed to submit to leaderboard" };
  }
}

export async function getLeaderboard(): Promise<{
  success: boolean;
  data?: LeaderboardEntry[];
  error?: string;
}> {
  try {
    const supabase = createServerSupabaseClient();

    // Use the leaderboard_display view for better performance and privacy
    const { data, error } = await supabase
      .from("leaderboard_display")
      .select("*")
      .order("composite_score", { ascending: true }) // Lower scores are better
      .limit(100);

    if (error) {
      console.error("Supabase leaderboard fetch error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Database fetch error:", error);
    return { success: false, error: "Failed to fetch leaderboard" };
  }
}

export async function saveQuizSubmission(
  submission: QuizSubmission
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase.from("quiz_results").insert([
      {
        dummy_user_id: submission.user_id,
        session_id: submission.session_id,
        quiz_responses: submission.quiz_responses,
        scoring_result: submission.scoring_result,
      },
    ]);

    if (error) {
      console.error("Supabase quiz submission error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Database quiz submission error:", error);
    return { success: false, error: "Failed to save quiz submission" };
  }
}
