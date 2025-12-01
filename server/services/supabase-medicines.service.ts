import { supabase } from '../lib/supabase';

/**
 * Supabase Medicines Service
 * 
 * This service provides operations for medicine lookup and management.
 */

export interface Medicine {
  id: string;
  barcode: string;
  name: string;
  dosage?: string;
  form?: string;
  species?: string;
  indication?: string;
  manufacturer?: string;
  created_at?: string;
}

/**
 * Get medicine by barcode
 * @param barcode - The barcode (EAN/UPC) to search for
 * @returns The medicine if found, null otherwise
 */
export async function getMedicineByBarcode(barcode: string): Promise<Medicine | null> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('barcode', barcode.trim())
    .single();

  if (error) {
    // PGRST116 = no rows returned (not an error, just not found)
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Supabase query error:', error);
    throw new Error(`Failed to query medicine: ${error.message}`);
  }

  return data as Medicine;
}

/**
 * Get all medicines
 * @returns Array of all medicines
 */
export async function getAllMedicines(): Promise<Medicine[]> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Supabase query error:', error);
    throw new Error(`Failed to query medicines: ${error.message}`);
  }

  return (data || []) as Medicine[];
}

/**
 * Create a new medicine
 * @param medicineData - Medicine data to insert
 * @returns The created medicine
 */
export async function createMedicine(medicineData: Omit<Medicine, 'id' | 'created_at'>): Promise<Medicine> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  const { data, error } = await supabase
    .from('medicines')
    .insert(medicineData)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to create medicine: ${error.message}`);
  }

  return data as Medicine;
}

/**
 * Update a medicine
 * @param id - Medicine ID
 * @param updates - Fields to update
 * @returns The updated medicine
 */
export async function updateMedicine(id: string, updates: Partial<Omit<Medicine, 'id' | 'created_at'>>): Promise<Medicine> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  const { data, error } = await supabase
    .from('medicines')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase update error:', error);
    throw new Error(`Failed to update medicine: ${error.message}`);
  }

  return data as Medicine;
}

