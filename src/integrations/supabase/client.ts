import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zpjjtajbsnnphszojggs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwamp0YWpic25ucGhzem9qZ2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDA3NjksImV4cCI6MjA2MzgxNjc2OX0.uD6NE0wFkbperFIyaTJ1LFJ7xDgVOoFjPmNDY9cKAuE";

// Determine the redirect URL based on the environment
const getRedirectUrl = () => {
  // For production
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `${window.location.origin}/auth/callback`;
  }
  // For local development
  return 'http://localhost:3000/auth/callback';
};

// Create the Supabase client with auth options
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: process.env.NODE_ENV === 'development',
    },
  }
);

// Set the redirect URL for OAuth
export const getAuthRedirectUrl = () => getRedirectUrl();