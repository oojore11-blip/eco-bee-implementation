import { NextRequest, NextResponse } from "next/server";
import { serverEnvConfig, validateServerEnvironment } from "../../config/env";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_name, barcode, image_data } = body;

    // Validate environment configuration
    const envValidation = validateServerEnvironment();

    if (!envValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "API configuration incomplete",
          sustainability: null,
        },
        { status: 500 }
      );
    }

    // For now, return mock sustainability data
    // Later, you can integrate with Mistral API for real analysis using serverEnvConfig.mistralApiKey

    const mockSustainability = {
      sustainability_score: {
        overall_score: Math.floor(Math.random() * 40) + 30, // 30-70 range
        environmental_impact: Math.floor(Math.random() * 50) + 25, // 25-75 range
        social_impact: Math.floor(Math.random() * 30) + 40, // 40-70 range
        economic_impact: Math.floor(Math.random() * 25) + 50, // 50-75 range
      },
      environmental_tips: [
        "Consider choosing products with minimal packaging",
        "Look for eco-friendly alternatives when possible",
        "Check if this product can be recycled in your area",
        "Consider the product's lifecycle and durability",
      ],
      alternatives: [
        {
          name: "Eco-friendly alternative",
          description: "A more sustainable option with similar functionality",
          sustainability_improvement: "25% better environmental impact",
        },
      ],
      grade: ["B+", "B", "B-", "C+", "C"][Math.floor(Math.random() * 5)],
    };

    return NextResponse.json({
      success: true,
      product_name: product_name || "Unknown Product",
      sustainability: mockSustainability,
      note: "This is generated sustainability data. For more accurate analysis, ensure all API keys are properly configured.",
    });
  } catch (error) {
    console.error("Product sustainability API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze product sustainability",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
