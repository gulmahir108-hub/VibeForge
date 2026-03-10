import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect to login if user is not signed in and trying to access protected routes
  if (!session && req.nextUrl.pathname.startsWith('/sell')) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/sell/:path*']
}
