# PULSE Portal - Student Event Management System

A comprehensive student event management system with certificate generation, event management, and analytics dashboard.

## Features

### 🎯 Core Features
- **User Authentication** - Secure login/signup with role-based access
- **Event Management** - Create, edit, and manage events with access keys
- **Certificate Generation** - Generate certificates with QR verification
- **Student Dashboard** - Track progress, achievements, and certificates
- **Admin Dashboard** - Analytics, user management, and event oversight
- **Real-time Database** - Supabase integration for persistent data

### 👥 User Roles
- **Admin** - Full system access, event creation, user management
- **Student** - Event registration, certificate generation, progress tracking

### 🎨 UI/UX Features
- Modern, responsive design with Tailwind CSS
- Dark/Light theme support
- Smooth animations with Framer Motion
- Beautiful UI components with Radix UI

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Animations**: Framer Motion

## Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd pulse-portal
pnpm install
```

### 2. Set Up Supabase Database

#### A. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key

#### B. Create Database Tables
Run these SQL commands in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  rollNumber TEXT,
  joinDate DATE DEFAULT CURRENT_DATE,
  certificatesEarned INTEGER DEFAULT 0,
  eventsAttended INTEGER DEFAULT 0,
  totalPoints INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('active', 'upcoming', 'completed')),
  participants INTEGER DEFAULT 0,
  maxParticipants INTEGER DEFAULT 100,
  category TEXT,
  accessKey TEXT UNIQUE NOT NULL,
  createdBy UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Certificates table
CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  studentId UUID REFERENCES users(id),
  eventId UUID REFERENCES events(id),
  studentName TEXT NOT NULL,
  rollNumber TEXT,
  eventName TEXT NOT NULL,
  issueDate DATE NOT NULL,
  downloadUrl TEXT,
  status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'downloaded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Event registrations table
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  eventId UUID REFERENCES events(id),
  userId UUID REFERENCES users(id),
  registeredAt TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert demo admin user
INSERT INTO users (id, name, email, password, role, joinDate, certificatesEarned, eventsAttended, totalPoints, rank)
VALUES (
  '1',
  'Admin User',
  'admin@pulse.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gSJm6', -- admin123
  'admin',
  '2024-01-01',
  0,
  0,
  0,
  1
);

-- Insert demo student user
INSERT INTO users (id, name, email, password, role, rollNumber, joinDate, certificatesEarned, eventsAttended, totalPoints, rank)
VALUES (
  '2',
  'John Doe',
  'student@pulse.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gSJm6', -- student123
  'student',
  'ECE2024001',
  '2024-01-15',
  5,
  8,
  450,
  12
);
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 4. Run Development Server
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Demo Credentials

### Admin Access
- **Email**: admin@pulse.com
- **Password**: admin123

### Student Access
- **Email**: student@pulse.com
- **Password**: student123

## Features Overview

### 🔐 Authentication
- Secure login/signup system
- Role-based access control
- Session management with NextAuth.js
- Password hashing with bcrypt

### 📅 Event Management
- Create events with categories and access keys
- Track participant limits and registrations
- Event status management (upcoming, active, completed)
- Admin-only event creation and editing

### 🏆 Certificate System
- Generate certificates using event access keys
- Prevent duplicate certificates
- Track certificate status and downloads
- Automatic user stats updates

### 📊 Analytics Dashboard
- Real-time statistics and metrics
- User activity tracking
- Event participation analytics
- Certificate generation reports

### 👤 User Management
- Student registration system
- Admin user management
- Progress tracking and achievements
- Ranking system

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (admin only)
- `PUT /api/events/[id]` - Update event (admin only)
- `DELETE /api/events/[id]` - Delete event (admin only)

### Certificates
- `GET /api/certificates` - Get user certificates
- `POST /api/certificates` - Generate certificate

### Users
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Register new user

## Database Schema

### Users Table
- `id` - Unique identifier
- `name` - Full name
- `email` - Email address (unique)
- `password` - Hashed password
- `role` - User role (admin/student)
- `rollNumber` - Student roll number
- `joinDate` - Account creation date
- `certificatesEarned` - Number of certificates
- `eventsAttended` - Number of events attended
- `totalPoints` - Total points earned
- `rank` - User ranking

### Events Table
- `id` - Unique identifier
- `title` - Event title
- `description` - Event description
- `date` - Event date
- `time` - Event time
- `location` - Event location
- `status` - Event status
- `participants` - Current participants
- `maxParticipants` - Maximum participants
- `category` - Event category
- `accessKey` - Unique access key
- `createdBy` - Creator user ID

### Certificates Table
- `id` - Unique identifier
- `studentId` - Student user ID
- `eventId` - Event ID
- `studentName` - Student name
- `rollNumber` - Student roll number
- `eventName` - Event name
- `issueDate` - Certificate issue date
- `downloadUrl` - Download link
- `status` - Certificate status

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_key
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_production_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@pulseportal.com or create an issue in the repository. 