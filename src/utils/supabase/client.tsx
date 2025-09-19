import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a single Supabase client instance with a unique storage key
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
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