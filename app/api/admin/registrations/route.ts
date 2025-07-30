import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase'

// GET - Get all event registrations (admin only)
export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    if (!supabase) {
      // Return demo registration data when database is not configured
      return NextResponse.json([
        {
          id: '1',
          eventid: 'event-1',
          userid: 'user-1',
          registeredat: '2024-01-15T10:00:00Z',
          status: 'registered',
          event: {
            id: 'event-1',
            title: 'Tech Workshop 2024',
            description: 'Learn the latest technologies',
            date: '2024-02-15',
            time: '10:00:00',
            location: 'Main Auditorium'
          },
          user: {
            id: 'user-1',
            name: 'John Student',
            email: 'john@example.com',
            rollnumber: 'CS2021001'
          }
        }
      ])
    }

    // Get all registrations from database
    const { data: registrations, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events (
          id,
          title,
          description,
          date,
          time,
          location,
          status
        ),
        users (
          id,
          name,
          email,
          rollnumber
        )
      `)
      .order('registeredat', { ascending: false })

    if (error) {
      console.error('Admin registrations fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Admin registrations API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
