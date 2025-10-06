-- Seed data for nutrition-ai-app

-- Insert sample food items
INSERT INTO food_items (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sugar_per_100g, sodium_per_100g) VALUES
-- Proteins
('Chicken Breast (skinless)', 165, 31, 0, 3.6, 0, 0, 74),
('Salmon (Atlantic, farmed)', 208, 25.4, 0, 12.4, 0, 0, 44),
('Greek Yogurt (plain, 2%)', 97, 9, 6, 4, 0, 6, 36),
('Eggs (large)', 155, 13, 1.1, 11, 0, 1.1, 124),
('Tofu (firm)', 144, 15.8, 4.3, 8.7, 2.3, 2.7, 9),
('Quinoa (cooked)', 120, 4.4, 22, 1.9, 2.8, 0.9, 7),

-- Vegetables
('Broccoli (raw)', 25, 3, 5, 0.4, 2.3, 1.5, 41),
('Spinach (raw)', 23, 2.9, 3.6, 0.4, 2.2, 0.4, 79),
('Sweet Potato (baked)', 90, 2, 21, 0.1, 3.3, 6.8, 7),
('Avocado', 160, 2, 9, 15, 7, 0.7, 7),
('Bell Pepper (red)', 26, 1, 6, 0.2, 2.5, 4.2, 4),
('Kale (raw)', 35, 2.9, 4.4, 1.5, 4.1, 0.8, 53),

-- Fruits
('Banana', 89, 1.1, 23, 0.3, 2.6, 12, 1),
('Apple (with skin)', 52, 0.3, 14, 0.2, 2.4, 10, 1),
('Blueberries', 57, 0.7, 14, 0.3, 2.4, 10, 1),
('Orange', 43, 1.2, 9, 0.2, 2.8, 8.2, 13),

-- Grains and Legumes
('Brown Rice (cooked)', 112, 2.6, 23, 0.9, 1.8, 0.4, 10),
('Oats (rolled, dry)', 389, 17, 66, 7, 11, 1, 2),
('Lentils (cooked)', 116, 9, 20, 0.4, 7.9, 1.8, 238),
('Chickpeas (cooked)', 164, 8, 27, 2.6, 7.6, 4.8, 244),
('Black Beans (cooked)', 132, 8.9, 24, 0.5, 8.7, 0.3, 244),

-- Nuts and Seeds
('Almonds', 579, 21, 22, 50, 12, 4.4, 1),
('Walnuts', 654, 15, 14, 65, 6.7, 2.6, 2),
('Chia Seeds', 486, 17, 42, 31, 34, 0, 16),
('Pumpkin Seeds', 559, 19, 54, 19, 18, 1.4, 18),

-- Dairy and Alternatives
('Milk (2%)', 50, 3.3, 4.8, 2, 0, 4.8, 44),
('Cheddar Cheese', 403, 25, 1.3, 33, 0, 0.5, 653),
('Almond Milk (unsweetened)', 17, 0.6, 1.5, 1.2, 0.4, 0, 63),

-- Oils and Fats
('Olive Oil (extra virgin)', 884, 0, 0, 100, 0, 0, 2),
('Coconut Oil', 862, 0, 0, 100, 0, 0, 0);

-- Insert sample recipes
INSERT INTO recipes (name, description, prep_time, cook_time, servings, difficulty, cuisine, dietary_tags, instructions, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, fiber_per_serving, sugar_per_serving, sodium_per_serving) VALUES
-- Breakfast Recipes
('Mediterranean Breakfast Bowl', 'A nutritious bowl with Greek yogurt, fresh fruits, nuts, and a drizzle of honey', 10, 0, 2, 'easy', 'Mediterranean', 
 ARRAY['Vegetarian', 'Gluten-Free', 'High-Protein'], 
 ARRAY['Add Greek yogurt to bowls', 'Top with mixed berries and sliced banana', 'Sprinkle with chopped almonds and chia seeds', 'Drizzle with honey if desired'],
 320, 18, 35, 12, 8, 25, 65),

('Avocado Toast with Poached Egg', 'Creamy avocado on whole grain toast topped with a perfectly poached egg', 5, 10, 2, 'medium', 'American',
 ARRAY['Vegetarian', 'High-Protein'],
 ARRAY['Toast whole grain bread slices', 'Mash avocado with lemon juice and seasoning', 'Poach eggs in simmering water', 'Spread avocado on toast', 'Top with poached egg and season'],
 380, 18, 28, 22, 12, 3, 420),

-- Lunch Recipes
('Quinoa Power Bowl', 'Protein-packed bowl with quinoa, roasted vegetables, and tahini dressing', 20, 25, 4, 'medium', 'Mediterranean',
 ARRAY['Vegan', 'Vegetarian', 'Gluten-Free', 'High-Protein'],
 ARRAY['Cook quinoa according to package directions', 'Roast sweet potato and bell peppers at 400°F for 20 min', 'Massage kale with lemon juice', 'Prepare tahini dressing', 'Assemble bowl with all ingredients'],
 450, 16, 62, 18, 11, 12, 280),

('Grilled Chicken Caesar Salad', 'Classic Caesar salad with grilled chicken breast and homemade croutons', 15, 15, 2, 'medium', 'Italian',
 ARRAY['High-Protein', 'Low-Carb'],
 ARRAY['Season and grill chicken breast', 'Make croutons from whole grain bread', 'Prepare Caesar dressing', 'Chop romaine lettuce', 'Assemble salad with all components'],
 420, 35, 18, 25, 4, 3, 580),

-- Dinner Recipes
('Baked Salmon with Roasted Vegetables', 'Heart-healthy salmon fillet with colorful roasted vegetables', 15, 25, 4, 'easy', 'American',
 ARRAY['Gluten-Free', 'High-Protein', 'Heart-Healthy', 'Keto'],
 ARRAY['Preheat oven to 425°F', 'Season salmon fillets with herbs and lemon', 'Toss vegetables with olive oil and seasoning', 'Arrange on baking sheet and roast for 20-25 minutes', 'Serve immediately'],
 480, 42, 12, 28, 4, 8, 320),

('Lentil Curry with Brown Rice', 'Warming and protein-rich lentil curry with aromatic spices', 15, 30, 6, 'medium', 'Indian',
 ARRAY['Vegan', 'Vegetarian', 'High-Protein', 'Gluten-Free'],
 ARRAY['Sauté onion, garlic, and ginger with spices', 'Add lentils, coconut milk, and tomatoes', 'Simmer for 20-25 minutes until lentils are tender', 'Cook brown rice separately', 'Serve curry over rice with fresh cilantro'],
 420, 18, 65, 8, 12, 8, 380),

('Mediterranean Stuffed Bell Peppers', 'Colorful bell peppers stuffed with quinoa, vegetables, and feta cheese', 20, 35, 4, 'medium', 'Mediterranean',
 ARRAY['Vegetarian', 'Gluten-Free', 'Mediterranean'],
 ARRAY['Cut tops off bell peppers and remove seeds', 'Cook quinoa with vegetable broth', 'Sauté onion, garlic, and zucchini', 'Mix quinoa with vegetables and feta', 'Stuff peppers and bake at 375°F for 30-35 minutes'],
 350, 14, 48, 12, 8, 12, 450),

-- Snack Recipes
('Energy Balls', 'No-bake energy balls with dates, nuts, and cocoa', 15, 0, 12, 'easy', 'American',
 ARRAY['Vegan', 'Vegetarian', 'Gluten-Free', 'No-Bake'],
 ARRAY['Pit and soak dates in warm water', 'Blend dates, almonds, and cocoa powder in food processor', 'Roll mixture into balls', 'Chill for 30 minutes before serving'],
 120, 4, 18, 5, 3, 14, 2),

('Greek Yogurt Berry Parfait', 'Layered parfait with Greek yogurt, berries, and granola', 5, 0, 2, 'easy', 'American',
 ARRAY['Vegetarian', 'High-Protein'],
 ARRAY['Layer Greek yogurt in glasses', 'Add mixed berries', 'Top with granola', 'Repeat layers', 'Serve immediately'],
 280, 20, 32, 8, 4, 22, 85);

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, author, category, published) VALUES
('10 Science-Based Ways to Boost Your Metabolism', 
'Metabolism is the process by which your body converts what you eat and drink into energy. During this complex biochemical process, calories in food and beverages are combined with oxygen to release the energy your body needs to function.

Even when you''re at rest, your body needs energy for all its "hidden" functions, such as breathing, circulating blood, adjusting hormone levels, and growing and repairing cells. The number of calories your body uses to carry out these basic functions is known as your basal metabolic rate — what you might call metabolism.

Here are 10 evidence-based ways to boost your metabolism naturally:

1. **Eat More Protein at Every Meal**
Eating food can temporarily increase your metabolism for a few hours. This effect varies among different macronutrients, with protein causing the largest rise in the thermic effect of food (TEF).

2. **Drink More Cold Water**
People who drink water instead of sugary drinks are more successful at losing weight and keeping it off. This is because sugary drinks contain calories, so replacing them with water automatically reduces your calorie intake.

3. **Do a High-Intensity Workout**
High-intensity interval training (HIIT) involves quick and very intense bursts of activity. It can help you burn more fat by increasing your metabolic rate, even after your workout has finished.

4. **Lift Heavy Things**
Muscle is more metabolically active than fat, meaning it burns more calories at rest. Resistance training helps prevent the drop in metabolism that can occur during weight loss.

5. **Stand Up More**
Sitting too much is bad for your health. Some health commentators have even dubbed it "the new smoking." This is partly because long periods of sitting burn fewer calories and can lead to weight gain.',
'Discover proven strategies to naturally increase your metabolic rate and burn more calories throughout the day.',
'Dr. Sarah Johnson', 'Weight Loss', true),

('Complete Guide to Plant-Based Protein Sources',
'Getting enough protein on a plant-based diet is easier than you might think. While animal products are complete proteins containing all essential amino acids, many plant foods also provide high-quality protein.

The key is eating a variety of protein-rich plants throughout the day to ensure you get all essential amino acids your body needs.

**Top Plant-Based Protein Sources:**

1. **Legumes (15-18g protein per cup cooked)**
   - Lentils, chickpeas, black beans, kidney beans
   - Versatile and fiber-rich
   - Great in soups, salads, and main dishes

2. **Quinoa (8g protein per cup cooked)**
   - Complete protein containing all amino acids
   - Gluten-free grain alternative
   - Perfect for bowls and salads

3. **Tofu and Tempeh (10-20g protein per 3oz)**
   - Made from soybeans
   - Highly versatile and absorbs flavors well
   - Great meat substitute in many dishes

4. **Nuts and Seeds (4-8g protein per ounce)**
   - Hemp seeds, chia seeds, almonds, pumpkin seeds
   - Also provide healthy fats
   - Perfect for snacks and smoothies

**Daily Protein Needs:**
Most adults need about 0.8 grams of protein per kilogram of body weight. For a 154-pound (70kg) person, that''s about 56 grams per day.

With proper planning, a plant-based diet can easily meet and exceed protein requirements while providing numerous health benefits.',
'Everything you need to know about getting adequate protein on a vegetarian or vegan diet.',
'Dr. Michael Chen', 'Vegetarian', true),

('The Mediterranean Diet: A Heart-Healthy Lifestyle',
'The Mediterranean diet is based on the traditional eating patterns of countries bordering the Mediterranean Sea. Numerous studies have shown that following this eating pattern can lead to weight loss and help prevent heart attacks, strokes, type 2 diabetes and premature death.

**Key Components of the Mediterranean Diet:**

1. **Abundant Plant Foods**
   - Fresh fruits and vegetables
   - Whole grains, nuts, and legumes
   - These should make up the majority of your meals

2. **Olive Oil as Primary Fat**
   - Rich in monounsaturated fats
   - Contains antioxidants and anti-inflammatory compounds
   - Use extra virgin olive oil for maximum benefits

3. **Fish and Seafood**
   - Consume at least twice per week
   - Rich in omega-3 fatty acids
   - Choose wild-caught when possible

**Health Benefits:**
- Heart Health: Reduces risk of heart disease by up to 30%
- Brain Function: May protect against cognitive decline
- Cancer Prevention: Antioxidants help fight inflammation
- Weight Management: Sustainable approach to healthy weight

The Mediterranean diet isn''t just about food—it''s a lifestyle that includes regular physical activity, sharing meals with others, and savoring the eating experience.',
'Learn how the Mediterranean diet can reduce your risk of heart disease and improve overall health.',
'Dr. Elena Rodriguez', 'Heart Health', true),

('Understanding Macronutrients: Your Complete Guide',
'Macronutrients are the nutrients your body needs in large amounts to function properly. They provide energy (calories) and are essential for growth, metabolism, and other bodily functions.

The three main macronutrients are:

**Carbohydrates (4 calories per gram)**
- Primary source of energy for your brain and muscles
- Found in fruits, vegetables, grains, and legumes
- Aim for complex carbs over simple sugars

**Proteins (4 calories per gram)**
- Essential for muscle repair and growth
- Found in meat, fish, dairy, legumes, and nuts
- Need all essential amino acids daily

**Fats (9 calories per gram)**
- Important for hormone production and nutrient absorption
- Found in oils, nuts, seeds, and fatty fish
- Focus on unsaturated fats for heart health

Understanding the right balance of macronutrients can help you achieve your health and fitness goals more effectively.',
'Learn about the three macronutrients and how to balance them for optimal health and performance.',
'Dr. James Wilson', 'Meal Planning', true),

('Hydration: The Often Overlooked Pillar of Health',
'Water makes up about 60% of your body weight and is essential for nearly every bodily function. Despite its importance, many people don''t drink enough water throughout the day.

**Why Hydration Matters:**
- Regulates body temperature
- Lubricates joints
- Transports nutrients to cells
- Removes waste products
- Supports cognitive function

**Signs of Dehydration:**
- Thirst (a late indicator)
- Dark yellow urine
- Fatigue and dizziness
- Headaches
- Dry mouth and skin

**How Much Water Do You Need?**
The general recommendation is 8 glasses (64 ounces) per day, but individual needs vary based on:
- Activity level
- Climate
- Overall health
- Pregnancy or breastfeeding

**Tips for Better Hydration:**
1. Start your day with a glass of water
2. Keep a water bottle with you
3. Eat water-rich foods like fruits and vegetables
4. Set reminders to drink water
5. Monitor your urine color

Remember, proper hydration is one of the simplest yet most effective ways to support your overall health and well-being.',
'Discover why proper hydration is crucial for your health and learn practical tips to stay well-hydrated.',
'Dr. Lisa Park', 'Mental Health', true);

-- Create sample users for testing
INSERT INTO users (name, email, age, weight, height, activity_level, dietary_preferences) VALUES
('John Doe', 'john@example.com', 28, 75.5, 180, 'moderately-active', 'No restrictions'),
('Jane Smith', 'jane@example.com', 32, 62.3, 165, 'lightly-active', 'Vegetarian'),
('Mike Johnson', 'mike@example.com', 35, 82.1, 175, 'very-active', 'High-protein'),
('Sarah Wilson', 'sarah@example.com', 26, 58.7, 160, 'moderately-active', 'Gluten-free');

-- Create recipe ingredients relationships
INSERT INTO recipe_ingredients (recipe_id, food_item_id, quantity, unit, notes) VALUES
-- Mediterranean Breakfast Bowl ingredients
(1, 3, 150, 'g', 'Greek yogurt base'),
(1, 15, 100, 'g', 'Mixed berries'),
(1, 13, 1, 'medium', 'Sliced banana'),
(1, 21, 20, 'g', 'Chopped almonds'),
(1, 23, 10, 'g', 'Chia seeds'),

-- Avocado Toast ingredients  
(2, 10, 100, 'g', 'Mashed avocado'),
(2, 4, 2, 'large', 'Poached eggs'),

-- Quinoa Power Bowl ingredients
(3, 6, 100, 'g', 'Cooked quinoa'),
(3, 9, 150, 'g', 'Roasted sweet potato'),
(3, 11, 100, 'g', 'Bell peppers'),
(3, 12, 80, 'g', 'Massaged kale'),

-- Add more recipe ingredients for other recipes as needed
(4, 1, 150, 'g', 'Grilled chicken breast'),
(5, 2, 150, 'g', 'Salmon fillet'),
(5, 7, 200, 'g', 'Broccoli'),
(6, 19, 200, 'g', 'Cooked lentils'),
(6, 17, 150, 'g', 'Brown rice');

COMMIT;