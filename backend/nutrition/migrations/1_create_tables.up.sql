CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INTEGER NOT NULL,
  weight DOUBLE PRECISION,
  height DOUBLE PRECISION,
  activity_level TEXT,
  dietary_preferences TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE food_items (
  id BIGSERIAL PRIMARY KEY,
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

CREATE TABLE nutrition_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  food_item_id BIGINT REFERENCES food_items(id),
  quantity_grams DOUBLE PRECISION NOT NULL,
  meal_type TEXT NOT NULL, -- breakfast, lunch, dinner, snack
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
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

CREATE TABLE food_analysis (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  image_url TEXT NOT NULL,
  analysis_result TEXT NOT NULL, -- JSON string with AI analysis
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
('Sweet Potato', 86, 1.6, 20, 0.1, 3, 4.2, 5);

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, author, category, published) VALUES
('Understanding Macronutrients: A Complete Guide', 'Macronutrients are the nutrients your body needs in large amounts to function properly. They include carbohydrates, proteins, and fats. Each macronutrient plays a crucial role in your health and well-being...', 'Learn about the three essential macronutrients and how they fuel your body for optimal health and performance.', 'Dr. Sarah Johnson', 'Basics', true),
('Age-Specific Nutrition: What Changes as We Grow', 'Nutritional needs vary significantly across different life stages. From infancy to old age, our bodies require different amounts and types of nutrients to support growth, development, and maintenance...', 'Discover how nutritional requirements change throughout life and what to focus on at each age.', 'Dr. Michael Chen', 'Age Groups', true),
('The Power of Micronutrients: Small but Mighty', 'While macronutrients get most of the attention, micronutrients - vitamins and minerals - are equally important for optimal health. These nutrients support everything from immune function to bone health...', 'Explore the vital role of vitamins and minerals in maintaining health and preventing disease.', 'Dr. Emily Rodriguez', 'Basics', true),
('Nutrition for Athletes: Fueling Performance', 'Athletic performance depends heavily on proper nutrition. Whether you are a weekend warrior or a professional athlete, understanding how to fuel your body can make a significant difference...', 'Learn how to optimize your nutrition for better athletic performance and faster recovery.', 'Dr. James Wilson', 'Sports', true);
