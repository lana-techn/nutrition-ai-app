import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      return NextResponse.json({ 
        error: 'GEMINI_API_KEY not set',
        message: 'Please set GEMINI_API_KEY in .env.local'
      }, { status: 500 });
    }

    // List available models using REST API
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`
      );
      
      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json({ 
          status: 'API Key may be invalid or expired',
          error: error.error?.message || 'Failed to list models',
          message: 'Please check your GEMINI_API_KEY',
          instructions: [
            '1. Go to https://aistudio.google.com/app/apikey',
            '2. Create or copy your API key',
            '3. Add it to .env.local as GEMINI_API_KEY=your_key_here',
            '4. Restart your development server'
          ]
        }, { status: 401 });
      }

      const data = await response.json();
      const models = data.models || [];
      
      // Filter models that support generateContent
      const availableModels = models
        .filter((model: any) => 
          model.supportedGenerationMethods?.includes('generateContent')
        )
        .map((model: any) => ({
          name: model.name.replace('models/', ''),
          displayName: model.displayName,
          description: model.description,
          inputTokenLimit: model.inputTokenLimit,
          outputTokenLimit: model.outputTokenLimit
        }));

      return NextResponse.json({ 
        status: 'API Key is valid',
        message: 'Successfully connected to Gemini API',
        totalModels: models.length,
        availableForChat: availableModels.length,
        models: availableModels,
        recommendedModel: availableModels[0]?.name || 'No models available'
      });

    } catch (error) {
      return NextResponse.json({ 
        status: 'Failed to connect to Gemini API',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Please check your internet connection and API key'
      }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to check API key',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
