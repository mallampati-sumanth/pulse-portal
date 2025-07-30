import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabase) {
      console.log('GET /api/users - Supabase not configured, returning demo users')
      // Return demo users when database is not configured
      return NextResponse.json([
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@pulse.com',
          role: 'admin',
          joindate: '2024-01-01',
          certificatesearned: 5,
          eventsattended: 10,
          totalpoints: 150,
          rank: 1
        },
        {
          id: '2', 
          name: 'Demo Student',
          email: 'student@pulse.com',
          role: 'student',
          rollnumber: 'ST001',
          joindate: '2024-01-15',
          certificatesearned: 3,
          eventsattended: 7,
          totalpoints: 90,
          rank: 2
        }
      ])
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('GET /api/users - Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('GET /api/users - Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, rollNumber, password } = body

    console.log('POST /api/users - Registration attempt:', { name, email, rollNumber })

    if (!name || !email || !password) {
      console.log('POST /api/users - Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!supabase) {
      console.log('POST /api/users - Supabase not configured, creating demo user')
      // For demo mode, just return success without actually creating user
      return NextResponse.json({
        id: 'demo-' + Date.now(),
        name,
        email,
        role: 'student',
        rollnumber: rollNumber,
        joindate: new Date().toISOString().split('T')[0],
        certificatesearned: 0,
        eventsattended: 0,
        totalpoints: 0,
        rank: 1
      })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser) {
      console.log('POST /api/users - User already exists:', email)
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log('POST /api/users - Creating user in database...')

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        rollnumber: rollNumber,
        password: hashedPassword,
        role: 'student',
        joindate: new Date().toISOString().split('T')[0],
        certificatesearned: 0,
        eventsattended: 0,
        totalpoints: 0,
        rank: 1
      })
      .select('id, name, email, role, rollnumber, joindate, certificatesearned, eventsattended, totalpoints, rank')
      .single()

    if (error) {
      console.error('POST /api/users - Database error:', error)
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        details: error
      }, { status: 500 })
    }

    console.log('POST /api/users - User created successfully:', user?.id)
    return NextResponse.json(user)
  } catch (error) {
    console.error('POST /api/users - Server error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 