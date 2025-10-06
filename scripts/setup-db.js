const { Pool } = require('@neondatabase/serverless');
const fs = require('fs').promises;
const path = require('path');

async function setupDatabase() {
  try {
    console.log('🚀 Setting up NutriAI database...');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const pool = new Pool({ connectionString: databaseUrl });

    console.log('📡 Connected to database');

    // Read and execute schema
    console.log('📋 Creating database schema...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSQL = await fs.readFile(schemaPath, 'utf8');
    
    await pool.query(schemaSQL);
    console.log('✅ Database schema created successfully');

    // Read and execute seed data
    console.log('🌱 Seeding database with sample data...');
    const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
    const seedSQL = await fs.readFile(seedPath, 'utf8');
    
    await pool.query(seedSQL);
    console.log('✅ Sample data seeded successfully');

    // Verify setup by counting records
    console.log('\n📊 Verifying database setup:');
    
    const tables = [
      { name: 'users', display: 'Users' },
      { name: 'food_items', display: 'Food Items' },
      { name: 'recipes', display: 'Recipes' },
      { name: 'blog_posts', display: 'Blog Posts' },
      { name: 'recipe_ingredients', display: 'Recipe Ingredients' }
    ];

    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) as count FROM ${table.name}`);
      console.log(`   ${table.display}: ${result.rows[0].count} records`);
    }

    await pool.end();
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure your .env.local file has the correct DATABASE_URL');
    console.log('   2. Run `pnpm dev` to start the application');
    console.log('   3. Visit http://localhost:3000 to see your nutrition AI app');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();