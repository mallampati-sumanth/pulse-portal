import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = supabase!.from('certificates').select('*')
    
    // If student, only show their certificates
    if (session.user.role === 'student') {
      query = query.eq('studentId', session.user.id)
    }
    
    const { data: certificates, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(certificates)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { accessKey, studentName, rollNumber, issueDate } = body

    // Find event by access key
    const { data: event, error: eventError } = await supabase!
      .from('events')
      .select('*')
      .eq('accessKey', accessKey)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Invalid access key' }, { status: 400 })
    }

    // Check if certificate already exists for this student and event
    const { data: existingCert } = await supabase!
      .from('certificates')
      .select('*')
      .eq('studentId', session.user.id)
      .eq('eventId', event.id)
      .single()

    if (existingCert) {
      return NextResponse.json({ error: 'Certificate already generated for this event' }, { status: 400 })
    }

    // Create certificate
    const { data: certificate, error } = await supabase!
      .from('certificates')
      .insert({
        studentId: session.user.id,
        eventId: event.id,
        studentName: studentName || session.user.name,
        rollNumber: rollNumber || session.user.rollNumber,
        eventName: event.title,
        issueDate: issueDate || new Date().toISOString().split('T')[0],
        downloadUrl: `#certificate-${Date.now()}`,
        status: 'generated'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update user stats
    await supabase!
      .from('users')
      .update({
        certificatesEarned: (session.user.certificatesEarned || 0) + 1,
        totalPoints: (session.user.totalPoints || 0) + 100
      })
      .eq('id', session.user.id)

    return NextResponse.json(certificate)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 