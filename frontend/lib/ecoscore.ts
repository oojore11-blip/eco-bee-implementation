// Enhanced Planetary Boundaries EcoScore Engine
// Ported from Python backend for Vercel deployment

interface BoundaryConfig {
  name: string;
  weight: number;
  safe_operating_space: number;
  current_global_status: number;
  units: string;
  description: string;
}

export const PLANETARY_BOUNDARIES: Record<string, BoundaryConfig> = {
  climate: {
    name: "Climate Change",
    weight: 0.25,
    safe_operating_space: 350.0, // ppm CO2 equivalent
    current_global_status: 415.0, // Current global level
    units: "ppm CO2eq",
    description: "Atmospheric CO2 concentration and radiative forcing"
  },
  biosphere: {
    name: "Biosphere Integrity", 
    weight: 0.25,
    safe_operating_space: 10.0, // Extinctions per million species-years
    current_global_status: 100.0, // Current extinction rate
    units: "E/MSY",
    description: "Biodiversity loss and ecosystem function"
  },
  biogeochemical: {
    name: "Biogeochemical Flows",
    weight: 0.20,
    safe_operating_space: 62.0, // Tg N/yr to ocean
    current_global_status: 150.0, // Current nitrogen flows
    units: "Tg N/yr",
    description: "Nitrogen and phosphorus cycles"
  },
  freshwater: {
    name: "Freshwater Use",
    weight: 0.15,
    safe_operating_space: 4000.0, // km³/yr global consumption
    current_global_status: 2600.0, // Current usage
    units: "km³/yr",
    description: "Global freshwater consumption"
  },
  aerosols: {
    name: "Atmospheric Aerosols",
    weight: 0.15,
    safe_operating_space: 25.0, // AOD units
    current_global_status: 30.0, // Current levels
    units: "AOD",
    description: "Atmospheric aerosol loading"
  }
};

interface QuizResponse {
  question_id: string;
  question_text: string;
  answer: string | string[];
  category: string;
}

interface ScoringResult {
  items: any[];
  per_boundary_averages: Record<string, number>;
  composite: number;
  grade: string;
  recommendations: Array<{
    action: string;
    impact: string;
    boundary: string;
    current_score: number;
  }>;
  boundary_details: Record<string, any>;
}

export function calculateEcoScoreFromQuizResponses(responses: QuizResponse[]): ScoringResult {
  // Initialize boundary scores with baseline values
  const boundaryScores: Record<string, number> = {
    climate: 50,
    biosphere: 50, 
    biogeochemical: 50,
    freshwater: 50,
    aerosols: 50
  };

  // Process each quiz response
  responses.forEach(response => {
    const answer = Array.isArray(response.answer) ? response.answer[0] : response.answer;
    
    switch (response.question_id) {
      case "food_today":
        processFrequencyAnswer(answer, "climate", boundaryScores, {
          "plant-based": -20,
          "mixed": -5,
          "meat-heavy": 15,
          "packaged": 10
        });
        processFrequencyAnswer(answer, "biosphere", boundaryScores, {
          "plant-based": -15,
          "mixed": -3,
          "meat-heavy": 12,
          "packaged": 8
        });
        break;

      case "transport_today": 
        processFrequencyAnswer(answer, "climate", boundaryScores, {
          "walk": -20,
          "bike": -15,
          "public": -10,
          "electric": -5,
          "car": 20
        });
        break;

      case "energy_usage":
        processFrequencyAnswer(answer, "climate", boundaryScores, {
          "renewable": -15,
          "efficient": -8,
          "standard": 5,
          "high": 15
        });
        break;

      case "waste_habits":
        processFrequencyAnswer(answer, "biogeochemical", boundaryScores, {
          "minimal": -15,
          "recycle": -8,
          "some": 5,
          "high": 12
        });
        break;

      case "water_usage":
        processFrequencyAnswer(answer, "freshwater", boundaryScores, {
          "low": -15,
          "moderate": -5,
          "high": 10,
          "very-high": 20
        });
        break;

      case "shopping_habits":
        processFrequencyAnswer(answer, "biosphere", boundaryScores, {
          "local": -12,
          "sustainable": -8,
          "mixed": 3,
          "convenience": 15
        });
        break;
    }
  });

  // Normalize scores to 0-100 range
  Object.keys(boundaryScores).forEach(boundary => {
    boundaryScores[boundary] = Math.max(0, Math.min(100, boundaryScores[boundary]));
  });

  // Calculate weighted composite score
  const composite = Object.keys(PLANETARY_BOUNDARIES).reduce((sum, boundary) => {
    return sum + (boundaryScores[boundary] * PLANETARY_BOUNDARIES[boundary].weight);
  }, 0);

  // Determine grade (inverted - lower scores are better for environment)
  const grade = composite <= 30 ? "A" : composite <= 50 ? "B" : composite <= 70 ? "C" : "D";

  // Generate recommendations based on worst-performing boundaries
  const recommendations = generateRecommendations(boundaryScores);

  return {
    items: [],
    per_boundary_averages: boundaryScores,
    composite: Math.round(composite),
    grade,
    recommendations,
    boundary_details: PLANETARY_BOUNDARIES
  };
}

function processFrequencyAnswer(
  answer: string, 
  boundary: string, 
  scores: Record<string, number>, 
  mapping: Record<string, number>
) {
  const adjustment = mapping[answer] || 0;
  scores[boundary] += adjustment;
}

function generateRecommendations(boundaryScores: Record<string, number>) {
  const recommendations = [];
  
  // Find the highest scoring (worst performing) boundaries
  const sortedBoundaries = Object.entries(boundaryScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  for (const [boundary, score] of sortedBoundaries) {
    const config = PLANETARY_BOUNDARIES[boundary];
    let action = "";
    let impact = "";

    switch (boundary) {
      case "climate":
        action = "Reduce meat consumption and choose plant-based meals";
        impact = "Could reduce your climate impact by 30-50%";
        break;
      case "biosphere":
        action = "Choose local, organic, and sustainable products";
        impact = "Supports biodiversity and ecosystem health";
        break;
      case "biogeochemical":
        action = "Minimize food waste and compost organic matter";
        impact = "Reduces nitrogen runoff and soil degradation";
        break;
      case "freshwater":
        action = "Take shorter showers and fix water leaks";
        impact = "Conserves freshwater resources";
        break;
      case "aerosols":
        action = "Use public transport and reduce air travel";
        impact = "Decreases air pollution and particulate matter";
        break;
    }

    recommendations.push({
      action,
      impact,
      boundary: config.name,
      current_score: Math.round(score)
    });
  }

  return recommendations;
}
