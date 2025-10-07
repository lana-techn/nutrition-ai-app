import { NextRequest, NextResponse } from 'next/server';
import type { AIAnalysisResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const prompt = `
Analyze this food image and provide a detailed nutritional analysis. Return your response as a JSON object with the following structure:

{
  "detectedFoods": [
    {
      "name": "food name",
      "confidence": 0.95,
      "estimatedWeight": 150,
      "nutrition": {
        "calories": 200,
        "protein": 20,
        "carbs": 30,
        "fat": 5
      }
    }
  ],
  "totalNutrition": {
    "calories": 200,
    "protein": 20,
    "carbs": 30,
    "fat": 5
  },
  "suggestions": [
    "Add some vegetables for more fiber",
    "Consider a smaller portion size"
  ]
}

Please estimate the weight of each food item in grams and calculate nutritional values accordingly. Provide practical suggestions for improving the meal's nutritional balance.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64
                }
              }
            ]
          }]
        })
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${result.error?.message || 'Unknown error'}`);
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Fallback response if JSON parsing fails
      const analysis: AIAnalysisResult = {
        detectedFoods: [
          {
            name: "Mixed Food Items",
            confidence: 0.7,
            estimatedWeight: 200,
            nutrition: {
              calories: 300,
              protein: 15,
              carbs: 40,
              fat: 10
            }
          }
        ],
        totalNutrition: {
          calories: 300,
          protein: 15,
          carbs: 40,
          fat: 10
        },
        suggestions: [
          "Unable to provide detailed analysis. Consider logging individual food items manually.",
          "Try to include more variety in your meals."
        ]
      };
      return NextResponse.json({ analysis });
    }

    const analysis = JSON.parse(jsonMatch[0]) as AIAnalysisResult;
    return NextResponse.json({ analysis });

  } catch (error) {
    console.error('Food analysis error:', error);
    
    // Fallback response in case of API errors
    const analysis: AIAnalysisResult = {
      detectedFoods: [
        {
          name: "Food Item",
          confidence: 0.5,
          estimatedWeight: 150,
          nutrition: {
            calories: 250,
            protein: 12,
            carbs: 35,
            fat: 8
          }
        }
      ],
      totalNutrition: {
        calories: 250,
        protein: 12,
        carbs: 35,
        fat: 8
      },
      suggestions: [
        "Image analysis temporarily unavailable. Please try again later.",
        "Consider logging your food manually for accurate tracking."
      ]
    };
    return NextResponse.json({ analysis });
  }
}