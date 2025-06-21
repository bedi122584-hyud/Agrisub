import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gwznesrrbmgmymulzbqd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3em5lc3JyYm1nbXltdWx6YnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODkyMzYsImV4cCI6MjA2MzA2NTIzNn0.IXAXvaGrGhSBi6dnoVYBD-3udtnw9PaWhuEOp2lwbAY";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);