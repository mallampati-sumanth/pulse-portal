-- PULSE Portal Database Setup Script
-- Run this in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  rollnumber TEXT,
  joindate DATE DEFAULT CURRENT_DATE,
  certificatesearned INTEGER DEFAULT 0,
  eventsattended INTEGER DEFAULT 0,
  totalpoints INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add unique constraint on email if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_key') THEN
    ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
  END IF;
END $$;

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('active', 'upcoming', 'completed')),
  participants INTEGER DEFAULT 0,
  maxparticipants INTEGER DEFAULT 100,
  category TEXT,
  accesskey TEXT UNIQUE NOT NULL,
  createdby UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add unique constraint on accesskey if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_accesskey_key') THEN
    ALTER TABLE events ADD CONSTRAINT events_accesskey_key UNIQUE (accesskey);
  END IF;
END $$;

-- Certificate Templates table
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  templatedata JSONB DEFAULT '{}',
  isactive BOOLEAN DEFAULT true,
  usage INTEGER DEFAULT 0,
  createdby UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  studentid UUID REFERENCES users(id),
  eventid UUID REFERENCES events(id),
  templateid UUID REFERENCES certificate_templates(id),
  studentname TEXT NOT NULL,
  rollnumber TEXT,
  eventname TEXT NOT NULL,
  issuedate DATE NOT NULL,
  downloadurl TEXT,
  status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'downloaded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add unique constraint on studentid and eventid combination if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'certificates_student_event_unique') THEN
    ALTER TABLE certificates ADD CONSTRAINT certificates_student_event_unique UNIQUE (studentid, eventid);
  END IF;
END $$;

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  eventid UUID REFERENCES events(id),
  userid UUID REFERENCES users(id),
  registeredat TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Certificate Keys table
CREATE TABLE IF NOT EXISTS certificate_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_key VARCHAR(100) NOT NULL UNIQUE,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one key per user per event
  UNIQUE(event_id, user_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_certificate_keys_access_key ON certificate_keys(access_key);
CREATE INDEX IF NOT EXISTS idx_certificate_keys_event_user ON certificate_keys(event_id, user_id);
CREATE INDEX IF NOT EXISTS idx_certificate_keys_issued_at ON certificate_keys(issued_at DESC);

-- Insert demo admin user (password: admin123)
INSERT INTO users (id, name, email, password, role, joindate, certificatesearned, eventsattended, totalpoints, rank)
VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@pulse.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gSJm6',
  'admin',
  '2024-01-01',
  0,
  0,
  0,
  1
) ON CONFLICT DO NOTHING;

-- Insert demo student user (password: student123)
INSERT INTO users (id, name, email, password, role, rollnumber, joindate, certificatesearned, eventsattended, totalpoints, rank)
VALUES (
  gen_random_uuid(),
  'John Doe',
  'student@pulse.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gSJm6',
  'student',
  'ECE2024001',
  '2024-01-15',
  5,
  8,
  450,
  12
) ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO events (id, title, description, date, time, location, status, participants, maxparticipants, category, accesskey, createdby)
VALUES 
(
  gen_random_uuid(),
  'Web Development Workshop',
  'Learn modern web development with React and Next.js',
  '2024-02-15',
  '10:00:00',
  'Computer Lab 1',
  'active',
  45,
  50,
  'workshop',
  'PULSE2024WEB',
  (SELECT id FROM users WHERE email = 'admin@pulse.com' LIMIT 1)
),
(
  gen_random_uuid(),
  'AI/ML Symposium 2024',
  'Annual symposium on Artificial Intelligence and Machine Learning',
  '2024-02-20',
  '09:00:00',
  'Main Auditorium',
  'upcoming',
  120,
  200,
  'symposium',
  'PULSE2024AI',
  (SELECT id FROM users WHERE email = 'admin@pulse.com' LIMIT 1)
),
(
  gen_random_uuid(),
  'Technical Quiz Competition',
  'Test your technical knowledge across various domains',
  '2024-01-30',
  '14:00:00',
  'Seminar Hall',
  'completed',
  80,
  100,
  'competition',
  'PULSE2024QUIZ',
  (SELECT id FROM users WHERE email = 'admin@pulse.com' LIMIT 1)
) ON CONFLICT DO NOTHING;

-- Insert sample certificate templates
INSERT INTO certificate_templates (id, name, description, category, templatedata, isactive, usage, createdby)
VALUES 
(
  gen_random_uuid(),
  'Workshop Certificate',
  'Standard template for workshop completion certificates',
  'workshop',
  '{"backgroundColor": "#ffffff", "textColor": "#000000", "borderColor": "#4f46e5", "logo": "pulse-logo.png"}',
  true,
  156,
  (SELECT id FROM users WHERE email = 'admin@pulse.com' LIMIT 1)
),
(
  gen_random_uuid(),
  'Competition Winner',
  'Template for competition winners and participants',
  'competition',
  '{"backgroundColor": "#fef3c7", "textColor": "#92400e", "borderColor": "#f59e0b", "logo": "trophy-icon.png"}',
  true,
  89,
  (SELECT id FROM users WHERE email = 'admin@pulse.com' LIMIT 1)
),
(
  gen_random_uuid(),
  'Symposium Certificate',
  'Professional template for symposium participation',
  'symposium',
  '{"backgroundColor": "#dbeafe", "textColor": "#1e40af", "borderColor": "#3b82f6", "logo": "academic-logo.png"}',
  true,
  67,
  (SELECT id FROM users WHERE email = 'admin@pulse.com' LIMIT 1)
) ON CONFLICT DO NOTHING;

-- Insert sample certificate
INSERT INTO certificates (id, studentid, eventid, templateid, studentname, rollnumber, eventname, issuedate, downloadurl, status)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM users WHERE email = 'student@pulse.com' LIMIT 1),
  (SELECT id FROM events WHERE accesskey = 'PULSE2024QUIZ' LIMIT 1),
  (SELECT id FROM certificate_templates WHERE category = 'competition' LIMIT 1),
  'John Doe',
  'ECE2024001',
  'Technical Quiz Competition',
  '2024-01-30',
  '#certificate-1',
  'downloaded'
) ON CONFLICT DO NOTHING; 