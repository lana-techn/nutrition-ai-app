import { HeroModern } from "@/components/ui/hero-modern";
import { Component as ColorfulBentoGrid } from "@/components/ui/colorful-bento-grid";
import { About3 } from "@/components/ui/about-3";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DemoPage() {
  return (
    <div>
      {/* Fixed theme toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <HeroModern 
        title="Transform Your"
        subtitle="Nutrition Journey"
        description="Discover personalized nutrition insights powered by AI. Track your meals, understand your body, and achieve your health goals with intelligent recommendations tailored just for you."
        primaryButtonText="Start Your Journey"
        secondaryButtonText="Learn More"
        primaryButtonLink="/analyze"
        secondaryButtonLink="/dashboard"
      />

      {/* Bento Grid Section */}
      <ColorfulBentoGrid />

      {/* About Section */}
      <About3 
        title="About Nutrition AI"
        description="We're a passionate team dedicated to creating innovative solutions that empower individuals to thrive in their health journey through AI-powered nutrition insights and personalized recommendations."
        achievementsTitle="Our Impact in Numbers"
        achievementsDescription="Helping thousands of users achieve their health goals through intelligent nutrition tracking, personalized meal planning, and evidence-based recommendations."
        achievements={[
          { label: "Active Users", value: "10K+" },
          { label: "Meals Analyzed", value: "500K+" },
          { label: "Success Rate", value: "95%" },
          { label: "Countries Served", value: "50+" },
        ]}
        mainImage={{
          src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          alt: "Healthy nutrition and lifestyle",
        }}
        secondaryImage={{
          src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          alt: "Fresh healthy foods",
        }}
        breakout={{
          src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
          alt: "AI nutrition insights",
          title: "AI-Powered Nutrition Platform",
          description: "Providing individuals with effective tools to improve nutrition habits, boost health metrics, and encourage sustainable lifestyle changes through intelligent recommendations.",
          buttonText: "Explore Features",
          buttonUrl: "/features",
        }}
        companiesTitle="Trusted by health enthusiasts worldwide"
        companies={[
          {
            src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=50&q=80",
            alt: "Health Partner 1",
          },
          {
            src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=50&q=80",
            alt: "Health Partner 2",
          },
          {
            src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=50&q=80",
            alt: "Health Partner 3",
          },
          {
            src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=50&q=80",
            alt: "Health Partner 4",
          },
          {
            src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=50&q=80",
            alt: "Health Partner 5",
          },
          {
            src: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=50&q=80",
            alt: "Health Partner 6",
          },
        ]}
      />

      {/* Additional spacing at bottom */}
      <div className="h-32" />
    </div>
  );
}