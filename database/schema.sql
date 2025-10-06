-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS meal_plan_entries CASCADE;
DROP TABLE IF EXISTS meal_plans CASCADE;
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS food_analysis CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS nutrition_logs CASCADE;
DROP TABLE IF EXISTS food_items CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop types if they exist
DROP TYPE IF EXISTS difficulty CASCADE;
DROP TYPE IF EXISTS meal_type CASCADE;

-- Create custom types
CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER NOT NULL,
    weight DOUBLE PRECISION,
    height DOUBLE PRECISION,
    activity_level TEXT,
    dietary_preferences TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food items table
CREATE TABLE food_items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    calories_per_100g DOUBLE PRECISION NOT NULL,
    protein_per_100g DOUBLE PRECISION NOT NULL,
    carbs_per_100g DOUBLE PRECISION NOT NULL,
    fat_per_100g DOUBLE PRECISION NOT NULL,
    fiber_per_100g DOUBLE PRECISION DEFAULT 0,
    sugar_per_100g DOUBLE PRECISION DEFAULT 0,
    sodium_per_100g DOUBLE PRECISION DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nutrition logs table
CREATE TABLE nutrition_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    food_item_id INTEGER REFERENCES food_items(id),
    quantity_grams DOUBLE PRECISION NOT NULL,
    meal_type meal_type NOT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food analysis table
CREATE TABLE food_analysis (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    image_url TEXT NOT NULL,
    analysis_result TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipes table
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    prep_time INTEGER NOT NULL,
    cook_time INTEGER NOT NULL,
    servings INTEGER NOT NULL,
    difficulty difficulty NOT NULL,
    cuisine TEXT NOT NULL,
    dietary_tags TEXT[] DEFAULT '{}',
    instructions TEXT[] NOT NULL,
    calories_per_serving DOUBLE PRECISION NOT NULL,
    protein_per_serving DOUBLE PRECISION NOT NULL,
    carbs_per_serving DOUBLE PRECISION NOT NULL,
    fat_per_serving DOUBLE PRECISION NOT NULL,
    fiber_per_serving DOUBLE PRECISION NOT NULL,
    sugar_per_serving DOUBLE PRECISION NOT NULL,
    sodium_per_serving DOUBLE PRECISION NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipe ingredients table
CREATE TABLE recipe_ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    food_item_id INTEGER REFERENCES food_items(id),
    quantity DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meal plans table
CREATE TABLE meal_plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_calories DOUBLE PRECISION NOT NULL,
    target_protein DOUBLE PRECISION,
    target_carbs DOUBLE PRECISION,
    target_fat DOUBLE PRECISION,
    dietary_restrictions TEXT[] DEFAULT '{}',
    preferences TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meal plan entries table
CREATE TABLE meal_plan_entries (
    id SERIAL PRIMARY KEY,
    meal_plan_id INTEGER REFERENCES meal_plans(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type meal_type NOT NULL,
    recipe_id INTEGER REFERENCES recipes(id),
    servings DOUBLE PRECISION DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_nutrition_logs_user_id ON nutrition_logs(user_id);
CREATE INDEX idx_nutrition_logs_logged_at ON nutrition_logs(logged_at);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX idx_meal_plan_entries_meal_plan_id ON meal_plan_entries(meal_plan_id);
CREATE INDEX idx_meal_plan_entries_date ON meal_plan_entries(date);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to relevant tables
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();