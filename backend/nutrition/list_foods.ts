import { api } from "encore.dev/api";
import { nutritionDB } from "./db";
import type { FoodItem } from "./types";

interface ListFoodsResponse {
  foods: FoodItem[];
}

// Retrieves all food items in the database.
export const listFoods = api<void, ListFoodsResponse>(
  { expose: true, method: "GET", path: "/foods" },
  async () => {
    const foods = await nutritionDB.queryAll<{
      id: number;
      name: string;
      calories_per_100g: number;
      protein_per_100g: number;
      carbs_per_100g: number;
      fat_per_100g: number;
      fiber_per_100g: number;
      sugar_per_100g: number;
      sodium_per_100g: number;
      created_at: Date;
    }>`SELECT * FROM food_items ORDER BY name`;

    return {
      foods: foods.map(food => ({
        id: food.id,
        name: food.name,
        caloriesPer100g: food.calories_per_100g,
        proteinPer100g: food.protein_per_100g,
        carbsPer100g: food.carbs_per_100g,
        fatPer100g: food.fat_per_100g,
        fiberPer100g: food.fiber_per_100g,
        sugarPer100g: food.sugar_per_100g,
        sodiumPer100g: food.sodium_per_100g,
        createdAt: food.created_at,
      }))
    };
  }
);
