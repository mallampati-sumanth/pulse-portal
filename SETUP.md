# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Create a new project
4. Wait for project to be ready
5. Go to Settings → API to get your credentials

### 2. Set Up Database
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Copy and paste the entire content from `scripts/setup-database.sql`
4. Click "Run" to execute the script

### 3. Configure Environment Variables
Create a `.env.local` file in your project root:

```env
# Supabase Configuration (get these from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

### 4. Run the Application
```bash
pnpm dev
```

### 5. Test the Application
Visit [http://localhost:3000](http://localhost:3000)

**Demo Credentials:**
- **Admin**: admin@pulse.com / admin123
- **Student**: student@pulse.com / student123

## ✅ What's Included

### Database Tables
- ✅ Users (with authentication)
- ✅ Events (with access keys)
- ✅ Certificates (with generation tracking)
- ✅ Event Registrations (for attendance tracking)

### API Endpoints
- ✅ Authentication (NextAuth.js)
- ✅ Event management (CRUD operations)
- ✅ Certificate generation
- ✅ User registration and management

### Features
- ✅ Role-based access control
- ✅ Real-time database operations
- ✅ Secure password hashing
- ✅ Session management
- ✅ Middleware protection

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your Supabase URL and anon key
   - Ensure your project is active

2. **Authentication Not Working**
   - Verify NEXTAUTH_SECRET is set
   - Check that demo users exist in database

3. **API Errors**
   - Check browser console for errors
   - Verify environment variables are loaded

### Getting Help
- Check the main README.md for detailed documentation
- Review the API routes in `/app/api/`
- Check the database schema in the setup script

## 🎯 Next Steps

1. **Customize the UI** - Modify components in `/components/`
2. **Add More Features** - Extend the API routes
3. **Deploy to Production** - Use Vercel or similar platform
4. **Add Real Certificate Generation** - Integrate with PDF libraries
5. **Add Email Notifications** - Use Supabase Edge Functions

## 📊 Database Schema Overview

```
users
├── id (UUID)
├── name (TEXT)
├── email (TEXT, UNIQUE)
├── password (TEXT, HASHED)
├── role (admin/student)
├── rollNumber (TEXT)
├── joinDate (DATE)
├── certificatesEarned (INTEGER)
├── eventsAttended (INTEGER)
├── totalPoints (INTEGER)
└── rank (INTEGER)

events
├── id (UUID)
├── title (TEXT)
├── description (TEXT)
├── date (DATE)
├── time (TIME)
├── location (TEXT)
├── status (active/upcoming/completed)
├── participants (INTEGER)
├── maxParticipants (INTEGER)
├── category (TEXT)
├── accessKey (TEXT, UNIQUE)
└── createdBy (UUID, REFERENCES users)

certificates
├── id (UUID)
├── studentId (UUID, REFERENCES users)
├── eventId (UUID, REFERENCES events)
├── studentName (TEXT)
├── rollNumber (TEXT)
├── eventName (TEXT)
├── issueDate (DATE)
├── downloadUrl (TEXT)
└── status (generated/downloaded)
```

## 🚀 Ready to Deploy?

Your PULSE Portal is now ready with:
- ✅ Real database storage
- ✅ Secure authentication
- ✅ Event management
- ✅ Certificate generation
- ✅ User management
- ✅ Beautiful UI

Start building amazing student experiences! 🎉 