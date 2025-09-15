import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Target, Clock, Users, ChefHat, BarChart3, TrendingUp, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import backend from '~backend/client';
import type { MealPlan, MealPlanEntry } from '~backend/nutrition/types';

export default function MealPlanDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: mealPlan, isLoading, error } = useQuery({
    queryKey: ['meal-plan', id],
    queryFn: () => backend.nutrition.getMealPlan({ id: parseInt(id!) }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-16 mb-6"></div>
            <div className="h-10 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="grid lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !mealPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Meal plan not found
          </h1>
          <p className="text-muted-foreground mb-6">
            The meal plan you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/meal-planner">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Meal Planner
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Group meals by date
  const mealsByDate = mealPlan.meals.reduce((acc, meal) => {
    const dateKey = meal.date.toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(meal);
    return acc;
  }, {} as Record<string, MealPlanEntry[]>);

  // Calculate daily nutrition totals
  const dailyNutrition = Object.entries(mealsByDate).map(([date, meals]) => {
    const totals = meals.reduce((acc, meal) => {
      const recipe = meal.recipe!;
      acc.calories += recipe.nutrition.calories * meal.servings;
      acc.protein += recipe.nutrition.protein * meal.servings;
      acc.carbs += recipe.nutrition.carbs * meal.servings;
      acc.fat += recipe.nutrition.fat * meal.servings;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return { date, ...totals };
  });

  // Calculate averages
  const averages = dailyNutrition.reduce((acc, day) => {
    acc.calories += day.calories;
    acc.protein += day.protein;
    acc.carbs += day.carbs;
    acc.fat += day.fat;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const daysCount = dailyNutrition.length;
  Object.keys(averages).forEach(key => {
    averages[key as keyof typeof averages] = Math.round(averages[key as keyof typeof averages] / daysCount);
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'lunch': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'dinner': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'snack': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/meal-planner">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Meal Planner
            </Link>
          </Button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {mealPlan.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {formatDate(mealPlan.startDate.toISOString().split('T')[0])} - {formatDate(mealPlan.endDate.toISOString().split('T')[0])}
                </p>
              </div>
            </div>

            {/* Plan Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="text-center p-4 shadow-md border-0 bg-white/80">
                <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="font-bold text-orange-700">{mealPlan.targetCalories}</div>
                <div className="text-sm text-orange-600">Target Calories</div>
              </Card>
              <Card className="text-center p-4 shadow-md border-0 bg-white/80">
                <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="font-bold text-blue-700">{averages.calories}</div>
                <div className="text-sm text-blue-600">Avg Daily Calories</div>
              </Card>
              <Card className="text-center p-4 shadow-md border-0 bg-white/80">
                <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="font-bold text-green-700">{daysCount}</div>
                <div className="text-sm text-green-600">Days</div>
              </Card>
              <Card className="text-center p-4 shadow-md border-0 bg-white/80">
                <Utensils className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="font-bold text-purple-700">{mealPlan.meals.length}</div>
                <div className="text-sm text-purple-600">Total Meals</div>
              </Card>
            </div>

            {/* Dietary Info */}
            <div className="flex flex-wrap gap-2 mb-6">
              {mealPlan.dietaryRestrictions.map(restriction => (
                <Badge 
                  key={restriction} 
                  className="bg-red-100 text-red-700 border border-red-200 text-sm px-3 py-1"
                >
                  {restriction.replace('-', ' ')}
                </Badge>
              ))}
              {mealPlan.preferences.map(preference => (
                <Badge 
                  key={preference} 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-700 border border-blue-200 text-sm px-3 py-1"
                >
                  {preference.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Daily Meal Plans */}
            <div className="lg:col-span-3">
              <div className="space-y-8">
                {Object.entries(mealsByDate).sort().map(([date, meals]) => {
                  const dayNutrition = dailyNutrition.find(d => d.date === date)!;
                  
                  return (
                    <Card key={date} className="shadow-lg border-0 bg-white/90 backdrop-blur">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-orange-600" />
                            <span>{formatDate(date)}</span>
                          </CardTitle>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="font-semibold text-orange-700">
                              {Math.round(dayNutrition.calories)} calories
                            </div>
                            <div>
                              P: {Math.round(dayNutrition.protein)}g | 
                              C: {Math.round(dayNutrition.carbs)}g | 
                              F: {Math.round(dayNutrition.fat)}g
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          {['breakfast', 'lunch', 'dinner'].map(mealType => {
                            const meal = meals.find(m => m.mealType === mealType);
                            
                            return (
                              <Card key={mealType} className={`p-4 ${getMealTypeColor(mealType)}`}>
                                <div className="flex items-center space-x-2 mb-3">
                                  <span className="text-lg">{getMealTypeIcon(mealType)}</span>
                                  <span className="font-semibold capitalize">
                                    {mealType}
                                  </span>
                                </div>
                                
                                {meal ? (
                                  <div>
                                    <Link 
                                      to={`/recipes/${meal.recipe!.id}`}
                                      className="font-medium hover:underline block mb-2"
                                    >
                                      {meal.recipe!.name}
                                    </Link>
                                    <div className="text-sm space-y-1">
                                      <div className="flex items-center space-x-1">
                                        <Users className="h-3 w-3" />
                                        <span>{meal.servings} serving{meal.servings !== 1 ? 's' : ''}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{meal.recipe!.prepTime + meal.recipe!.cookTime} min</span>
                                      </div>
                                      <div className="font-medium">
                                        {Math.round(meal.recipe!.nutrition.calories * meal.servings)} cal
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm text-muted-foreground">
                                    No meal planned
                                  </div>
                                )}
                              </Card>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Nutrition Summary */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Nutrition Summary</span>
                  </CardTitle>
                  <CardDescription>
                    Average daily nutrition values
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-white/60 rounded-xl border border-green-200">
                    <div className="text-3xl font-bold text-green-700">
                      {averages.calories}
                    </div>
                    <div className="text-sm text-green-600">Avg Daily Calories</div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white/40 rounded-lg">
                      <span className="text-green-700 font-medium">Protein</span>
                      <span className="font-bold text-green-800">{averages.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/40 rounded-lg">
                      <span className="text-green-700 font-medium">Carbs</span>
                      <span className="font-bold text-green-800">{averages.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/40 rounded-lg">
                      <span className="text-green-700 font-medium">Fat</span>
                      <span className="font-bold text-green-800">{averages.fat}g</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-lg">Target vs Actual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Calories</span>
                    <div className="text-right">
                      <div className="font-bold text-blue-800">
                        {averages.calories} / {mealPlan.targetCalories}
                      </div>
                      <div className="text-xs text-blue-600">
                        {Math.round((averages.calories / mealPlan.targetCalories) * 100)}% of target
                      </div>
                    </div>
                  </div>
                  
                  {mealPlan.targetProtein > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Protein</span>
                      <div className="text-right">
                        <div className="font-bold text-blue-800">
                          {averages.protein}g / {mealPlan.targetProtein}g
                        </div>
                        <div className="text-xs text-blue-600">
                          {Math.round((averages.protein / mealPlan.targetProtein) * 100)}% of target
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                    <Link to="/meal-planner">
                      <ChefHat className="h-4 w-4 mr-2" />
                      Create New Plan
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50">
                    <Target className="h-4 w-4 mr-2" />
                    Adjust Plan
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
