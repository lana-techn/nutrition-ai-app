import { Link } from 'react-router-dom';
import { Camera, Target, BookOpen, MessageCircle, Sparkles, Heart, Brain, CheckCircle, Star, ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Floating badges */}
            <div className="flex justify-center mb-8">
              <Badge variant="secondary" className="bg-white/80 text-green-700 border border-green-200 shadow-lg backdrop-blur-sm animate-pulse">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Nutrition
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 leading-tight">
              Transform Your
              <span className="block">Nutrition Journey</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Get personalized nutrition advice, analyze your food with AI, and learn from expert content 
              tailored to your age and lifestyle. Your health transformation starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg" 
                asChild 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg"
              >
                <Link to="/analyze" className="flex items-center space-x-3">
                  <Camera className="h-6 w-6" />
                  <span>Start Food Analysis</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Link to="/recommendations" className="flex items-center space-x-3">
                  <Target className="h-6 w-6" />
                  <span>Get Personal Plan</span>
                </Link>
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                <div className="text-gray-600">Meals Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">AI Assistant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="bg-white/80 text-blue-700 border border-blue-200 shadow-lg backdrop-blur-sm mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              Everything You Need for
              <span className="block">Better Nutrition</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform combines cutting-edge AI technology with nutritional science 
              to help you make informed dietary choices and achieve your health goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-emerald-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/5 group-hover:from-green-600/5 group-hover:to-green-600/10 transition-all duration-500"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">AI Food Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Snap a photo of your meal and get instant nutritional analysis powered by advanced AI technology.
                </CardDescription>
                <div className="mt-4 flex justify-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Star className="h-3 w-3 mr-1" />
                    Instant Results
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-cyan-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/5 group-hover:from-blue-600/5 group-hover:to-blue-600/10 transition-all duration-500"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Age-Specific Plans</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Receive personalized nutrition advice tailored to your age, lifestyle, and health goals.
                </CardDescription>
                <div className="mt-4 flex justify-center">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Personalized
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-violet-100">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/5 group-hover:from-purple-600/5 group-hover:to-purple-600/10 transition-all duration-500"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Expert Content</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Learn from our library of evidence-based articles written by nutrition professionals.
                </CardDescription>
                <div className="mt-4 flex justify-center">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    <Shield className="h-3 w-3 mr-1" />
                    Science-Based
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-amber-100">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-orange-600/5 group-hover:from-orange-600/5 group-hover:to-orange-600/10 transition-all duration-500"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">AI Nutrition Coach</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Chat with our AI nutritionist for instant answers to your dietary questions and concerns.
                </CardDescription>
                <div className="mt-4 flex justify-center">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    <Sparkles className="h-3 w-3 mr-1" />
                    24/7 Available
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-green-50 to-blue-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="bg-white/80 text-green-700 border border-green-200 shadow-lg backdrop-blur-sm mb-6">
                <Heart className="h-4 w-4 mr-2" />
                Why Choose NutriAI
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
                The Science Behind
                <span className="block">Your Success</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="group text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Accuracy</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Our advanced AI provides precise nutritional analysis and personalized recommendations 
                  with 95% accuracy rate, backed by the latest nutritional science.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>Scientifically Proven</span>
                  </div>
                </div>
              </div>

              <div className="group text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-pink-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Health-Focused</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Every recommendation is designed to support your overall health and wellbeing, 
                  considering your unique needs and lifestyle preferences.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>Personalized Approach</span>
                  </div>
                </div>
              </div>

              <div className="group text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Brain className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Science-Based</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  All advice is grounded in the latest nutritional science and research, 
                  ensuring you get evidence-based recommendations you can trust.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>Research-Backed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge variant="secondary" className="bg-white/10 text-white border border-white/20 shadow-lg backdrop-blur-sm mb-6">
              <Zap className="h-4 w-4 mr-2" />
              See It In Action
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Experience the Future of
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Nutrition Analysis
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Upload a photo of your meal right now and see how our AI instantly analyzes 
              its nutritional content with incredible accuracy.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-xl font-bold mb-3">Instant Analysis</h3>
                  <p className="text-gray-300">Get nutritional breakdown in seconds</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                  <h3 className="text-xl font-bold mb-3">Smart Recommendations</h3>
                  <p className="text-gray-300">Personalized suggestions for better health</p>
                </CardContent>
              </Card>
            </div>

            <Button 
              size="lg" 
              asChild 
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg"
            >
              <Link to="/analyze" className="flex items-center space-x-3">
                <Camera className="h-6 w-6" />
                <span>Try Food Analysis Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="bg-white/80 text-purple-700 border border-purple-200 shadow-lg backdrop-blur-sm mb-6">
              <Star className="h-4 w-4 mr-2" />
              Start Your Journey
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              Ready to Transform
              <span className="block">Your Nutrition?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join thousands of users who have already transformed their health with our AI-powered 
              nutrition guidance. Start your journey to better health today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button 
                size="lg" 
                asChild 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg"
              >
                <Link to="/chat" className="flex items-center space-x-3">
                  <MessageCircle className="h-6 w-6" />
                  <span>Chat with AI Nutritionist</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Link to="/blog" className="flex items-center space-x-3">
                  <BookOpen className="h-6 w-6" />
                  <span>Explore Our Blog</span>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3 text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
