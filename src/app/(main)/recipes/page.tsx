'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Clock, Users, ChefHat, Star, Leaf, Flame, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Recipe } from '@/lib/types';

const DIETARY_TAGS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Low-Carb', 'High-Protein', 
  'Keto', 'Mediterranean', 'Low-Sodium', 'Dairy-Free', 'Paleo'
];

const CUISINES = [
  'Italian', 'Asian', 'Mexican', 'Mediterranean', 'Indian', 
  'American', 'Thai', 'Japanese', 'Greek', 'Middle Eastern'
];

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipesUpdated();
  }, [filterRecipesUpdated]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/nutrition/recipes');
      if (response.ok) {
        const data = await response.json();
        // Handle API response structure (recipes endpoint returns {recipes: [...], total: ...})
        const recipesData = data.recipes || data;
        setRecipes(Array.isArray(recipesData) ? recipesData : mockRecipes);
      } else {
        // Fallback to mock data if API fails
        setRecipes(mockRecipes);
      }
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      setRecipes(mockRecipes);
    } finally {
      setLoading(false);
    }
  };


  const toggleDietaryTag = (tag: string) => {
    setSelectedDietaryTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCuisine('');
    setSelectedDifficulty('');
    setSelectedDietaryTags([]);
  };

  // Update filter logic to handle 'all' values
  const filterRecipesUpdated = useCallback(() => {
    // Ensure recipes is always an array
    if (!Array.isArray(recipes)) {
      setFilteredRecipes([]);
      return;
    }

    let filtered = recipes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by cuisine
    if (selectedCuisine && selectedCuisine !== 'all') {
      filtered = filtered.filter(recipe => recipe.cuisine === selectedCuisine);
    }

    // Filter by difficulty
    if (selectedDifficulty && selectedDifficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }

    // Filter by dietary tags
    if (selectedDietaryTags.length > 0) {
      filtered = filtered.filter(recipe => 
        selectedDietaryTags.some(tag => recipe.dietaryTags.includes(tag))
      );
    }

    setFilteredRecipes(filtered);
  }, [recipes, searchTerm, selectedCuisine, selectedDifficulty, selectedDietaryTags]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-xl">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Heart className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
            Healthy Recipes
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover thousands of nutritious and delicious recipes designed by nutrition experts. 
            Every recipe comes with detailed nutritional information and cooking instructions.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search recipes by name or ingredient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {(selectedCuisine || selectedDifficulty || selectedDietaryTags.length > 0) && (
                    <span className="ml-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                      {[selectedCuisine, selectedDifficulty, ...selectedDietaryTags].filter(Boolean).length}
                    </span>
                  )}
                </Button>
                
                {(selectedCuisine || selectedDifficulty || selectedDietaryTags.length > 0) && (
                  <Button variant="ghost" onClick={clearFilters} className="text-slate-600">
                    Clear All
                  </Button>
                )}
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                  {/* Cuisine Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Cuisine</Label>
                    <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Cuisines" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cuisines</SelectItem>
                        {CUISINES.map(cuisine => (
                          <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Difficulty Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Difficulty</Label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dietary Tags */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Dietary Preferences</Label>
                    <div className="flex flex-wrap gap-2">
                      {DIETARY_TAGS.map(tag => (
                        <Button
                          key={tag}
                          variant={selectedDietaryTags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleDietaryTag(tag)}
                          className={`text-xs ${
                            selectedDietaryTags.includes(tag) 
                              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                              : 'border-slate-300 text-slate-600 hover:bg-orange-50'
                          }`}
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            Showing <span className="font-semibold">{filteredRecipes.length}</span> recipes
            {searchTerm && (
              <span> for &quot;<span className="font-semibold">{searchTerm}</span>&quot;</span>
            )}
          </p>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg animate-pulse">
                <div className="h-48 bg-slate-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded mb-4"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="h-16 w-16 text-slate-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">No recipes found</h3>
            <p className="text-slate-500 mb-6">
              Try adjusting your search terms or filters to find what you&apos;re looking for.
            </p>
            <Button onClick={clearFilters} className="bg-orange-500 hover:bg-orange-600 text-white">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group overflow-hidden bg-white">
                  <div className="relative h-48 overflow-hidden">
                    {recipe.imageUrl ? (
                      <Image
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                        <ChefHat className="h-16 w-16 text-orange-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {recipe.name}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                        {recipe.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.prepTime + recipe.cookTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flame className="h-4 w-4" />
                        <span>{recipe.nutrition.calories} cal</span>
                      </div>
                    </div>

                    {/* Dietary Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {recipe.dietaryTags.slice(0, 3).map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center space-x-1"
                        >
                          <Leaf className="h-3 w-3" />
                          <span>{tag}</span>
                        </span>
                      ))}
                      {recipe.dietaryTags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          +{recipe.dietaryTags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Nutrition Preview */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <p className="font-semibold text-blue-700">{recipe.nutrition.protein}g</p>
                        <p className="text-blue-600">Protein</p>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded-lg">
                        <p className="font-semibold text-orange-700">{recipe.nutrition.carbs}g</p>
                        <p className="text-orange-600">Carbs</p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <p className="font-semibold text-purple-700">{recipe.nutrition.fat}g</p>
                        <p className="text-purple-600">Fat</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data for testing
const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Mediterranean Grilled Chicken Bowl',
    description: 'Fresh and healthy bowl with grilled chicken, quinoa, and Mediterranean vegetables',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'easy',
    cuisine: 'Mediterranean',
    dietaryTags: ['High-Protein', 'Gluten-Free', 'Mediterranean'],
    ingredients: [],
    instructions: [],
    nutrition: {
      calories: 425,
      protein: 35,
      carbs: 28,
      fat: 18,
      fiber: 6,
      sugar: 8,
      sodium: 420
    },
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Vegan Buddha Bowl',
    description: 'Colorful plant-based bowl with quinoa, roasted vegetables, and tahini dressing',
    prepTime: 20,
    cookTime: 25,
    servings: 2,
    difficulty: 'medium',
    cuisine: 'Asian',
    dietaryTags: ['Vegan', 'Vegetarian', 'Gluten-Free', 'High-Protein'],
    ingredients: [],
    instructions: [],
    nutrition: {
      calories: 380,
      protein: 15,
      carbs: 45,
      fat: 16,
      fiber: 12,
      sugar: 12,
      sodium: 280
    },
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'Keto Salmon with Asparagus',
    description: 'Pan-seared salmon with garlic butter asparagus, perfect for ketogenic diet',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'easy',
    cuisine: 'American',
    dietaryTags: ['Keto', 'Low-Carb', 'High-Protein', 'Gluten-Free'],
    ingredients: [],
    instructions: [],
    nutrition: {
      calories: 520,
      protein: 42,
      carbs: 6,
      fat: 38,
      fiber: 3,
      sugar: 3,
      sodium: 320
    },
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];