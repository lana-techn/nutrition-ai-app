import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { sql } from 'drizzle-orm';

/**
 * Admin endpoint to test database connection and schema
 * Useful for debugging sync issues
 */
export async function GET() {
  try {
    const tests = {
      connection: false,
      tableExists: false,
      clerkIdColumn: false,
      userCount: 0,
      sampleUsers: [] as any[],
    };

    // Test 1: Database connection
    try {
      await db.execute(sql`SELECT 1`);
      tests.connection = true;
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        tests,
      }, { status: 500 });
    }

    // Test 2: Check if users table exists
    try {
      const result = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'users'
        ) as exists
      `);
      tests.tableExists = (result.rows[0]?.exists === true) || false;
    } catch (error) {
      console.error('Error checking table existence:', error);
    }

    if (!tests.tableExists) {
      return NextResponse.json({
        success: false,
        error: 'Users table does not exist. Please run database migration.',
        hint: 'Run: pnpm db:migrate:clerk',
        tests,
      }, { status: 500 });
    }

    // Test 3: Check if clerk_id column exists
    try {
      const result = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'users' 
          AND column_name = 'clerk_id'
        ) as exists
      `);
      tests.clerkIdColumn = (result.rows[0]?.exists === true) || false;
    } catch (error) {
      console.error('Error checking clerk_id column:', error);
    }

    if (!tests.clerkIdColumn) {
      return NextResponse.json({
        success: false,
        error: 'clerk_id column not found in users table',
        hint: 'Run migration: pnpm db:migrate:clerk',
        tests,
      }, { status: 500 });
    }

    // Test 4: Get user count
    try {
      const result = await db.select().from(users);
      tests.userCount = result.length;
      tests.sampleUsers = result.slice(0, 3).map(u => ({
        id: u.id,
        clerkId: u.clerkId,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
      }));
    } catch (error) {
      console.error('Error getting user count:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Database is properly configured for Clerk integration',
      tests,
      schema: {
        hasClerkId: tests.clerkIdColumn,
        tableExists: tests.tableExists,
      },
    });

  } catch (error) {
    console.error('Error testing database:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
