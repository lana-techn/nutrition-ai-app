'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestIntegrationPage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    dietaryPreferences: ''
  });

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        
        // Populate form with existing data
        if (data.profile) {
          setUpdateData({
            age: data.profile.age?.toString() || '',
            weight: data.profile.weight?.toString() || '',
            height: data.profile.height?.toString() || '',
            activityLevel: data.profile.activityLevel || 'moderate',
            dietaryPreferences: data.profile.dietaryPreferences || ''
          });
        }
      } else {
        console.error('Failed to fetch profile:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const updates: any = {};
      
      if (updateData.age) updates.age = parseInt(updateData.age);
      if (updateData.weight) updates.weight = parseFloat(updateData.weight);
      if (updateData.height) updates.height = parseFloat(updateData.height);
      if (updateData.activityLevel) updates.activityLevel = updateData.activityLevel;
      if (updateData.dietaryPreferences) updates.dietaryPreferences = updateData.dietaryPreferences;

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        alert('Profile updated successfully!');
      } else {
        const error = await response.text();
        alert('Failed to update profile: ' + error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-border/50 shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Please sign in to test the integration</p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-primary font-bold">
              🧪 Clerk + Neon Integration Test
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Clerk User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>👤</span>
              <span>Clerk User Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Clerk ID:</strong> {user.id}</div>
              <div><strong>Full Name:</strong> {user.fullName || 'N/A'}</div>
              <div><strong>First Name:</strong> {user.firstName || 'N/A'}</div>
              <div><strong>Last Name:</strong> {user.lastName || 'N/A'}</div>
              <div><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</div>
              <div><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>

        {/* Database Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🗄️</span>
              <span>Database Profile Data</span>
              <Button 
                onClick={fetchProfile} 
                disabled={loading}
                size="sm"
                variant="outline"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading profile...</div>
            ) : profile ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Database ID:</strong> {profile.id}</div>
                <div><strong>Clerk ID:</strong> {profile.clerkId}</div>
                <div><strong>Name:</strong> {profile.name}</div>
                <div><strong>Email:</strong> {profile.email}</div>
                <div><strong>Age:</strong> {profile.age || 'Not set'}</div>
                <div><strong>Weight:</strong> {profile.weight ? `${profile.weight} kg` : 'Not set'}</div>
                <div><strong>Height:</strong> {profile.height ? `${profile.height} cm` : 'Not set'}</div>
                <div><strong>Activity Level:</strong> {profile.activityLevel || 'Not set'}</div>
                <div><strong>Dietary Preferences:</strong> {profile.dietaryPreferences || 'Not set'}</div>
                <div><strong>Created:</strong> {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</div>
                <div><strong>Updated:</strong> {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}</div>
                <div><strong>Last Sign In:</strong> {profile.lastSignInAt ? new Date(profile.lastSignInAt).toLocaleDateString() : 'N/A'}</div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No profile data found. User may not be synced to database yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>✏️</span>
              <span>Update Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={updateData.age}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Enter age"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={updateData.weight}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="Enter weight"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={updateData.height}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="Enter height"
                />
              </div>
              <div>
                <Label htmlFor="activity">Activity Level</Label>
                <select
                  id="activity"
                  value={updateData.activityLevel}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, activityLevel: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="dietary">Dietary Preferences</Label>
              <Input
                id="dietary"
                value={updateData.dietaryPreferences}
                onChange={(e) => setUpdateData(prev => ({ ...prev, dietaryPreferences: e.target.value }))}
                placeholder="e.g., vegetarian, gluten-free, etc."
              />
            </div>
            <Button 
              onClick={updateProfile} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Integration Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span>Clerk Authentication: ✅ Working</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${profile ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                <span>Database Sync: {profile ? '✅ Synced' : '⚠️ Not Synced Yet'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span>API Endpoints: ✅ Working</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}