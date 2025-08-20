import { NextRequest, NextResponse } from "next/server";
import { serverEnvConfig, validateServerEnvironment } from "../../config/env";
import { getProductInfo, generateSustainabilityData, generateRandomBarcode } from "../../../lib/productDatabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_data, camera_input, product_type } = body;

    // Validate environment configuration
    const envValidation = validateServerEnvironment();
    
    if (!envValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: "API configuration incomplete - barcode scanning requires proper configuration",
        barcode: null,
        product_info: null,
      }, { status: 500 });
    }

    // For mock scanning, generate a random barcode from our database
    const randomBarcode = generateRandomBarcode();
    const productInfo = getProductInfo(randomBarcode);

    if (!productInfo) {
      return NextResponse.json({
        success: false,
        barcode: null,
        product_info: null,
        product_details: null,
        sustainability: null,
        detected: false,
        error: "No product found for this barcode",
      });
    }

    // Generate comprehensive sustainability data
    const sustainabilityData = generateSustainabilityData(productInfo);

    return NextResponse.json({
      success: true,
      barcode: randomBarcode,
      product_info: productInfo,
      product_details: productInfo,
      sustainability: sustainabilityData,
      detected: true,
      note: "This is mock barcode scanning data. For real barcode detection, integrate with a barcode scanning service.",
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
