'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { 
  Camera, Upload, Loader2, Sparkles, Zap, Clock, Target, 
  CheckCircle, TrendingUp, Lightbulb, Save,
  Share2, Download, RotateCcw, Info, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { AIAnalysisResult } from '@/lib/types';

export default function AnalyzePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [, setAnalysisHistory] = useState<AIAnalysisResult[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('idle');
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
    setCurrentStep('uploading');

    try {
      // Extract base64 data from the data URL
      const base64Data = selectedImage.split(',')[1];
      
      setCurrentStep('analyzing');
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

      setCurrentStep('processing');
      const { analysis }: { analysis: AIAnalysisResult } = await analysisResponse.json();
      setAnalysisResult(analysis);
      
      // Add to history
      setAnalysisHistory(prev => [
        { ...analysis, timestamp: new Date().toISOString() },
        ...prev.slice(0, 4) // Keep only last 5 analyses
      ]);
      
      setCurrentStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      setCurrentStep('error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
          setAnalysisResult(null);
          setError(null);
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    setCurrentStep('idle');
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'uploading': return 25;
      case 'analyzing': return 50;
      case 'processing': return 75;
      case 'complete': return 100;
      default: return 0;
    }
  };

  const getStepMessage = () => {
    switch (currentStep) {
      case 'uploading': return 'Uploading image...';
      case 'analyzing': return 'AI is analyzing your food...';
      case 'processing': return 'Calculating nutrition facts...';
      case 'complete': return 'Analysis complete!';
      case 'error': return 'Analysis failed';
      default: return 'Ready to analyze';
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            AI Food Analysis
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Upload a photo of your meal and get instant nutritional insights powered by advanced AI technology. 
            Discover calories, macros, and personalized recommendations in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="border border-border/50 shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl text-foreground">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <span>Upload Your Food Photo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="food-image" className="text-sm font-medium text-foreground">
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
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 group ${
                    dragActive 
                      ? 'border-primary bg-primary/5 scale-[1.02]' 
                      : 'border-border hover:border-primary hover:bg-primary/5'
                  }`}
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
                        className="border-primary/20 text-primary hover:bg-primary/5"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-16 w-16 text-muted-foreground mx-auto group-hover:text-primary transition-colors" />
                      <div>
                        <p className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                          Drop your food photo here
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Or click to browse files (PNG, JPG, JPEG)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress indicator */}
              {isAnalyzing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{getStepMessage()}</span>
                    <span className="text-emerald-600 font-medium">{getStepProgress()}%</span>
                  </div>
                  <Progress value={getStepProgress()} className="h-2" />
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {getStepMessage()}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>

              {selectedImage && !isAnalyzing && (
                <Button
                  onClick={resetAnalysis}
                  variant="outline"
                  className="w-full border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
              )}

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
                  {/* Success Header */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">Analysis Complete!</h3>
                        <p className="text-sm text-green-600">Your food has been successfully analyzed</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* Detected Foods */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-800">Detected Foods</h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {analysisResult.detectedFoods.length} items found
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {analysisResult.detectedFoods.map((food, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-medium text-slate-800">{food.name}</p>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${
                                  food.confidence > 0.8 
                                    ? 'bg-green-100 text-green-700' 
                                    : food.confidence > 0.6 
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {Math.round(food.confidence * 100)}% confident
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">
                              Estimated weight: ~{food.estimatedWeight}g
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-600 text-lg">{food.nutrition.calories}</p>
                            <p className="text-xs text-slate-500">calories</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Nutrition */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800">Nutritional Breakdown</h3>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Per serving
                      </Badge>
                    </div>
                    
                    {/* Main nutrition cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="relative p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl text-center border border-emerald-200 hover:shadow-lg transition-shadow">
                        <div className="absolute top-2 right-2">
                          <Zap className="h-4 w-4 text-emerald-600" />
                        </div>
                        <p className="text-3xl font-bold text-emerald-700 mb-1">
                          {analysisResult.totalNutrition.calories}
                        </p>
                        <p className="text-sm text-emerald-600 font-medium">Calories</p>
                        <div className="mt-2 h-1 bg-emerald-200 rounded-full">
                          <div className="h-1 bg-emerald-500 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div className="relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-center border border-blue-200 hover:shadow-lg transition-shadow">
                        <div className="absolute top-2 right-2">
                          <Award className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold text-blue-700 mb-1">
                          {analysisResult.totalNutrition.protein}g
                        </p>
                        <p className="text-sm text-blue-600 font-medium">Protein</p>
                        <div className="mt-2 h-1 bg-blue-200 rounded-full">
                          <div className="h-1 bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div className="relative p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl text-center border border-orange-200 hover:shadow-lg transition-shadow">
                        <div className="absolute top-2 right-2">
                          <Target className="h-4 w-4 text-orange-600" />
                        </div>
                        <p className="text-3xl font-bold text-orange-700 mb-1">
                          {analysisResult.totalNutrition.carbs}g
                        </p>
                        <p className="text-sm text-orange-600 font-medium">Carbs</p>
                        <div className="mt-2 h-1 bg-orange-200 rounded-full">
                          <div className="h-1 bg-orange-500 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div className="relative p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center border border-purple-200 hover:shadow-lg transition-shadow">
                        <div className="absolute top-2 right-2">
                          <Info className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-3xl font-bold text-purple-700 mb-1">
                          {analysisResult.totalNutrition.fat}g
                        </p>
                        <p className="text-sm text-purple-600 font-medium">Fat</p>
                        <div className="mt-2 h-1 bg-purple-200 rounded-full">
                          <div className="h-1 bg-purple-500 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional nutrition info */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-medium text-slate-800 mb-3 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Additional Information
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-slate-700">25%</p>
                          <p className="text-slate-500">Daily Calories</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-slate-700">High</p>
                          <p className="text-slate-500">Protein Content</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-slate-700">Balanced</p>
                          <p className="text-slate-500">Macro Ratio</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  {analysisResult.suggestions.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">AI-Powered Insights</h3>
                        <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          Smart recommendations
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {analysisResult.suggestions.map((suggestion, index) => (
                          <div key={index} className="group relative p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 hover:border-cyan-300 hover:shadow-md transition-all">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Sparkles className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-slate-700 leading-relaxed">{suggestion}</p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Action buttons */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="text-cyan-600 border-cyan-200 hover:bg-cyan-50">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          View Similar Foods
                        </Button>
                        <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                          <Target className="h-4 w-4 mr-1" />
                          Add to Meal Plan
                        </Button>
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                          <Download className="h-4 w-4 mr-1" />
                          Export Report
                        </Button>
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