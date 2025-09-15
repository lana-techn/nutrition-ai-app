import { api, APIError } from "encore.dev/api";
import { nutritionDB } from "./db";
import type { MealPlan, MealPlanEntry, Recipe } from "./types";

interface GetMealPlanRequest {
  id: number;
}

// Retrieves a specific meal plan with all meals and recipe details.
export const getMealPlan = api<GetMealPlanRequest, MealPlan>(
  { expose: true, method: "GET", path: "/meal-plans/:id" },
  async (req) => {
    // Get meal plan
    const mealPlanRow = await nutritionDB.queryRow<{
      id: number;
      name: string;
      start_date: Date;
      end_date: Date;
      target_calories: number;
      target_protein: number | null;
      target_carbs: number | null;
      target_fat: number | null;
      dietary_restrictions: string[];
      preferences: string[];
      created_at: Date;
      updated_at: Date;
    }>`SELECT * FROM meal_plans WHERE id = ${req.id}`;

    if (!mealPlanRow) {
      throw APIError.notFound("Meal plan not found");
    }

    // Get meal plan entries with recipe details
    const mealEntries = await nutritionDB.queryAll<{
      id: number;
      meal_plan_id: number;
      date: Date;
      meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      recipe_id: number;
      servings: number;
      recipe_name: string;
      recipe_description: string;
      prep_time: number;
      cook_time: number;
      recipe_servings: number;
      difficulty: 'easy' | 'medium' | 'hard';
      cuisine: string;
      dietary_tags: string[];
      instructions: string[];
      calories_per_serving: number;
      protein_per_serving: number;
      carbs_per_serving: number;
      fat_per_serving: number;
      fiber_per_serving: number;
      sugar_per_serving: number;
      sodium_per_serving: number;
      image_url: string | null;
      recipe_created_at: Date;
      recipe_updated_at: Date;
    }>`
      SELECT mpe.*, 
             r.name as recipe_name, r.description as recipe_description,
             r.prep_time, r.cook_time, r.servings as recipe_servings,
             r.difficulty, r.cuisine, r.dietary_tags, r.instructions,
             r.calories_per_serving, r.protein_per_serving, r.carbs_per_serving,
             r.fat_per_serving, r.fiber_per_serving, r.sugar_per_serving,
             r.sodium_per_serving, r.image_url, r.created_at as recipe_created_at,
             r.updated_at as recipe_updated_at
      FROM meal_plan_entries mpe
      JOIN recipes r ON mpe.recipe_id = r.id
      WHERE mpe.meal_plan_id = ${req.id}
      ORDER BY mpe.date, 
               CASE mpe.meal_type 
                 WHEN 'breakfast' THEN 1 
                 WHEN 'lunch' THEN 2 
                 WHEN 'dinner' THEN 3 
                 WHEN 'snack' THEN 4 
               END
    `;

    const meals: MealPlanEntry[] = mealEntries.map(entry => ({
      id: entry.id,
      mealPlanId: entry.meal_plan_id,
      date: entry.date,
      mealType: entry.meal_type,
      recipeId: entry.recipe_id,
      servings: entry.servings,
      recipe: {
        id: entry.recipe_id,
        name: entry.recipe_name,
        description: entry.recipe_description,
        prepTime: entry.prep_time,
        cookTime: entry.cook_time,
        servings: entry.recipe_servings,
        difficulty: entry.difficulty,
        cuisine: entry.cuisine,
        dietaryTags: entry.dietary_tags,
        ingredients: [], // Will be loaded separately if needed
        instructions: entry.instructions,
        nutrition: {
          calories: entry.calories_per_serving,
          protein: entry.protein_per_serving,
          carbs: entry.carbs_per_serving,
          fat: entry.fat_per_serving,
          fiber: entry.fiber_per_serving,
          sugar: entry.sugar_per_serving,
          sodium: entry.sodium_per_serving,
        },
        imageUrl: entry.image_url || undefined,
        createdAt: entry.recipe_created_at,
        updatedAt: entry.recipe_updated_at,
      }
    }));

    return {
      id: mealPlanRow.id,
      name: mealPlanRow.name,
      startDate: mealPlanRow.start_date,
      endDate: mealPlanRow.end_date,
      targetCalories: mealPlanRow.target_calories,
      targetProtein: mealPlanRow.target_protein || 0,
      targetCarbs: mealPlanRow.target_carbs || 0,
      targetFat: mealPlanRow.target_fat || 0,
      dietaryRestrictions: mealPlanRow.dietary_restrictions,
      preferences: mealPlanRow.preferences,
      meals,
      createdAt: mealPlanRow.created_at,
      updatedAt: mealPlanRow.updated_at,
    };
  }
);
