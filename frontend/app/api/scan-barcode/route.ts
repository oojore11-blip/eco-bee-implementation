import { NextRequest, NextResponse } from "next/server";
import { envConfig, validateEnvironment } from "../../config/env";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_data, camera_input } = body;

    // Validate environment configuration
    const envValidation = validateEnvironment();
    
    if (!envValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: "API configuration incomplete - barcode scanning requires Mistral API key",
        barcode: null,
        product_info: null,
      }, { status: 500 });
    }

    // For now, return mock barcode scanning result
    // Later, you can integrate with Mistral's vision API for real barcode detection
    
    const mockBarcodes = [
      "123456789012",
      "987654321098", 
      "456789012345",
      "789012345678",
      "234567890123",
    ];
    
    const mockProductNames = [
      "Organic Pasta",
      "Eco-Friendly Detergent",
      "Sustainable Coffee",
      "Bamboo Toothbrush",
      "Recycled Paper Towels",
    ];

    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    const randomProductName = mockProductNames[Math.floor(Math.random() * mockProductNames.length)];

    const mockProductInfo = {
      name: randomProductName,
      barcode: randomBarcode,
      sustainability: {
        sustainability_score: {
          overall_score: Math.floor(Math.random() * 40) + 40, // 40-80 range
          environmental_impact: Math.floor(Math.random() * 50) + 30, // 30-80 range
          social_impact: Math.floor(Math.random() * 30) + 50, // 50-80 range
          economic_impact: Math.floor(Math.random() * 25) + 60, // 60-85 range
        },
        environmental_tips: [
          `This ${randomProductName.toLowerCase()} appears to be an eco-conscious choice`,
          "Consider supporting brands with sustainable practices",
          "Look for certifications like organic, fair trade, or recycled content",
          "Proper disposal or recycling helps complete the sustainability cycle",
        ],
        grade: ["A-", "B+", "B", "B-"][Math.floor(Math.random() * 4)],
      },
    };

    return NextResponse.json({
      success: true,
      barcode: randomBarcode,
      product_info: mockProductInfo,
      note: "This is mock barcode scanning data. For real barcode detection, ensure Mistral API integration is properly configured.",
    });

  } catch (error) {
    console.error("Barcode scan API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to scan barcode",
        details: error instanceof Error ? error.message : "Unknown error",
        barcode: null,
        product_info: null,
      },
      { status: 500 }
    );
  }
}
