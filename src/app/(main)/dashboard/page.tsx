'use client';

import { useUser, SignInButton } from '@clerk/nextjs';

// Force this page to be dynamic to avoid SSR issues with authentication
export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, Settings, Heart, TrendingUp, Target, 
  Clock, Utensils, BookOpen, Camera, MessageCircle 
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/user-service';

export default function DashboardPage() {
  const user = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch user profile from database
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-border/50 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Welcome to NutriAI</h2>
            <p className="text-muted-foreground mb-6">Sign in to access your personalized nutrition dashboard and start your health journey.</p>
            <SignInButton>
              <Button className="w-full bg-primary hover:bg-primary/90">Sign In to Continue</Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">
                Welcome back, {user.firstName || user.fullName || 'there'}! 👋
              </h1>
              <p className="text-xl text-muted-foreground">
                Here&apos;s your nutrition journey overview
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border border-border/50 shadow-sm bg-card hover:shadow-md transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Today&apos;s Calories</p>
                  <p className="text-3xl font-bold text-foreground mt-2">1,847</p>
                  <p className="text-xs text-muted-foreground mt-1">of 2,200 goal</p>
                  <div className="w-full bg-secondary rounded-full h-1.5 mt-3">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm bg-card hover:shadow-md transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Streak Days</p>
                  <p className="text-3xl font-bold text-foreground mt-2">12</p>
                  <p className="text-xs text-success mt-1">Keep it up! 🔥</p>
                  <div className="flex items-center mt-2">
                    <div className="flex space-x-1">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${ i < 5 ? 'bg-success' : 'bg-secondary' }`}></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-success/10 p-3 rounded-full group-hover:bg-success/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm bg-card hover:shadow-md transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Weight Goal</p>
                  <p className="text-3xl font-bold text-foreground mt-2">-2.3 kg</p>
                  <p className="text-xs text-warning mt-1">since last month</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <div className="text-xs px-2 py-1 bg-warning/10 text-warning rounded-full">
                      On track
                    </div>
                  </div>
                </div>
                <div className="bg-warning/10 p-3 rounded-full group-hover:bg-warning/20 transition-colors">
                  <Target className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm bg-card hover:shadow-md transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Health Score</p>
                  <p className="text-3xl font-bold text-foreground mt-2">85</p>
                  <p className="text-xs text-success mt-1">Excellent! 💚</p>
                  <div className="w-full bg-secondary rounded-full h-1.5 mt-3">
                    <div className="bg-gradient-to-r from-success to-primary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="bg-red-500/10 p-3 rounded-full group-hover:bg-red-500/20 transition-colors">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border border-border/50 shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-foreground">Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button
                    asChild
                    variant="outline"
                    className="h-28 flex-col space-y-3 border-border/50 hover:bg-accent hover:text-accent-foreground hover:border-primary/20 transition-all duration-200 group"
                  >
                    <Link href="/analyze" className="flex flex-col items-center space-y-2">
                      <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Camera className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Analyze Food</span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-24 flex-col space-y-2 border-blue-200 hover:bg-blue-50"
                  >
                    <Link href="/meal-planner">
                      <Utensils className="h-6 w-6 text-blue-600" />
                      <span className="text-sm">Meal Plan</span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-24 flex-col space-y-2 border-orange-200 hover:bg-orange-50"
                  >
                    <Link href="/recipes">
                      <BookOpen className="h-6 w-6 text-orange-600" />
                      <span className="text-sm">Recipes</span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-24 flex-col space-y-2 border-purple-200 hover:bg-purple-50"
                  >
                    <Link href="/chat">
                      <MessageCircle className="h-6 w-6 text-purple-600" />
                      <span className="text-sm">AI Chat</span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-24 flex-col space-y-2 border-teal-200 hover:bg-teal-50"
                  >
                    <Link href="/recommendations">
                      <TrendingUp className="h-6 w-6 text-teal-600" />
                      <span className="text-sm">Get Tips</span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-24 flex-col space-y-2 border-slate-200 hover:bg-slate-50"
                  >
                    <Link href="/profile">
                      <Settings className="h-6 w-6 text-slate-600" />
                      <span className="text-sm">Settings</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-xl bg-white mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                    <Camera className="h-5 w-5 text-emerald-600" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">Analyzed breakfast photo</p>
                      <p className="text-sm text-slate-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Utensils className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">Updated meal plan for this week</p>
                      <p className="text-sm text-slate-600">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">Saved &quot;Mediterranean Bowl&quot; recipe</p>
                      <p className="text-sm text-slate-600">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile & Progress */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border border-border/50 shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-foreground">Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingProfile ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="text-sm text-slate-600 mt-2">Loading profile...</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      {userProfile?.imageUrl ? (
                        <img 
                          src={userProfile.imageUrl} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <User className="h-10 w-10 text-white" />
                        </div>
                      )}
                      <h3 className="font-semibold text-slate-900">{userProfile?.name || user?.fullName || 'User'}</h3>
                      <p className="text-sm text-slate-600">{userProfile?.email || user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Member since:</span>
                        <span className="font-medium">
                          {userProfile?.createdAt 
                            ? new Date(userProfile.createdAt).toLocaleDateString()
                            : new Date(user?.createdAt).toLocaleDateString()
                          }
                        </span>
                      </div>
                      {userProfile?.age && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Age:</span>
                          <span className="font-medium">{userProfile.age} years</span>
                        </div>
                      )}
                      {userProfile?.weight && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Weight:</span>
                          <span className="font-medium">{userProfile.weight} kg</span>
                        </div>
                      )}
                      {userProfile?.height && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Height:</span>
                          <span className="font-medium">{userProfile.height} cm</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-600">Plan:</span>
                        <span className="font-medium text-emerald-600">Free</span>
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4" variant="outline">
                      <Link href="/profile">Edit Profile</Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>This Week</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Nutrition Goals</span>
                      <span className="font-medium">6/7 days</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '86%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Water Intake</span>
                      <span className="font-medium">1.8L / 2.5L</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Exercise</span>
                      <span className="font-medium">3/5 sessions</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}