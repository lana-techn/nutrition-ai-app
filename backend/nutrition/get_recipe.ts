import { api, APIError } from "encore.dev/api";
import { nutritionDB } from "./db";
import type { Recipe, RecipeIngredient } from "./types";

interface GetRecipeRequest {
  id: number;
}

// Retrieves a specific recipe with full details including ingredients.
export const getRecipe = api<GetRecipeRequest, Recipe>(
  { expose: true, method: "GET", path: "/recipes/:id" },
  async (req) => {
    // Get recipe
    const recipeRow = await nutritionDB.queryRow<{
      id: number;
      name: string;
      description: string;
      prep_time: number;
      cook_time: number;
      servings: number;
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
      created_at: Date;
      updated_at: Date;
    }>`SELECT * FROM recipes WHERE id = ${req.id}`;

    if (!recipeRow) {
      throw APIError.notFound("Recipe not found");
    }

    // Get ingredients
    const ingredientRows = await nutritionDB.queryAll<{
      id: number;
      recipe_id: number;
      food_item_id: number;
      quantity: number;
      unit: string;
      notes: string | null;
      food_name: string;
      calories_per_100g: number;
      protein_per_100g: number;
      carbs_per_100g: number;
      fat_per_100g: number;
      fiber_per_100g: number;
      sugar_per_100g: number;
      sodium_per_100g: number;
    }>`
      SELECT ri.*, fi.name as food_name, fi.calories_per_100g, fi.protein_per_100g,
             fi.carbs_per_100g, fi.fat_per_100g, fi.fiber_per_100g, 
             fi.sugar_per_100g, fi.sodium_per_100g
      FROM recipe_ingredients ri
      JOIN food_items fi ON ri.food_item_id = fi.id
      WHERE ri.recipe_id = ${req.id}
      ORDER BY ri.id
    `;

    const ingredients: RecipeIngredient[] = ingredientRows.map(row => ({
      id: row.id,
      recipeId: row.recipe_id,
      foodItemId: row.food_item_id,
      quantity: row.quantity,
      unit: row.unit,
      notes: row.notes || undefined,
      foodItem: {
        id: row.food_item_id,
        name: row.food_name,
        caloriesPer100g: row.calories_per_100g,
        proteinPer100g: row.protein_per_100g,
        carbsPer100g: row.carbs_per_100g,
        fatPer100g: row.fat_per_100g,
        fiberPer100g: row.fiber_per_100g,
        sugarPer100g: row.sugar_per_100g,
        sodiumPer100g: row.sodium_per_100g,
        createdAt: new Date(),
      }
    }));

    return {
      id: recipeRow.id,
      name: recipeRow.name,
      description: recipeRow.description,
      prepTime: recipeRow.prep_time,
      cookTime: recipeRow.cook_time,
      servings: recipeRow.servings,
      difficulty: recipeRow.difficulty,
      cuisine: recipeRow.cuisine,
      dietaryTags: recipeRow.dietary_tags,
      ingredients,
      instructions: recipeRow.instructions,
      nutrition: {
        calories: recipeRow.calories_per_serving,
        protein: recipeRow.protein_per_serving,
        carbs: recipeRow.carbs_per_serving,
        fat: recipeRow.fat_per_serving,
        fiber: recipeRow.fiber_per_serving,
        sugar: recipeRow.sugar_per_serving,
        sodium: recipeRow.sodium_per_serving,
      },
      imageUrl: recipeRow.image_url || undefined,
      createdAt: recipeRow.created_at,
      updatedAt: recipeRow.updated_at,
    };
  }
);
