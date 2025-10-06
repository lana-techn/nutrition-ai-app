# Database Setup Guide

This directory contains the database schema and seed data for the NutriAI application.

## Prerequisites

1. **NeonDB Account**: Create a free account at [neon.tech](https://neon.tech)
2. **Database Instance**: Create a new PostgreSQL database instance
3. **Environment Variables**: Set up your `.env.local` file with the database connection string

## Quick Setup

### Option 1: Automated Setup (Recommended)

```bash
# Copy environment variables
cp .env.example .env.local

# Edit .env.local and add your DATABASE_URL and GEMINI_API_KEY

# Run the automated setup script
pnpm db:setup
```

### Option 2: Manual Setup

```bash
# Create schema
pnpm db:schema

# Seed with sample data
pnpm db:seed
```

### Option 3: Using psql directly

```bash
# Set your database URL
export DATABASE_URL="your-neon-connection-string"

# Create schema
psql $DATABASE_URL -f database/schema.sql

# Add sample data
psql $DATABASE_URL -f database/seed.sql
```

## Database Schema

The database includes the following tables:

### Core Tables
- **users**: User accounts and profiles
- **food_items**: Nutritional database of food items
- **recipes**: Recipe collection with nutrition info
- **blog_posts**: Nutrition articles and content

### Functional Tables
- **nutrition_logs**: User food intake tracking
- **food_analysis**: AI food image analysis results
- **meal_plans**: Weekly meal planning
- **meal_plan_entries**: Individual meals in meal plans
- **recipe_ingredients**: Recipe to food item relationships

## Sample Data

The seed file includes:
- **28 food items** with complete nutritional information
- **9 recipes** across different meal types and cuisines
- **5 blog articles** on various nutrition topics
- **4 sample users** for testing
- **Recipe ingredients** relationships

## Schema Features

- **PostgreSQL arrays** for dietary tags and preferences
- **Custom enums** for difficulty and meal types
- **Indexes** on frequently queried columns
- **Triggers** for automatic timestamp updates
- **Foreign key constraints** for data integrity

## Troubleshooting

### Connection Issues
- Ensure your DATABASE_URL is correctly formatted
- Check that your NeonDB instance is active
- Verify network connectivity to NeonDB

### Permission Errors
- Make sure your database user has CREATE privileges
- Check that the database exists before running schema

### Data Issues
- Run schema before seed to ensure tables exist
- Check for any conflicting data if re-running seed

## Environment Variables

Required environment variables in `.env.local`:

```bash
DATABASE_URL="postgresql://username:password@your-neon-host/nutrition_db"
GEMINI_API_KEY="your-gemini-api-key-here"
```

## Development Workflow

1. Make schema changes in `schema.sql`
2. Test changes locally with `pnpm db:setup`
3. Update seed data if needed in `seed.sql`
4. Document any breaking changes in migration notes

## Production Deployment

For production deployment:

1. Create production database in NeonDB
2. Run schema setup: `pnpm db:schema`
3. Optionally seed with sample data: `pnpm db:seed`
4. Set production DATABASE_URL in deployment environment

## Data Backup

To backup your data:

```bash
# Backup schema and data
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```