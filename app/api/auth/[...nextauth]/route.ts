import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Check if it's a demo login
          if (credentials.email === 'admin@pulse.com' && credentials.password === 'admin123') {
            return {
              id: '1',
              name: 'Admin User',
              email: 'admin@pulse.com',
              role: 'admin',
              rollnumber: undefined,
              joindate: '2024-01-01',
              certificatesearned: 0,
              eventsattended: 0,
              totalpoints: 0,
              rank: 1,
            }
          }

          if (credentials.email === 'student@pulse.com' && credentials.password === 'student123') {
            return {
              id: '2',
              name: 'Demo Student',
              email: 'student@pulse.com',
              role: 'student',
              rollnumber: 'ECE2024001',
              joindate: '2024-01-15',
              certificatesearned: 5,
              eventsattended: 8,
              totalpoints: 450,
              rank: 12,
            }
          }

                  // Check database for real users (only if Supabase is configured)
        if (supabase) {
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single()

          if (error || !user) {
            return null
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password)

          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            rollnumber: user.rollnumber,
            joindate: user.joindate,
            certificatesearned: user.certificatesearned,
            eventsattended: user.eventsattended,
            totalpoints: user.totalpoints,
            rank: user.rank,
          }
        }

        return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.rollnumber = user.rollnumber
        token.certificatesearned = user.certificatesearned
        token.eventsattended = user.eventsattended
        token.totalpoints = user.totalpoints
        token.rank = user.rank
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as 'admin' | 'student'
        session.user.rollnumber = token.rollnumber as string
        session.user.certificatesearned = token.certificatesearned as number
        session.user.eventsattended = token.eventsattended as number
        session.user.totalpoints = token.totalpoints as number
        session.user.rank = token.rank as number
      }
      return session
    }
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST } 