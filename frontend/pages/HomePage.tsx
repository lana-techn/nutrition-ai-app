import { Link } from 'react-router-dom';
import { Camera, Target, BookOpen, MessageCircle, Sparkles, Heart, Brain, CheckCircle, Star, ArrowRight, Zap, Shield, TrendingUp, Users, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-violet-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-blue-600/5 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-36">
          <div className="max-w-5xl mx-auto text-center">
            {/* Floating badge with enhanced animation */}
            <div className="flex justify-center mb-10">
              <Badge 
                variant="secondary" 
                className="bg-white/90 text-emerald-700 border-2 border-emerald-200/50 shadow-2xl backdrop-blur-md px-6 py-3 text-base font-medium hover:shadow-emerald-200/50 hover:scale-105 transition-all duration-500 animate-bounce"
              >
                <Sparkles className="h-5 w-5 mr-3 text-emerald-500" />
                AI-Powered Nutrition Revolution
              </Badge>
            </div>

            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-violet-600 bg-clip-text text-transparent mb-10 leading-tight tracking-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Nutrition Journey
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-slate-600 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
              Experience the future of personalized nutrition with AI-powered analysis, 
              expert guidance, and interactive coaching tailored to your unique lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
              <Button 
                size="lg" 
                asChild 
                className="group bg-gradient-to-r from-emerald-600 via-blue-600 to-violet-600 hover:from-emerald-700 hover:via-blue-700 hover:to-violet-700 text-white shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-110 transition-all duration-500 px-10 py-6 text-xl font-semibold rounded-2xl border-0"
              >
                <Link to="/analyze" className="flex items-center space-x-4">
                  <Camera className="h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Start Food Analysis</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="group border-3 border-emerald-600/30 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 hover:text-emerald-800 shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-500 px-10 py-6 text-xl font-semibold rounded-2xl backdrop-blur-sm bg-white/80"
              >
                <Link to="/recommendations" className="flex items-center space-x-4">
                  <Target className="h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Get Personal Plan</span>
                </Link>
              </Button>
            </div>

            {/* Enhanced stats with animations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-3xl mx-auto">
              <div className="group text-center transform hover:scale-110 transition-all duration-500">
                <div className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-3 group-hover:from-emerald-500 group-hover:to-blue-500 transition-all duration-300">
                  50K+
                </div>
                <div className="text-slate-600 font-medium text-lg">Meals Analyzed</div>
                <div className="mt-2 w-16 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mx-auto group-hover:w-24 transition-all duration-500"></div>
              </div>
              <div className="group text-center transform hover:scale-110 transition-all duration-500">
                <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-3 group-hover:from-blue-500 group-hover:to-violet-500 transition-all duration-300">
                  98%
                </div>
                <div className="text-slate-600 font-medium text-lg">Accuracy Rate</div>
                <div className="mt-2 w-16 h-1 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full mx-auto group-hover:w-24 transition-all duration-500"></div>
              </div>
              <div className="group text-center transform hover:scale-110 transition-all duration-500">
                <div className="text-5xl font-black bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent mb-3 group-hover:from-violet-500 group-hover:to-pink-500 transition-all duration-300">
                  24/7
                </div>
                <div className="text-slate-600 font-medium text-lg">AI Assistant</div>
                <div className="mt-2 w-16 h-1 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full mx-auto group-hover:w-24 transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with enhanced animations */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="bg-white/90 text-blue-700 border-2 border-blue-200/50 shadow-xl backdrop-blur-md mb-8 px-6 py-3 text-base font-medium hover:shadow-blue-200/50 hover:scale-105 transition-all duration-500">
              <Zap className="h-5 w-5 mr-3 text-blue-500" />
              Powerful AI Features
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8 leading-tight">
              Everything You Need for
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Better Nutrition
              </span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Our comprehensive platform combines cutting-edge AI technology with nutritional science 
              to help you make informed dietary choices and achieve your health goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <Card className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-700 transform hover:-translate-y-4 hover:rotate-1 bg-gradient-to-br from-emerald-50 to-teal-100">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-emerald-600/5 group-hover:from-emerald-600/10 group-hover:to-emerald-600/20 transition-all duration-700"></div>
              <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl group-hover:scale-150 transition-all duration-700"></div>
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  <Camera className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-300">AI Food Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10 pb-8">
                <CardDescription className="text-slate-600 leading-relaxed text-lg mb-6">
                  Snap a photo of your meal and get instant nutritional analysis powered by advanced AI technology.
                </CardDescription>
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2 font-medium">
                    <Star className="h-4 w-4 mr-2" />
                    Instant Results
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-700 transform hover:-translate-y-4 hover:-rotate-1 bg-gradient-to-br from-blue-50 to-cyan-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/5 group-hover:from-blue-600/10 group-hover:to-blue-600/20 transition-all duration-700"></div>
              <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl group-hover:scale-150 transition-all duration-700"></div>
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-300">Age-Specific Plans</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10 pb-8">
                <CardDescription className="text-slate-600 leading-relaxed text-lg mb-6">
                  Receive personalized nutrition advice tailored to your age, lifestyle, and health goals.
                </CardDescription>
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2 font-medium">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Personalized
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-violet-500/25 transition-all duration-700 transform hover:-translate-y-4 hover:rotate-1 bg-gradient-to-br from-violet-50 to-purple-100">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-violet-600/5 group-hover:from-violet-600/10 group-hover:to-violet-600/20 transition-all duration-700"></div>
              <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-xl group-hover:scale-150 transition-all duration-700"></div>
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-violet-700 transition-colors duration-300">Expert Content</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10 pb-8">
                <CardDescription className="text-slate-600 leading-relaxed text-lg mb-6">
                  Learn from our library of evidence-based articles written by nutrition professionals.
                </CardDescription>
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700 border border-violet-200 px-4 py-2 font-medium">
                    <Shield className="h-4 w-4 mr-2" />
                    Science-Based
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-orange-500/25 transition-all duration-700 transform hover:-translate-y-4 hover:-rotate-1 bg-gradient-to-br from-orange-50 to-amber-100">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-orange-600/5 group-hover:from-orange-600/10 group-hover:to-orange-600/20 transition-all duration-700"></div>
              <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-xl group-hover:scale-150 transition-all duration-700"></div>
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-orange-700 transition-colors duration-300">AI Nutrition Coach</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10 pb-8">
                <CardDescription className="text-slate-600 leading-relaxed text-lg mb-6">
                  Chat with our AI nutritionist for instant answers to your dietary questions and concerns.
                </CardDescription>
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 border border-orange-200 px-4 py-2 font-medium">
                    <Sparkles className="h-4 w-4 mr-2" />
                    24/7 Available
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section with enhanced design */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-emerald-50/50 to-blue-50/50"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <Badge variant="secondary" className="bg-white/90 text-emerald-700 border-2 border-emerald-200/50 shadow-xl backdrop-blur-md mb-8 px-6 py-3 text-base font-medium hover:shadow-emerald-200/50 hover:scale-105 transition-all duration-500">
                <Heart className="h-5 w-5 mr-3 text-emerald-500" />
                Why Choose NutriAI
              </Badge>
              <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8 leading-tight">
                The Science Behind
                <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Your Success
                </span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-16">
              <div className="group text-center transform hover:scale-105 transition-all duration-700">
                <div className="relative mb-10">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 relative z-10">
                    <Sparkles className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-r from-yellow-400/30 to-red-500/30 rounded-full blur-2xl group-hover:blur-3xl group-hover:scale-150 transition-all duration-700"></div>
                  <div className="absolute top-4 right-8 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-4 left-8 w-6 h-6 bg-orange-400 rounded-full animate-pulse delay-300"></div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6 group-hover:text-orange-600 transition-colors duration-300">AI-Powered Accuracy</h3>
                <p className="text-slate-600 leading-relaxed text-xl font-light">
                  Our advanced AI provides precise nutritional analysis and personalized recommendations 
                  with 98% accuracy rate, backed by the latest nutritional science and machine learning.
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-3 text-emerald-600 font-semibold bg-emerald-50 px-6 py-3 rounded-full border border-emerald-200">
                    <CheckCircle className="h-5 w-5" />
                    <span>Scientifically Proven</span>
                  </div>
                </div>
              </div>

              <div className="group text-center transform hover:scale-105 transition-all duration-700">
                <div className="relative mb-10">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 relative z-10">
                    <Heart className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-r from-pink-500/30 to-red-500/30 rounded-full blur-2xl group-hover:blur-3xl group-hover:scale-150 transition-all duration-700"></div>
                  <div className="absolute top-4 right-8 w-4 h-4 bg-pink-400 rounded-full animate-ping delay-150"></div>
                  <div className="absolute bottom-4 left-8 w-6 h-6 bg-rose-400 rounded-full animate-pulse delay-500"></div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6 group-hover:text-rose-600 transition-colors duration-300">Health-Focused</h3>
                <p className="text-slate-600 leading-relaxed text-xl font-light">
                  Every recommendation is designed to support your overall health and wellbeing, 
                  considering your unique needs, preferences, and lifestyle factors.
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-3 text-emerald-600 font-semibold bg-emerald-50 px-6 py-3 rounded-full border border-emerald-200">
                    <CheckCircle className="h-5 w-5" />
                    <span>Personalized Approach</span>
                  </div>
                </div>
              </div>

              <div className="group text-center transform hover:scale-105 transition-all duration-700">
                <div className="relative mb-10">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 relative z-10">
                    <Brain className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-r from-indigo-500/30 to-violet-600/30 rounded-full blur-2xl group-hover:blur-3xl group-hover:scale-150 transition-all duration-700"></div>
                  <div className="absolute top-4 right-8 w-4 h-4 bg-indigo-400 rounded-full animate-ping delay-300"></div>
                  <div className="absolute bottom-4 left-8 w-6 h-6 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6 group-hover:text-purple-600 transition-colors duration-300">Science-Based</h3>
                <p className="text-slate-600 leading-relaxed text-xl font-light">
                  All advice is grounded in the latest nutritional science and research, 
                  ensuring you get evidence-based recommendations you can trust completely.
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-3 text-emerald-600 font-semibold bg-emerald-50 px-6 py-3 rounded-full border border-emerald-200">
                    <CheckCircle className="h-5 w-5" />
                    <span>Research-Backed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center text-white">
            <Badge variant="secondary" className="bg-white/10 text-white border-2 border-white/20 shadow-2xl backdrop-blur-md mb-8 px-6 py-3 text-base font-medium hover:bg-white/20 transition-all duration-500">
              <Zap className="h-5 w-5 mr-3" />
              See It In Action
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Experience the Future of
              <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Nutrition Analysis
              </span>
            </h2>
            <p className="text-2xl text-slate-300 mb-16 leading-relaxed max-w-4xl mx-auto font-light">
              Upload a photo of your meal right now and see how our AI instantly analyzes 
              its nutritional content with incredible accuracy and provides personalized recommendations.
            </p>

            <div className="grid md:grid-cols-2 gap-10 mb-16">
              <Card className="bg-white/10 border-2 border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-105">
                <CardContent className="p-10 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center">
                    <Camera className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Instant Analysis</h3>
                  <p className="text-slate-300 text-lg">Get complete nutritional breakdown in seconds</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-2 border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-105">
                <CardContent className="p-10 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full flex items-center justify-center">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Smart Recommendations</h3>
                  <p className="text-slate-300 text-lg">Personalized suggestions for better health</p>
                </CardContent>
              </Card>
            </div>

            <Button 
              size="lg" 
              asChild 
              className="group bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 hover:from-emerald-600 hover:via-blue-600 hover:to-violet-600 text-white shadow-2xl hover:shadow-emerald-500/30 transform hover:scale-110 transition-all duration-500 px-12 py-6 text-2xl font-semibold rounded-2xl border-0"
            >
              <Link to="/analyze" className="flex items-center space-x-4">
                <Camera className="h-8 w-8 group-hover:rotate-12 transition-transform duration-300" />
                <span>Try Food Analysis Now</span>
                <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 bg-gradient-to-br from-emerald-50 via-blue-50 to-violet-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-blue-600/5"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <Badge variant="secondary" className="bg-white/90 text-violet-700 border-2 border-violet-200/50 shadow-xl backdrop-blur-md mb-8 px-6 py-3 text-base font-medium hover:shadow-violet-200/50 hover:scale-105 transition-all duration-500">
                <Users className="h-5 w-5 mr-3 text-violet-500" />
                Trusted by Thousands
              </Badge>
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8 leading-tight">
                Join the Nutrition Revolution
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-10 mb-16">
              <Card className="text-center p-8 border-0 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-emerald-50">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-black text-emerald-600 mb-2">25,000+</div>
                <div className="text-slate-600 font-medium text-lg">Active Users</div>
              </Card>
              <Card className="text-center p-8 border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-black text-blue-600 mb-2">4.9/5</div>
                <div className="text-slate-600 font-medium text-lg">User Rating</div>
              </Card>
              <Card className="text-center p-8 border-0 shadow-2xl hover:shadow-violet-500/25 transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-violet-50">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-black text-violet-600 mb-2">&lt;2s</div>
                <div className="text-slate-600 font-medium text-lg">Analysis Time</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-emerald-50 via-blue-50 to-violet-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-blue-600/5"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="secondary" className="bg-white/90 text-violet-700 border-2 border-violet-200/50 shadow-xl backdrop-blur-md mb-8 px-6 py-3 text-base font-medium hover:shadow-violet-200/50 hover:scale-105 transition-all duration-500">
              <Star className="h-5 w-5 mr-3 text-violet-500" />
              Start Your Journey
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8 leading-tight">
              Ready to Transform
              <span className="block bg-gradient-to-r from-emerald-600 to-violet-600 bg-clip-text text-transparent">
                Your Nutrition?
              </span>
            </h2>
            <p className="text-2xl text-slate-600 mb-16 leading-relaxed max-w-4xl mx-auto font-light">
              Join thousands of users who have already transformed their health with our AI-powered 
              nutrition guidance. Start your journey to better health today with personalized recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
              <Button 
                size="lg" 
                asChild 
                className="group bg-gradient-to-r from-emerald-600 via-blue-600 to-violet-600 hover:from-emerald-700 hover:via-blue-700 hover:to-violet-700 text-white shadow-2xl hover:shadow-emerald-500/30 transform hover:scale-110 transition-all duration-500 px-10 py-6 text-xl font-semibold rounded-2xl border-0"
              >
                <Link to="/chat" className="flex items-center space-x-4">
                  <MessageCircle className="h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Chat with AI Nutritionist</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="group border-3 border-violet-600/30 text-violet-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-blue-50 hover:text-violet-800 shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-500 px-10 py-6 text-xl font-semibold rounded-2xl backdrop-blur-sm bg-white/80"
              >
                <Link to="/blog" className="flex items-center space-x-4">
                  <BookOpen className="h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Explore Our Blog</span>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-4 text-slate-600 bg-white/60 px-6 py-4 rounded-2xl border border-emerald-200/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                <span className="font-medium text-lg">Free to start</span>
              </div>
              <div className="flex items-center justify-center space-x-4 text-slate-600 bg-white/60 px-6 py-4 rounded-2xl border border-blue-200/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                <span className="font-medium text-lg">No credit card required</span>
              </div>
              <div className="flex items-center justify-center space-x-4 text-slate-600 bg-white/60 px-6 py-4 rounded-2xl border border-violet-200/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                <span className="font-medium text-lg">Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
