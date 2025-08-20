"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaLeaf,
  FaCheckCircle,
  FaArrowLeft,
  FaTrophy,
  FaLightbulb,
  FaStar,
  FaGlobe,
  FaRecycle,
  FaShareAlt,
  FaChartBar,
} from "react-icons/fa";
import Link from "next/link";
import { getApiUrl } from "../config/api";

function ResultsContent() {
  const searchParams = useSearchParams();
  const resultParam = searchParams.get("result");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  let result = null;
  try {
    result = resultParam ? JSON.parse(decodeURIComponent(resultParam)) : null;
  } catch (error) {
    console.error("Error parsing result:", error);
  }

  // Save results to Supabase automatically when page loads
  useEffect(() => {
    if (result && saveStatus === "idle") {
      saveResultsToDatabase(result);
    }
  }, [result, saveStatus]);

  const saveResultsToDatabase = async (resultData: any) => {
    setSaveStatus("saving");
    try {
      const response = await fetch(getApiUrl("/intake"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz_responses: resultData.quiz_responses || [],
          items: resultData.items || [],
          session_id: resultData.session_id || `session_${Date.now()}`,
          user_id: null,
        }),
      });

      if (response.ok) {
        setSaveStatus("saved");
        console.log("✅ Results saved to database successfully");
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Error saving results to database:", error);
      setSaveStatus("error");
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      const entries = Object.entries(value);
      if (entries.length === 0) return "none";
      if (entries.length === 1) {
        const [key, val] = entries[0];
        return `${key}: ${val}`;
      }
      return `${entries.length} items`;
    }
    if (typeof value === "boolean") {
      return value ? "yes" : "no";
    }
    if (typeof value === "number") {
      return value.toString();
    }
    return String(value);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100 border-green-200";
    if (score >= 60) return "bg-blue-100 border-blue-200";
    if (score >= 40) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 p-4">
        <div className="max-w-md mx-auto glass rounded-2xl p-8 mt-20">
          <div className="text-center">
            <div className="icon-badge mx-auto mb-6">
              <span className="text-4xl">🌱</span>
            </div>
            <h2 className="text-xl neon-title mb-4">
              No Results Found
            </h2>
            <p className="text-white/70 mb-8 leading-relaxed">
              Please complete the EcoBee quiz to view your sustainability results.
            </p>
            <Link
              href="/"
              className="btn btn-primary"
            >
              <FaArrowLeft />
              <span>Back to Quiz</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const overallScore =
    result.eco_score?.overall_score || result.score?.total || 0;
  const grade = result.eco_score?.grade || result.score?.level || "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 p-4">
      <div className="max-w-5xl mx-auto ml-8">
        {/* Header Card */}
        <div className="glass rounded-2xl mb-6">
          <div className="glass-header p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="icon-badge">
                  <FaTrophy className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl neon-title">
                    Your EcoBee Results
                  </h1>
                  <p className="text-white/70">Environmental Impact Assessment</p>
                  {/* Save status indicator */}
                  {saveStatus === "saving" && (
                    <p className="text-blue-400 text-sm mt-1">
                      💾 Saving results...
                    </p>
                  )}
                  {saveStatus === "saved" && (
                    <p className="text-green-400 text-sm mt-1">
                      ✅ Results saved securely
                    </p>
                  )}
                  {saveStatus === "error" && (
                    <p className="text-red-400 text-sm mt-1">
                      ⚠️ Save failed (results still visible)
                    </p>
                  )}
                </div>
              </div>
              <button
                className="btn"
                title="Share Results"
                aria-label="Share Results"
              >
                <FaShareAlt />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Score Circle Card */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 h-fit">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <svg
                    className="w-36 h-36 transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={
                        overallScore >= 80
                          ? "#10b981"
                          : overallScore >= 60
                          ? "#3b82f6"
                          : overallScore >= 40
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 40 * (1 - overallScore / 100)
                      }`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-4xl font-bold text-white mb-1">
                      {overallScore}
                    </div>
                    <div className="text-sm text-white/60">/ 100</div>
                    <div className="glass-card-inner px-3 py-1 rounded-full mt-2">
                      <span className="text-sm font-semibold text-white">
                        {grade}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed">
                  {overallScore >= 80
                    ? "Excellent! You're living sustainably."
                    : overallScore >= 60
                    ? "Good progress! Keep improving."
                    : "There's room for improvement."}
                </p>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg neon-title mb-6 flex items-center gap-3">
                <div className="icon-badge">
                  <FaChartBar />
                </div>
                Category Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    name: "Food Choices",
                    score:
                      result.eco_score?.category_scores?.meal ||
                      result.score?.breakdown?.food_choices ||
                      0,
                    icon: "🍽️",
                    color: "green",
                  },
                  {
                    name: "Transportation",
                    score:
                      result.eco_score?.category_scores?.transportation ||
                      result.score?.breakdown?.transportation ||
                      0,
                    icon: "🚗",
                    color: "blue",
                  },
                  {
                    name: "Daily Actions",
                    score:
                      result.eco_score?.category_scores
                        ?.environmental_actions ||
                      result.score?.breakdown?.daily_actions ||
                      0,
                    icon: "♻️",
                    color: "purple",
                  },
                  {
                    name: "Clothing",
                    score:
                      result.eco_score?.category_scores?.clothing ||
                      result.score?.breakdown?.clothing ||
                      0,
                    icon: "👕",
                    color: "yellow",
                  },
                ].map((category, index) => (
                  <div
                    key={index}
                    className="glass-card-inner p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <div className="font-semibold text-white text-sm">
                            {category.name}
                          </div>
                          <div className="text-xs text-white/60">Score</div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-white">
                        {category.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reflection Analysis */}
        {result.analysis?.reflection_analysis && (
          <div className="glass rounded-2xl p-6 mt-6">
            <h3 className="text-lg neon-title mb-6 flex items-center gap-3">
              <div className="icon-badge">
                <FaStar />
              </div>
              Sustainability Reflection
              <span className="ml-auto glass-card-inner px-3 py-1 rounded-full text-sm font-semibold text-white">
                {result.analysis.reflection_analysis.reflection_score || 0}/10
              </span>
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* AI Insights */}
              <div className="glass-card-inner p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-400" />
                  AI Analysis
                </h4>
                <p className="text-white/80 text-sm leading-relaxed">
                  {result.analysis.reflection_analysis.insights}
                </p>
              </div>

              {/* Strengths & Suggestions */}
              <div className="space-y-4">
                {result.analysis.reflection_analysis.strengths?.length > 0 && (
                  <div className="glass-card-inner p-4 rounded-lg">
                    <h4 className="font-semibold text-green-400 text-sm mb-3">
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {result.analysis.reflection_analysis.strengths
                        .slice(0, 2)
                        .map((strength: string, index: number) => (
                          <li
                            key={index}
                            className="text-white/80 text-xs flex items-start gap-2"
                          >
                            <span className="text-green-400 font-bold">✓</span>
                            {strength}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {result.analysis.reflection_analysis.suggestions?.length >
                  0 && (
                  <div className="glass-card-inner p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-400 text-sm mb-3">
                      Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {result.analysis.reflection_analysis.suggestions
                        .slice(0, 2)
                        .map((suggestion: string, index: number) => (
                          <li
                            key={index}
                            className="text-white/80 text-xs flex items-start gap-2"
                          >
                            <span className="text-yellow-400 font-bold">💡</span>
                            {suggestion}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Themes */}
            {result.analysis.reflection_analysis.themes?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <h4 className="font-semibold text-white/80 text-sm mb-3">
                  Key Themes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.reflection_analysis.themes
                    .slice(0, 5)
                    .map((theme: string, index: number) => (
                      <span
                        key={index}
                        className="glass-card-inner px-3 py-1 rounded-full text-xs text-white font-medium"
                      >
                        {theme}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Impact & Recommendations */}
        {(result.analysis || result.comprehensive_analysis) && (
          <div className="glass rounded-2xl p-6 mt-6">
            <h3 className="text-lg neon-title mb-6 flex items-center gap-3">
              <div className="icon-badge">
                <FaGlobe />
              </div>
              Environmental Impact & Recommendations
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Impact Summary */}
              {(result.analysis?.impact_summary ||
                result.comprehensive_analysis?.overall_impact) && (
                <div className="glass-card-inner p-4 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-3">
                    Today's Impact
                  </h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {result.analysis?.impact_summary ||
                      `${
                        result.comprehensive_analysis?.overall_impact
                          ?.environmental_actions_taken || 0
                      } environmental actions taken`}
                  </p>
                </div>
              )}

              {/* Top Recommendations */}
              {(
                result.analysis?.recommendations ||
                result.comprehensive_analysis?.recommendations
              )?.length > 0 && (
                <div className="glass-card-inner p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-3">
                    Top Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {(
                      result.analysis?.recommendations ||
                      result.comprehensive_analysis?.recommendations ||
                      []
                    )
                      .slice(0, 3)
                      .map((rec: string, index: number) => (
                        <li
                          key={index}
                          className="text-white/80 text-sm flex items-start gap-2"
                        >
                          <FaCheckCircle className="text-blue-400 mt-0.5 flex-shrink-0 text-xs" />
                          <span>{rec}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="glass rounded-2xl p-6 mt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn btn-primary"
            >
              <FaArrowLeft />
              <span>Take Another Assessment</span>
            </Link>
            <button className="btn">
              <FaShareAlt />
              <span>Share Results</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 text-center max-w-md w-full">
            <div className="icon-badge mx-auto mb-6">
              <span className="text-4xl">🌱</span>
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent"></div>
              <span className="text-lg text-yellow-400 font-semibold">Processing...</span>
            </div>
            <p className="text-white/70">
              Loading your sustainability results...
            </p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
