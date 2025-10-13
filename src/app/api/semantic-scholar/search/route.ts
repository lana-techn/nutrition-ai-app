import { NextRequest, NextResponse } from 'next/server';
import { semanticScholarService } from '@/lib/semantic-scholar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('query');
    const year = searchParams.get('year');
    const publicationTypes = searchParams.get('publicationTypes');
    const minCitationCount = searchParams.get('minCitationCount');
    const openAccessPdf = searchParams.get('openAccessPdf');
    const offset = searchParams.get('offset');
    const limit = searchParams.get('limit');
    const fieldsOfStudy = searchParams.get('fieldsOfStudy');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const searchOptions: any = {
      query,
      fields: 'title,abstract,authors,venue,year,url,openAccessPdf,citationCount,referenceCount,publicationTypes,fieldsOfStudy,s2FieldsOfStudy,publicationDate,journal',
    };

    if (year) searchOptions.year = year;
    if (publicationTypes) searchOptions.publicationTypes = publicationTypes;
    if (minCitationCount) searchOptions.minCitationCount = parseInt(minCitationCount);
    if (openAccessPdf === 'true') searchOptions.openAccessPdf = true;
    if (offset) searchOptions.offset = parseInt(offset);
    if (limit) searchOptions.limit = Math.min(parseInt(limit), 100);
    if (fieldsOfStudy) searchOptions.fieldsOfStudy = fieldsOfStudy;

    const results = await semanticScholarService.searchNutritionPapers(query, searchOptions);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Semantic Scholar API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        message: 'Failed to search papers. Please try again later.'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, ...searchOptions } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required in request body' },
        { status: 400 }
      );
    }

    const results = await semanticScholarService.searchNutritionPapers(query, searchOptions);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Semantic Scholar API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        message: 'Failed to search papers. Please try again later.'
      },
      { status: 500 }
    );
  }
}
