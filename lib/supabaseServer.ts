import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();

  const sanitize = (str: string | undefined) => {
    if (!str) return '';
    const cleaned = str.trim().replace(/^['"]|['"]$/g, '').trim();
    if (cleaned === 'undefined' || cleaned === 'null' || cleaned === '') {
      return '';
    }
    return cleaned;
  };

  const supabaseUrl = sanitize(process.env.NEXT_PUBLIC_SUPABASE_URL) || 'https://nsimbewmydjlsnmlivft.supabase.co';
  const supabaseAnonKey = sanitize(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zaW1iZXdteWRqbHNubWxpdmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTg0NjQsImV4cCI6MjA5NDEzNDQ2NH0.cbIW0tjNMD7GHvPh-m_FCg06jb63iKFYW0fZQqWYXj8';

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
