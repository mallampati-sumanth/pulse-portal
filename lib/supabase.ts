import { createClient } from '@supabase/supabase-js'

// Only create client if environment variables are properly set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'student'
  rollnumber?: string
  joindate: string
  certificatesearned: number
  eventsattended: number
  totalpoints: number
  rank: number
  created_at?: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  status: 'active' | 'upcoming' | 'completed'
  participants: number
  maxParticipants: number
  category: string
  accessKey: string
  createdBy: string
  created_at?: string
}

export interface Certificate {
  id: string
  studentId: string
  eventId: string
  studentName: string
  rollNumber: string
  eventName: string
  issueDate: string
  downloadUrl: string
  status: 'generated' | 'downloaded'
  created_at?: string
}

export interface EventRegistration {
  id: string
  eventId: string
  userId: string
  registeredAt: string
  status: 'registered' | 'attended'
  created_at?: string
} 