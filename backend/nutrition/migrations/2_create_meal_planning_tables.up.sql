-- Recipes table
CREATE TABLE recipes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  prep_time INTEGER NOT NULL, -- minutes
  cook_time INTEGER NOT NULL, -- minutes
  servings INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  cuisine TEXT NOT NULL,
  dietary_tags TEXT[] DEFAULT '{}', -- vegetarian, vegan, gluten-free, etc.
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

-- Recipe ingredients
CREATE TABLE recipe_ingredients (
  id BIGSERIAL PRIMARY KEY,
  recipe_id BIGINT REFERENCES recipes(id) ON DELETE CASCADE,
  food_item_id BIGINT REFERENCES food_items(id),
  quantity DOUBLE PRECISION NOT NULL,
  unit TEXT NOT NULL, -- grams, cups, tbsp, etc.
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meal plans
CREATE TABLE meal_plans (
  id BIGSERIAL PRIMARY KEY,
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

-- Meal plan entries
CREATE TABLE meal_plan_entries (
  id BIGSERIAL PRIMARY KEY,
  meal_plan_id BIGINT REFERENCES meal_plans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_id BIGINT REFERENCES recipes(id),
  servings DOUBLE PRECISION NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
),
(
  'Greek Yogurt Parfait',
  'Layered parfait with Greek yogurt, berries, and granola.',
  5, 0, 1, 'easy', 'Mediterranean', '{"vegetarian", "high-protein"}',
  '{"In a glass or bowl, layer half the Greek yogurt", "Add half the mixed berries", "Sprinkle with half the granola", "Repeat layers", "Top with a drizzle of honey if desired"}',
  240, 18, 32, 6, 5, 22, 85
),
(
  'Vegetable Stir-Fry',
  'Quick and colorful stir-fry with mixed vegetables and brown rice.',
  15, 10, 2, 'easy', 'Asian', '{"vegetarian", "vegan"}',
  '{"Cook brown rice according to package instructions", "Heat oil in a large wok or skillet over high heat", "Add garlic and ginger, stir-fry for 30 seconds", "Add harder vegetables first (carrots, bell peppers)", "Stir-fry for 2-3 minutes, then add softer vegetables", "Add soy sauce and sesame oil", "Serve over brown rice"}',
  280, 8, 52, 6, 8, 10, 480
),
(
  'Turkey and Avocado Wrap',
  'Healthy wrap with sliced turkey, avocado, and fresh vegetables.',
  10, 0, 1, 'easy', 'American', '{"high-protein"}',
  '{"Lay tortilla flat on a clean surface", "Spread mashed avocado evenly over tortilla", "Layer turkey slices, lettuce, tomato, and cucumber", "Season with salt and pepper", "Roll tightly, tucking in sides", "Cut in half to serve"}',
  350, 28, 24, 18, 8, 4, 620
),
(
  'Lentil Soup',
  'Hearty and nutritious soup with red lentils and vegetables.',
  15, 30, 4, 'medium', 'Mediterranean', '{"vegetarian", "vegan", "high-fiber"}',
  '{"Heat olive oil in a large pot over medium heat", "Sauté onion, carrots, and celery until softened", "Add garlic, cumin, and paprika, cook for 1 minute", "Add lentils, broth, and diced tomatoes", "Bring to a boil, then simmer for 25-30 minutes", "Season with salt, pepper, and lemon juice", "Garnish with fresh herbs"}',
  220, 12, 38, 3, 15, 6, 380
),
(
  'Overnight Oats',
  'Easy make-ahead breakfast with oats, milk, and toppings.',
  5, 0, 1, 'easy', 'American', '{"vegetarian"}',
  '{"Combine oats, milk, chia seeds, and vanilla in a jar", "Add maple syrup or honey to taste", "Stir well and refrigerate overnight", "In the morning, top with fresh berries and nuts", "Enjoy cold or warm up if desired"}',
  310, 12, 45, 8, 10, 15, 120
);

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
(3, 5, 150, 'grams', 'florets'),

-- Greek Yogurt Parfait (recipe_id: 4)
(4, 7, 150, 'grams', 'plain'),
(4, 2, 80, 'grams', 'fresh'),

-- Vegetable Stir-Fry (recipe_id: 5)
(5, 4, 100, 'grams', 'cooked'),
(5, 5, 100, 'grams', 'florets'),

-- Turkey and Avocado Wrap (recipe_id: 6)
(6, 9, 50, 'grams', 'leaves'),

-- Lentil Soup (recipe_id: 7)
(7, 5, 100, 'grams', 'florets'),

-- Overnight Oats (recipe_id: 8)
(8, 2, 50, 'grams', 'fresh berries');
