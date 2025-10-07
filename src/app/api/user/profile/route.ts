import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getCurrentUserProfile, updateUserProfile, syncUserFromClerk } from '@/lib/user-service';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to get user profile from database
    let userProfile = await getCurrentUserProfile();
    
    // If user doesn't exist in database, sync from Clerk
    if (!userProfile) {
      userProfile = await syncUserFromClerk();
    }

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: userProfile });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { age, weight, height, activityLevel, dietaryPreferences } = body;

    // Validate input
    const updates: any = {};
    
    if (age !== undefined) {
      if (typeof age !== 'number' || age < 0 || age > 150) {
        return NextResponse.json({ error: 'Invalid age' }, { status: 400 });
      }
      updates.age = age;
    }

    if (weight !== undefined) {
      if (typeof weight !== 'number' || weight < 0 || weight > 1000) {
        return NextResponse.json({ error: 'Invalid weight' }, { status: 400 });
      }
      updates.weight = weight;
    }

    if (height !== undefined) {
      if (typeof height !== 'number' || height < 0 || height > 300) {
        return NextResponse.json({ error: 'Invalid height' }, { status: 400 });
      }
      updates.height = height;
    }

    if (activityLevel !== undefined) {
      const validActivityLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
      if (!validActivityLevels.includes(activityLevel)) {
        return NextResponse.json({ error: 'Invalid activity level' }, { status: 400 });
      }
      updates.activityLevel = activityLevel;
    }

    if (dietaryPreferences !== undefined) {
      if (typeof dietaryPreferences !== 'string') {
        return NextResponse.json({ error: 'Invalid dietary preferences' }, { status: 400 });
      }
      updates.dietaryPreferences = dietaryPreferences;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const updatedProfile = await updateUserProfile(userId, updates);

    if (!updatedProfile) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}