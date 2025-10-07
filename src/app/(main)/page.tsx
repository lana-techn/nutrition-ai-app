import Link from 'next/link';
import { Camera, MessageCircle, ChefHat, Target, BookOpen, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-cyan-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Your AI-Powered
              <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                {" "}Nutrition Assistant
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed">
              Transform your health journey with intelligent food analysis, personalized recommendations, 
              and AI-powered meal planning designed just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white">
                <Link href="/analyze" className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Analyze Your Food</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/chat" className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat with AI Nutritionist</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features for Better Nutrition</h2>
            <p className="text-xl text-slate-600">Everything you need to make healthier choices, powered by AI</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Food Analysis */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-cyan-50">
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-500"></div>
              <CardContent className="relative z-10 p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors duration-300">
                  AI Food Analysis
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Snap a photo and get instant nutritional breakdown with 98% accuracy. Our AI recognizes over 50,000 foods.
                </p>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/analyze">Try Now</Link>
                </Button>
              </CardContent>
            </Card>

            {/* AI Nutrition Coach */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-pink-500/20 transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-pink-50 to-rose-50">
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-500"></div>
              <CardContent className="relative z-10 p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-pink-700 transition-colors duration-300">
                  AI Nutrition Coach
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Get personalized advice from our AI nutritionist. Available 24/7 for all your dietary questions.
                </p>
                <Button asChild className="bg-pink-600 hover:bg-pink-700">
                  <Link href="/chat">Start Chat</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Meal Planning */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-orange-500/20 transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-500"></div>
              <CardContent className="relative z-10 p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ChefHat className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-700 transition-colors duration-300">
                  Smart Meal Planning
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Generate personalized weekly meal plans based on your goals, preferences, and dietary restrictions.
                </p>
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/meal-planner">Plan Meals</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Personalized Recommendations */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-500"></div>
              <CardContent className="relative z-10 p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                  Personal Recommendations
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Get tailored nutrition advice based on your age, lifestyle, and health goals.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/recommendations">Get Recommendations</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recipe Database */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-violet-50">
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-500"></div>
              <CardContent className="relative z-10 p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">
                  Healthy Recipes
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Discover thousands of nutritious recipes with detailed nutritional information and cooking instructions.
                </p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/recipes">Explore Recipes</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Expert Content */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-teal-500/20 transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-teal-50 to-green-50">
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-teal-400/20 to-green-400/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-500"></div>
              <CardContent className="relative z-10 p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-teal-700 transition-colors duration-300">
                  Expert Content
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Access evidence-based nutrition articles written by certified professionals and researchers.
                </p>
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/blog">Read Articles</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
