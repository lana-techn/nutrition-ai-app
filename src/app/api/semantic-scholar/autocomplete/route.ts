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

    // Add minimum length validation to avoid API errors for very short queries
    if (query.length < 2) {
      return NextResponse.json([]);
    }

    const suggestions = await semanticScholarService.autocomplete(query);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Semantic Scholar autocomplete error:', error);
    
    // Check if it's a bad request from the Semantic Scholar API (likely due to invalid query)
    if (error instanceof Error && error.message.includes('400 Bad Request')) {
      return NextResponse.json([]);
    }
    
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
