import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zpjjtajbsnnphszojggs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwamp0YWpic25ucGhzem9qZ2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDA3NjksImV4cCI6MjA2MzgxNjc2OX0.uD6NE0wFkbperFIyaTJ1LFJ7xDgVOoFjPmNDY9cKAuE";

// Get the site URL based on the environment
export const SITE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://cheril.netlify.app' // Your Netlify URL
    : 'http://localhost:3000';

// Create the Supabase client with PKCE flow
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: process.env.NODE_ENV === 'development'
    },
  }
);

// Function to handle OAuth sign-in
export const signInWithOAuth = async (provider: 'google' | 'github' = 'google') => {
  const redirectTo = `${SITE_URL}/auth/callback`;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
};