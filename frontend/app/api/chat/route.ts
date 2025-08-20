import { NextRequest, NextResponse } from "next/server";
import { envConfig, validateEnvironment } from "../../config/env";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context, user_id } = body;

    // Validate environment configuration
    const envValidation = validateEnvironment();
    
    if (!envValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: "API configuration incomplete",
        response: "I'm sorry, but I'm not properly configured to provide responses right now. Please check back later.",
      }, { status: 500 });
    }

    // Call Mistral API
    try {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${envConfig.mistralApiKey}`,
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [
            {
              role: "system",
              content: `You are EcoBee, a friendly sustainability assistant. Help users with environmental questions and provide practical eco-friendly advice. Keep responses concise and actionable. Context: ${context || 'general sustainability advice'}`
            },
            {
              role: "user", 
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status}`);
      }

      const result = await response.json();
      const assistantMessage = result.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

      return NextResponse.json({
        success: true,
        response: assistantMessage,
      });

    } catch (apiError) {
      console.error("Mistral API error:", apiError);
      
      // Fallback response
      const fallbackResponses = [
        "That's a great question about sustainability! Here are some general tips: reduce energy consumption, choose renewable energy when possible, minimize waste, and consider the environmental impact of your purchases.",
        "For sustainable living, try focusing on the 3 R's: Reduce what you consume, Reuse items when possible, and Recycle properly. Every small action helps!",
        "Consider sustainable transportation options like walking, cycling, public transit, or electric vehicles. Also, eating more plant-based meals can significantly reduce your carbon footprint.",
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      return NextResponse.json({
        success: true,
        response: randomResponse,
        note: "This is a fallback response as the AI service is temporarily unavailable.",
      });
    }

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process chat message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
