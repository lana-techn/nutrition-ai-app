"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ModernNavbar() {
  return <Navbar className="top-6" />;
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <div className={cn("fixed top-6 inset-x-0 max-w-6xl mx-auto z-50", className)}>
      <div className="flex items-center justify-between w-full bg-card/80 backdrop-blur-md border border-border/50 rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-card/90">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Apple className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">NutriAI</span>
        </Link>

        {/* Main Navigation */}
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Features">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/analyze">
                <div className="flex items-center space-x-2">
                  <span>📸</span>
                  <div>
                    <div className="font-medium">Food Analysis</div>
                    <div className="text-xs text-muted-foreground">Analyze food photos with AI</div>
                  </div>
                </div>
              </HoveredLink>
              <HoveredLink href="/meal-planner">
                <div className="flex items-center space-x-2">
                  <span>🍽️</span>
                  <div>
                    <div className="font-medium">Meal Planner</div>
                    <div className="text-xs text-muted-foreground">Plan your weekly meals</div>
                  </div>
                </div>
              </HoveredLink>
              <HoveredLink href="/recommendations">
                <div className="flex items-center space-x-2">
                  <span>💡</span>
                  <div>
                    <div className="font-medium">AI Recommendations</div>
                    <div className="text-xs text-muted-foreground">Personalized nutrition tips</div>
                  </div>
                </div>
              </HoveredLink>
              <HoveredLink href="/chat">
                <div className="flex items-center space-x-2">
                  <span>💬</span>
                  <div>
                    <div className="font-medium">AI Chat</div>
                    <div className="text-xs text-muted-foreground">Ask nutrition questions</div>
                  </div>
                </div>
              </HoveredLink>
            </div>
          </MenuItem>
          
          <MenuItem setActive={setActive} active={active} item="Resources">
            <div className="grid grid-cols-1 gap-6 p-4 min-w-[400px]">
              <ProductItem
                title="Recipe Collection"
                href="/recipes"
                src="/api/placeholder/400/200"
                description="Discover healthy recipes tailored to your dietary needs and preferences."
              />
              <ProductItem
                title="Nutrition Blog"
                href="/blog"
                src="/api/placeholder/400/200"
                description="Expert articles on nutrition, health tips, and wellness guidance."
              />
              <ProductItem
                title="Meal Analysis"
                href="/analyze"
                src="/api/placeholder/400/200"
                description="Analyze your food photos with AI to get detailed nutritional information."
              />
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Dashboard">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/dashboard">
                <div className="flex items-center space-x-2">
                  <span>📊</span>
                  <div>
                    <div className="font-medium">Overview</div>
                    <div className="text-xs text-muted-foreground">Your nutrition dashboard</div>
                  </div>
                </div>
              </HoveredLink>
              <HoveredLink href="/analyze">
                <div className="flex items-center space-x-2">
                  <span>📸</span>
                  <div>
                    <div className="font-medium">Food Analysis</div>
                    <div className="text-xs text-muted-foreground">Analyze your meals</div>
                  </div>
                </div>
              </HoveredLink>
              <HoveredLink href="/meal-planner">
                <div className="flex items-center space-x-2">
                  <span>🍽️</span>
                  <div>
                    <div className="font-medium">Meal Planner</div>
                    <div className="text-xs text-muted-foreground">Plan your weekly meals</div>
                  </div>
                </div>
              </HoveredLink>
            </div>
          </MenuItem>
        </Menu>

        {/* Right side - Auth & Theme */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Separator */}
          <div className="w-px h-6 bg-border/50"></div>
          
          {/* Auth Section */}
          <SignedOut>
            <div className="flex items-center space-x-2">
              <SignInButton>
                <Button variant="ghost" size="sm" className="text-sm px-3 py-1.5">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-sm px-3 py-1.5">
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonTrigger: "focus:shadow-none"
                }
              }}
              showName={false}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}