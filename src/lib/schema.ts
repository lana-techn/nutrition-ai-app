import { pgTable, serial, text, integer, doublePrecision, timestamp, boolean, date, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);
export const mealTypeEnum = pgEnum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password'), // nullable for OAuth users
  age: integer('age'),
  weight: doublePrecision('weight'),
  height: doublePrecision('height'),
  activityLevel: text('activity_level'),
  dietaryPreferences: text('dietary_preferences'),
  avatar: text('avatar'),
  isVerified: boolean('is_verified').default(false),
  provider: text('provider').default('email'), // 'email', 'google', etc.
  providerId: text('provider_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Food items table
export const foodItems = pgTable('food_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  caloriesPer100g: doublePrecision('calories_per_100g').notNull(),
  proteinPer100g: doublePrecision('protein_per_100g').notNull(),
  carbsPer100g: doublePrecision('carbs_per_100g').notNull(),
  fatPer100g: doublePrecision('fat_per_100g').notNull(),
  fiberPer100g: doublePrecision('fiber_per_100g').default(0),
  sugarPer100g: doublePrecision('sugar_per_100g').default(0),
  sodiumPer100g: doublePrecision('sodium_per_100g').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt').notNull(),
  author: text('author').notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url'),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Recipes table
export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  prepTime: integer('prep_time').notNull(),
  cookTime: integer('cook_time').notNull(),
  servings: integer('servings').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  cuisine: text('cuisine').notNull(),
  dietaryTags: text('dietary_tags').array().default([]),
  instructions: text('instructions').array().notNull(),
  caloriesPerServing: doublePrecision('calories_per_serving').notNull(),
  proteinPerServing: doublePrecision('protein_per_serving').notNull(),
  carbsPerServing: doublePrecision('carbs_per_serving').notNull(),
  fatPerServing: doublePrecision('fat_per_serving').notNull(),
  fiberPerServing: doublePrecision('fiber_per_serving').notNull(),
  sugarPerServing: doublePrecision('sugar_per_serving').notNull(),
  sodiumPerServing: doublePrecision('sodium_per_serving').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Recipe ingredients table
export const recipeIngredients = pgTable('recipe_ingredients', {
  id: serial('id').primaryKey(),
  recipeId: integer('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  foodItemId: integer('food_item_id').references(() => foodItems.id),
  quantity: doublePrecision('quantity').notNull(),
  unit: text('unit').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Meal plans table
export const mealPlans = pgTable('meal_plans', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  targetCalories: doublePrecision('target_calories').notNull(),
  targetProtein: doublePrecision('target_protein'),
  targetCarbs: doublePrecision('target_carbs'),
  targetFat: doublePrecision('target_fat'),
  dietaryRestrictions: text('dietary_restrictions').array().default([]),
  preferences: text('preferences').array().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Meal plan entries table
export const mealPlanEntries = pgTable('meal_plan_entries', {
  id: serial('id').primaryKey(),
  mealPlanId: integer('meal_plan_id').references(() => mealPlans.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  mealType: mealTypeEnum('meal_type').notNull(),
  recipeId: integer('recipe_id').references(() => recipes.id),
  servings: doublePrecision('servings').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  // Relations can be added here when needed
}));

export const foodItemsRelations = relations(foodItems, ({ many }) => ({
  recipeIngredients: many(recipeIngredients),
}));

export const recipesRelations = relations(recipes, ({ many }) => ({
  ingredients: many(recipeIngredients),
  mealPlanEntries: many(mealPlanEntries),
}));

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id],
  }),
  foodItem: one(foodItems, {
    fields: [recipeIngredients.foodItemId],
    references: [foodItems.id],
  }),
}));

export const mealPlansRelations = relations(mealPlans, ({ many }) => ({
  entries: many(mealPlanEntries),
}));

export const mealPlanEntriesRelations = relations(mealPlanEntries, ({ one }) => ({
  mealPlan: one(mealPlans, {
    fields: [mealPlanEntries.mealPlanId],
    references: [mealPlans.id],
  }),
  recipe: one(recipes, {
    fields: [mealPlanEntries.recipeId],
    references: [recipes.id],
  }),
}));

