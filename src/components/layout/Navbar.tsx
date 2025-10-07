'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Apple, Camera, BookOpen, MessageCircle, Target, ChefHat, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@stackframe/stack';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const pathname = usePathname();
  const user = useUser();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Apple className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-foreground">NutriAI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link href="/">Home</Link>
            </Button>
            <Button
              variant={isActive('/analyze') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link href="/analyze" className="flex items-center space-x-1">
                <Camera className="h-4 w-4" />
                <span>Analyze Food</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/recommendations') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link href="/recommendations" className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>Recommendations</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/meal-planner') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link href="/meal-planner" className="flex items-center space-x-1">
                <ChefHat className="h-4 w-4" />
                <span>Meal Planner</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/recipes') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link href="/recipes" className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>Recipes</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/blog') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link href="/blog" className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/chat') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link href="/chat" className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>AI Chat</span>
              </Link>
            </Button>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:inline">{user.displayName || user.primaryEmail}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => user.signOut()}
                    className="flex items-center space-x-2 text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/handler/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/handler/sign-up">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}