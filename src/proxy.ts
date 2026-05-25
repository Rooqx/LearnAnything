import NextAuth from "next-auth"
import { authConfig } from "./lib/auth/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const userId = req.auth?.user?.id
  
  // Check if onboarding is complete by checking the JWT or the temporary cookie
  const hasCompletedOnboarding = isLoggedIn && (
    !!(req.auth?.user as any)?.displayname || 
    (userId && req.cookies.get(`onboarding_${userId}`)?.value === 'true')
  )

  const pathname = req.nextUrl.pathname
  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")
  const isOnboardingRoute = pathname.startsWith("/onboarding")
  
  // Define routes that require the user to be fully logged in AND onboarded
  const isProtectedRoute = pathname.startsWith("/dashboard") || 
                           pathname.startsWith("/chat") || 
                           pathname.startsWith("/courses") || 
                           pathname.startsWith("/achievements") || 
                           pathname.startsWith("/leaderboard") || 
                           pathname.startsWith("/profile")

  // 1. Not logged in -> Trying to access protected route (including onboarding)
  if (!isLoggedIn && (isProtectedRoute || isOnboardingRoute)) {
    let callbackUrl = req.nextUrl.pathname
    if (req.nextUrl.search) {
      callbackUrl += req.nextUrl.search
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${encodedCallbackUrl}`, req.url))
  }

  // 2. Logged in -> Routing logic
  if (isLoggedIn) {
    // If they haven't onboarded, ONLY allow access to /onboarding
    if (!hasCompletedOnboarding && !isOnboardingRoute) {
      return NextResponse.redirect(new URL("/onboarding", req.url))
    }

    // If they HAVE onboarded, prevent access to auth routes and /onboarding
    if (hasCompletedOnboarding && (isAuthRoute || isOnboardingRoute)) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
