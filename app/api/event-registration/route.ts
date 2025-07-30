import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase'

// POST - Register for an event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = await request.json()

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    // For demo users or when database is not configured
    if (!supabase || session.user.id === '1' || session.user.id === '2') {
      return NextResponse.json({ 
        success: true, 
        message: 'Registration successful (demo mode)',
        registration: {
          id: `reg-${Date.now()}`,
          eventid: eventId,
          userid: session.user.id,
          registeredat: new Date().toISOString(),
          status: 'registered'
        }
      })
    }

    // Check if user is already registered for this event
    const { data: existingRegistration } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('eventid', eventId)
      .eq('userid', session.user.id)
      .single()

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered for this event' }, { status: 400 })
    }

    // Check if event exists and has capacity
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title, maxparticipants, participants')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.participants >= event.maxparticipants) {
      return NextResponse.json({ error: 'Event is full' }, { status: 400 })
    }

    // Create registration record
    const { data: registration, error: registrationError } = await supabase
      .from('event_registrations')
      .insert({
        eventid: eventId,
        userid: session.user.id,
        registeredat: new Date().toISOString(),
        status: 'registered'
      })
      .select()
      .single()

    if (registrationError) {
      console.error('Registration creation error:', registrationError)
      return NextResponse.json({ error: registrationError.message }, { status: 500 })
    }

    // Update event participant count
    const { error: updateError } = await supabase
      .from('events')
      .update({ participants: event.participants + 1 })
      .eq('id', eventId)

    if (updateError) {
      console.error('Event update error:', updateError)
      // Note: In production, you might want to implement a transaction here
    }

    // Update user's events attended count
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ 
        eventsattended: supabase.sql`eventsattended + 1`,
        totalpoints: supabase.sql`totalpoints + 50`
      })
      .eq('id', session.user.id)

    if (userUpdateError) {
      console.error('User update error:', userUpdateError)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      registration 
    })

  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET - Get registrations for current user
export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Get user registrations from database
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
