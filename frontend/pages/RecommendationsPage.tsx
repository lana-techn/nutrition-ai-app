import { useState } from 'react';
import { Calculator, User, Activity, Scale, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { NutritionRecommendation } from '~backend/nutrition/types';

export default function RecommendationsPage() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [recommendation, setRecommendation] = useState<NutritionRecommendation | null>(null);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    gender: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.age) {
      toast({
        title: "Missing information",
        description: "Please enter your age.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCalculating(true);
      
      const request = {
        age: parseInt(formData.age),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        activityLevel: formData.activityLevel || undefined,
        gender: formData.gender || undefined,
      };

      const result = await backend.nutrition.getRecommendations(request);
      setRecommendation(result.recommendation);
      
      toast({
        title: "Recommendations calculated!",
        description: "Your personalized nutrition plan is ready.",
      });
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: "Calculation failed",
        description: "Failed to calculate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Personalized Nutrition Recommendations
          </h1>
          <p className="text-lg text-muted-foreground">
            Get customized nutrition advice based on your age, lifestyle, and health goals
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Your Information</span>
              </CardTitle>
              <CardDescription>
                Tell us about yourself to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="25"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center space-x-1">
                      <Scale className="h-4 w-4" />
                      <span>Weight (kg)</span>
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      min="20"
                      max="300"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="flex items-center space-x-1">
                      <Ruler className="h-4 w-4" />
                      <span>Height (cm)</span>
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      min="100"
                      max="250"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="170"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-1">
                    <Activity className="h-4 w-4" />
                    <span>Activity Level</span>
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('activityLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                      <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (very hard exercise, physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <Calculator className="h-4 w-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Get Recommendations
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Your Recommendations</CardTitle>
              <CardDescription>
                Personalized nutrition targets and guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendation ? (
                <div className="space-y-6">
                  {/* Age Group */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{recommendation.ageGroup}</h3>
                  </div>

                  {/* Daily Targets */}
                  <div>
                    <h4 className="font-semibold mb-3">Daily Nutrition Targets</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-3 bg-blue-50/50 border-blue-200">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-700">
                            {recommendation.calories}
                          </p>
                          <p className="text-sm text-blue-600">Calories</p>
                        </div>
                      </Card>
                      <Card className="p-3 bg-green-50/50 border-green-200">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-700">
                            {recommendation.protein}g
                          </p>
                          <p className="text-sm text-green-600">Protein</p>
                        </div>
                      </Card>
                      <Card className="p-3 bg-orange-50/50 border-orange-200">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-700">
                            {recommendation.carbs}g
                          </p>
                          <p className="text-sm text-orange-600">Carbs</p>
                        </div>
                      </Card>
                      <Card className="p-3 bg-purple-50/50 border-purple-200">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-700">
                            {recommendation.fat}g
                          </p>
                          <p className="text-sm text-purple-600">Fat</p>
                        </div>
                      </Card>
                    </div>
                    <Card className="p-3 bg-amber-50/50 border-amber-200 mt-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-amber-700">
                          {recommendation.fiber}g
                        </p>
                        <p className="text-sm text-amber-600">Daily Fiber</p>
                      </div>
                    </Card>
                  </div>

                  {/* Age-Specific Notes */}
                  <div>
                    <h4 className="font-semibold mb-3">Important Notes for Your Age Group</h4>
                    <div className="space-y-2">
                      {recommendation.notes.map((note, index) => (
                        <Card key={index} className="p-3 bg-slate-50/50 border-slate-200">
                          <p className="text-sm text-slate-700">• {note}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Fill out your information to get personalized recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our recommendations are based on the Mifflin-St Jeor Equation and evidence-based nutritional guidelines, adjusted for your specific age group and lifestyle.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personalized Approach</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Nutrition needs vary significantly by age. Our system provides targeted advice for children, teens, adults, and older adults based on current research.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Professional Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                While our recommendations are science-based, always consult with healthcare professionals for specific dietary concerns or medical conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
