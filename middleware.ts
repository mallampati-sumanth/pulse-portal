import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/')

    if (isAuthPage) {
      if (isAuth) {
        // If user is logged in and on home page, redirect based on role
        if (req.nextUrl.pathname === '/') {
          if (token?.role === 'admin') {
            return NextResponse.redirect(new URL('/admin', req.url))
          } else {
            return NextResponse.redirect(new URL('/student', req.url))
          }
        }
        return NextResponse.next()
      }
      return NextResponse.next()
    }

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!isAuth || token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Protect student routes
    if (req.nextUrl.pathname.startsWith('/student')) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ['/', '/admin/:path*', '/student/:path*']
} 