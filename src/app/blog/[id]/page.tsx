'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, Calendar, User, Clock, BookOpen, Share2, Bookmark, 
  Twitter, Facebook, Linkedin, Copy, Heart, MessageCircle, 
  TrendingUp, Tag, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { BlogPost } from '@/lib/types';

export default function BlogPostDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/nutrition/blog/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
        setLikeCount(Math.floor(Math.random() * 100) + 20); // Mock like count
      } else {
        console.error('Post not found');
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  };

  const getReadingTime = (content: string) => {
    if (!content || typeof content !== 'string') {
      return 5;
    }
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    const text = post?.excerpt || '';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        break;
      case 'facebook':
        window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // You could add a toast notification here
        break;
    }
    setShowShareMenu(false);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save to backend
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    // Here you would typically save to backend
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="max-w-4xl mx-auto">
              <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-700 mb-2">Article not found</h1>
            <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/blog">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                  <div className="py-2">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                      Share on Facebook
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                      Share on LinkedIn
                    </button>
                    <Separator className="my-1" />
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleBookmark}
              className={isBookmarked ? 'bg-teal-50 border-teal-200' : ''}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-teal-500 text-teal-500' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <Card className="border-0 shadow-xl bg-white mb-8">
            <CardContent className="p-8">
              {/* Category Badge */}
              <div className="mb-4">
                <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200">
                  <Tag className="h-3 w-3 mr-1" />
                  {post.category}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {post.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{getReadingTime(post.content)} min read</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>{Math.floor(Math.random() * 1000) + 500} views</span>
                </div>
              </div>

              {/* Interaction Buttons */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleLike}
                  className={`${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-red-500' : ''}`} />
                  {likeCount} likes
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {Math.floor(Math.random() * 50) + 10} comments
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          {post.imageUrl && (
            <Card className="border-0 shadow-xl overflow-hidden bg-white mb-8">
              <div className="relative h-96 md:h-[500px]">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          )}

          {/* Article Content */}
          <Card className="border-0 shadow-xl bg-white mb-8">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ 
                    __html: `<p>${formatContent(post.content)}</p>`
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Author Bio */}
          <Card className="border-0 shadow-xl bg-white mb-8">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-green-400 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About {post.author}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {post.author} is a certified nutrition specialist with over 10 years of experience 
                    in helping people achieve their health and wellness goals through evidence-based 
                    nutrition strategies and personalized meal planning.
                  </p>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Certified Nutritionist
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {Math.floor(Math.random() * 50) + 20} articles published
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="flex items-center text-teal-600">
                <BookOpen className="h-5 w-5 mr-2" />
                You might also like
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mock related articles */}
                {[
                  'The Science Behind Intermittent Fasting',
                  'Plant-Based Nutrition for Athletes',
                  'Understanding Macro vs Micro Nutrients'
                ].map((title, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors cursor-pointer"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
                    <p className="text-sm text-gray-500">
                      {Math.floor(Math.random() * 10) + 5} min read • {post.category}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Signup */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-teal-500 to-green-500 mt-8">
            <CardContent className="p-8 text-center text-white">
              <BookOpen className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Stay Informed</h3>
              <p className="text-teal-100 mb-6">
                Get the latest nutrition research and healthy recipes delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-white text-gray-900"
                />
                <Button className="bg-white text-teal-600 hover:bg-gray-100 font-semibold">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}