# PULSE Portal - Complete Setup Guide

## 🚀 Quick Setup Instructions

### Step 1: Fix Environment Variables

1. **Delete your current .env.local file** and create a new one with this content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ccpjweaykzumczcbqqkp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_CORRECT_ANON_KEY_HERE

# NextAuth Configuration  
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random-at-least-32-characters
```

2. **Get your correct Supabase key:**
   - Go to https://supabase.com/dashboard/project/ccpjweaykzumczcbqqkp
   - Click **Settings** → **API**
   - Copy the **anon public** key (it should be one long line, about 200+ characters)
   - Replace `YOUR_CORRECT_ANON_KEY_HERE` with this key

3. **Generate a NextAuth secret:**
   - Run this command to generate a secure secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   - Replace `your-super-secret-key-here-make-it-long-and-random-at-least-32-characters` with the generated secret

### Step 2: Set Up Database

1. **Go to your Supabase project:**
   - Visit https://supabase.com/dashboard/project/ccpjweaykzumczcbqqkp
   - Click **SQL Editor** in the left sidebar

2. **Run the database setup:**
   - Copy the entire content from `scripts/setup-database.sql`
   - Paste it in the SQL Editor
   - Click **Run** to execute

### Step 3: Start the Application

```bash
pnpm dev
```

## ✅ Features Working

### 🔐 Authentication System
- **Login:** Existing users can sign in
- **Signup:** New students can register and create accounts
- **Role-based access:** Admin vs Student permissions
- **Session management:** Secure authentication with NextAuth

### 👤 User Management
- **Student Registration:** Complete signup flow with validation
- **Admin Dashboard:** View and manage all users
- **Profile Management:** Users can update their information
- **Role Assignment:** Automatic student role assignment for new signups

### 📅 Event Management
- **Create Events:** Admins can create new events
- **Event Registration:** Students can register for events
- **Event Calendar:** View all upcoming events
- **Access Keys:** Secure event access with unique keys

### 🏆 Certificate System
- **Generate Certificates:** Students can generate certificates for attended events
- **Certificate Templates:** Admin-managed certificate designs
- **Download Certificates:** PDF download functionality
- **Certificate Tracking:** Track issued certificates and prevent duplicates

### 📊 Analytics & Tracking
- **Student Progress:** Track certificates, events, and points
- **Leaderboard:** Student ranking system
- **Admin Analytics:** Overview of portal statistics
- **Real-time Updates:** Live data synchronization

## 🎯 Demo Credentials

**Admin Account:**
- Email: admin@pulse.com
- Password: admin123

**Student Account:**
- Email: student@pulse.com  
- Password: student123

## 🛠️ Troubleshooting

### Environment Variables Issue
If you see "supabaseUrl is required" error:
1. Check your .env.local file exists in the project root
2. Ensure the Supabase key is on one line without breaks
3. Restart the development server after making changes

### Database Connection Issue
If database operations fail:
1. Verify your Supabase project is active
2. Check the database setup script ran successfully
3. Ensure your anon key has proper permissions

### Authentication Issues
If login/signup doesn't work:
1. Check NextAuth configuration in .env.local
2. Verify the NEXTAUTH_SECRET is set properly
3. Ensure database tables are created correctly

## 📱 Application URLs

- **Home Page:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin  
- **Student Dashboard:** http://localhost:3000/student
- **Login Page:** http://localhost:3000/login

## 🎉 Success Indicators

When everything is working correctly, you should see:
- ✅ No "supabaseUrl is required" errors
- ✅ Signup form creates new student accounts
- ✅ Login works with created accounts
- ✅ Database operations save real data
- ✅ All features function with persistent storage

Your PULSE Portal is now ready for production use! 🚀
