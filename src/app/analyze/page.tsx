'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, Loader2, Sparkles, Zap, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AIAnalysisResult } from '@/lib/types';

export default function AnalyzePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Extract base64 data from the data URL
      const base64Data = selectedImage.split(',')[1];
      
      const analysisResponse = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Data
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze image');
      }

      const { analysis }: { analysis: AIAnalysisResult } = await analysisResponse.json();
      setAnalysisResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-emerald-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
            AI Food Analysis
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Upload a photo of your meal and get instant nutritional insights powered by advanced AI technology. 
            Discover calories, macros, and personalized recommendations in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl text-slate-800">
                <Camera className="h-6 w-6 text-emerald-600" />
                <span>Upload Your Food Photo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="food-image" className="text-sm font-medium text-slate-700">
                  Select Image
                </Label>
                <Input
                  id="food-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  ref={fileInputRef}
                  className="hidden"
                />
                <div
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 group"
                >
                  {selectedImage ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <Image
                          src={selectedImage}
                          alt="Selected food"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerFileInput();
                        }}
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-16 w-16 text-emerald-400 mx-auto group-hover:text-emerald-600 transition-colors" />
                      <div>
                        <p className="text-lg font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">
                          Drop your food photo here
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Or click to browse files (PNG, JPG, JPEG)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white py-3 text-lg font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing Your Food...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl text-slate-800">
                <Target className="h-6 w-6 text-blue-600" />
                <span>Analysis Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!analysisResult && !isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6">
                    <Camera className="h-16 w-16 text-slate-400" />
                  </div>
                  <p className="text-lg text-slate-600 mb-2">Ready to analyze your food!</p>
                  <p className="text-sm text-slate-500">Upload an image to get started</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <div className="relative">
                    <Loader2 className="h-16 w-16 text-emerald-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-lg text-slate-700 mt-6 mb-2">Analyzing your food...</p>
                  <p className="text-sm text-slate-500">Our AI is identifying ingredients and calculating nutrition</p>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6">
                  {/* Detected Foods */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Detected Foods</h3>
                    <div className="space-y-3">
                      {analysisResult.detectedFoods.map((food, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-800">{food.name}</p>
                            <p className="text-sm text-slate-600">
                              ~{food.estimatedWeight}g • {Math.round(food.confidence * 100)}% confidence
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-emerald-600">{food.nutrition.calories} cal</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Nutrition */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Total Nutrition</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg text-center">
                        <p className="text-2xl font-bold text-emerald-700">
                          {analysisResult.totalNutrition.calories}
                        </p>
                        <p className="text-sm text-emerald-600 font-medium">Calories</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-700">
                          {analysisResult.totalNutrition.protein}g
                        </p>
                        <p className="text-sm text-blue-600 font-medium">Protein</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-700">
                          {analysisResult.totalNutrition.carbs}g
                        </p>
                        <p className="text-sm text-orange-600 font-medium">Carbs</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg text-center">
                        <p className="text-2xl font-bold text-purple-700">
                          {analysisResult.totalNutrition.fat}g
                        </p>
                        <p className="text-sm text-purple-600 font-medium">Fat</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  {analysisResult.suggestions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">AI Recommendations</h3>
                      <div className="space-y-2">
                        {analysisResult.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-cyan-50 rounded-lg">
                            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Sparkles className="h-3 w-3 text-white" />
                            </div>
                            <p className="text-sm text-slate-700">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-slate-50 to-blue-50">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Tips for Better Results</h3>
                <p className="text-slate-600">Get the most accurate analysis with these simple guidelines</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800">Good Lighting</h4>
                  <p className="text-sm text-slate-600">Take photos in well-lit environments for best recognition</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800">Clear Focus</h4>
                  <p className="text-sm text-slate-600">Ensure your food is in focus and fills most of the frame</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800">Single Dish</h4>
                  <p className="text-sm text-slate-600">Photograph one dish at a time for more accurate results</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}