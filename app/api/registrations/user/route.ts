import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Session user:', session.user) // Debug log

    if (!supabase) {
      // Return demo registration data when database is not configured
      return NextResponse.json([
        {
          id: '1',
          eventid: 'event-1',
          userid: session.user.id,
          registeredat: '2024-01-15T10:00:00Z',
          status: 'registered',
          event: {
            id: 'event-1',
            title: 'Tech Workshop 2024',
            description: 'Learn the latest technologies',
            date: '2024-02-15',
            time: '10:00:00',
            location: 'Main Auditorium'
          }
        }
      ])
    }

    // For demo users (string IDs), return demo data
    if (session.user.id === '1' || session.user.id === '2' || !session.user.id) {
      return NextResponse.json([
        {
          id: '1',
          eventid: 'demo-event-1',
          userid: session.user.id,
          registeredat: '2024-01-15T10:00:00Z',
          status: 'registered',
          event: {
            id: 'demo-event-1',
            title: 'React Workshop 2024',
            description: 'Advanced React concepts and best practices',
            date: '2024-02-15',
            time: '10:00:00',
            location: 'Computer Lab'
          }
        },
        {
          id: '2',
          eventid: 'demo-event-2',
          userid: session.user.id,
          registeredat: '2024-01-20T14:00:00Z',
          status: 'registered',
          event: {
            id: 'demo-event-2',
            title: 'AI/ML Symposium',
            description: 'Introduction to Machine Learning concepts',
            date: '2024-02-25',
            time: '14:00:00',
            location: 'Main Auditorium'
          }
        }
      ])
    }

    // Get user registrations from database (for real UUID users)
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
        )
      `)
      .eq('userid', session.user.id)
      .order('registeredat', { ascending: false })

    if (error) {
      console.error('Registrations fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Registrations API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
