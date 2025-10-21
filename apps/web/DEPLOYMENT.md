# 🚀 Deployment Guide

## Step 1: Set up Neon Database

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub
   - Create a new project

2. **Get Database URL**
   - Copy the connection string from Neon dashboard
   - It looks like: `postgresql://username:password@hostname/database?sslmode=require`

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. **Connect GitHub**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo: `bettercallzaal/zaaltimelinev1`

2. **Configure Project**
   - Root Directory: `apps/web`
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`

3. **Environment Variables**
   ```
   DATABASE_URL=your_neon_connection_string_here
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to web app
cd apps/web

# Deploy
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
# Paste your Neon connection string
```

## Step 3: Initialize Database

After deployment, the database tables will be created automatically on first API call.

## Step 4: Test Deployment

1. Visit your Vercel URL
2. Add a timeline entry
3. Refresh page - data should persist
4. Check Neon dashboard for data

## 🔧 Local Development with Database

```bash
# Set up local environment
cp .env.example .env.local
# Add your DATABASE_URL to .env.local

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Start development server
pnpm dev
```

## 📊 Database Schema

```sql
CREATE TABLE timeline_entries (
  id TEXT PRIMARY KEY,
  photo TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔄 Migration from localStorage

The app automatically falls back to localStorage if the database is unavailable, so existing local data will still work during the transition.

## 🛠️ Troubleshooting

### Build Errors
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Check that Prisma generate runs successfully

### Database Connection
- Verify Neon connection string is correct
- Ensure database is not sleeping (Neon free tier)

### API Errors
- Check Vercel function logs
- Verify API routes are deployed correctly

---

*Your timeline will now persist across devices and sessions! 🎉*
