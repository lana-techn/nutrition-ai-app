import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('🔄 Starting bulk user sync from Clerk to database...');

    // Fetch all users from Clerk
    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList({
      limit: 500, // Adjust if you have more users
    });

    console.log(`📊 Found ${clerkUsers.data.length} users in Clerk`);

    const results = {
      total: clerkUsers.data.length,
      synced: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Sync each user
    for (const clerkUser of clerkUsers.data) {
      try {
        const userData = {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
          imageUrl: clerkUser.imageUrl || null,
          updatedAt: new Date(),
        };

        // Check if user already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.clerkId, clerkUser.id))
          .limit(1);

        if (existingUser.length > 0) {
          // Update existing user
          await db
            .update(users)
            .set(userData)
            .where(eq(users.clerkId, clerkUser.id));
          
          results.updated++;
          console.log(`✅ Updated user: ${userData.email}`);
        } else {
          // Insert new user
          await db.insert(users).values({
            ...userData,
            createdAt: new Date(),
          });
          
          results.synced++;
          console.log(`✨ Created user: ${userData.email}`);
        }
      } catch (error) {
        results.failed++;
        const errorMsg = `Failed to sync ${clerkUser.emailAddresses[0]?.emailAddress}: ${error}`;
        results.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    console.log('✅ Bulk sync completed!');
    console.log(`📊 Results: ${results.synced} new, ${results.updated} updated, ${results.failed} failed`);

    return NextResponse.json({
      success: true,
      message: 'Bulk user sync completed',
      results,
    });
  } catch (error) {
    console.error('❌ Bulk sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sync users',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check sync status
export async function GET() {
  try {
    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList({ limit: 500 });
    
    const dbUsers = await db.select().from(users);

    return NextResponse.json({
      success: true,
      clerkUserCount: clerkUsers.data.length,
      dbUserCount: dbUsers.length,
      needsSync: clerkUsers.data.length > dbUsers.length,
      difference: clerkUsers.data.length - dbUsers.length,
    });
  } catch (error) {
    console.error('Error checking sync status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check sync status',
      },
      { status: 500 }
    );
  }
}
