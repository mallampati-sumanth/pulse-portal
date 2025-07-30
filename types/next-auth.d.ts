import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
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
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: 'admin' | 'student'
      rollnumber?: string
      certificatesearned: number
      eventsattended: number
      totalpoints: number
      rank: number
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: 'admin' | 'student'
    rollnumber?: string
    certificatesearned: number
    eventsattended: number
    totalpoints: number
    rank: number
  }
} 