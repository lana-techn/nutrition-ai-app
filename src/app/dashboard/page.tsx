'use client';

import { useUser } from '@stackframe/stack';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, Settings, Heart, TrendingUp, Target, 
  Clock, Utensils, BookOpen, Camera, MessageCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const user = useUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-slate-600 mb-4">You need to be signed in to access your dashboard.</p>
            <Button asChild>
              <Link href="/handler/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user.displayName || 'there'}! 👋
          </h1>
          <p className="text-slate-600">
            Here's your nutrition journey overview
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Today's Calories</p>
                  <p className="text-2xl font-bold">1,847</p>
                  <p className="text-emerald-200 text-xs">of 2,200 goal</p>
                </div>
                <Utensils className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Streak Days</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-blue-200 text-xs">Keep it up!</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Weight Goal</p>
                  <p className="text-2xl font-bold">-2.3 kg</p>
                  <p className="text-orange-200 text-xs">since last month</p>
                </div>
                <Target className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Health Score</p>
                  <p className="text-2xl font-bold">85</p>
                  <p className="text-purple-200 text-xs">Excellent!</p>
                </div>
                <Heart className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button
                    asChild
                    variant="outline"
                    className="h-24 flex-col space-y-2 border-emerald-200 hover:bg-emerald-50"
                  >
                    <Link href="/analyze">
                      <Camera className="h-6 w-6 text-emerald-600" />
                      <span className="text-sm">Analyze Food</span>
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
                      <p className="font-medium text-slate-800">Saved "Mediterranean Bowl" recipe</p>
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
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <span>Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{user.displayName || 'User'}</h3>
                  <p className="text-sm text-slate-600">{user.primaryEmail}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Member since:</span>
                    <span className="font-medium">
                      {new Date(user.createdAtMillis).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Plan:</span>
                    <span className="font-medium text-emerald-600">Free</span>
                  </div>
                </div>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link href="/profile">Edit Profile</Link>
                </Button>
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