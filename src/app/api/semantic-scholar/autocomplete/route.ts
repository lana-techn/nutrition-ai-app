import { NextRequest, NextResponse } from 'next/server';
import { semanticScholarService } from '@/lib/semantic-scholar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const suggestions = await semanticScholarService.autocomplete(query);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Semantic Scholar autocomplete error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        message: 'Failed to get suggestions. Please try again later.'
      },
      { status: 500 }
    );
  }
}
