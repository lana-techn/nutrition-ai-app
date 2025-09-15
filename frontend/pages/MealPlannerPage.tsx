import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Calendar, Target, Filter, Loader2, Clock, Users, Utensils, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { MealPlanRequest } from '~backend/nutrition/types';

export default function MealPlannerPage() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    targetCalories: '',
    targetProtein: '',
    targetCarbs: '',
    targetFat: '',
    daysCount: '7',
    difficulty: '',
    prepTimeLimit: '',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  const { toast } = useToast();

  const availableDietaryTags = [
    'vegetarian',
    'vegan', 
    'gluten-free',
    'high-protein',
    'low-carb',
    'high-fiber',
    'omega-3',
    'dairy-free',
    'nut-free',
    'low-sodium'
  ];

  const availableCuisines = [
    'American',
    'Mediterranean',
    'Asian',
    'Mexican',
    'Italian',
    'Indian',
    'Thai',
    'French',
    'Greek',
    'Japanese'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDietaryRestrictionToggle = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const handleCuisineToggle = (cuisine: string) => {
    setCuisinePreferences(prev => 
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.targetCalories) {
      toast({
        title: "Missing information",
        description: "Please enter your target calories.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      const request: MealPlanRequest = {
        targetCalories: parseInt(formData.targetCalories),
        targetProtein: formData.targetProtein ? parseFloat(formData.targetProtein) : undefined,
        targetCarbs: formData.targetCarbs ? parseFloat(formData.targetCarbs) : undefined,
        targetFat: formData.targetFat ? parseFloat(formData.targetFat) : undefined,
        dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
        cuisinePreferences: cuisinePreferences.length > 0 ? cuisinePreferences : undefined,
        difficulty: formData.difficulty || undefined,
        prepTimeLimit: formData.prepTimeLimit ? parseInt(formData.prepTimeLimit) : undefined,
        startDate: new Date(formData.startDate),
        daysCount: parseInt(formData.daysCount),
      };

      const result = await backend.nutrition.generateMealPlan(request);
      
      toast({
        title: "Meal plan generated!",
        description: "Your personalized meal plan is ready.",
      });

      // Navigate to the meal plan details page
      navigate(`/meal-plans/${result.mealPlan.id}`);
    } catch (error) {
      console.error('Meal plan generation error:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                AI Meal Planner
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Generate personalized weekly meal plans based on your nutrition goals, dietary preferences, and lifestyle
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <span>Nutrition Goals</span>
                  </CardTitle>
                  <CardDescription>
                    Set your daily nutrition targets for the meal plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="targetCalories">Target Calories *</Label>
                        <Input
                          id="targetCalories"
                          type="number"
                          min="1000"
                          max="5000"
                          value={formData.targetCalories}
                          onChange={(e) => handleInputChange('targetCalories', e.target.value)}
                          placeholder="2000"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetProtein">Target Protein (g)</Label>
                        <Input
                          id="targetProtein"
                          type="number"
                          min="30"
                          max="300"
                          value={formData.targetProtein}
                          onChange={(e) => handleInputChange('targetProtein', e.target.value)}
                          placeholder="120"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="targetCarbs">Target Carbs (g)</Label>
                        <Input
                          id="targetCarbs"
                          type="number"
                          min="50"
                          max="500"
                          value={formData.targetCarbs}
                          onChange={(e) => handleInputChange('targetCarbs', e.target.value)}
                          placeholder="250"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetFat">Target Fat (g)</Label>
                        <Input
                          id="targetFat"
                          type="number"
                          min="20"
                          max="200"
                          value={formData.targetFat}
                          onChange={(e) => handleInputChange('targetFat', e.target.value)}
                          placeholder="65"
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <span>Plan Duration & Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Configure your meal plan timeline and cooking preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="daysCount">Number of Days</Label>
                      <Select onValueChange={(value) => handleInputChange('daysCount', value)} defaultValue="7">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="5">5 days</SelectItem>
                          <SelectItem value="7">7 days (1 week)</SelectItem>
                          <SelectItem value="14">14 days (2 weeks)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cooking Difficulty</Label>
                      <Select onValueChange={(value) => handleInputChange('difficulty', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prepTimeLimit">Max Prep Time (minutes)</Label>
                      <Input
                        id="prepTimeLimit"
                        type="number"
                        min="5"
                        max="180"
                        value={formData.prepTimeLimit}
                        onChange={(e) => handleInputChange('prepTimeLimit', e.target.value)}
                        placeholder="60"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-orange-600" />
                    <span>Dietary Restrictions</span>
                  </CardTitle>
                  <CardDescription>
                    Select any dietary restrictions or preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableDietaryTags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag}
                          checked={dietaryRestrictions.includes(tag)}
                          onCheckedChange={() => handleDietaryRestrictionToggle(tag)}
                        />
                        <Label
                          htmlFor={tag}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                        >
                          {tag.replace('-', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Utensils className="h-5 w-5 text-orange-600" />
                    <span>Cuisine Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred cuisines (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableCuisines.map((cuisine) => (
                      <div key={cuisine} className="flex items-center space-x-2">
                        <Checkbox
                          id={cuisine}
                          checked={cuisinePreferences.includes(cuisine)}
                          onCheckedChange={() => handleCuisineToggle(cuisine)}
                        />
                        <Label
                          htmlFor={cuisine}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {cuisine}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleSubmit}
                disabled={isGenerating || !formData.targetCalories}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-lg font-semibold"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                    Generating Your Meal Plan...
                  </>
                ) : (
                  <>
                    <ChefHat className="h-5 w-5 mr-3" />
                    Generate Meal Plan
                  </>
                )}
              </Button>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-amber-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-orange-600" />
                    <span>What's Included</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-orange-800">Complete Meal Plans</p>
                      <p className="text-sm text-orange-600">Breakfast, lunch, and dinner for each day</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-orange-800">Detailed Recipes</p>
                      <p className="text-sm text-orange-600">Step-by-step cooking instructions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-orange-800">Nutrition Analysis</p>
                      <p className="text-sm text-orange-600">Complete nutritional breakdown per meal</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-orange-800">Shopping Lists</p>
                      <p className="text-sm text-orange-600">Organized ingredient lists for easy shopping</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Time Estimates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Generation:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      ~30 seconds
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Avg prep time:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      15-45 min
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Planning period:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      3-14 days
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span>Meal Planning Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-green-700">
                  <p>• Set realistic calorie goals based on your activity level</p>
                  <p>• Include variety in cuisines for better nutrient diversity</p>
                  <p>• Consider your cooking schedule when setting prep time limits</p>
                  <p>• Review recipes before shopping to ensure you have necessary equipment</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
