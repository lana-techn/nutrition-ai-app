import { api } from "encore.dev/api";
import { nutritionDB } from "./db";
import type { Recipe, RecipeIngredient, RecipeNutrition } from "./types";

interface ListRecipesRequest {
  search?: string;
  cuisine?: string;
  difficulty?: string;
  dietaryTags?: string[];
  maxPrepTime?: number;
  limit?: number;
  offset?: number;
}

interface ListRecipesResponse {
  recipes: Recipe[];
  total: number;
}

// Retrieves recipes with optional filtering and pagination.
export const listRecipes = api<ListRecipesRequest, ListRecipesResponse>(
  { expose: true, method: "GET", path: "/recipes" },
  async (req) => {
    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    // Build WHERE conditions
    if (req.search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${req.search}%`);
      paramIndex++;
    }

    if (req.cuisine) {
      whereConditions.push(`cuisine = $${paramIndex}`);
      params.push(req.cuisine);
      paramIndex++;
    }

    if (req.difficulty) {
      whereConditions.push(`difficulty = $${paramIndex}`);
      params.push(req.difficulty);
      paramIndex++;
    }

    if (req.dietaryTags && req.dietaryTags.length > 0) {
      whereConditions.push(`dietary_tags && $${paramIndex}`);
      params.push(req.dietaryTags);
      paramIndex++;
    }

    if (req.maxPrepTime) {
      whereConditions.push(`prep_time <= $${paramIndex}`);
      params.push(req.maxPrepTime);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM recipes ${whereClause}`;
    const countResult = await nutritionDB.rawQueryRow<{ count: number }>(countQuery, ...params);
    const total = countResult?.count || 0;

    // Get recipes with pagination
    const limit = req.limit || 20;
    const offset = req.offset || 0;
    
    const recipesQuery = `
      SELECT * FROM recipes 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const recipeRows = await nutritionDB.rawQueryAll<{
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
    }>(recipesQuery, ...params);

    const recipes: Recipe[] = recipeRows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      prepTime: row.prep_time,
      cookTime: row.cook_time,
      servings: row.servings,
      difficulty: row.difficulty,
      cuisine: row.cuisine,
      dietaryTags: row.dietary_tags,
      ingredients: [], // Will be loaded separately if needed
      instructions: row.instructions,
      nutrition: {
        calories: row.calories_per_serving,
        protein: row.protein_per_serving,
        carbs: row.carbs_per_serving,
        fat: row.fat_per_serving,
        fiber: row.fiber_per_serving,
        sugar: row.sugar_per_serving,
        sodium: row.sodium_per_serving,
      },
      imageUrl: row.image_url || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { recipes, total };
  }
);
