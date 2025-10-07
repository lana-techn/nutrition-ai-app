import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';

export interface UserProfile {
  id: number;
  clerkId: string;
  name: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  activityLevel: string | null;
  dietaryPreferences: string | null;
  isVerified: boolean | null;
  lastSignInAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface UserProfileUpdate {
  age?: number;
  weight?: number;
  height?: number;
  activityLevel?: string;
  dietaryPreferences?: string;
}

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string): Promise<UserProfile | null> {
  try {
    const result = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error getting user by Clerk ID:', error);
    return null;
  }
}

/**
 * Get current user profile (requires authentication)
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    return await getUserByClerkId(user.id);
  } catch (error) {
    console.error('Error getting current user profile:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  clerkId: string,
  updates: UserProfileUpdate
): Promise<UserProfile | null> {
  try {
    const result = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, clerkId))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

/**
 * Create user profile (usually called from webhook)
 */
export async function createUserProfile(userData: {
  clerkId: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}): Promise<UserProfile | null> {
  try {
    const result = await db
      .insert(users)
      .values({
        clerkId: userData.clerkId,
        name: userData.name,
        email: userData.email,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        imageUrl: userData.imageUrl || null,
        createdAt: new Date(),
      })
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
}

/**
 * Delete user profile
 */
export async function deleteUserProfile(clerkId: string): Promise<boolean> {
  try {
    const result = await db.delete(users).where(eq(users.clerkId, clerkId));
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return false;
  }
}

/**
 * Sync user from Clerk (fallback method if webhook fails)
 */
export async function syncUserFromClerk(): Promise<UserProfile | null> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    // Check if user exists in database
    let dbUser = await getUserByClerkId(clerkUser.id);

    if (!dbUser) {
      // Create user if doesn't exist
      dbUser = await createUserProfile({
        clerkId: clerkUser.id,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      });
    }

    return dbUser;
  } catch (error) {
    console.error('Error syncing user from Clerk:', error);
    return null;
  }
}

/**
 * Get user BMI calculation
 */
export function calculateBMI(weight: number, height: number): number | null {
  if (!weight || !height || weight <= 0 || height <= 0) return null;
  
  const heightInMeters = height / 100; // Convert cm to meters
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/**
 * Calculate daily calorie needs (using Mifflin-St Jeor Equation)
 */
export function calculateDailyCalorieNeeds(
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number | null {
  if (!weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) return null;

  // Base Metabolic Rate (BMR)
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return Math.round(bmr * activityMultipliers[activityLevel]);
}