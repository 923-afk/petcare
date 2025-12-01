/**
 * Supabase Client Service
 * 
 * Initializes and exports Supabase client for use throughout the application
 * 
 * Environment Variables Required:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_KEY: Your Supabase anon/public key
 * 
 * Usage:
 * import { supabase } from './services/supabase';
 * 
 * const { data, error } = await supabase.from('table_name').select('*');
 */

import { createClient } from '@supabase/supabase-js';

// Read environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '⚠️  Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_KEY in your environment variables.'
  );
  console.warn('   SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.warn('   SUPABASE_KEY:', supabaseKey ? '✓ Set' : '✗ Missing');
}

/**
 * Initialize Supabase client
 * 
 * Creates a Supabase client with default configuration:
 * - Auto-refresh tokens enabled
 * - Session persistence enabled
 * - Database schema: 'public'
 */
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-client-info': 'vetcepi-app',
        },
      },
    })
  : null;

/**
 * Check if Supabase client is properly initialized
 * 
 * @returns {boolean} True if client is initialized, false otherwise
 */
export const isSupabaseInitialized = () => {
  return supabase !== null;
};

/**
 * Get Supabase client instance
 * 
 * @returns {SupabaseClient|null} Supabase client or null if not initialized
 */
export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. Please check your SUPABASE_URL and SUPABASE_KEY environment variables.'
    );
  }
  return supabase;
};

// Export default client
export default supabase;

