import { Link, useLocation } from 'react-router-dom';
import { Apple, Camera, BookOpen, MessageCircle, Target, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Apple className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-foreground">NutriAI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              variant={isActive('/analyze') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/analyze" className="flex items-center space-x-1">
                <Camera className="h-4 w-4" />
                <span>Analyze Food</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/recommendations') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/recommendations" className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>Recommendations</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/meal-planner') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/meal-planner" className="flex items-center space-x-1">
                <ChefHat className="h-4 w-4" />
                <span>Meal Planner</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/recipes') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/recipes" className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>Recipes</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/blog') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/blog" className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/chat') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/chat" className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>AI Chat</span>
              </Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
