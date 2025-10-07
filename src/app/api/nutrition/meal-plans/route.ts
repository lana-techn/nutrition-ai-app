import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mealPlans, mealPlanEntries, recipes } from '@/lib/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import type { MealPlan, MealPlanRequest, MealPlanGeneration, MealPlanEntry } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Build query conditions
    let whereClause;
    if (startDate && endDate) {
      whereClause = and(
        gte(mealPlans.startDate, new Date(startDate)),
        lte(mealPlans.endDate, new Date(endDate))
      );
    }

    const mealPlansData = await db.select()
      .from(mealPlans)
      .where(whereClause)
      .limit(limit)
      .orderBy(mealPlans.createdAt);

    // Fetch meal plan entries for each plan
    const mealPlansWithEntries = await Promise.all(
      mealPlansData.map(async (plan) => {
        const entries = await db.select({
          id: mealPlanEntries.id,
          mealPlanId: mealPlanEntries.mealPlanId,
          date: mealPlanEntries.date,
          mealType: mealPlanEntries.mealType,
          recipeId: mealPlanEntries.recipeId,
          servings: mealPlanEntries.servings,
          recipe: {
            id: recipes.id,
            name: recipes.name,
            description: recipes.description,
            prepTime: recipes.prepTime,
            cookTime: recipes.cookTime,
            servings: recipes.servings,
            difficulty: recipes.difficulty,
            cuisine: recipes.cuisine,
            dietaryTags: recipes.dietaryTags,
            instructions: recipes.instructions,
            caloriesPerServing: recipes.caloriesPerServing,
            proteinPerServing: recipes.proteinPerServing,
            carbsPerServing: recipes.carbsPerServing,
            fatPerServing: recipes.fatPerServing,
            fiberPerServing: recipes.fiberPerServing,
            sugarPerServing: recipes.sugarPerServing,
            sodiumPerServing: recipes.sodiumPerServing,
            imageUrl: recipes.imageUrl,
          }
        })
        .from(mealPlanEntries)
        .leftJoin(recipes, eq(mealPlanEntries.recipeId, recipes.id))
        .where(eq(mealPlanEntries.mealPlanId, plan.id));

        return {
          ...plan,
          meals: entries.map(entry => ({
            id: entry.id,
            mealPlanId: entry.mealPlanId,
            date: entry.date,
            mealType: entry.mealType,
            recipeId: entry.recipeId,
            servings: entry.servings,
            recipe: entry.recipe ? {
              id: entry.recipe.id,
              name: entry.recipe.name,
              description: entry.recipe.description,
              prepTime: entry.recipe.prepTime,
              cookTime: entry.recipe.cookTime,
              servings: entry.recipe.servings,
              difficulty: entry.recipe.difficulty,
              cuisine: entry.recipe.cuisine,
              dietaryTags: entry.recipe.dietaryTags,
              ingredients: [], // To be loaded separately if needed
              instructions: entry.recipe.instructions,
              nutrition: {
                calories: entry.recipe.caloriesPerServing,
                protein: entry.recipe.proteinPerServing,
                carbs: entry.recipe.carbsPerServing,
                fat: entry.recipe.fatPerServing,
                fiber: entry.recipe.fiberPerServing,
                sugar: entry.recipe.sugarPerServing,
                sodium: entry.recipe.sodiumPerServing,
              },
              imageUrl: entry.recipe.imageUrl,
              createdAt: new Date(), // Would come from recipe table
              updatedAt: new Date(),
            } : undefined
          }))
        };
      })
    );

    return NextResponse.json(mealPlansWithEntries);

  } catch (error) {
    console.error('Meal plans fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const request: MealPlanRequest = await req.json();

    // Normalize and coerce dates/numbers
    const normalizedStartDate = new Date((request as any).startDate);
    const normalizedDaysCount = Number((request as any).daysCount || 7);
    
    const normalizedRequest: MealPlanRequest = {
      ...request,
      startDate: normalizedStartDate as any,
      daysCount: normalizedDaysCount as any,
    };

    // Generate meal plan using AI or rule-based logic
    const mealPlanGeneration = await generateMealPlan(normalizedRequest);

    // Save meal plan to database
    const [savedMealPlan] = await db.insert(mealPlans).values({
      name: `Meal Plan ${new Date().toLocaleDateString()}`,
      startDate: normalizedStartDate,
      endDate: new Date(normalizedStartDate.getTime() + (normalizedDaysCount - 1) * 24 * 60 * 60 * 1000),
      targetCalories: request.targetCalories,
      targetProtein: request.targetProtein,
      targetCarbs: request.targetCarbs,
      targetFat: request.targetFat,
      dietaryRestrictions: request.dietaryRestrictions || [],
      preferences: request.preferences || [],
    }).returning();

    // Save meal plan entries
    const mealPlanEntriesData = mealPlanGeneration.mealPlan.meals.map(meal => ({
      mealPlanId: savedMealPlan.id,
      date: meal.date,
      mealType: meal.mealType,
      recipeId: meal.recipeId,
      servings: meal.servings,
    }));

    await db.insert(mealPlanEntries).values(mealPlanEntriesData);

    // Return complete meal plan with entries
    const completeMealPlan = {
      ...savedMealPlan,
      meals: mealPlanGeneration.mealPlan.meals
    };

    return NextResponse.json({
      mealPlan: completeMealPlan,
      nutritionSummary: mealPlanGeneration.nutritionSummary,
      suggestions: mealPlanGeneration.suggestions
    });

  } catch (error) {
    console.error('Meal plan generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateMealPlan(request: MealPlanRequest): Promise<MealPlanGeneration> {
  try {
    // Ensure startDate is a Date object
    const startDate = new Date((request as any).startDate);

    // Get recipes that match dietary restrictions
    let recipeQuery = db.select().from(recipes);
    
    if (request.dietaryRestrictions && request.dietaryRestrictions.length > 0) {
      // Filter recipes that contain any of the required dietary tags
      recipeQuery = recipeQuery.where(
        // This would need proper SQL array overlap query
        // For now, we'll get all recipes and filter in memory
      );
    }

    const availableRecipes = await recipeQuery.limit(50);

    // Filter recipes based on criteria
    const filteredRecipes = availableRecipes.filter(recipe => {
      // Check dietary restrictions
      if (request.dietaryRestrictions && request.dietaryRestrictions.length > 0) {
        const hasRequiredTags = request.dietaryRestrictions.some(restriction => 
          recipe.dietaryTags.includes(restriction)
        );
        if (!hasRequiredTags) return false;
      }

      // Check difficulty
      if (request.difficulty && recipe.difficulty !== request.difficulty) {
        return false;
      }

      // Check prep time limit
      if (request.prepTimeLimit && recipe.prepTime > request.prepTimeLimit) {
        return false;
      }

      return true;
    });

    // Generate meals for each day
    const meals: MealPlanEntry[] = [];
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

    for (let day = 0; day < request.daysCount; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);

      for (const mealType of mealTypes) {
        // Select appropriate recipe for meal type and nutritional goals
        const suitableRecipes = filteredRecipes.filter(recipe => {
          // Simple logic: breakfast should be lower calorie, dinner higher protein, etc.
          const calories = recipe.caloriesPerServing;
          switch (mealType) {
            case 'breakfast':
              return calories >= 250 && calories <= 450;
            case 'lunch':
              return calories >= 350 && calories <= 600;
            case 'dinner':
              return calories >= 400 && calories <= 700;
            case 'snack':
              return calories >= 100 && calories <= 300;
            default:
              return true;
          }
        });

        if (suitableRecipes.length > 0) {
          // Select a random suitable recipe
          const selectedRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)];
          
          meals.push({
            id: meals.length + 1,
            mealPlanId: 0, // Will be set after meal plan creation
            date,
            mealType,
            recipeId: selectedRecipe.id,
            servings: 1,
            recipe: {
              id: selectedRecipe.id,
              name: selectedRecipe.name,
              description: selectedRecipe.description,
              prepTime: selectedRecipe.prepTime,
              cookTime: selectedRecipe.cookTime,
              servings: selectedRecipe.servings,
              difficulty: selectedRecipe.difficulty,
              cuisine: selectedRecipe.cuisine,
              dietaryTags: selectedRecipe.dietaryTags,
              ingredients: [], // Would need separate query
              instructions: selectedRecipe.instructions,
              nutrition: {
                calories: selectedRecipe.caloriesPerServing,
                protein: selectedRecipe.proteinPerServing,
                carbs: selectedRecipe.carbsPerServing,
                fat: selectedRecipe.fatPerServing,
                fiber: selectedRecipe.fiberPerServing,
                sugar: selectedRecipe.sugarPerServing,
                sodium: selectedRecipe.sodiumPerServing,
              },
              imageUrl: selectedRecipe.imageUrl,
              createdAt: selectedRecipe.createdAt,
              updatedAt: selectedRecipe.updatedAt,
            }
          });
        }
      }
    }

    // Calculate nutrition summary
    const totalCalories = meals.reduce((sum, meal) => sum + (meal.recipe?.nutrition.calories || 0), 0);
    const totalProtein = meals.reduce((sum, meal) => sum + (meal.recipe?.nutrition.protein || 0), 0);
    const totalCarbs = meals.reduce((sum, meal) => sum + (meal.recipe?.nutrition.carbs || 0), 0);
    const totalFat = meals.reduce((sum, meal) => sum + (meal.recipe?.nutrition.fat || 0), 0);

    const mealPlan: MealPlan = {
      id: 0, // Will be set after insertion
      name: `AI Generated Meal Plan`,
      startDate: startDate as any,
      endDate: new Date(startDate.getTime() + (request.daysCount - 1) * 24 * 60 * 60 * 1000),
      targetCalories: request.targetCalories,
      targetProtein: request.targetProtein || 0,
      targetCarbs: request.targetCarbs || 0,
      targetFat: request.targetFat || 0,
      dietaryRestrictions: request.dietaryRestrictions || [],
      preferences: request.preferences || [],
      meals,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const nutritionSummary = {
      averageCalories: Math.round(totalCalories / request.daysCount),
      averageProtein: Math.round(totalProtein / request.daysCount),
      averageCarbs: Math.round(totalCarbs / request.daysCount),
      averageFat: Math.round(totalFat / request.daysCount),
      varietyScore: Math.min(95, filteredRecipes.length * 2), // Simple variety calculation
    };

    const suggestions = [
      `Your meal plan provides an average of ${nutritionSummary.averageCalories} calories per day.`,
      `Protein intake averages ${nutritionSummary.averageProtein}g per day, which is excellent for muscle maintenance.`,
      'Remember to stay hydrated by drinking at least 8 glasses of water daily.',
      'Consider meal prepping on Sundays to save time during the week.',
    ];

    return {
      mealPlan,
      nutritionSummary,
      suggestions,
    };

  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
}