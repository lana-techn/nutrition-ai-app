export interface SemanticScholarPaper {
  paperId?: string;
  id?: string;
  title: string;
  abstract?: string;
  authors?: Array<{
    authorId: string;
    name: string;
    url?: string;
  }>;
  venue?: string;
  year?: number;
  url?: string;
  openAccessPdf?: {
    url: string;
    status: string;
  };
  citationCount?: number;
  referenceCount?: number;
  publicationTypes?: string[];
  fieldsOfStudy?: string[];
  s2FieldsOfStudy?: Array<{
    category: string;
    source: string;
  }>;
  publicationDate?: string;
  journal?: {
    name: string;
    pages: string;
    volume: string;
  };
  authorsYear?: string; // For autocomplete responses
}

export interface SemanticScholarSearchResponse {
  total: number;
  offset: number;
  next?: number;
  data: SemanticScholarPaper[];
}

export interface SemanticScholarSearchParams {
  query: string;
  fields?: string;
  publicationTypes?: string;
  openAccessPdf?: boolean;
  minCitationCount?: number;
  year?: string;
  venue?: string;
  fieldsOfStudy?: string;
  offset?: number;
  limit?: number;
}

class SemanticScholarService {
  private baseUrl = 'https://api.semanticscholar.org/graph/v1';
  private apiKey: string | undefined;
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_MS = 1100; // 1.1 seconds to be safe with 1 req/sec limit

  constructor() {
    this.apiKey = process.env.SEMANTIC_SCHOLAR_API_KEY;
    if (!this.apiKey) {
      console.warn('SEMANTIC_SCHOLAR_API_KEY not found in environment variables');
    }
  }

  // private async enforceRateLimit(): Promise<void> {
//   const now = Date.now();
//   const timeSinceLastRequest = now - this.lastRequestTime;
//   
//   if (timeSinceLastRequest < this.RATE_LIMIT_MS) {
//     const waitTime = this.RATE_LIMIT_MS - timeSinceLastRequest;
//     await new Promise(resolve => setTimeout(resolve, waitTime));
//   }
//   
//   this.lastRequestTime = Date.now();
// }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }

    return headers;
  }

  async searchPapers(params: SemanticScholarSearchParams): Promise<SemanticScholarSearchResponse> {
    // Check if API key is available
    if (!this.apiKey) {
      throw new Error('Semantic Scholar API key is not configured. Please add SEMANTIC_SCHOLAR_API_KEY to your environment variables.');
    }

    const searchParams = new URLSearchParams();
    
    searchParams.append('query', params.query);
    
    if (params.fields) {
      searchParams.append('fields', params.fields);
    } else {
      // Default fields for nutrition/health papers
      searchParams.append('fields', 'title,abstract,authors,venue,year,url,openAccessPdf,citationCount,publicationTypes,fieldsOfStudy,journal');
    }
    
    if (params.publicationTypes) {
      searchParams.append('publicationTypes', params.publicationTypes);
    }
    
    if (params.openAccessPdf) {
      searchParams.append('openAccessPdf', '');
    }
    
    if (params.minCitationCount) {
      searchParams.append('minCitationCount', params.minCitationCount.toString());
    }
    
    if (params.year) {
      searchParams.append('year', params.year);
    }
    
    if (params.venue) {
      searchParams.append('venue', params.venue);
    }
    
    if (params.fieldsOfStudy) {
      searchParams.append('fieldsOfStudy', params.fieldsOfStudy);
    }
    
    if (params.offset) {
      searchParams.append('offset', params.offset.toString());
    }
    
    if (params.limit) {
      searchParams.append('limit', Math.min(params.limit, 100).toString());
    }

    const url = `${this.baseUrl}/paper/search?${searchParams.toString()}`;

    try {
      // TODO: Re-enable rate limiting when proper queue management is implemented
      // await this.enforceRateLimit();
      
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        let errorMessage = `Semantic Scholar API error: ${response.status} ${response.statusText}`;
        
        if (response.status === 403) {
          errorMessage = 'Invalid or missing API key. Please check your SEMANTIC_SCHOLAR_API_KEY configuration.';
        } else if (response.status === 429) {
          errorMessage = 'API rate limit exceeded. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching papers:', error);
      throw error;
    }
  }

  async getPaperDetails(paperId: string, fields?: string): Promise<SemanticScholarPaper> {
    const searchParams = new URLSearchParams();
    
    if (fields) {
      searchParams.append('fields', fields);
    } else {
      searchParams.append('fields', 'title,abstract,authors,venue,year,url,openAccessPdf,citationCount,referenceCount,publicationTypes,fieldsOfStudy,s2FieldsOfStudy,publicationDate,journal');
    }

    const url = `${this.baseUrl}/paper/${encodeURIComponent(paperId)}?${searchParams.toString()}`;

    try {
      // TODO: Re-enable rate limiting when proper queue management is implemented
      // await this.enforceRateLimit();
      
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Semantic Scholar API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting paper details:', error);
      throw error;
    }
  }

  async autocomplete(query: string): Promise<SemanticScholarPaper[]> {
    // Check if API key is available
    if (!this.apiKey) {
      throw new Error('Semantic Scholar API key is not configured. Please add SEMANTIC_SCHOLAR_API_KEY to your environment variables.');
    }

    const searchParams = new URLSearchParams();
    searchParams.append('query', query);

    const url = `${this.baseUrl}/paper/autocomplete?${searchParams.toString()}`;

    try {
      // TODO: Re-enable rate limiting when proper queue management is implemented
      // await this.enforceRateLimit();
      
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        let errorMessage = `Semantic Scholar API error: ${response.status} ${response.statusText}`;
        
        if (response.status === 403) {
          errorMessage = 'Invalid or missing API key. Please check your SEMANTIC_SCHOLAR_API_KEY configuration.';
        } else if (response.status === 429) {
          errorMessage = 'API rate limit exceeded. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Handle autocomplete response structure: { "matches": [...] }
      if (data.matches && Array.isArray(data.matches)) {
        return data.matches;
      }
      
      // Handle search response structure: { "data": [...] }
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      // If it's already an array, return as is
      if (Array.isArray(data)) {
        return data;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error);
      throw error;
    }
  }

  // Search specifically for health and nutrition related papers
  async searchNutritionPapers(
    query: string, 
    options: Partial<Omit<SemanticScholarSearchParams, 'query'>> = {}
  ): Promise<SemanticScholarSearchResponse> {
    return this.searchPapers({
      query,
      fieldsOfStudy: 'Medicine,Biology,Agricultural and Food Sciences,Psychology',
      publicationTypes: 'JournalArticle,Review,ClinicalTrial,MetaAnalysis,Study',
      year: '2015-', // Papers from 2015 onwards
      ...options,
    });
  }
}

export const semanticScholarService = new SemanticScholarService();
