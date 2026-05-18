import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const sanitizeUrl = (str: string | undefined) => {
    if (!str) return '';
    const cleaned = str.trim().replace(/^['"]|['"]$/g, '').trim();
    if (cleaned === 'undefined' || cleaned === 'null' || cleaned === '') {
      return '';
    }
    if (!cleaned.startsWith('https://') || !cleaned.includes('.supabase.')) {
      return '';
    }
    return cleaned;
  };

  const sanitizeKey = (str: string | undefined) => {
    if (!str) return '';
    const cleaned = str.trim().replace(/^['"]|['"]$/g, '').trim();
    if (cleaned === 'undefined' || cleaned === 'null' || cleaned === '') {
      return '';
    }
    if (!cleaned.startsWith('eyJ') || !cleaned.includes('.')) {
      return '';
    }
    return cleaned;
  };

  const supabaseUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) || 'https://nsimbewmydjlsnmlivft.supabase.co';
  const supabaseAnonKey = sanitizeKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zaW1iZXdteWRqbHNubWxpdmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTg0NjQsImV4cCI6MjA5NDEzNDQ2NH0.cbIW0tjNMD7GHvPh-m_FCg06jb63iKFYW0fZQqWYXj8';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  const protectedRoutes = ['/dashboard', '/stats', '/family', '/profile', '/lock', '/fajr'];
  const isProtectedRoute = protectedRoutes.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Onboarding logic
  if (session && isProtectedRoute) {
    const { data: user } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', session.user.id)
      .single();

    if (user && !user.onboarding_completed && request.nextUrl.pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth|landing).*)',
  ],
};
