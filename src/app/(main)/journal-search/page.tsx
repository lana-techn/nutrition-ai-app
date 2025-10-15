"use client";

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { 
  Search, 
  BookOpen, 
  Calendar, 
  Users, 
  Quote, 
  ExternalLink, 
  Filter, 
  X, 
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  FileText,
  Download,
  Heart,
  Zap,
  ChevronRight,
  Shield,
  Sun,
  Leaf
} from 'lucide-react';
import { SemanticScholarPaper, SemanticScholarSearchResponse } from '@/lib/semantic-scholar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const JournalSearchPage = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SemanticScholarPaper[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SemanticScholarPaper[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [lastSearchTime, setLastSearchTime] = useState<number>(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState({
    year: '2015-',
    publicationTypes: '',
    minCitations: '',
    openAccess: false,
  });

  // Resolve current theme
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  // Popular search suggestions with theme-aware colors
  const popularSearches = [
    { term: 'nutrition & immunity', icon: Shield, lightColor: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' },
    { term: 'vitamin D deficiency', icon: Sun, lightColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' },
    { term: 'gut microbiome', icon: Heart, lightColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300' },
    { term: 'plant-based diet', icon: Leaf, lightColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' },
    { term: 'diabetes management', icon: Zap, lightColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' },
    { term: 'sportsnutrition', icon: TrendingUp, lightColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = async (resetOffset = true) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);
    setSuggestions([]);

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('query', query);
      searchParams.append('limit', '20');
      searchParams.append('fieldsOfStudy', 'Medicine,Biology,Agricultural and Food Sciences,Psychology');

      if (resetOffset) {
        setOffset(0);
      } else {
        searchParams.append('offset', offset.toString());
      }

      if (filters.year) {
        searchParams.append('year', filters.year);
      }
      
      if (filters.publicationTypes) {
        searchParams.append('publicationTypes', filters.publicationTypes);
      }
      
      if (filters.minCitations) {
        searchParams.append('minCitationCount', filters.minCitations);
      }
      
      if (filters.openAccess) {
        searchParams.append('openAccessPdf', 'true');
      }

      console.log('Making API call to:', `/api/semantic-scholar/search?${searchParams.toString()}`);
      const response = await fetch(`/api/semantic-scholar/search?${searchParams.toString()}`);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`API error: ${response.status}: ${errorText}`);
      }

      const responseText = await response.text();
      console.log('Response text (first 500 chars):', responseText.substring(0, 500));
      
      const responseData: SemanticScholarSearchResponse = JSON.parse(responseText);
      console.log('Parsed API Response successfully');

      if (resetOffset) {
        setResults(responseData.data);
      } else {
        setResults(prev => [...prev, ...responseData.data]);
      }
      
      setTotal(responseData.total || 0);
      setOffset(prev => prev + (responseData.data?.length || 0));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Search failed: ${errorMessage}. Please check your API key configuration.`);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutocomplete = async (value: string) => {
    if (value.length < 2 || hasSearched) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/semantic-scholar/autocomplete?query=${encodeURIComponent(value)}`);
      if (response.ok) {
        const suggestions = await response.json();
        if (Array.isArray(suggestions)) {
          setSuggestions(suggestions.slice(0, 5));
        } else {
          console.warn('Autocomplete API returned non-array:', suggestions);
          setSuggestions([]);
        }
      } else if (response.status === 400 || response.status === 500) {
        // Handle validation or API errors gracefully by clearing suggestions
        setSuggestions([]);
      } else {
        console.error('Autocomplete API returned non-200 status:', response.status);
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Autocomplete error:', err);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleAutocomplete(query);
    }, 800);

    return () => clearTimeout(timer);
  }, [query]);

  const loadMore = () => {
    if (results.length < total && !loading) {
      handleSearch(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      year: '2015-',
      publicationTypes: '',
      minCitations: '',
      openAccess: false,
    });
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    setHasSearched(false); // Reset search state for quick search
    setSuggestions([]); // Clear suggestions immediately
    setTimeout(() => handleSearch(), 100);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-amber-50 dark:from-orange-950/20 dark:via-background dark:to-amber-950/20">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6 dark:from-orange-400 dark:to-amber-400">
              Journal & Research Search
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore cutting-edge research in nutrition, health, and medical science. Access peer-reviewed papers, clinical studies, and breakthrough findings from trusted academic sources.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center space-x-12 mb-12">
              <div className="text-center">
                <div className="flex items-center space-x-2 text-orange-600 mb-1 dark:text-orange-400">
                  <FileText className="w-5 h-5" />
                  <span className="font-semibold">200M+</span>
                </div>
                <p className="text-sm text-muted-foreground">Academic Papers</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2 text-amber-600 mb-1 dark:text-amber-400">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">50K+</span>
                </div>
                <p className="text-sm text-muted-foreground">Journals</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2 text-green-600 mb-1 dark:text-green-400">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Recent</span>
                </div>
                <p className="text-sm text-muted-foreground">Updated Daily</p>
              </div>
            </div>

            {/* Quick Search Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {popularSearches.map((search, index) => {
                const Icon = search.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(search.term)}
                    className={cn(
                      "inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 dark:opacity-90",
                      search.lightColor
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{search.term}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-200 h-200 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-32 h-32 bg-orange-300 rounded-full filter blur-3xl"></div>
          <div className="absolute top-32 right-32 w-48 h-48 bg-amber-300 rounded-full filter blur-3xl"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <Card className="mb-8 shadow-lg border-orange-100/50 dark:border-orange-900/30 dark:bg-card/50 overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <Search className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span>Search Academic Papers</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Find research papers, clinical studies, and scientific articles on nutrition and health
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="relative mb-4">
              <div className="relative">
                <Input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setHasSearched(false); // Reset search state when user starts typing
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for research topics, authors, or keywords..."
                  className="w-full pl-12 pr-32 h-12 text-lg border-orange-200/50 focus:border-orange-500 focus:ring-orange-500 dark:bg-background dark:border-orange-800/50 dark:text-foreground dark:placeholder:text-muted-foreground"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-muted-foreground w-5 h-5" />
                
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    size="sm"
                    className="border-orange-200/50 text-orange-600 hover:bg-orange-50 dark:border-orange-800/50 dark:text-orange-400 dark:hover:bg-orange-950/20"
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => handleSearch()}
                    disabled={loading || !query.trim()}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg whitespace-nowrap"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        <span className="hidden sm:inline">Searching...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Search</span>
                        <span className="sm:hidden">🔍</span>
                        <Sparkles className="w-4 h-4 ml-2 hidden sm:inline" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions && suggestions.length > 0 && query && !hasSearched && (
              <div className="absolute z-[100] left-0 right-0 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg mt-1 overflow-hidden" style={{ maxWidth: 'min(100%, 600px)', margin: '0 auto' }}>
                <div className="max-h-48 overflow-y-auto">
                  {suggestions.slice(0, 4).map((suggestion, index) => (
                    <div
                      key={suggestion.paperId || suggestion.id}
                      className={`px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors ${index !== suggestions.length - 1 && index !== 3 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
                      onClick={() => {
                        setQuery(suggestion.title);
                        setSuggestions([]);
                        handleSearch();
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                          <div className="w-4 h-4 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center">
                            <BookOpen className="w-2.5 h-2.5 text-orange-600 dark:text-orange-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate leading-tight">
                            {suggestion.title.length > 60 ? suggestion.title.substring(0, 60) + '...' : suggestion.title}
                          </div>
                          {suggestion.authorsYear && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                              {suggestion.authorsYear}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filters Section */}
            {showFilters && (
              <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <span>Search Filters</span>
                  </h3>
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    size="sm"
                    className="border-orange-200/50 text-orange-600 hover:bg-orange-50 dark:border-orange-800/50 dark:text-orange-400 dark:hover:bg-orange-950/20"
                  >
                    Reset All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2">Publication Year</Label>
                    <select
                      value={filters.year}
                      onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                      className="w-full px-3 py-2 border border-orange-200/50 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-background dark:border-orange-800/50"
                    >
                      <option value="2015-">2015 - Present</option>
                      <option value="2020-">2020 - Present</option>
                      <option value="2023-">2023 - Present</option>
                      <option value="2024-">2024 - Present</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2">Publication Type</Label>
                    <select
                      value={filters.publicationTypes}
                      onChange={(e) => setFilters(prev => ({ ...prev, publicationTypes: e.target.value }))}
                      className="w-full px-3 py-2 border border-orange-200/50 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-background dark:border-orange-800/50"
                    >
                      <option value="">All Types</option>
                      <option value="JournalArticle">Journal Articles</option>
                      <option value="Review">Reviews</option>
                      <option value="ClinicalTrial">Clinical Trials</option>
                      <option value="MetaAnalysis">Meta Analysis</option>
                      <option value="Study">Studies</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2">Min Citations</Label>
                    <Input
                      type="number"
                      value={filters.minCitations}
                      onChange={(e) => setFilters(prev => ({ ...prev, minCitations: e.target.value }))}
                      placeholder="e.g., 10"
                      className="w-full px-3 py-2 border border-orange-200/50 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-background dark:border-orange-800/50 dark:text-foreground dark:placeholder:text-muted-foreground"
                    />
                  </div>
                  
                  <div className="lg:col-span-2 flex items-end">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="openAccess"
                        checked={filters.openAccess}
                        onChange={(e) => setFilters(prev => ({ ...prev, openAccess: e.target.checked }))}
                        className="mr-2 h-4 w-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500 dark:border-orange-700 dark:text-orange-400"
                      />
                      <Label htmlFor="openAccess" className="text-sm font-medium text-foreground cursor-pointer">
                        Open Access Only
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg dark:bg-destructive/5 dark:border-destructive/15">
                <div className="flex items-center space-x-2">
                  <X className="w-5 h-5 text-destructive" />
                  <span className="text-destructive font-medium">Search Error</span>
                </div>
                <p className="text-destructive/80 mt-1">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Research Papers</h2>
                <p className="text-muted-foreground">
                  Found <span className="font-semibold text-orange-600 dark:text-orange-400">{total.toLocaleString()}</span> papers
                  {total > 0 && <span> (showing {Math.min(results.length, total)} of {total})</span>}
                </p>
              </div>
              {loading && (
                <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading more...</span>
                </div>
              )}
            </div>
            
            <Progress 
              value={Math.min((results.length / Math.min(total, 100)) * 100, 100)} 
              className="mt-4 h-2 bg-orange-100 dark:bg-orange-900/20"
            />
          </div>
        )}

        {/* Results Grid */}
        <div className="space-y-4 mb-8">
          {results.map((paper, index) => (
            <Card key={paper.paperId} className="group hover:shadow-lg transition-all duration-200 border-orange-100/50 dark:border-orange-900/30 dark:bg-card/50 overflow-hidden fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 px-6 py-4">
                  <div className="flex items-start justify-between">
                    {paper.url ? (
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 mr-4"
                      >
                        <h3 className="text-lg font-semibold text-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors line-clamp-2">
                          {paper.title}
                        </h3>
                      </a>
                    ) : (
                      <h3 className="text-lg font-semibold text-foreground flex-1 mr-4 line-clamp-2">{paper.title}</h3>
                    )}
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {paper.url && (
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors dark:bg-orange-900/50 dark:text-orange-400 dark:hover:bg-orange-900/70"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {paper.openAccessPdf?.url && (
                        <a
                          href={paper.openAccessPdf.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors dark:bg-green-900/50 dark:text-green-400 dark:hover:bg-green-900/70"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Authors */}
                  {paper.authors && paper.authors.length > 0 && (
                    <div className="flex items-center text-muted-foreground mb-3">
                      <Users className="w-4 h-4 mr-2 text-orange-500" />
                      <span className="text-sm line-clamp-1">
                        {paper.authors.slice(0, 10).map(author => author.name).join(', ')}
                        {paper.authors.length > 10 && <span className="text-orange-600 dark:text-orange-400"> +{paper.authors.length - 10} more</span>}
                      </span>
                    </div>
                  )}

                  {/* Publication Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    {(paper.venue || paper.journal?.name) && (
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1 text-orange-500" />
                        <span className="font-medium">{paper.journal?.name || paper.venue}</span>
                      </div>
                    )}
                    {paper.year && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-orange-500" />
                        <span>{paper.year}</span>
                      </div>
                    )}
                  </div>

                  {/* Abstract */}
                  {paper.abstract && (
                    <p className="text-foreground mb-4 line-clamp-3 leading-relaxed">
                      {paper.abstract}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.publicationTypes?.map((type, index) => (
                      <Badge key={index} className="bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50">
                        {type}
                      </Badge>
                    ))}
                    {paper.fieldsOfStudy?.map((field, index) => (
                      <Badge key={index} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50">
                        {field}
                      </Badge>
                    ))}
                    {paper.s2FieldsOfStudy?.slice(0, 2).map((field, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">
                        {field.category}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      {paper.citationCount !== undefined && (
                        <div className="flex items-center">
                          <Quote className="w-4 h-4 mr-1 text-orange-500" />
                          <span className="font-medium">{paper.citationCount.toLocaleString()}</span>
                          <span className="text-muted-foreground/60">citations</span>
                        </div>
                      )}
                      {paper.referenceCount !== undefined && (
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1 text-blue-500" />
                          <span className="font-medium">{paper.referenceCount.toLocaleString()}</span>
                          <span className="text-muted-foreground/60">references</span>
                        </div>
                      )}
                    </div>
                    {paper.openAccessPdf?.url && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        Open Access
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {results.length > 0 && results.length < total && (
          <div className="text-center">
            <Button
              onClick={loadMore}
              disabled={loading}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg px-8 dark:from-orange-600 dark:to-amber-600 dark:hover:from-orange-700 dark:hover:to-amber-700"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Results
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && query && (
          <Card className="text-center py-16 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
            <CardContent>
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No papers found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn&apos;t find any papers matching your search. Try adjusting your search terms or filters.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['nutrition', 'vitamin D', 'gut microbiome', 'diabetes diet', 'protein metabolism'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        handleSearch();
                      }}
                      className="px-3 py-1 bg-white border border-orange-200 rounded-full text-sm text-orange-600 hover:bg-orange-50 transition-colors dark:bg-background dark:border-orange-800/50 dark:text-orange-400 dark:hover:bg-orange-950/20"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!loading && results.length === 0 && !query && (
          <Card className="text-center py-16 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
            <CardContent>
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Start Your Research</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Search through millions of academic papers and research studies on nutrition, health, and medical science.
              </p>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">200M+</div>
                  <div className="text-sm text-muted-foreground">Papers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">50K+</div>
                  <div className="text-sm text-muted-foreground">Journals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">Real-time</div>
                  <div className="text-sm text-muted-foreground">Updates</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JournalSearchPage;
