'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, ChefHat, Plus, Edit2, Clock, Flame, Target, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MealPlan, MealPlanEntry, Recipe, MealPlanRequest, MealPlanGeneration } from '@/lib/types';

interface CalendarDay {
  date: Date;
  dayName: string;
  meals: {
    breakfast?: MealPlanEntry;
    lunch?: MealPlanEntry;
    dinner?: MealPlanEntry;
    snack?: MealPlanEntry;
  };
}

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo', 
  'Low-Carb', 'Low-Sodium', 'Dairy-Free', 'Nut-Free'
];

const CUISINE_PREFERENCES = [
  'Italian', 'Mediterranean', 'Asian', 'Mexican', 'American', 
  'Indian', 'Thai', 'Greek', 'Middle Eastern', 'French'
];

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

export default function MealPlannerPage() {
  const [currentWeek, setCurrentWeek] = useState<Date>(getStartOfWeek(new Date()));
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGeneratorForm, setShowGeneratorForm] = useState(false);
  const [generatorForm, setGeneratorForm] = useState<MealPlanRequest>({
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 250,
    targetFat: 67,
    dietaryRestrictions: [],
    preferences: [],
    excludeIngredients: [],
    cuisinePreferences: [],
    difficulty: 'medium',
    prepTimeLimit: 60,
    startDate: new Date(),
    daysCount: 7
  });
  const [, setEditingMeal] = useState<{ dayIndex: number; mealType: string } | null>(null);

  const generateCalendarDays = useCallback(() => {
    const days: CalendarDay[] = [];
    const startDate = new Date(currentWeek);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      days.push({
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        meals: {}
      });
    }
    
    setCalendarDays(days);
  }, [currentWeek]);

  // Generate days when currentWeek changes
  useEffect(() => {
    generateCalendarDays();
  }, [generateCalendarDays]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const updateGeneratorForm = (key: keyof MealPlanRequest, value: string | number | string[]) => {
    setGeneratorForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = (key: keyof MealPlanRequest, value: string) => {
    setGeneratorForm(prev => ({
      ...prev,
      [key]: Array.isArray(prev[key])
        ? (prev[key] as string[]).includes(value)
          ? (prev[key] as string[]).filter(item => item !== value)
          : [...(prev[key] as string[]), value]
        : [value]
    }));
  };

  const generateMealPlan = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/nutrition/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...generatorForm,
          startDate: currentWeek.toISOString()
        })
      });

      if (response.ok) {
        const mealPlanGeneration: MealPlanGeneration = await response.json();
        setCurrentMealPlan(mealPlanGeneration.mealPlan);
        populateCalendarWithMealPlan(mealPlanGeneration.mealPlan);
        setShowGeneratorForm(false);
      } else {
        // Fallback to mock meal plan
        const mockMealPlan = generateMockMealPlan();
        setCurrentMealPlan(mockMealPlan);
        populateCalendarWithMealPlan(mockMealPlan);
        setShowGeneratorForm(false);
      }
    } catch (error) {
      console.error('Failed to generate meal plan:', error);
      const mockMealPlan = generateMockMealPlan();
      setCurrentMealPlan(mockMealPlan);
      populateCalendarWithMealPlan(mockMealPlan);
      setShowGeneratorForm(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockMealPlan = (): MealPlan => {
    return {
      id: 1,
      name: 'Weekly Nutrition Plan',
      startDate: currentWeek,
      endDate: new Date(currentWeek.getTime() + 6 * 24 * 60 * 60 * 1000),
      targetCalories: generatorForm.targetCalories,
      targetProtein: generatorForm.targetProtein,
      targetCarbs: generatorForm.targetCarbs,
      targetFat: generatorForm.targetFat,
      dietaryRestrictions: generatorForm.dietaryRestrictions || [],
      preferences: generatorForm.preferences || [],
      meals: generateMockMealEntries(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };

  const generateMockMealEntries = (): MealPlanEntry[] => {
    const mockRecipes = [
      { id: 1, name: 'Avocado Toast with Eggs', calories: 420, protein: 18, prepTime: 10 },
      { id: 2, name: 'Greek Yogurt Berry Bowl', calories: 280, protein: 20, prepTime: 5 },
      { id: 3, name: 'Quinoa Chicken Salad', calories: 480, protein: 35, prepTime: 25 },
      { id: 4, name: 'Mediterranean Wrap', calories: 390, protein: 22, prepTime: 15 },
      { id: 5, name: 'Grilled Salmon with Vegetables', calories: 520, protein: 42, prepTime: 30 },
      { id: 6, name: 'Lentil Curry with Rice', calories: 450, protein: 18, prepTime: 35 },
      { id: 7, name: 'Apple with Almond Butter', calories: 190, protein: 8, prepTime: 2 },
      { id: 8, name: 'Mixed Nuts and Dried Fruits', calories: 160, protein: 5, prepTime: 1 }
    ];

    const entries: MealPlanEntry[] = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(currentWeek);
      date.setDate(currentWeek.getDate() + day);

      // Breakfast
      entries.push({
        id: day * 4 + 1,
        mealPlanId: 1,
        date,
        mealType: 'breakfast',
        recipeId: mockRecipes[day % 2].id,
        servings: 1,
        recipe: mockRecipes[day % 2] as Recipe
      });

      // Lunch
      entries.push({
        id: day * 4 + 2,
        mealPlanId: 1,
        date,
        mealType: 'lunch',
        recipeId: mockRecipes[2 + (day % 2)].id,
        servings: 1,
        recipe: mockRecipes[2 + (day % 2)] as Recipe
      });

      // Dinner
      entries.push({
        id: day * 4 + 3,
        mealPlanId: 1,
        date,
        mealType: 'dinner',
        recipeId: mockRecipes[4 + (day % 2)].id,
        servings: 1,
        recipe: mockRecipes[4 + (day % 2)] as Recipe
      });

      // Snack
      entries.push({
        id: day * 4 + 4,
        mealPlanId: 1,
        date,
        mealType: 'snack',
        recipeId: mockRecipes[6 + (day % 2)].id,
        servings: 1,
        recipe: mockRecipes[6 + (day % 2)] as Recipe
      });
    }
    return entries;
  };

  const populateCalendarWithMealPlan = (mealPlan: MealPlan) => {
    setCalendarDays(prevDays => 
      prevDays.map(day => {
        const dayMeals = mealPlan.meals.filter(meal => {
          const mealDate = new Date((meal as any).date);
          return mealDate.toDateString() === day.date.toDateString();
        });
        
        const meals: CalendarDay['meals'] = {};
        dayMeals.forEach(meal => {
          meals[meal.mealType] = meal;
        });
        
        return { ...day, meals };
      })
    );
  };

  const getDailyNutrition = (day: CalendarDay) => {
    let totalCalories = 0;
    let totalProtein = 0;
    
    Object.values(day.meals).forEach(meal => {
      if (meal?.recipe) {
        const recipeCalories = (meal.recipe as Recipe).nutrition?.calories || ((meal.recipe as { calories?: number }).calories) || 0;
        const recipeProtein = (meal.recipe as Recipe).nutrition?.protein || ((meal.recipe as { protein?: number }).protein) || 0;
        totalCalories += recipeCalories * meal.servings;
        totalProtein += recipeProtein * meal.servings;
      }
    });
    
    return { calories: totalCalories, protein: totalProtein };
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'lunch': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dinner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'snack': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center shadow-lg">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <ChefHat className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            AI Meal Planner
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Generate personalized weekly meal plans based on your nutrition goals, dietary preferences, and lifestyle. 
            Smart planning made simple with AI-powered recommendations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={() => setShowGeneratorForm(true)}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Generate New Meal Plan
          </Button>
          {currentMealPlan && (
            <>
              <Button 
                variant="outline" 
                className="px-8 py-3"
                onClick={() => {
                  // dynamic import to reduce bundle size
                  import('@/lib/export-utils').then(({ exportMealPlanToXLSX }) => {
                    exportMealPlanToXLSX(currentMealPlan, `meal-plan-${new Date().toISOString().slice(0,10)}.xlsx`)
                  });
                }}
              >
                <Download className="h-5 w-5 mr-2" />
                Export Plan
              </Button>
              <Button variant="outline" className="px-8 py-3">
                <Share2 className="h-5 w-5 mr-2" />
                Share Plan
              </Button>
            </>
          )}
        </div>

        {/* Week Navigation */}
        <Card className="border border-border/50 shadow-xl bg-card/80 backdrop-blur-sm mb-8 hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigateWeek('prev')}
                className="flex items-center space-x-2 border-primary/20 hover:bg-primary/5"
              >
                <span>← Previous Week</span>
              </Button>
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground">
                  {currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
                  {new Date(currentWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
                {currentMealPlan && (
                  <p className="text-muted-foreground mt-1">
                    Target: {currentMealPlan.targetCalories} cal/day • {currentMealPlan.targetProtein}g protein
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => navigateWeek('next')}
                className="flex items-center space-x-2"
              >
                <span>Next Week →</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Weekly Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-8">
          {calendarDays.map((day, dayIndex) => {
            const dailyNutrition = getDailyNutrition(day);
            return (
              <Card key={dayIndex} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit">
                <CardHeader className="pb-4">
                  <div className="text-center">
                    <h4 className="font-bold text-slate-800">{day.dayName}</h4>
                    <p className="text-sm text-slate-500">
                      {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    {dailyNutrition.calories > 0 && (
                      <div className="mt-2 text-xs">
                        <div className="flex justify-center space-x-2">
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                            {dailyNutrition.calories} cal
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {dailyNutrition.protein}g protein
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {MEAL_TYPES.map(mealType => {
                    const meal = day.meals[mealType];
                    return (
                      <div key={mealType} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getMealTypeColor(mealType)}`}>
                            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={() => setEditingMeal({ dayIndex, mealType })}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                        {meal?.recipe ? (
                          <div className="bg-slate-50 rounded-lg p-3 min-h-[80px]">
                            <p className="font-medium text-sm text-slate-800 line-clamp-2">
                              {meal.recipe.name}
                            </p>
                            <div className="flex items-center space-x-2 mt-2 text-xs text-slate-500">
                              <div className="flex items-center space-x-1">
                                <Flame className="h-3 w-3" />
                                <span>{((meal.recipe as Recipe).nutrition?.calories || ((meal.recipe as { calories?: number }).calories) || 0)} cal</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{((meal.recipe as Recipe).prepTime || ((meal.recipe as { prepTime?: number }).prepTime) || 0)}m</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-100 rounded-lg p-3 min-h-[80px] border-2 border-dashed border-slate-300 flex items-center justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-500 hover:text-slate-700"
                              onClick={() => setEditingMeal({ dayIndex, mealType })}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add meal
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Generator Form Modal */}
        {showGeneratorForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Generate Your Meal Plan</CardTitle>
                <p className="text-slate-600 text-center">
                  Set your preferences and let AI create the perfect weekly meal plan for you
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nutrition Goals */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Daily Calories</Label>
                    <Input
                      type="number"
                      value={generatorForm.targetCalories}
                      onChange={(e) => updateGeneratorForm('targetCalories', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Protein (g)</Label>
                    <Input
                      type="number"
                      value={generatorForm.targetProtein}
                      onChange={(e) => updateGeneratorForm('targetProtein', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Carbs (g)</Label>
                    <Input
                      type="number"
                      value={generatorForm.targetCarbs}
                      onChange={(e) => updateGeneratorForm('targetCarbs', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fat (g)</Label>
                    <Input
                      type="number"
                      value={generatorForm.targetFat}
                      onChange={(e) => updateGeneratorForm('targetFat', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                {/* Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Cooking Difficulty</Label>
                    <Select value={generatorForm.difficulty} onValueChange={(value) => updateGeneratorForm('difficulty', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy (≤30 min)</SelectItem>
                        <SelectItem value="medium">Medium (30-60 min)</SelectItem>
                        <SelectItem value="hard">Hard (60+ min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Max Prep Time (minutes)</Label>
                    <Input
                      type="number"
                      value={generatorForm.prepTimeLimit}
                      onChange={(e) => updateGeneratorForm('prepTimeLimit', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Dietary Restrictions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {DIETARY_RESTRICTIONS.map(restriction => (
                      <Button
                        key={restriction}
                        type="button"
                        variant={generatorForm.dietaryRestrictions?.includes(restriction) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleArrayValue('dietaryRestrictions', restriction)}
                        className="justify-start text-sm"
                      >
                        {restriction}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Cuisine Preferences */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Cuisine Preferences</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {CUISINE_PREFERENCES.map(cuisine => (
                      <Button
                        key={cuisine}
                        type="button"
                        variant={generatorForm.cuisinePreferences?.includes(cuisine) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleArrayValue('cuisinePreferences', cuisine)}
                        className="justify-start text-sm"
                      >
                        {cuisine}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowGeneratorForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={generateMealPlan}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Generate Meal Plan
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!currentMealPlan && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ChefHat className="h-16 w-16 text-orange-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">Ready to plan your meals?</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Generate a personalized weekly meal plan based on your nutrition goals and dietary preferences.
            </p>
            <Button
              onClick={() => setShowGeneratorForm(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Meal Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}