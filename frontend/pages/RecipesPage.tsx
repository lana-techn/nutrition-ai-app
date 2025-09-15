import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Clock, Users, ChefHat, Filter, Star, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import backend from '~backend/client';

export default function RecipesPage() {
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: recipesData, isLoading, error } = useQuery({
    queryKey: ['recipes', search, cuisine, difficulty, selectedTags],
    queryFn: () => backend.nutrition.listRecipes({
      search: search || undefined,
      cuisine: cuisine || undefined,
      difficulty: difficulty || undefined,
      dietaryTags: selectedTags.length > 0 ? selectedTags : undefined,
      limit: 50,
    }),
  });

  const availableTags = [
    'vegetarian', 'vegan', 'gluten-free', 'high-protein', 'low-carb',
    'high-fiber', 'omega-3', 'dairy-free', 'nut-free', 'low-sodium'
  ];

  const availableCuisines = [
    'American', 'Mediterranean', 'Asian', 'Mexican', 'Italian',
    'Indian', 'Thai', 'French', 'Greek', 'Japanese'
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-10 bg-muted rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-muted rounded w-96 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Unable to load recipes
          </h1>
          <p className="text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const recipes = recipesData?.recipes || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Recipe Database
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover healthy recipes with complete nutritional information and step-by-step instructions
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-orange-600" />
                <span>Find Your Perfect Recipe</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search recipes..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Select onValueChange={setCuisine} value={cuisine}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any cuisine</SelectItem>
                      {availableCuisines.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Select onValueChange={setDifficulty} value={difficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any difficulty</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dietary Tags */}
              <div>
                <p className="text-sm font-medium mb-3">Dietary Preferences:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedTags.includes(tag) 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'hover:bg-orange-50 hover:border-orange-300'
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
              {search && ` for "${search}"`}
            </p>
          </div>

          {/* Recipe Grid */}
          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No recipes found</h2>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <Card key={recipe.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white/90 backdrop-blur">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                      {recipe.imageUrl ? (
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ChefHat className="h-16 w-16 text-orange-300" />
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getDifficultyColor(recipe.difficulty)} capitalize font-medium`}>
                        {recipe.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-white/90 text-orange-700 border border-orange-200">
                        {recipe.cuisine}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-2 group-hover:text-orange-600 transition-colors">
                      <Link to={`/recipes/${recipe.id}`}>
                        {recipe.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {recipe.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Time and Servings */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Timer className="h-4 w-4" />
                        <span>{recipe.prepTime + recipe.cookTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>

                    {/* Nutrition Info */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-100">
                        <div className="font-bold text-orange-700">{recipe.nutrition.calories}</div>
                        <div className="text-xs text-orange-600">calories</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="font-bold text-blue-700">{recipe.nutrition.protein}g</div>
                        <div className="text-xs text-blue-600">protein</div>
                      </div>
                    </div>

                    {/* Dietary Tags */}
                    <div className="flex flex-wrap gap-1">
                      {recipe.dietaryTags.slice(0, 3).map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-amber-100 text-amber-700 border border-amber-200"
                        >
                          {tag.replace('-', ' ')}
                        </Badge>
                      ))}
                      {recipe.dietaryTags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{recipe.dietaryTags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <Button asChild className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                      <Link to={`/recipes/${recipe.id}`}>
                        View Recipe
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
