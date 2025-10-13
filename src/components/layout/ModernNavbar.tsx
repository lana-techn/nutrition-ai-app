"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Apple, MenuIcon, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ModernNavbar() {
  return <Navbar className="top-2 sm:top-6" />;
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <div className={cn("fixed inset-x-0 max-w-6xl mx-2 sm:mx-auto z-50", className)}>
        <div className="flex items-center justify-between w-full bg-card/80 backdrop-blur-md border border-border/50 rounded-full px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-card/90">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Apple className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="text-base sm:text-lg font-bold text-foreground">NutriAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
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
                  <HoveredLink href="/journal-search">
                    <div className="flex items-center space-x-2">
                      <span>🔍</span>
                      <div>
                        <div className="font-medium">Journal Search</div>
                        <div className="text-xs text-muted-foreground">Search academic papers</div>
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
                    title="Journal Search"
                    href="/journal-search"
                    src="/api/placeholder/400/200"
                    description="Search academic papers and journals on health, nutrition, and medical research."
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
          </div>

          {/* Right side - Auth & Theme */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Separator - Hidden on mobile */}
            <div className="hidden sm:block w-px h-6 bg-border/50"></div>
            
            {/* Auth Section - Hidden on mobile, replaced by menu button */}
            <div className="hidden md:flex items-center space-x-2">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/95 backdrop-blur-md z-40 lg:hidden"
          onClick={closeMobileMenu}
        >
          <div 
            className="fixed top-20 left-0 right-0 bottom-0 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto px-4 py-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-6">
                {/* Features Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Features</h3>
                  <Link 
                    href="/analyze" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-2xl">📸</span>
                    <div>
                      <div className="font-medium text-foreground">Food Analysis</div>
                      <div className="text-sm text-muted-foreground">Analyze food photos with AI</div>
                    </div>
                  </Link>
                  <Link 
                    href="/meal-planner" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-2xl">🍽️</span>
                    <div>
                      <div className="font-medium text-foreground">Meal Planner</div>
                      <div className="text-sm text-muted-foreground">Plan your weekly meals</div>
                    </div>
                  </Link>
                  <Link 
                    href="/recommendations" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-2xl">💡</span>
                    <div>
                      <div className="font-medium text-foreground">AI Recommendations</div>
                      <div className="text-sm text-muted-foreground">Personalized nutrition tips</div>
                    </div>
                  </Link>
                  <Link 
                    href="/chat" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-2xl">💬</span>
                    <div>
                      <div className="font-medium text-foreground">AI Chat</div>
                      <div className="text-sm text-muted-foreground">Ask nutrition questions</div>
                    </div>
                  </Link>
                </div>

                {/* Resources Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Resources</h3>
                  <Link 
                    href="/recipes" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-2xl">👨‍🍳</span>
                    <div>
                      <div className="font-medium text-foreground">Recipe Collection</div>
                      <div className="text-sm text-muted-foreground">Healthy recipes for you</div>
                    </div>
                  </Link>
                  <Link 
                    href="/blog" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-2xl">📝</span>
                    <div>
                      <div className="font-medium text-foreground">Nutrition Blog</div>
                      <div className="text-sm text-muted-foreground">Expert health tips</div>
                    </div>
                  </Link>
                  <Link 
                    href="/journal-search" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-2xl">🔍</span>
                    <div>
                      <div className="font-medium text-foreground">Journal Search</div>
                      <div className="text-sm text-muted-foreground">Search academic papers</div>
                    </div>
                  </Link>
                </div>

                {/* Dashboard Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dashboard</h3>
                  <Link 
                    href="/dashboard" 
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-2xl">📊</span>
                    <div>
                      <div className="font-medium text-foreground">Overview</div>
                      <div className="text-sm text-muted-foreground">Your nutrition dashboard</div>
                    </div>
                  </Link>
                </div>

                {/* Auth Section */}
                <div className="pt-4 border-t border-border">
                  <SignedOut>
                    <div className="space-y-3">
                      <SignInButton>
                        <Button variant="outline" className="w-full" size="lg">
                          Sign In
                        </Button>
                      </SignInButton>
                      <SignUpButton>
                        <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                          Get Started
                        </Button>
                      </SignUpButton>
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                      <span className="text-sm font-medium text-foreground">Account</span>
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10",
                            userButtonTrigger: "focus:shadow-none"
                          }
                        }}
                        showName={false}
                        afterSignOutUrl="/"
                      />
                    </div>
                  </SignedIn>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}