import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './info';

// Create a single Supabase client instance with a unique storage key
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'campaign-ai-auth-storage',
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'X-Client-Info': 'campaign-ai-dashboard',
      },
    },
  }
);