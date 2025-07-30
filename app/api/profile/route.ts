import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabase) {
      // Return demo profile data when database is not configured
      return NextResponse.json({
        id: session.user.id,
        name: session.user.name || 'Demo User',
        email: session.user.email,
        role: session.user.role,
        rollnumber: session.user.rollnumber || 'DEMO001',
        joindate: '2024-01-01',
        certificatesearned: session.user.certificatesearned || 0,
        eventsattended: session.user.eventsattended || 0,
        totalpoints: session.user.totalpoints || 0,
        rank: session.user.rank || 1
      })
    }

    // Get user profile from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, rollnumber, joindate, certificatesearned, eventsattended, totalpoints, rank')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('Profile fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, rollnumber } = body

    if (!supabase) {
      // Return success for demo mode
      return NextResponse.json({
        id: session.user.id,
        name: name || session.user.name,
        email: session.user.email,
        role: session.user.role,
        rollnumber: rollnumber || session.user.rollnumber,
        joindate: '2024-01-01',
        certificatesearned: session.user.certificatesearned || 0,
        eventsattended: session.user.eventsattended || 0,
        totalpoints: session.user.totalpoints || 0,
        rank: session.user.rank || 1
      })
    }

    // Update user profile in database
    const { data: user, error } = await supabase
      .from('users')
      .update({
        name: name,
        rollnumber: rollnumber
      })
      .eq('id', session.user.id)
      .select('id, name, email, role, rollnumber, joindate, certificatesearned, eventsattended, totalpoints, rank')
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile update API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
