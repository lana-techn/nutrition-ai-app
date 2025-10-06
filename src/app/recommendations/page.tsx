'use client';

import { useState } from 'react';
import { Target, User, Activity, Scale, Ruler, Calendar, Zap, TrendingUp, Award, Heart } from 'lucide-react';
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

  const updateProfile = (key: keyof UserProfile, value: any) => {
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
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600 bg-blue-100' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600 bg-green-100' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600 bg-yellow-100' };
    return { category: 'Obese', color: 'text-red-600 bg-red-100' };
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-xl">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Target className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Your Personal Nutrition Plan
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Based on your profile, here are your personalized nutrition recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Recommendations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Daily Targets */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-2xl text-slate-800">
                    <Target className="h-6 w-6 text-blue-600" />
                    <span>Daily Nutrition Targets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-3xl font-bold text-emerald-700 mb-1">{recommendations.calories}</p>
                      <p className="text-sm text-emerald-600 font-medium">Calories</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-3xl font-bold text-blue-700 mb-1">{recommendations.protein}g</p>
                      <p className="text-sm text-blue-600 font-medium">Protein</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-3xl font-bold text-orange-700 mb-1">{recommendations.carbs}g</p>
                      <p className="text-sm text-orange-600 font-medium">Carbs</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-3xl font-bold text-purple-700 mb-1">{recommendations.fat}g</p>
                      <p className="text-sm text-purple-600 font-medium">Fat</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personalized Recommendations */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-2xl text-slate-800">
                    <User className="h-6 w-6 text-indigo-600" />
                    <span>Personalized Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.notes.map((note, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{note}</p>
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
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-xl text-slate-800">
                      <Scale className="h-5 w-5 text-slate-600" />
                      <span>BMI Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-800 mb-2">{bmi}</div>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${bmiInfo.color}`}>
                        {bmiInfo.category}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Profile Summary */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-xl text-slate-800">
                    <User className="h-5 w-5 text-slate-600" />
                    <span>Your Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Age:</span>
                    <span className="font-medium">{profile.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Gender:</span>
                    <span className="font-medium capitalize">{profile.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Weight:</span>
                    <span className="font-medium">{profile.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Height:</span>
                    <span className="font-medium">{profile.height} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Activity:</span>
                    <span className="font-medium capitalize">{profile.activityLevel.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Goal:</span>
                    <span className="font-medium capitalize">{profile.goal.replace('-', ' ')}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button 
                  onClick={() => setStep('form')}
                  variant="outline"
                  className="w-full"
                >
                  Update Profile
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                >
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-xl">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
            Personal Recommendations
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Get personalized nutrition recommendations based on your health profile, goals, and lifestyle. 
            Our AI will create a custom plan just for you.
          </p>
        </div>

        {/* Assessment Form */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-slate-800 mb-2">
              Health & Lifestyle Assessment
            </CardTitle>
            <p className="text-slate-600 text-center">
              Please fill out this quick assessment to receive your personalized recommendations
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                  <User className="h-5 w-5" />
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
                <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
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
                <h3 className="text-lg font-semibold text-slate-800">Dietary Preferences & Restrictions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DIETARY_RESTRICTIONS.map(restriction => (
                    <Button
                      key={restriction}
                      variant={profile.dietaryRestrictions.includes(restriction) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayValue('dietaryRestrictions', restriction)}
                      className={`text-sm ${
                        profile.dietaryRestrictions.includes(restriction)
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'border-slate-300 text-slate-600 hover:bg-blue-50'
                      }`}
                    >
                      {restriction}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Health Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Health Conditions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {HEALTH_CONDITIONS.map(condition => (
                    <Button
                      key={condition}
                      variant={profile.healthConditions.includes(condition) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayValue('healthConditions', condition)}
                      className={`text-sm ${
                        profile.healthConditions.includes(condition)
                          ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                          : 'border-slate-300 text-slate-600 hover:bg-indigo-50'
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
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-4 text-lg font-semibold"
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