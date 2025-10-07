import Link from 'next/link';
import { Camera, MessageCircle, ChefHat, Target, BookOpen, Shield, ArrowRight, Sparkles, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-cyan-600/5 dark:from-emerald-400/10 dark:to-cyan-400/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 px-4 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Nutrition Assistant
              </Badge>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Transform Your Health with{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Smart Nutrition
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Get personalized insights, analyze your food instantly, and achieve your health goals with AI-powered recommendations tailored just for you.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold text-foreground">10K+</span>
                <span>Active Users</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold text-foreground">98%</span>
                <span>Accuracy Rate</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold text-foreground">50K+</span>
                <span>Foods Recognized</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/analyze" className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Start Food Analysis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-2 hover:bg-accent transition-all duration-300">
                <Link href="/chat" className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Try AI Nutritionist
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Target className="h-4 w-4 mr-2" />
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Powerful Tools for Better Health</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to make informed nutrition choices, powered by cutting-edge AI technology</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* AI Food Analysis */}
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-emerald-600 transition-colors">
                  AI Food Analysis
                </CardTitle>
                <CardDescription className="text-base">
                  Snap a photo and get instant nutritional breakdown with 98% accuracy. Our AI recognizes over 50,000 foods.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/analyze">Try Now</Link>
                </Button>
              </CardContent>
            </Card>

            {/* AI Nutrition Coach */}
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-pink-600 transition-colors">
                  AI Nutrition Coach
                </CardTitle>
                <CardDescription className="text-base">
                  Get personalized advice from our AI nutritionist. Available 24/7 for all your dietary questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full bg-pink-600 hover:bg-pink-700">
                  <Link href="/chat">Start Chat</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Meal Planning */}
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-orange-600 transition-colors">
                  Smart Meal Planning
                </CardTitle>
                <CardDescription className="text-base">
                  Generate personalized weekly meal plans based on your goals, preferences, and dietary restrictions.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                  <Link href="/meal-planner">Plan Meals</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Personal Recommendations */}
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                  Personal Recommendations
                </CardTitle>
                <CardDescription className="text-base">
                  Get tailored nutrition advice based on your age, lifestyle, and health goals.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/recommendations">Get Recommendations</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recipe Database */}
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-purple-600 transition-colors">
                  Healthy Recipes
                </CardTitle>
                <CardDescription className="text-base">
                  Discover thousands of nutritious recipes with detailed nutritional information and cooking instructions.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href="/recipes">Explore Recipes</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Expert Content */}
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-teal-600 transition-colors">
                  Expert Content
                </CardTitle>
                <CardDescription className="text-base">
                  Access evidence-based nutrition articles written by certified professionals and researchers.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                  <Link href="/blog">Read Articles</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <Card className="border-0 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/50 dark:to-cyan-950/50">
            <CardContent className="p-12 lg:p-16 text-center">
              <div className="max-w-3xl mx-auto">
                <Badge variant="secondary" className="mb-6 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Started Today
                </Badge>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Ready to Transform Your{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    Health Journey?
                  </span>
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of users who have already improved their nutrition and health with our AI-powered platform.
                </p>
                
                <Separator className="my-8 max-w-md mx-auto" />
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link href="/analyze" className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Start Free Analysis
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-2">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      View Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
