import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import backend from '~backend/client';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => backend.nutrition.getBlogPost({ id: parseInt(id!) }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-16 mb-6"></div>
            <div className="h-10 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Blog post not found
          </h1>
          <p className="text-muted-foreground mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </Button>

        {/* Article Header */}
        <header className="mb-8">
          <Badge variant="secondary" className="mb-4">
            {post.category}
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <Card>
          <CardContent className="prose prose-gray max-w-none pt-6">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {post.content}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-8 bg-green-50/50 border-green-200">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Ready to Apply This Knowledge?
            </h3>
            <p className="text-green-700 mb-4">
              Get personalized nutrition recommendations or chat with our AI nutritionist
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/recommendations">
                  Get Personal Recommendations
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/chat">
                  Chat with AI Nutritionist
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Continue Learning
          </h3>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Link 
                  to="/blog" 
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h4 className="font-semibold mb-2">Explore More Articles</h4>
                  <p className="text-sm text-muted-foreground">
                    Discover more evidence-based nutrition content
                  </p>
                </Link>
                <Link 
                  to="/analyze" 
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h4 className="font-semibold mb-2">Analyze Your Food</h4>
                  <p className="text-sm text-muted-foreground">
                    Use AI to analyze your meals and track nutrition
                  </p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
