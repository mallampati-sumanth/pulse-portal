# Database Setup Guide - Fixed Version

## 🚨 Issue Fixed
The database setup was failing due to column name mismatches. This guide provides the corrected setup.

## ✅ Step-by-Step Setup

### 1. Clear Existing Database (if any)
If you already ran the SQL script and got errors, clear the database first:

```sql
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS certificate_templates CASCADE;
DROP TABLE IF EXISTS certificate_keys CASCADE;
```

### 2. Run the Fixed SQL Script
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Copy and paste the **entire content** from `scripts/setup-database.sql`
4. Click "Run" to execute the script

### 3. Verify Database Tables
After running the script, you should see these tables created:

- ✅ `users` - User accounts and authentication
- ✅ `events` - Event management with access keys
- ✅ `certificates` - Certificate generation and tracking
- ✅ `event_registrations` - Event attendance tracking
- ✅ `certificate_templates` - Certificate template management
- ✅ `certificate_keys` - Certificate access key management

### 4. Set Environment Variables
Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here
```

### 5. Restart Your Server
```bash
npm run dev
```

## 🔧 What Was Fixed

### ✅ Column Name Consistency
- Changed all column names to lowercase (PostgreSQL convention)
- Fixed `templateId` → `templateid`
- Fixed `studentId` → `studentid`
- Fixed `eventId` → `eventid`
- Fixed `accessKey` → `accesskey`
- Fixed `maxParticipants` → `maxparticipants`
- Fixed `createdBy` → `createdby`

### ✅ Database Schema
- Added proper foreign key relationships
- Fixed unique constraints
- Added certificate_keys table
- Improved error handling

### ✅ API Compatibility
- Updated all API routes to use correct column names
- Fixed certificate generation logic
- Improved user registration flow

## 🎯 Expected Result

After following these steps, you should see:
- ✅ No more column name errors
- ✅ Database tables created successfully
- ✅ Demo users inserted
- ✅ Sample events and certificates created
- ✅ Application working with real database

## 🚀 Test the Application

Visit [http://localhost:3000](http://localhost:3000) and use:

**Demo Credentials:**
- **Admin**: admin@pulse.com / admin123
- **Student**: student@pulse.com / student123

## 📊 Database Schema Overview

### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'student',
  rollnumber TEXT,
  joindate DATE DEFAULT CURRENT_DATE,
  certificatesearned INTEGER DEFAULT 0,
  eventsattended INTEGER DEFAULT 0,
  totalpoints INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 1
)
```

### Events Table
```sql
events (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'upcoming',
  participants INTEGER DEFAULT 0,
  maxparticipants INTEGER DEFAULT 100,
  category TEXT,
  accesskey TEXT UNIQUE NOT NULL,
  createdby UUID REFERENCES users(id)
)
```

### Certificates Table
```sql
certificates (
  id UUID PRIMARY KEY,
  studentid UUID REFERENCES users(id),
  eventid UUID REFERENCES events(id),
  templateid UUID REFERENCES certificate_templates(id),
  studentname TEXT NOT NULL,
  rollnumber TEXT,
  eventname TEXT NOT NULL,
  issuedate DATE NOT NULL,
  downloadurl TEXT,
  status TEXT DEFAULT 'generated'
)
```

## 🆘 Still Having Issues?

1. **Check Supabase Project Status** - Ensure your project is active
2. **Verify Environment Variables** - Make sure they're correctly set
3. **Check SQL Editor** - Look for any error messages
4. **Restart Development Server** - Clear cache and restart

The application will work in **demo mode** until you set up the database properly! 🎉 