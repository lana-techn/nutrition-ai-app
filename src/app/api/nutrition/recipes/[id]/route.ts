import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes, recipeIngredients, foodItems } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const recipeId = parseInt(resolvedParams.id);

    if (!recipeId) {
      return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 });
    }

    // Get recipe
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, recipeId));

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Get ingredients with food item details
    const ingredients = await db
      .select({
        id: recipeIngredients.id,
        recipeId: recipeIngredients.recipeId,
        foodItemId: recipeIngredients.foodItemId,
        quantity: recipeIngredients.quantity,
        unit: recipeIngredients.unit,
        notes: recipeIngredients.notes,
        foodName: foodItems.name,
        caloriesPer100g: foodItems.caloriesPer100g,
        proteinPer100g: foodItems.proteinPer100g,
        carbsPer100g: foodItems.carbsPer100g,
        fatPer100g: foodItems.fatPer100g,
        fiberPer100g: foodItems.fiberPer100g,
        sugarPer100g: foodItems.sugarPer100g,
        sodiumPer100g: foodItems.sodiumPer100g,
        createdAt: foodItems.createdAt,
      })
      .from(recipeIngredients)
      .innerJoin(foodItems, eq(recipeIngredients.foodItemId, foodItems.id))
      .where(eq(recipeIngredients.recipeId, recipeId));

    // Transform ingredients data
    const ingredientsData = ingredients.map(ingredient => ({
      id: ingredient.id,
      recipeId: ingredient.recipeId,
      foodItemId: ingredient.foodItemId,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      notes: ingredient.notes || undefined,
      foodItem: {
        id: ingredient.foodItemId,
        name: ingredient.foodName,
        caloriesPer100g: ingredient.caloriesPer100g,
        proteinPer100g: ingredient.proteinPer100g,
        carbsPer100g: ingredient.carbsPer100g,
        fatPer100g: ingredient.fatPer100g,
        fiberPer100g: ingredient.fiberPer100g,
        sugarPer100g: ingredient.sugarPer100g,
        sodiumPer100g: ingredient.sodiumPer100g,
        createdAt: ingredient.createdAt,
      }
    }));

    const recipeResponse = {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      cuisine: recipe.cuisine,
      dietaryTags: recipe.dietaryTags,
      ingredients: ingredientsData,
      instructions: recipe.instructions,
      nutrition: {
        calories: recipe.caloriesPerServing,
        protein: recipe.proteinPerServing,
        carbs: recipe.carbsPerServing,
        fat: recipe.fatPerServing,
        fiber: recipe.fiberPerServing,
        sugar: recipe.sugarPerServing,
        sodium: recipe.sodiumPerServing,
      },
      imageUrl: recipe.imageUrl || undefined,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
    };

    return NextResponse.json(recipeResponse);

  } catch (error) {
    console.error('Recipe details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}