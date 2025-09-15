import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, Timer, Utensils, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import backend from '~backend/client';

export default function RecipeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => backend.nutrition.getRecipe({ id: parseInt(id!) }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-16 mb-6"></div>
            <div className="h-64 bg-muted rounded mb-6"></div>
            <div className="h-10 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Recipe not found
          </h1>
          <p className="text-muted-foreground mb-6">
            The recipe you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/recipes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/recipes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Link>
          </Button>

          {/* Recipe Header */}
          <div className="mb-8">
            <div className="relative h-64 mb-6 rounded-2xl overflow-hidden shadow-2xl">
              {recipe.imageUrl ? (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                  <ChefHat className="h-24 w-24 text-orange-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {recipe.name}
                </h1>
                <p className="text-xl text-white/90">
                  {recipe.description}
                </p>
              </div>
            </div>

            {/* Recipe Meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="text-center p-4 shadow-md border-0 bg-white/80">
                <Timer className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="font-bold text-orange-700">{recipe.prepTime} min</div>
                <div className="text-sm text-orange-600">Prep Time</div>
              </Card>
              <Card className="text-center p-4 shadow-md border-0 bg-white/80">
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="font-bold text-blue-700">{recipe.cookTime} min</div>
                <div className="text-sm text-blue-600">Cook Time</div>
              </Card>
              <Card className="text-center p-4 shadow-md border-0 bg-white/80">
                <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="font-bold text-green-700">{recipe.servings}</div>
                <div className="text-sm text-green-600">Servings</div>
              </Card>
              <Card className="text-center p-4 shadow-md border-0 bg-white/80">
                <ChefHat className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className={`font-bold capitalize ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </div>
                <div className="text-sm text-purple-600">Difficulty</div>
              </Card>
            </div>

            {/* Tags and Cuisine */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge className="bg-orange-100 text-orange-700 border border-orange-200 text-sm px-3 py-1">
                {recipe.cuisine}
              </Badge>
              {recipe.dietaryTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-amber-100 text-amber-700 border border-amber-200 text-sm px-3 py-1"
                >
                  {tag.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Ingredients and Instructions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Ingredients */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Utensils className="h-5 w-5 text-orange-600" />
                    <span>Ingredients</span>
                  </CardTitle>
                  <CardDescription>
                    Everything you'll need to make this recipe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recipe.ingredients.length > 0 ? (
                    <div className="space-y-3">
                      {recipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-orange-50/50 rounded-lg border border-orange-100">
                          <div>
                            <span className="font-medium text-orange-800">
                              {ingredient.foodItem?.name || `Ingredient ${index + 1}`}
                            </span>
                            {ingredient.notes && (
                              <p className="text-sm text-orange-600 mt-1">
                                {ingredient.notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-orange-700">
                              {ingredient.quantity} {ingredient.unit}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Detailed ingredient list coming soon.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ChefHat className="h-5 w-5 text-orange-600" />
                    <span>Instructions</span>
                  </CardTitle>
                  <CardDescription>
                    Step-by-step cooking instructions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recipe.instructions.map((step, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground leading-relaxed">
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Nutrition Info */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span>Nutrition Facts</span>
                  </CardTitle>
                  <CardDescription>
                    Per serving nutritional information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-white/60 rounded-xl border border-green-200">
                    <div className="text-3xl font-bold text-green-700">
                      {recipe.nutrition.calories}
                    </div>
                    <div className="text-sm text-green-600">Calories</div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white/40 rounded-lg">
                      <span className="text-green-700 font-medium">Protein</span>
                      <span className="font-bold text-green-800">{recipe.nutrition.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/40 rounded-lg">
                      <span className="text-green-700 font-medium">Carbs</span>
                      <span className="font-bold text-green-800">{recipe.nutrition.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/40 rounded-lg">
                      <span className="text-green-700 font-medium">Fat</span>
                      <span className="font-bold text-green-800">{recipe.nutrition.fat}g</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/40 rounded-lg">
                      <span className="text-green-700 font-medium">Fiber</span>
                      <span className="font-bold text-green-800">{recipe.nutrition.fiber}g</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/40 rounded-lg">
                      <span className="text-green-700 font-medium">Sugar</span>
                      <span className="font-bold text-green-800">{recipe.nutrition.sugar}g</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/40 rounded-lg">
                      <span className="text-green-700 font-medium">Sodium</span>
                      <span className="font-bold text-green-800">{recipe.nutrition.sodium}mg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                    <Link to="/meal-planner">
                      <ChefHat className="h-4 w-4 mr-2" />
                      Add to Meal Plan
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                    <Target className="h-4 w-4 mr-2" />
                    Scale Recipe
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
