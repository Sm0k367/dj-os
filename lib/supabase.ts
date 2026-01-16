import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If keys are missing, we export a proxy object that prevents 
// the app from crashing but logs a warning when called.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: (target, prop) => {
        console.warn(`Supabase: Attempted to access "${String(prop)}" without API keys. Set up .env.local to enable cloud features.`);
        return () => Promise.resolve({ data: null, error: null });
      }
    });
