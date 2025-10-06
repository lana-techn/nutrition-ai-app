import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recipes } from '@/lib/schema';
import { sql, and, or, like, lte, eq, SQL } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const cuisine = searchParams.get('cuisine');
    const difficulty = searchParams.get('difficulty');
    const dietaryTags = searchParams.getAll('dietaryTags');
    const maxPrepTime = searchParams.get('maxPrepTime');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query conditions
    const conditions: SQL[] = [];
    
    if (search) {
      const searchCondition = or(
        like(recipes.name, `%${search}%`),
        like(recipes.description, `%${search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }
    
    if (cuisine) {
      conditions.push(eq(recipes.cuisine, cuisine));
    }
    
    if (difficulty) {
      conditions.push(eq(recipes.difficulty, difficulty as 'easy' | 'medium' | 'hard'));
    }
    
    if (dietaryTags.length > 0) {
      conditions.push(sql`${recipes.dietaryTags} && ${dietaryTags}`);
    }
    
    if (maxPrepTime) {
      conditions.push(lte(recipes.prepTime, parseInt(maxPrepTime)));
    }

    // Build where clause
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Execute query with conditions
    const recipesData = await db.select()
      .from(recipes)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${recipes.createdAt} DESC`);

    // Get total count
    const [{ count: total }] = await db.select({ count: sql<number>`count(*)` })
      .from(recipes)
      .where(whereClause);

    // Transform data to match expected format
    const recipesResponse = recipesData.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      cuisine: recipe.cuisine,
      dietaryTags: recipe.dietaryTags,
      ingredients: [], // Will be loaded separately if needed
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
    }));

    return NextResponse.json({ recipes: recipesResponse, total });

  } catch (error) {
    console.error('Recipes list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}