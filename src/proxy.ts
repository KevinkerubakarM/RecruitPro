import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = [
    '/recruiter',
    '/candidate/searchJob',
]

// Define public routes that should redirect to home if already logged in
const authRoutes = ['/login', '/signup']

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value

    // Check if user is accessing a protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Check if user is accessing an auth route
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // If accessing protected route without token, redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // If accessing auth route with token, redirect to appropriate home
    if (isAuthRoute && token) {
        // Decode token to get user role (basic implementation)
        try {
            const decoded = Buffer.from(token, 'base64').toString('utf-8')
            const [userId] = decoded.split(':')

            // For a more robust solution, we'd verify the token and get role from it
            // For now, we'll let them access auth routes and client will handle redirect
        } catch (error) {
            // Invalid token, allow access to auth routes
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|home|pricing).*)',
    ],
}
