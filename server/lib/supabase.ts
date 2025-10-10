import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials not found. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
}

// Create Supabase client
export const supabase: SupabaseClient | null = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      db: {
        schema: 'public'
      }
    })
  : null;

// Type definitions for Supabase tables
export interface SupabasePet {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  medical_history: string; // Encrypted
  created_at: string;
}

export interface PetInput {
  owner_id: string;
  name: string;
  species: string;
  medical_history: string; // Plain text - will be encrypted
}

export interface DecryptedPet {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  medical_history: string; // Decrypted
  created_at: string;
}

