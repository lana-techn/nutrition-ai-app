import { api } from "encore.dev/api";
import { nutritionDB } from "./db";
import type { MealPlanRequest, MealPlanGeneration, MealPlan, MealPlanEntry, Recipe } from "./types";

// Generates a personalized weekly meal plan based on user preferences and nutrition goals.
export const generateMealPlan = api<MealPlanRequest, MealPlanGeneration>(
  { expose: true, method: "POST", path: "/meal-plans/generate" },
  async (req) => {
    // Build recipe filter conditions
    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    // Filter by dietary restrictions
    if (req.dietaryRestrictions && req.dietaryRestrictions.length > 0) {
      whereConditions.push(`dietary_tags && $${paramIndex}`);
      params.push(req.dietaryRestrictions);
      paramIndex++;
    }

    // Filter by prep time limit
    if (req.prepTimeLimit) {
      whereConditions.push(`prep_time <= $${paramIndex}`);
      params.push(req.prepTimeLimit);
      paramIndex++;
    }

    // Filter by difficulty
    if (req.difficulty) {
      whereConditions.push(`difficulty = $${paramIndex}`);
      params.push(req.difficulty);
      paramIndex++;
    }

    // Filter by cuisine preferences
    if (req.cuisinePreferences && req.cuisinePreferences.length > 0) {
      const cuisineConditions = req.cuisinePreferences.map(() => `cuisine = $${paramIndex++}`);
      whereConditions.push(`(${cuisineConditions.join(' OR ')})`);
      params.push(...req.cuisinePreferences);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get available recipes
    const recipesQuery = `
      SELECT * FROM recipes 
      ${whereClause}
      ORDER BY RANDOM()
    `;

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

    if (recipeRows.length === 0) {
      throw new Error("No recipes found matching the criteria");
    }

    // Convert to Recipe objects
    const availableRecipes: Recipe[] = recipeRows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      prepTime: row.prep_time,
      cookTime: row.cook_time,
      servings: row.servings,
      difficulty: row.difficulty,
      cuisine: row.cuisine,
      dietaryTags: row.dietary_tags,
      ingredients: [],
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

    // Generate meal plan
    const mealPlan = await generateOptimalMealPlan(req, availableRecipes);

    // Calculate nutrition summary
    const nutritionSummary = calculateNutritionSummary(mealPlan);

    // Generate suggestions
    const suggestions = generateMealPlanSuggestions(mealPlan, req, nutritionSummary);

    return {
      mealPlan,
      nutritionSummary,
      suggestions,
    };
  }
);

async function generateOptimalMealPlan(
  req: MealPlanRequest,
  availableRecipes: Recipe[]
): Promise<MealPlan> {
  const startDate = new Date(req.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + req.daysCount - 1);

  // Create meal plan record
  const mealPlanRow = await nutritionDB.queryRow<{ id: number }>`
    INSERT INTO meal_plans (
      name, start_date, end_date, target_calories, target_protein, 
      target_carbs, target_fat, dietary_restrictions, preferences
    ) VALUES (
      ${`Meal Plan - ${startDate.toISOString().split('T')[0]}`},
      ${startDate.toISOString().split('T')[0]},
      ${endDate.toISOString().split('T')[0]},
      ${req.targetCalories},
      ${req.targetProtein || null},
      ${req.targetCarbs || null},
      ${req.targetFat || null},
      ${req.dietaryRestrictions || []},
      ${req.preferences || []}
    ) RETURNING id
  `;

  if (!mealPlanRow) {
    throw new Error("Failed to create meal plan");
  }

  const mealPlanId = mealPlanRow.id;

  // Generate meals for each day
  const meals: MealPlanEntry[] = [];
  const mealTypes: Array<'breakfast' | 'lunch' | 'dinner' | 'snack'> = ['breakfast', 'lunch', 'dinner'];
  
  // Target calories per meal type
  const calorieDistribution = {
    breakfast: req.targetCalories * 0.25,
    lunch: req.targetCalories * 0.35,
    dinner: req.targetCalories * 0.35,
    snack: req.targetCalories * 0.05,
  };

  for (let day = 0; day < req.daysCount; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    for (const mealType of mealTypes) {
      const targetCalories = calorieDistribution[mealType];
      
      // Find best recipe for this meal type and calorie target
      const suitableRecipes = availableRecipes.filter(recipe => {
        const calorieRange = targetCalories * 0.3; // Allow 30% variance
        return Math.abs(recipe.nutrition.calories - targetCalories) <= calorieRange;
      });

      // If no suitable recipes, use any available recipe with adjusted servings
      const selectedRecipes = suitableRecipes.length > 0 ? suitableRecipes : availableRecipes;
      const recipe = selectedRecipes[Math.floor(Math.random() * selectedRecipes.length)];
      
      // Calculate servings to match target calories
      const servings = Math.max(0.5, Math.min(3, targetCalories / recipe.nutrition.calories));

      // Insert meal plan entry
      const entryRow = await nutritionDB.queryRow<{ id: number }>`
        INSERT INTO meal_plan_entries (meal_plan_id, date, meal_type, recipe_id, servings)
        VALUES (${mealPlanId}, ${currentDate.toISOString().split('T')[0]}, ${mealType}, ${recipe.id}, ${servings})
        RETURNING id
      `;

      if (entryRow) {
        meals.push({
          id: entryRow.id,
          mealPlanId,
          date: currentDate,
          mealType,
          recipeId: recipe.id,
          servings,
          recipe,
        });
      }
    }
  }

  return {
    id: mealPlanId,
    name: `Meal Plan - ${startDate.toISOString().split('T')[0]}`,
    startDate,
    endDate,
    targetCalories: req.targetCalories,
    targetProtein: req.targetProtein || 0,
    targetCarbs: req.targetCarbs || 0,
    targetFat: req.targetFat || 0,
    dietaryRestrictions: req.dietaryRestrictions || [],
    preferences: req.preferences || [],
    meals,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function calculateNutritionSummary(mealPlan: MealPlan) {
  const dailyTotals = new Map<string, { calories: number; protein: number; carbs: number; fat: number }>();

  // Group meals by date
  mealPlan.meals.forEach(meal => {
    const dateKey = meal.date.toISOString().split('T')[0];
    if (!dailyTotals.has(dateKey)) {
      dailyTotals.set(dateKey, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    const dayTotal = dailyTotals.get(dateKey)!;
    const recipe = meal.recipe!;
    
    dayTotal.calories += recipe.nutrition.calories * meal.servings;
    dayTotal.protein += recipe.nutrition.protein * meal.servings;
    dayTotal.carbs += recipe.nutrition.carbs * meal.servings;
    dayTotal.fat += recipe.nutrition.fat * meal.servings;
  });

  // Calculate averages
  const totals = Array.from(dailyTotals.values());
  const daysCount = totals.length;

  const averageCalories = totals.reduce((sum, day) => sum + day.calories, 0) / daysCount;
  const averageProtein = totals.reduce((sum, day) => sum + day.protein, 0) / daysCount;
  const averageCarbs = totals.reduce((sum, day) => sum + day.carbs, 0) / daysCount;
  const averageFat = totals.reduce((sum, day) => sum + day.fat, 0) / daysCount;

  // Calculate variety score (unique recipes / total meals)
  const uniqueRecipes = new Set(mealPlan.meals.map(meal => meal.recipeId));
  const varietyScore = (uniqueRecipes.size / mealPlan.meals.length) * 100;

  return {
    averageCalories: Math.round(averageCalories),
    averageProtein: Math.round(averageProtein),
    averageCarbs: Math.round(averageCarbs),
    averageFat: Math.round(averageFat),
    varietyScore: Math.round(varietyScore),
  };
}

function generateMealPlanSuggestions(
  mealPlan: MealPlan,
  request: MealPlanRequest,
  nutritionSummary: any
): string[] {
  const suggestions: string[] = [];

  // Calorie target comparison
  const calorieDeviation = Math.abs(nutritionSummary.averageCalories - request.targetCalories);
  if (calorieDeviation > request.targetCalories * 0.1) {
    if (nutritionSummary.averageCalories > request.targetCalories) {
      suggestions.push("Consider reducing portion sizes or choosing lower-calorie recipes to meet your calorie goal.");
    } else {
      suggestions.push("Consider increasing portion sizes or adding healthy snacks to meet your calorie goal.");
    }
  }

  // Variety score feedback
  if (nutritionSummary.varietyScore < 60) {
    suggestions.push("Try exploring more recipe varieties to ensure a diverse range of nutrients.");
  } else if (nutritionSummary.varietyScore > 80) {
    suggestions.push("Great job maintaining variety in your meal plan!");
  }

  // Protein adequacy
  const proteinTarget = request.targetProtein || request.targetCalories * 0.15 / 4;
  if (nutritionSummary.averageProtein < proteinTarget * 0.8) {
    suggestions.push("Consider adding more protein-rich foods like lean meats, legumes, or dairy products.");
  }

  // General wellness tips
  suggestions.push("Remember to stay hydrated and consider meal prep on weekends to save time during busy weekdays.");
  suggestions.push("Don't forget to include a variety of colorful vegetables to ensure adequate micronutrient intake.");

  return suggestions;
}
