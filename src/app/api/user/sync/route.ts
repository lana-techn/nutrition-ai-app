import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { syncUserFromClerk, getUserByClerkId } from '@/lib/user-service';

/**
 * API endpoint to manually sync user from Clerk to database
 * This is a fallback mechanism if webhook fails
 */
export async function POST() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized - No user found' },
        { status: 401 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByClerkId(clerkUser.id);
    
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'User already synced',
        user: existingUser,
        alreadyExists: true,
      });
    }

    // Sync user from Clerk
    const syncedUser = await syncUserFromClerk();

    if (!syncedUser) {
      return NextResponse.json(
        { error: 'Failed to sync user from Clerk' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User synced successfully',
      user: syncedUser,
      alreadyExists: false,
    });
  } catch (error) {
    console.error('Error in user sync endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check user sync status
 */
export async function GET() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized - No user found' },
        { status: 401 }
      );
    }

    // Check if user exists in database
    const dbUser = await getUserByClerkId(clerkUser.id);
    
    return NextResponse.json({
      clerkUser: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
      },
      dbUser: dbUser,
      isSynced: !!dbUser,
    });
  } catch (error) {
    console.error('Error checking user sync status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
