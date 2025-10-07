import Link from 'next/link';
import { Camera, MessageCircle, ChefHat, Target, BookOpen, Shield, ArrowRight, Sparkles, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HeroModern } from '@/components/ui/hero-modern';
import { Component as ColorfulBentoGrid } from '@/components/ui/colorful-bento-grid';
import { About3 } from '@/components/ui/about-3';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div>
      {/* Fixed Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section - Using New Modern Hero */}
      <HeroModern 
        title="Transform Your Health with"
        subtitle="Smart Nutrition"
        description="Get personalized insights, analyze your food instantly, and achieve your health goals with AI-powered recommendations tailored just for you."
        primaryButtonText="Start Food Analysis"
        secondaryButtonText="Try AI Nutritionist"
        primaryButtonLink="/analyze"
        secondaryButtonLink="/chat"
      />

      {/* Features Section - Modern Bento Grid */}
      <ColorfulBentoGrid />

      {/* About Section - Modern About3 Component */}
      <About3 
        title="About Nutrition AI"
        description="We're a passionate team dedicated to revolutionizing how people understand and manage their nutrition through cutting-edge AI technology. Our mission is to make healthy eating accessible, personalized, and effortless for everyone."
        achievementsTitle="Our Impact in Numbers"
        achievementsDescription="Helping thousands of users achieve their health goals through intelligent nutrition tracking, personalized meal planning, and evidence-based recommendations powered by advanced AI."
        achievements={[
          { label: "Active Users", value: "10K+" },
          { label: "Foods Analyzed", value: "500K+" },
          { label: "Success Rate", value: "98%" },
          { label: "Countries Served", value: "25+" },
        ]}
        mainImage={{
          src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          alt: "Healthy nutrition and lifestyle with fresh foods and AI technology",
        }}
        secondaryImage={{
          src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Fresh healthy foods and nutrition ingredients",
        }}
        breakout={{
          src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
          alt: "AI-powered nutrition analysis",
          title: "Powered by Advanced AI Technology",
          description: "Our cutting-edge AI analyzes your food with 98% accuracy, providing personalized nutrition insights and recommendations tailored to your unique health goals and dietary preferences.",
          buttonText: "Explore Features",
          buttonUrl: "/analyze",
        }}
        companiesTitle="Trusted by health professionals and organizations worldwide"
        companies={[
          {
            src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=60&q=80",
            alt: "Healthcare Partner",
          },
          {
            src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=60&q=80",
            alt: "Nutrition Institute",
          },
          {
            src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=60&q=80",
            alt: "Health Tech Company",
          },
          {
            src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=60&q=80",
            alt: "Wellness Center",
          },
          {
            src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=60&q=80",
            alt: "Fitness Platform",
          },
          {
            src: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=60&q=80",
            alt: "Medical Research Center",
          },
        ]}
      />
    </div>
  );
}
