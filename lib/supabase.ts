import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'PREVENTIVE WARNING: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. ' +
    'Please verify that these variables are correctly set in your Vercel Dashboard Settings (under Environment Variables) ' +
    'and that they do not contain trailing whitespaces or quotation marks.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://nsimbewmydjlsnmlivft.supabase.co', // Use healthy default fallback for robustness
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zaW1iZXdteWRqbHNubWxpdmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTg0NjQsImV4cCI6MjA5NDEzNDQ2NH0.cbIW0tjNMD7GHvPh-m_FCg06jb63iKFYW0fZQqWYXj8'
);

