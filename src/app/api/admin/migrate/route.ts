import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  // Simple authentication (dalam production, gunakan auth yang proper)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== 'Bearer admin-secret-key') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Drop existing users table
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);

    // Create updated users table untuk Clerk integration
    await db.execute(sql`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        clerk_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        first_name TEXT,
        last_name TEXT,
        image_url TEXT,
        age INTEGER,
        weight DOUBLE PRECISION,
        height DOUBLE PRECISION,
        activity_level TEXT,
        dietary_preferences TEXT,
        is_verified BOOLEAN DEFAULT TRUE,
        last_sign_in_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await db.execute(sql`CREATE INDEX idx_users_clerk_id ON users(clerk_id)`);
    await db.execute(sql`CREATE INDEX idx_users_email ON users(email)`);

    // Create trigger function
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION update_users_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    // Create trigger
    await db.execute(sql`
      CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW 
        EXECUTE FUNCTION update_users_updated_at()
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Database migration completed successfully' 
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Migration endpoint. Use POST with proper authorization to run migration.' 
  });
}