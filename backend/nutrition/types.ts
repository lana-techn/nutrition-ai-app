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

export interface NutritionLog {
  id: number;
  userId: number;
  foodItemId: number;
  quantityGrams: number;
  mealType: string;
  loggedAt: Date;
  foodItem?: FoodItem;
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

export interface FoodAnalysis {
  id: number;
  userId: number;
  imageUrl: string;
  analysisResult: string;
  createdAt: Date;
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
