-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
DO $$ BEGIN
    CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS food_items (
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
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  food_item_id INTEGER REFERENCES food_items(id),
  quantity_grams DOUBLE PRECISION NOT NULL,
  meal_type meal_type NOT NULL,
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food analysis table
CREATE TABLE IF NOT EXISTS food_analysis (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  image_url TEXT NOT NULL,
  analysis_result TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
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
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  food_item_id INTEGER REFERENCES food_items(id),
  quantity DOUBLE PRECISION NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
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
CREATE TABLE IF NOT EXISTS meal_plan_entries (
  id SERIAL PRIMARY KEY,
  meal_plan_id INTEGER REFERENCES meal_plans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type meal_type NOT NULL,
  recipe_id INTEGER REFERENCES recipes(id),
  servings DOUBLE PRECISION DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample food items
INSERT INTO food_items (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sugar_per_100g, sodium_per_100g) VALUES
('Apple', 52, 0.3, 14, 0.2, 2.4, 10, 1),
('Banana', 89, 1.1, 23, 0.3, 2.6, 12, 1),
('Chicken Breast', 165, 31, 0, 3.6, 0, 0, 74),
('Brown Rice', 123, 2.6, 23, 0.9, 1.8, 0.4, 7),
('Broccoli', 34, 2.8, 7, 0.4, 2.6, 1.5, 33),
('Salmon', 208, 25, 0, 12, 0, 0, 59),
('Greek Yogurt', 59, 10, 3.6, 0.4, 0, 3.2, 36),
('Quinoa', 120, 4.4, 22, 1.9, 2.8, 0.9, 7),
('Spinach', 23, 2.9, 3.6, 0.4, 2.2, 0.4, 79),
('Sweet Potato', 86, 1.6, 20, 0.1, 3, 4.2, 5)
ON CONFLICT DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, author, category, published) VALUES
('Understanding Macronutrients: A Complete Guide', 'Macronutrients are the nutrients your body needs in large amounts to function properly. They include carbohydrates, proteins, and fats. Each macronutrient plays a crucial role in your health and well-being...', 'Learn about the three essential macronutrients and how they fuel your body for optimal health and performance.', 'Dr. Sarah Johnson', 'Basics', true),
('Age-Specific Nutrition: What Changes as We Grow', 'Nutritional needs vary significantly across different life stages. From infancy to old age, our bodies require different amounts and types of nutrients to support growth, development, and maintenance...', 'Discover how nutritional requirements change throughout life and what to focus on at each age.', 'Dr. Michael Chen', 'Age Groups', true),
('The Power of Micronutrients: Small but Mighty', 'While macronutrients get most of the attention, micronutrients - vitamins and minerals - are equally important for optimal health. These nutrients support everything from immune function to bone health...', 'Explore the vital role of vitamins and minerals in maintaining health and preventing disease.', 'Dr. Emily Rodriguez', 'Basics', true),
('Nutrition for Athletes: Fueling Performance', 'Athletic performance depends heavily on proper nutrition. Whether you are a weekend warrior or a professional athlete, understanding how to fuel your body can make a significant difference...', 'Learn how to optimize your nutrition for better athletic performance and faster recovery.', 'Dr. James Wilson', 'Sports', true)
ON CONFLICT DO NOTHING;

-- Insert sample recipes
INSERT INTO recipes (
  name, description, prep_time, cook_time, servings, difficulty, cuisine, dietary_tags, instructions,
  calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, 
  fiber_per_serving, sugar_per_serving, sodium_per_serving
) VALUES 
(
  'Grilled Chicken Salad',
  'A fresh and protein-rich salad with grilled chicken breast, mixed greens, and vegetables.',
  15, 10, 2, 'easy', 'American', '{"high-protein", "gluten-free"}',
  '{"Season chicken breast with salt, pepper, and herbs", "Grill chicken for 5-6 minutes per side until cooked through", "Let chicken rest for 5 minutes, then slice", "Combine mixed greens, cherry tomatoes, cucumber, and red onion in a large bowl", "Top with sliced chicken and your favorite dressing"}',
  320, 35, 12, 14, 6, 8, 280
),
(
  'Quinoa Buddha Bowl',
  'A nutritious bowl packed with quinoa, roasted vegetables, and tahini dressing.',
  20, 25, 2, 'medium', 'Mediterranean', '{"vegetarian", "vegan", "gluten-free"}',
  '{"Preheat oven to 400°F (200°C)", "Cook quinoa according to package instructions", "Dice sweet potato, bell peppers, and zucchini", "Toss vegetables with olive oil, salt, and pepper", "Roast vegetables for 20-25 minutes until tender", "Prepare tahini dressing by whisking tahini, lemon juice, water, and garlic", "Assemble bowls with quinoa, roasted vegetables, fresh greens, and dressing"}',
  420, 14, 58, 16, 10, 12, 320
),
(
  'Salmon with Steamed Broccoli',
  'Baked salmon fillet served with steamed broccoli and lemon.',
  10, 15, 1, 'easy', 'American', '{"high-protein", "omega-3", "gluten-free"}',
  '{"Preheat oven to 425°F (220°C)", "Season salmon with salt, pepper, and lemon juice", "Place salmon on parchment-lined baking sheet", "Bake for 12-15 minutes until fish flakes easily", "Steam broccoli for 5-7 minutes until tender-crisp", "Serve salmon with steamed broccoli and lemon wedges"}',
  380, 42, 8, 18, 4, 3, 220
)
ON CONFLICT DO NOTHING;

-- Insert sample recipe ingredients
INSERT INTO recipe_ingredients (recipe_id, food_item_id, quantity, unit, notes) VALUES
-- Grilled Chicken Salad (recipe_id: 1)
(1, 3, 150, 'grams', 'boneless, skinless breast'),
(1, 9, 100, 'grams', 'fresh spinach'),
(1, 5, 50, 'grams', 'florets'),

-- Quinoa Buddha Bowl (recipe_id: 2)  
(2, 8, 100, 'grams', 'dry quinoa'),
(2, 10, 150, 'grams', 'cubed'),
(2, 5, 100, 'grams', 'florets'),

-- Salmon with Steamed Broccoli (recipe_id: 3)
(3, 6, 120, 'grams', 'fillet'),
(3, 5, 150, 'grams', 'florets')
ON CONFLICT DO NOTHING;