import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// If keys are missing, we export a proxy object that prevents
// the app from crashing but logs a warning when called.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: (target, prop) => {
        if (prop === 'auth' || prop === 'from' || prop === 'rpc') {
          return new Proxy({}, {
            get: () => {
              console.warn(
                 +
                
              );
              return () => Promise.resolve({ data: null, error: null });
            }
          });
        }
        console.warn(
           +
          
        );
        return () => Promise.resolve({ data: null, error: null });
      }
    });

// Export a flag to check if Supabase is available
export const isSupabaseAvailable = isSupabaseConfigured;

// Helper function to safely use Supabase
export const useSupabaseIfAvailable = () => {
  return {
    isAvailable: isSupabaseConfigured,
    client: supabase,
  };
};
