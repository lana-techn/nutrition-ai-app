export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  weight?: number;
  height?: number;
  activityLevel?: string;
  dietaryPreferences?: string;
  createdAt: Date;
}

export interface FoodItem {
  id: number;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  sugarPer100g: number;
  sodiumPer100g: number;
  createdAt: Date;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  imageUrl?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionRecommendation {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ageGroup: string;
  notes: string[];
}

export interface AIAnalysisResult {
  detectedFoods: Array<{
    name: string;
    confidence: number;
    estimatedWeight: number;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }>;
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  suggestions: string[];
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  dietaryTags: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
  nutrition: RecipeNutrition;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  id: number;
  recipeId: number;
  foodItemId: number;
  quantity: number;
  unit: string;
  notes?: string;
  foodItem?: FoodItem;
}

export interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface MealPlan {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  dietaryRestrictions: string[];
  preferences: string[];
  meals: MealPlanEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MealPlanEntry {
  id: number;
  mealPlanId: number;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId: number;
  servings: number;
  recipe?: Recipe;
}

export interface MealPlanRequest {
  targetCalories: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  dietaryRestrictions?: string[];
  preferences?: string[];
  excludeIngredients?: string[];
  cuisinePreferences?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  prepTimeLimit?: number;
  startDate: Date;
  daysCount: number;
}

export interface MealPlanGeneration {
  mealPlan: MealPlan;
  nutritionSummary: {
    averageCalories: number;
    averageProtein: number;
    averageCarbs: number;
    averageFat: number;
    varietyScore: number;
  };
  suggestions: string[];
}