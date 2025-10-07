'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, Clock, Users, ChefHat, Flame, Leaf, Heart, Share2, 
  Bookmark, Printer, Star, Plus, Minus, ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Recipe, RecipeIngredient } from '@/lib/types';

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(1);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');

  useEffect(() => {
    if (id) {
      fetchRecipe(id);
    }
  }, [id]);

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings);
    }
  }, [recipe]);

  const fetchRecipe = async (recipeId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/nutrition/recipes/${recipeId}`);
      if (response.ok) {
        const data = await response.json();
        setRecipe(data);
      } else {
        console.error('Recipe not found');
      }
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const adjustServings = (newServings: number) => {
    if (newServings >= 1 && newServings <= 20) {
      setServings(newServings);
    }
  };

  const getAdjustedAmount = (originalAmount: string, originalServings: number) => {
    const ratio = servings / originalServings;
    const match = originalAmount.match(/^(\d+(?:\.\d+)?)/);
    if (match) {
      const amount = parseFloat(match[1]);
      const adjustedAmount = (amount * ratio).toFixed(ratio < 1 ? 1 : 0);
      return originalAmount.replace(match[1], adjustedAmount);
    }
    return originalAmount;
  };

  const getAdjustedNutrition = (value: number, originalServings: number) => {
    return Math.round((value * servings) / originalServings);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="container mx-auto px-4 py-12">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-700 mb-2">Recipe not found</h1>
            <p className="text-gray-500 mb-6">The recipe you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/recipes">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Recipes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/recipes">
            <Button variant="ghost" className="text-orange-600 hover:text-orange-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <Card className="border-0 shadow-xl overflow-hidden bg-white">
              <div className="relative h-96">
                {recipe.imageUrl ? (
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <ChefHat className="h-32 w-32 text-orange-300" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className={getDifficultyColor(recipe.difficulty)}>
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Recipe Header */}
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
                    <p className="text-gray-600 text-lg leading-relaxed">{recipe.description}</p>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-gray-600 ml-2">(4.8)</span>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center text-orange-600 mb-2">
                      <Clock className="h-5 w-5 mr-1" />
                      <span className="font-semibold">Prep</span>
                    </div>
                    <p className="text-gray-700">{recipe.prepTime} min</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-orange-600 mb-2">
                      <Flame className="h-5 w-5 mr-1" />
                      <span className="font-semibold">Cook</span>
                    </div>
                    <p className="text-gray-700">{recipe.cookTime} min</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-orange-600 mb-2">
                      <Users className="h-5 w-5 mr-1" />
                      <span className="font-semibold">Serves</span>
                    </div>
                    <p className="text-gray-700">{recipe.servings}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-orange-600 mb-2">
                      <Flame className="h-5 w-5 mr-1" />
                      <span className="font-semibold">Calories</span>
                    </div>
                    <p className="text-gray-700">{recipe.nutrition.calories}</p>
                  </div>
                </div>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {recipe.dietaryTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                      <Leaf className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recipe Content Tabs */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <div className="flex space-x-4 border-b">
                  {(['ingredients', 'instructions', 'nutrition'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors capitalize ${
                        activeTab === tab
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {activeTab === 'ingredients' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Ingredients</h3>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustServings(servings - 1)}
                          disabled={servings <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium px-3">{servings} servings</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustServings(servings + 1)}
                          disabled={servings >= 20}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                      <ul className="space-y-3">
                        {recipe.ingredients.map((ingredient: RecipeIngredient | string, index: number) => {
                          const displayText = typeof ingredient === 'string' 
                            ? getAdjustedAmount(ingredient, recipe.servings)
                            : `${getAdjustedAmount(ingredient.quantity?.toString() || '1', recipe.servings)} ${ingredient.unit || ''} ${ingredient.foodItem?.name || ingredient.name || ''}`;
                          
                          return (
                            <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <input type="checkbox" className="mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500" />
                              <span className="text-gray-700 flex-1">
                                {displayText.trim()}
                              </span>
                              {typeof ingredient === 'object' && ingredient.notes && (
                                <span className="text-xs text-gray-500 italic ml-2">
                                  ({ingredient.notes})
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No ingredients data available for this recipe.</p>
                    )}
                    
                    <Button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Shopping List
                    </Button>
                  </div>
                )}

                {activeTab === 'instructions' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Instructions</h3>
                    {recipe.instructions && recipe.instructions.length > 0 ? (
                      <ol className="space-y-4">
                        {recipe.instructions.map((instruction, index) => (
                          <li key={index} className="flex">
                            <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm mr-4">
                              {index + 1}
                            </span>
                            <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-gray-500 italic">No instructions data available for this recipe.</p>
                    )}
                  </div>
                )}

                {activeTab === 'nutrition' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Nutrition Facts</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">
                            {getAdjustedNutrition(recipe.nutrition.calories, recipe.servings)}
                          </p>
                          <p className="text-gray-600">Calories</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {getAdjustedNutrition(recipe.nutrition.protein, recipe.servings)}g
                          </p>
                          <p className="text-gray-600">Protein</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {getAdjustedNutrition(recipe.nutrition.carbs, recipe.servings)}g
                          </p>
                          <p className="text-gray-600">Carbs</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">
                            {getAdjustedNutrition(recipe.nutrition.fat, recipe.servings)}g
                          </p>
                          <p className="text-gray-600">Fat</p>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-gray-700">
                            {getAdjustedNutrition(recipe.nutrition.fiber || 0, recipe.servings)}g
                          </p>
                          <p className="text-gray-500">Fiber</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-700">
                            {getAdjustedNutrition(recipe.nutrition.sugar || 0, recipe.servings)}g
                          </p>
                          <p className="text-gray-500">Sugar</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-700">
                            {getAdjustedNutrition(recipe.nutrition.sodium || 0, recipe.servings)}mg
                          </p>
                          <p className="text-gray-500">Sodium</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-4">
                      * Nutrition facts are per serving based on {servings} serving(s)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipe Summary Card */}
            <Card className="border-0 shadow-xl bg-white sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <Heart className="h-5 w-5 mr-2" />
                  Recipe Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Time:</span>
                    <span className="font-semibold">{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cuisine:</span>
                    <span className="font-semibold">{recipe.cuisine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Servings:</span>
                    <span className="font-semibold">{recipe.servings}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    <Heart className="h-4 w-4 mr-2" />
                    Save Recipe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Similar Recipes */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="text-orange-600">You might also like</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-500 text-sm">Similar recipes will be shown here...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}