'use client';

import { useState } from 'react';
import { Target, User, Activity, Scale, Ruler, Calendar, Zap, TrendingUp, Award, Heart, Utensils, Edit2, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { NutritionRecommendation } from '@/lib/types';

interface UserProfile {
  age: number;
  gender: 'male' | 'female' | '';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extra-active' | '';
  goal: 'lose-weight' | 'maintain-weight' | 'gain-weight' | 'build-muscle' | '';
  dietaryRestrictions: string[];
  healthConditions: string[];
}

const initialProfile: UserProfile = {
  age: 0,
  gender: '',
  weight: 0,
  height: 0,
  activityLevel: '',
  goal: '',
  dietaryRestrictions: [],
  healthConditions: []
};

const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Lactose-Free', 'Nut-Free', 
  'Keto', 'Low-Carb', 'Low-Sodium', 'Diabetic-Friendly', 'Heart-Healthy'
];

const HEALTH_CONDITIONS = [
  'Diabetes Type 2', 'High Blood Pressure', 'High Cholesterol', 
  'Heart Disease', 'Thyroid Issues', 'PCOS', 'Food Allergies', 
  'Digestive Issues', 'Arthritis', 'None'
];

export default function RecommendationsPage() {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [recommendations, setRecommendations] = useState<NutritionRecommendation | null>(null);
  const [loading, setLoading] = useState(false);

  const updateProfile = (key: keyof UserProfile, value: string | number | string[]) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = (key: 'dietaryRestrictions' | 'healthConditions', value: string) => {
    setProfile(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const calculateBMI = () => {
    if (profile.weight && profile.height) {
      const heightInMeters = profile.height / 100;
      return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-info bg-info/10 border-info/20' };
    if (bmi < 25) return { category: 'Normal', color: 'text-success bg-success/10 border-success/20' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-warning bg-warning/10 border-warning/20' };
    return { category: 'Obese', color: 'text-error bg-error/10 border-error/20' };
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/nutrition/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
        setStep('results');
      } else {
        // Fallback to mock recommendations
        const mockRecommendations = generateMockRecommendations();
        setRecommendations(mockRecommendations);
        setStep('results');
      }
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      const mockRecommendations = generateMockRecommendations();
      setRecommendations(mockRecommendations);
      setStep('results');
    } finally {
      setLoading(false);
    }
  };

  const generateMockRecommendations = (): NutritionRecommendation => {
    // Simple BMR calculation (Mifflin-St Jeor Equation)
    let bmr;
    if (profile.gender === 'male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }

    // Activity multiplier
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly-active': 1.375,
      'moderately-active': 1.55,
      'very-active': 1.725,
      'extra-active': 1.9
    };
    
    const multiplier = activityMultipliers[profile.activityLevel as keyof typeof activityMultipliers] || 1.2;
    let calories = Math.round(bmr * multiplier);

    // Adjust for goal
    if (profile.goal === 'lose-weight') {
      calories -= 500; // 1 lb per week
    } else if (profile.goal === 'gain-weight' || profile.goal === 'build-muscle') {
      calories += 300;
    }

    const protein = Math.round(calories * 0.3 / 4); // 30% of calories from protein
    const carbs = Math.round(calories * 0.4 / 4); // 40% from carbs
    const fat = Math.round(calories * 0.3 / 9); // 30% from fat

    return {
      calories,
      protein,
      carbs,
      fat,
      fiber: 25,
      ageGroup: profile.age < 30 ? 'young-adult' : profile.age < 50 ? 'middle-age' : 'senior',
      notes: [
        `Your daily calorie goal is ${calories} calories based on your ${profile.goal.replace('-', ' ')} goal.`,
        `Aim for ${protein}g of protein daily to support ${profile.goal === 'build-muscle' ? 'muscle growth' : 'muscle maintenance'}.`,
        `Include ${carbs}g of carbs from whole grains, fruits, and vegetables for energy.`,
        `Consume ${fat}g of healthy fats from sources like nuts, avocado, and olive oil.`,
        'Stay hydrated with at least 8 glasses of water daily.',
        'Consider consulting with a healthcare provider before making major dietary changes.'
      ]
    };
  };

  const isFormValid = () => {
    return profile.age > 0 && profile.weight > 0 && profile.height > 0 && 
           profile.gender && profile.activityLevel && profile.goal;
  };

  if (step === 'results' && recommendations) {
    const bmi = calculateBMI();
    const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 max-w-6xl py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center shadow-lg">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <Target className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
              Your Personal Nutrition Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Based on your profile, here are your personalized nutrition recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Recommendations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Daily Targets */}
              <Card className="border border-border/50 shadow-sm bg-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-foreground">Daily Nutrition Targets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="group text-center p-6 bg-success/5 hover:bg-success/10 border border-success/20 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                      <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-3xl font-bold text-success mb-1">{recommendations.calories}</p>
                      <p className="text-sm text-muted-foreground font-medium">Calories</p>
                    </div>
                    <div className="group text-center p-6 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-3xl font-bold text-primary mb-1">{recommendations.protein}g</p>
                      <p className="text-sm text-muted-foreground font-medium">Protein</p>
                    </div>
                    <div className="group text-center p-6 bg-warning/5 hover:bg-warning/10 border border-warning/20 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                      <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-3xl font-bold text-warning mb-1">{recommendations.carbs}g</p>
                      <p className="text-sm text-muted-foreground font-medium">Carbs</p>
                    </div>
                    <div className="group text-center p-6 bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-3xl font-bold text-accent mb-1">{recommendations.fat}g</p>
                      <p className="text-sm text-muted-foreground font-medium">Fat</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personalized Recommendations */}
              <Card className="border border-border/50 shadow-sm bg-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="bg-accent/10 p-2 rounded-lg">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-foreground">Personalized Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.notes.map((note, index) => (
                      <div key={index} className="group flex items-start space-x-3 p-4 bg-muted/50 hover:bg-muted/80 rounded-xl border border-border/50 hover:border-primary/20 transition-all duration-200 hover:shadow-sm">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-foreground/80 leading-relaxed">{note}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Summary */}
            <div className="space-y-6">
              {/* BMI Card */}
              {bmi && bmiInfo && (
                <Card className="border border-border/50 shadow-sm bg-card hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Scale className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-foreground">BMI Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-foreground mb-3">{bmi}</div>
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${bmiInfo.color}`}>
                        {bmiInfo.category}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Profile Summary */}
              <Card className="border border-border/50 shadow-sm bg-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="bg-accent/10 p-2 rounded-lg">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-foreground">Your Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-semibold text-foreground">{profile.age} years</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="font-semibold text-foreground capitalize">{profile.gender}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-semibold text-foreground">{profile.weight} kg</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-muted-foreground">Height:</span>
                    <span className="font-semibold text-foreground">{profile.height} cm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-muted-foreground">Activity:</span>
                    <span className="font-semibold text-foreground capitalize">{profile.activityLevel.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-muted-foreground">Goal:</span>
                    <span className="font-semibold text-foreground capitalize">{profile.goal.replace('-', ' ')}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button 
                  onClick={() => setStep('form')}
                  variant="outline"
                  className="w-full border-border/50 hover:bg-accent/5 hover:text-accent hover:border-accent/20 transition-all duration-200"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <ChefHat className="h-4 w-4 mr-2" />
                  Generate Meal Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-4xl py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center shadow-lg">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            Personal Recommendations
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get personalized nutrition recommendations based on your health profile, goals, and lifestyle. 
            Our AI will create a custom plan just for you.
          </p>
        </div>

        {/* Assessment Form */}
        <Card className="border border-border/50 shadow-sm bg-card hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-foreground mb-2">
              Health & Lifestyle Assessment
            </CardTitle>
            <p className="text-muted-foreground text-center">
              Please fill out this quick assessment to receive your personalized recommendations
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <span>Basic Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={profile.age || ''}
                      onChange={(e) => updateProfile('age', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={profile.gender} onValueChange={(value) => updateProfile('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={profile.weight || ''}
                      onChange={(e) => updateProfile('weight', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={profile.height || ''}
                      onChange={(e) => updateProfile('height', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Activity & Goals */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <div className="bg-accent/10 p-1.5 rounded-lg">
                    <Activity className="h-5 w-5 text-accent" />
                  </div>
                  <span>Activity & Goals</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Activity Level</Label>
                    <Select value={profile.activityLevel} onValueChange={(value) => updateProfile('activityLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (desk job, no exercise)</SelectItem>
                        <SelectItem value="lightly-active">Lightly Active (light exercise 1-3x/week)</SelectItem>
                        <SelectItem value="moderately-active">Moderately Active (moderate exercise 3-5x/week)</SelectItem>
                        <SelectItem value="very-active">Very Active (intense exercise 6-7x/week)</SelectItem>
                        <SelectItem value="extra-active">Extremely Active (physical job + exercise)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Goal</Label>
                    <Select value={profile.goal} onValueChange={(value) => updateProfile('goal', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose-weight">Lose Weight</SelectItem>
                        <SelectItem value="maintain-weight">Maintain Weight</SelectItem>
                        <SelectItem value="gain-weight">Gain Weight</SelectItem>
                        <SelectItem value="build-muscle">Build Muscle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <Utensils className="h-5 w-5 text-primary" />
                  </div>
                  <span>Dietary Preferences & Restrictions</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DIETARY_RESTRICTIONS.map(restriction => (
                    <Button
                      key={restriction}
                      variant={profile.dietaryRestrictions.includes(restriction) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayValue('dietaryRestrictions', restriction)}
                      className={`text-sm transition-all duration-200 ${
                        profile.dietaryRestrictions.includes(restriction)
                          ? 'bg-primary hover:bg-primary/90 text-white border-primary shadow-sm'
                          : 'border-border/50 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/20'
                      }`}
                    >
                      {restriction}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Health Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <div className="bg-accent/10 p-1.5 rounded-lg">
                    <Heart className="h-5 w-5 text-accent" />
                  </div>
                  <span>Health Conditions</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {HEALTH_CONDITIONS.map(condition => (
                    <Button
                      key={condition}
                      variant={profile.healthConditions.includes(condition) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayValue('healthConditions', condition)}
                      className={`text-sm transition-all duration-200 ${
                        profile.healthConditions.includes(condition)
                          ? 'bg-accent hover:bg-accent/90 text-white border-accent shadow-sm'
                          : 'border-border/50 text-muted-foreground hover:bg-accent/5 hover:text-accent hover:border-accent/20'
                      }`}
                    >
                      {condition}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  onClick={generateRecommendations}
                  disabled={!isFormValid() || loading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Recommendations...
                    </>
                  ) : (
                    <>
                      <Target className="h-5 w-5 mr-2" />
                      Get My Personalized Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}