import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import backend from '~backend/client';

export default function BlogPage() {
  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => backend.nutrition.listBlogPosts(),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Unable to load blog posts
          </h1>
          <p className="text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const posts = postsData?.posts || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Nutrition Education Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Expert insights, research-backed advice, and practical tips for better nutrition
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No posts yet</h2>
            <p className="text-muted-foreground">
              Check back soon for expert nutrition content!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="mb-2">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">
                    <Link 
                      to={`/blog/${post.id}`}
                      className="hover:text-green-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Categories Overview */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Explore Topics
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <CardContent className="pt-0">
                <h3 className="font-semibold text-green-600 mb-2">Basics</h3>
                <p className="text-sm text-muted-foreground">
                  Fundamental nutrition concepts and macronutrients
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="pt-0">
                <h3 className="font-semibold text-blue-600 mb-2">Age Groups</h3>
                <p className="text-sm text-muted-foreground">
                  Nutrition advice for different life stages
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="pt-0">
                <h3 className="font-semibold text-purple-600 mb-2">Sports</h3>
                <p className="text-sm text-muted-foreground">
                  Athletic performance and recovery nutrition
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="pt-0">
                <h3 className="font-semibold text-orange-600 mb-2">Health</h3>
                <p className="text-sm text-muted-foreground">
                  Disease prevention and therapeutic nutrition
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
