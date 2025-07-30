# Quick Database Setup Fix

## 🚨 Current Issue
The database setup is failing due to UUID constraints. Here's how to fix it:

## ✅ Step-by-Step Fix

### 1. Clear Existing Database (if any)
If you already ran the SQL script and got errors, you need to clear the database first:

1. Go to your Supabase project
2. Go to **SQL Editor**
3. Run this to drop all tables:
```sql
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

### 2. Run the Fixed SQL Script
1. Copy the **entire content** from `scripts/setup-database.sql`
2. Paste it in your Supabase SQL Editor
3. Click **Run**

### 3. Set Environment Variables
Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here
```

### 4. Restart Your Server
```bash
pnpm dev
```

## 🔧 What Was Fixed

### ✅ UUID Issues
- Changed all hardcoded string IDs to `gen_random_uuid()`
- Fixed foreign key references
- Removed problematic `ON CONFLICT` clauses

### ✅ Environment Variables
- Added proper null checks for Supabase client
- Made app work without database initially
- Added fallback configurations

### ✅ Database Schema
- Added proper unique constraints
- Fixed table relationships
- Improved error handling

## 🎯 Expected Result

After following these steps, you should see:
- ✅ No more UUID errors
- ✅ Database tables created successfully
- ✅ Demo users inserted
- ✅ Application working with real database

## 🚀 Test the Application

Visit [http://localhost:3000](http://localhost:3000) and use:

**Demo Credentials:**
- **Admin**: admin@pulse.com / admin123
- **Student**: student@pulse.com / student123

## 📊 Database Tables Created

- ✅ `users` - User accounts and authentication
- ✅ `events` - Event management with access keys
- ✅ `certificates` - Certificate generation and tracking
- ✅ `event_registrations` - Event attendance tracking

## 🆘 Still Having Issues?

1. **Check Supabase Project Status** - Ensure your project is active
2. **Verify Environment Variables** - Make sure they're correctly set
3. **Check SQL Editor** - Look for any error messages
4. **Restart Development Server** - Clear cache and restart

The application will work in **demo mode** until you set up the database properly! 🎉 