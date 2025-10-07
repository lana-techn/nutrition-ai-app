'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Search, Calendar, User, Tag, TrendingUp, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BlogPost } from '@/lib/types';

const CATEGORIES = [
  'Weight Loss', 'Muscle Building', 'Heart Health', 'Mental Health',
  'Diabetes', 'Vegetarian', 'Supplements', 'Meal Planning', 'Sports Nutrition'
];

const FEATURED_POSTS = [
  {
    id: 1,
    title: '10 Science-Based Ways to Boost Your Metabolism',
    excerpt: 'Discover proven strategies to naturally increase your metabolic rate and burn more calories throughout the day.',
    category: 'Weight Loss',
    readTime: 8
  },
  {
    id: 2,
    title: 'Complete Guide to Plant-Based Protein Sources',
    excerpt: 'Everything you need to know about getting adequate protein on a vegetarian or vegan diet.',
    category: 'Vegetarian',
    readTime: 12
  },
  {
    id: 3,
    title: 'Mediterranean Diet: A Heart-Healthy Eating Plan',
    excerpt: 'Learn how the Mediterranean diet can reduce your risk of heart disease and improve overall health.',
    category: 'Heart Health',
    readTime: 10
  }
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/nutrition/blog');
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        setPosts(Array.isArray(data) ? data : mockPosts);
      } else {
        // Fallback to mock data if API fails
        setPosts(mockPosts);
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    // Ensure posts is always an array
    if (!Array.isArray(posts)) {
      setFilteredPosts([]);
      return;
    }

    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  };

  const getReadingTime = (content: string) => {
    if (!content || typeof content !== 'string') {
      return 5; // Default reading time
    }
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center shadow-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Star className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
            Nutrition Blog
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Evidence-based nutrition articles written by certified professionals. 
            Stay updated with the latest research and practical tips for healthy living.
          </p>
        </div>

        {/* Featured Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_POSTS.map((post) => (
              <Card key={post.id} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                <div className="h-48 bg-gradient-to-br from-teal-100 to-green-100 rounded-t-lg flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-teal-400 group-hover:text-teal-600 transition-colors" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-1 text-slate-500 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-64">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-slate-300 focus:border-teal-500 focus:ring-teal-500">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedCategory) && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="whitespace-nowrap"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            Showing <span className="font-semibold">{filteredPosts.length}</span> articles
            {searchTerm && (
              <span> for "<span className="font-semibold">{searchTerm}</span>"</span>
            )}
            {selectedCategory && (
              <span> in <span className="font-semibold">{selectedCategory}</span></span>
            )}
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg animate-pulse">
                <div className="h-48 bg-slate-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded mb-4"></div>
                  <div className="flex items-center space-x-4">
                    <div className="h-3 bg-slate-200 rounded w-20"></div>
                    <div className="h-3 bg-slate-200 rounded w-24"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">No articles found</h3>
            <p className="text-slate-500 mb-6">
              Try adjusting your search terms or browse all categories.
            </p>
            <Button onClick={clearFilters} className="bg-teal-500 hover:bg-teal-600 text-white">
              View All Articles
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group overflow-hidden bg-white h-full">
                  <div className="relative h-48 overflow-hidden">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-100 to-green-100 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-teal-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{getReadingTime(post.content)} min read</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-20">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-teal-500 to-green-500">
            <CardContent className="p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <TrendingUp className="h-16 w-16 text-white mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-4">Stay Updated</h3>
                <p className="text-teal-100 text-lg mb-8 leading-relaxed">
                  Get the latest nutrition tips, research updates, and healthy recipes delivered straight to your inbox every week.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white border-0 focus:ring-2 focus:ring-white flex-1"
                  />
                  <Button className="bg-white text-teal-600 hover:bg-teal-50 font-semibold px-8">
                    Subscribe
                  </Button>
                </div>
                <p className="text-teal-100 text-sm mt-4">
                  Join 10,000+ health-conscious individuals. Unsubscribe anytime.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Mock data for testing
const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: '10 Science-Based Ways to Boost Your Metabolism',
    content: `Metabolism is the process by which your body converts what you eat and drink into energy. During this complex biochemical process, calories in food and beverages are combined with oxygen to release the energy your body needs to function.

Even when you're at rest, your body needs energy for all its "hidden" functions, such as breathing, circulating blood, adjusting hormone levels, and growing and repairing cells. The number of calories your body uses to carry out these basic functions is known as your basal metabolic rate — what you might call metabolism.

Several factors determine your individual basal metabolic rate:
- Your body size and composition
- Your sex
- Your age

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
Sitting too much is bad for your health. Some health commentators have even dubbed it "the new smoking." This is partly because long periods of sitting burn fewer calories and can lead to weight gain.`,
    excerpt: 'Discover proven strategies to naturally increase your metabolic rate and burn more calories throughout the day.',
    author: 'Dr. Sarah Johnson',
    category: 'Weight Loss',
    imageUrl: null,
    published: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    title: 'Complete Guide to Plant-Based Protein Sources',
    content: `Getting enough protein on a plant-based diet is easier than you might think. While animal products are complete proteins containing all essential amino acids, many plant foods also provide high-quality protein.

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

5. **Nutritional Yeast (8g protein per 2 tablespoons)**
   - Cheesy flavor makes it great for sauces
   - Rich in B-vitamins
   - Excellent on popcorn and pasta

**Daily Protein Needs:**
Most adults need about 0.8 grams of protein per kilogram of body weight. For a 154-pound (70kg) person, that's about 56 grams per day.

**Sample Day of Plant Proteins:**
- Breakfast: Oatmeal with almond butter and chia seeds (15g)
- Lunch: Quinoa lentil salad (20g)  
- Snack: Hummus with veggies (8g)
- Dinner: Tofu stir-fry with edamame (25g)
- Total: 68g protein

With proper planning, a plant-based diet can easily meet and exceed protein requirements while providing numerous health benefits.`,
    excerpt: 'Everything you need to know about getting adequate protein on a vegetarian or vegan diet.',
    author: 'Dr. Michael Chen',
    category: 'Vegetarian',
    imageUrl: null,
    published: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 3,
    title: 'Mediterranean Diet: A Heart-Healthy Eating Plan',
    content: `The Mediterranean diet is based on the traditional eating patterns of countries bordering the Mediterranean Sea. Numerous studies have shown that following this eating pattern can lead to weight loss and help prevent heart attacks, strokes, type 2 diabetes and premature death.

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

4. **Moderate Poultry and Eggs**
   - Include chicken, turkey, and eggs in moderation
   - Focus on free-range and organic options

5. **Limited Red Meat**
   - Consume red meat only a few times per month
   - Choose grass-fed, lean cuts when you do

6. **Dairy in Moderation**
   - Small amounts of cheese and yogurt
   - Choose full-fat, minimally processed options

7. **Red Wine (Optional)**
   - One glass per day for women, two for men
   - Only if you already consume alcohol
   - Always with meals

**Health Benefits:**

- **Heart Health**: Reduces risk of heart disease by up to 30%
- **Brain Function**: May protect against cognitive decline
- **Cancer Prevention**: Antioxidants help fight inflammation
- **Weight Management**: Sustainable approach to healthy weight
- **Diabetes**: Improves blood sugar control
- **Longevity**: Associated with increased lifespan

**Getting Started:**

1. Replace butter with olive oil
2. Eat fish twice per week
3. Fill half your plate with vegetables
4. Choose whole grains over refined
5. Snack on nuts instead of processed foods
6. Use herbs and spices instead of salt

The Mediterranean diet isn't just about food—it's a lifestyle that includes regular physical activity, sharing meals with others, and savoring the eating experience.`,
    excerpt: 'Learn how the Mediterranean diet can reduce your risk of heart disease and improve overall health.',
    author: 'Dr. Elena Rodriguez',
    category: 'Heart Health',
    imageUrl: null,
    published: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 4,
    title: 'The Role of Omega-3 Fatty Acids in Brain Health',
    content: `Omega-3 fatty acids are essential fats that play crucial roles in brain function and development. Your body can't produce these fats on its own, so you must get them through your diet or supplements.

**Types of Omega-3s:**

1. **EPA (Eicosapentaenoic Acid)**
   - Found primarily in fish
   - Anti-inflammatory properties
   - Supports mood and behavior

2. **DHA (Docosahexaenoic Acid)**
   - Critical for brain development
   - Makes up 8% of brain weight
   - Essential for cognitive function

3. **ALA (Alpha-Linolenic Acid)**
   - Found in plant sources
   - Body converts small amounts to EPA and DHA
   - Good for those following plant-based diets

**Brain Health Benefits:**

- **Memory and Learning**: DHA is crucial for memory formation
- **Mood Regulation**: EPA helps reduce symptoms of depression
- **Cognitive Protection**: May slow age-related cognitive decline
- **Focus and Attention**: Supports ADHD symptom management
- **Brain Development**: Essential during pregnancy and early childhood

**Best Food Sources:**

1. **Fatty Fish** (highest EPA and DHA)
   - Salmon, mackerel, sardines, anchovies
   - Aim for 2-3 servings per week

2. **Plant Sources** (ALA)
   - Flaxseeds, chia seeds, walnuts
   - Algae-based supplements for vegans

3. **Fortified Foods**
   - Omega-3 enriched eggs
   - Fortified milk and yogurt

**Supplementation:**
If you don't eat fish regularly, consider a high-quality omega-3 supplement. Look for products that provide at least 500mg of EPA and DHA combined.

The research is clear: adequate omega-3 intake is essential for optimal brain health throughout all stages of life.`,
    excerpt: 'Discover how omega-3 fatty acids support brain function, memory, and cognitive health.',
    author: 'Dr. James Wilson',
    category: 'Mental Health',
    imageUrl: null,
    published: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  }
];