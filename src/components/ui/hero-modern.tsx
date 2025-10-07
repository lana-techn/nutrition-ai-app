"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, TrendingUp, Zap } from 'lucide-react';
import { useState, useEffect } from "react";
import Link from 'next/link';

interface HeroModernProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonLink?: string;
  className?: string;
}

export const HeroModern = ({
  title = "Transform Your",
  subtitle = "Nutrition Journey",
  description = "Discover personalized nutrition insights powered by AI. Track your meals, understand your body, and achieve your health goals with intelligent recommendations.",
  primaryButtonText = "Start Your Journey",
  secondaryButtonText = "Learn More",
  primaryButtonLink = "/analyze",
  secondaryButtonLink = "/chat",
  className,
}: HeroModernProps) => {
  const [mounted, setMounted] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(0);

  const floatingIcons = [
    { icon: Sparkles, color: "text-primary", delay: "0s" },
    { icon: Heart, color: "text-accent", delay: "0.5s" },
    { icon: TrendingUp, color: "text-secondary", delay: "1s" },
    { icon: Zap, color: "text-highlight", delay: "1.5s" },
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % floatingIcons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <section className={cn(
      "relative min-h-screen flex items-center justify-center overflow-hidden",
      "bg-gradient-to-br from-background via-background to-muted/50",
      "dark:from-background dark:via-background dark:to-muted/20",
      "-mt-24 pt-24", // Compensate for navbar
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:6rem_4rem]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={cn(
                "absolute transition-all duration-[3000ms] ease-in-out",
                currentIcon === index ? "opacity-100 scale-100" : "opacity-40 scale-75",
                item.color
              )}
              style={{
                left: `${20 + index * 20}%`,
                top: `${30 + index * 10}%`,
                animationDelay: item.delay,
              }}
            >
              <Icon 
                className="w-8 h-8 md:w-12 md:h-12 animate-pulse" 
                strokeWidth={1.5}
              />
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            AI-Powered Nutrition
          </div>

          {/* Headlines */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {title}
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-highlight bg-clip-text text-transparent animate-pulse">
                {subtitle}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href={primaryButtonLink}>
                {primaryButtonText}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold rounded-2xl border-2 hover:bg-accent/5 transition-all duration-300 hover:border-accent"
              asChild
            >
              <Link href={secondaryButtonLink}>
                {secondaryButtonText}
              </Link>
            </Button>
          </div>

          {/* Stats or Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            {[
              { value: "10K+", label: "Happy Users", icon: Heart },
              { value: "95%", label: "Success Rate", icon: TrendingUp },
              { value: "AI", label: "Powered Insights", icon: Sparkles },
            ].map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <div key={index} className="text-center space-y-3 group cursor-pointer">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <StatIcon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};