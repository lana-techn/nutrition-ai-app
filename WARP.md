# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Architecture Overview

This is a **Next.js 15** full-stack nutrition AI application built with the **App Router** architecture. The app provides AI-powered food analysis, nutrition recommendations, meal planning, and expert content with server-side rendering and API routes all in a single application.

### Application Architecture

**Full-Stack Next.js Setup:**
- **Frontend**: React 19 with Next.js App Router for server and client components
- **Backend**: Next.js API routes for all server-side functionality  
- **Database**: NeonDB (serverless PostgreSQL) with Drizzle ORM
- **AI Services**: Google Gemini API for food analysis and nutrition chat
- **Styling**: Tailwind CSS + shadcn/ui components (Radix UI based)
- **State Management**: TanStack React Query for server state
- **Deployment**: Optimized for Vercel with serverless functions

**Key Features:**
- **Type-safe full-stack**: Shared TypeScript types between frontend and backend
- **Server-side rendering**: Optimized performance with SSR and SSG
- **Serverless database**: NeonDB with connection pooling for Edge functions
- **AI-powered**: Food image analysis and nutrition chatbot using Gemini API
- **Modern UI**: shadcn/ui components with Tailwind CSS v4

### Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (backend endpoints)
│   │   ├── ai/                   # AI-related endpoints
│   │   │   ├── analyze-image/    # Food image analysis
│   │   │   └── chat/             # AI nutrition coach
│   │   └── nutrition/            # Core nutrition endpoints
│   │       ├── blog/             # Blog posts
│   │       ├── recipes/          # Recipe management
│   │       └── recommendations/  # Nutrition recommendations
│   ├── analyze/                  # Food analysis page
│   ├── chat/                     # AI chat page
│   ├── recipes/                  # Recipe pages
│   ├── blog/                     # Blog pages
│   ├── layout.tsx                # Root layout with navbar
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components (Navbar, etc.)
│   └── providers/                # Context providers (React Query)
└── lib/                         # Utilities and configuration
    ├── db.ts                    # Database connection
    ├── schema.ts                # Drizzle ORM schema
    ├── types.ts                 # TypeScript type definitions
    └── utils.ts                 # Utility functions
```

## Essential Development Commands

### Prerequisites Setup

Install required tools before starting:

```bash
# Install pnpm (package manager)
npm install -g pnpm

# Install dependencies
pnpm install
```

### Development Workflow

**Start development server:**
```bash
pnpm dev
```
This starts the Next.js development server on `http://localhost:3000` with both frontend and API routes.

**Build for production:**
```bash
pnpm build
```

**Start production server locally:**
```bash
pnpm start
```

**Lint and format code:**
```bash
# Lint code
pnpm lint

# Format with Prettier (if configured)
pnpm format
```

### Database Management

**Set up database:**
1. Create a NeonDB database at https://neon.tech
2. Copy the connection string to your `.env.local` file
3. Run the schema initialization:

```bash
# Connect to your NeonDB database and run:
psql "your-neon-connection-string" -f schema.sql
```

**Environment variables:**
Create `.env.local` file with:
```bash
DATABASE_URL="postgresql://username:password@your-neon-host/nutrition_db"
GEMINI_API_KEY="your-gemini-api-key"
```

### API Development

**API Routes Structure:**
- `GET /api/nutrition/blog` - List blog posts
- `GET /api/nutrition/blog/[id]` - Get specific blog post
- `GET /api/nutrition/recipes` - List recipes with filtering
- `GET /api/nutrition/recipes/[id]` - Get recipe with ingredients
- `POST /api/nutrition/recommendations` - Get personalized recommendations
- `POST /api/ai/analyze-image` - Analyze food image with AI
- `POST /api/ai/chat` - Chat with AI nutritionist

**Database Operations:**
Uses Drizzle ORM for type-safe database operations:
```typescript
import { db } from '@/lib/db';
import { recipes } from '@/lib/schema';

// Query examples
const allRecipes = await db.select().from(recipes);
const recipe = await db.select().from(recipes).where(eq(recipes.id, 1));
```

### Deployment to Vercel

**First-time setup:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

**Environment variables for production:**
Set these in your Vercel dashboard:
- `DATABASE_URL` - Your NeonDB connection string
- `GEMINI_API_KEY` - Your Google Gemini API key

**Automatic deployments:**
Connect your GitHub repository to Vercel for automatic deployments on every push to main branch.

## Key Implementation Details

**Database Connection:**
- Uses NeonDB serverless driver optimized for Edge Runtime
- Connection pooling configured for serverless functions
- Drizzle ORM provides type-safe queries and schema management

**API Client Pattern:**
Frontend components can directly call API routes:
```typescript
// In a React component
const { data: recipes } = useQuery({
  queryKey: ['recipes'],
  queryFn: () => fetch('/api/nutrition/recipes').then(res => res.json()),
});
```

**Server Components:**
Next.js App Router allows server components for better performance:
```typescript
// Server component - runs on server, no JavaScript sent to client
export default async function RecipesPage() {
  const recipes = await fetch('/api/nutrition/recipes').then(res => res.json());
  return <RecipesList recipes={recipes} />;
}
```

**Styling Architecture:**
- Tailwind CSS v4 for utility-first styling
- shadcn/ui for pre-built accessible components  
- class-variance-authority (CVA) for component variants
- Responsive design with mobile-first approach

**Type Safety:**
- Shared types between frontend and backend
- Database schema generates TypeScript types via Drizzle
- Full end-to-end type safety from database to UI

## Development Notes

**Performance Considerations:**
- Uses Next.js Image component for optimized images
- Server-side rendering for better SEO and initial load
- React Query for efficient data fetching and caching
- Edge-optimized database connections

**Security Features:**
- Environment variables for sensitive data
- Server-side API key management
- Input validation on API routes
- CORS handling built into Next.js

**Scalability:**
- Serverless architecture scales automatically
- NeonDB handles connection pooling and scaling
- Vercel Edge Functions for global performance
- Static site generation where applicable