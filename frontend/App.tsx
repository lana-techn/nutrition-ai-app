import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import FoodAnalysisPage from './pages/FoodAnalysisPage';
import RecommendationsPage from './pages/RecommendationsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ChatPage from './pages/ChatPage';
import MealPlannerPage from './pages/MealPlannerPage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import MealPlanDetailsPage from './pages/MealPlanDetailsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analyze" element={<FoodAnalysisPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/meal-planner" element={<MealPlannerPage />} />
              <Route path="/meal-plans/:id" element={<MealPlanDetailsPage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
