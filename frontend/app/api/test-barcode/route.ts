import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test API received:', body);
    
    return NextResponse.json({
      success: true,
      received_data: body,
      timestamp: new Date().toISOString(),
      message: "Test API working correctly"
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
