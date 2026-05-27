import { createBrowserClient } from '@supabase/ssr';

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

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = sanitizeUrl(rawUrl) || 'https://nsimbewmydjlsnmlivft.supabase.co';
const supabaseAnonKey = sanitizeKey(rawKey) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zaW1iZXdteWRqbHNubWxpdmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTg0NjQsImV4cCI6MjA5NDEzNDQ2NH0.cbIW0tjNMD7GHvPh-m_FCg06jb63iKFYW0fZQqWYXj8';

if (!rawUrl || !rawKey) {
  console.warn(
    'PREVENTIVE WARNING: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. ' +
    'Please verify that these variables are correctly set in your Vercel Dashboard Settings (under Environment Variables) ' +
    'and that they do not contain trailing whitespaces or quotation marks.'
  );
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

