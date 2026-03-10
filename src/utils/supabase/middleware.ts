import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // For now, just pass through - we'll implement auth later
  // This is a placeholder for future auth implementation
  return NextResponse.next()
}

export const config = {
  matcher: ['/sell/:path*']
}
