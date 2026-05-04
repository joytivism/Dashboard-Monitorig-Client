import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'

export async function proxy(request: NextRequest) {
  // Update session for all requests
  const response = await updateSession(request)
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // 1. If not logged in and not on /login, redirect to /login
  if (!user && url.pathname !== '/login') {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. If logged in and on /login, redirect to root
  if (user && url.pathname === '/login') {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // 3. Role-based redirection at root "/"
  if (user && url.pathname === '/') {
    // Fetch profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, client_key')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'client' && profile?.client_key) {
      url.pathname = `/client/${profile.client_key}`
      return NextResponse.redirect(url)
    }
  }

  // 4. Protect /admin for non-admins
  if (user && url.pathname.startsWith('/admin')) {
     const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      
     if (profile?.role !== 'admin') {
       url.pathname = '/' // or 403
       return NextResponse.redirect(url)
     }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
