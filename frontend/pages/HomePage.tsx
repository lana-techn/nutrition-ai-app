import { Link } from 'react-router-dom';
import { Camera, Target, BookOpen, MessageCircle, Sparkles, Heart, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Your AI-Powered
            <span className="text-green-600"> Nutrition</span> Coach
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Get personalized nutrition advice, analyze your food with AI, and learn from expert content tailored to your age and lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/analyze" className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Analyze Food</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/recommendations" className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Get Recommendations</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need for Better Nutrition
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform combines AI technology with nutritional science to help you make informed dietary choices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Camera className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>AI Food Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Snap a photo of your meal and get instant nutritional analysis powered by advanced AI technology.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Age-Specific Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Receive personalized nutrition advice tailored to your age, lifestyle, and health goals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Expert Blog Content</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Learn from our library of evidence-based articles written by nutrition professionals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>AI Nutrition Coach</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Chat with our AI nutritionist for instant answers to your dietary questions and concerns.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/50 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Why Choose NutriAI?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Sparkles className="h-16 w-16 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Accuracy</h3>
              <p className="text-muted-foreground">
                Our advanced AI provides precise nutritional analysis and personalized recommendations.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Heart className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Health-Focused</h3>
              <p className="text-muted-foreground">
                Every recommendation is designed to support your overall health and wellbeing.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Brain className="h-16 w-16 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Science-Based</h3>
              <p className="text-muted-foreground">
                All advice is grounded in the latest nutritional science and research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Transform Your Nutrition?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your journey to better health today with personalized AI-powered nutrition guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/chat" className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Chat with AI Nutritionist</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/blog">
                <span>Read Our Blog</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
