import { useState } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { AIAnalysisResult } from '~backend/nutrition/types';

export default function FoodAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Convert to base64 for API
      const base64Reader = new FileReader();
      base64Reader.onload = async (e) => {
        const base64String = (e.target?.result as string).split(',')[1];
        
        try {
          const result = await backend.ai.analyzeFoodImage({ imageBase64: base64String });
          setAnalysis(result.analysis);
          toast({
            title: "Analysis complete!",
            description: "Your food has been analyzed successfully.",
          });
        } catch (error) {
          console.error('Analysis error:', error);
          toast({
            title: "Analysis failed",
            description: "Failed to analyze the image. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsAnalyzing(false);
        }
      };
      base64Reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload the image. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setImagePreview(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            AI Food Analysis
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload a photo of your meal to get instant nutritional analysis powered by AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Upload Food Image</span>
              </CardTitle>
              <CardDescription>
                Take a photo or upload an image of your meal for analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Food preview"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <Button 
                      onClick={resetAnalysis} 
                      variant="outline" 
                      className="w-full"
                    >
                      Upload Different Image
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Click to upload or drag and drop your food image
                    </p>
                    <label htmlFor="food-image" className="cursor-pointer">
                      <Button asChild>
                        <span>Select Image</span>
                      </Button>
                    </label>
                    <input
                      id="food-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {isAnalyzing && (
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        <span className="text-blue-600">Analyzing your food...</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                AI-generated nutritional breakdown and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-6">
                  {/* Detected Foods */}
                  <div>
                    <h3 className="font-semibold mb-3">Detected Foods</h3>
                    <div className="space-y-2">
                      {analysis.detectedFoods.map((food, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{food.name}</p>
                              <p className="text-sm text-muted-foreground">
                                ~{food.estimatedWeight}g (Confidence: {Math.round(food.confidence * 100)}%)
                              </p>
                            </div>
                            <div className="text-right text-sm">
                              <p>{food.nutrition.calories} cal</p>
                              <p className="text-muted-foreground">
                                P: {food.nutrition.protein}g | C: {food.nutrition.carbs}g | F: {food.nutrition.fat}g
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Total Nutrition */}
                  <div>
                    <h3 className="font-semibold mb-3">Total Nutrition</h3>
                    <Card className="p-4 bg-green-50/50 border-green-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-700">
                            {analysis.totalNutrition.calories}
                          </p>
                          <p className="text-sm text-green-600">Calories</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-700">
                            {analysis.totalNutrition.protein}g
                          </p>
                          <p className="text-sm text-green-600">Protein</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-700">
                            {analysis.totalNutrition.carbs}g
                          </p>
                          <p className="text-sm text-green-600">Carbs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-700">
                            {analysis.totalNutrition.fat}g
                          </p>
                          <p className="text-sm text-green-600">Fat</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Suggestions */}
                  {analysis.suggestions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">AI Recommendations</h3>
                      <div className="space-y-2">
                        {analysis.suggestions.map((suggestion, index) => (
                          <Card key={index} className="p-3 bg-blue-50/50 border-blue-200">
                            <p className="text-sm text-blue-700">{suggestion}</p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Upload an image to see nutritional analysis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tips for Better Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium mb-1">Good Lighting</p>
                <p className="text-muted-foreground">
                  Take photos in well-lit conditions for better recognition
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Clear View</p>
                <p className="text-muted-foreground">
                  Make sure all food items are clearly visible
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Close-up Shot</p>
                <p className="text-muted-foreground">
                  Get close enough to see details but capture the whole meal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
