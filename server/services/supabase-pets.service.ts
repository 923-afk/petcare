import { supabase, SupabasePet, PetInput, DecryptedPet } from '../lib/supabase';
import { encryptMedicalData, decryptMedicalData } from '../lib/encryption';

/**
 * Supabase Pets Service with Encrypted Medical Records
 * 
 * This service provides CRUD operations for pets with AES-encrypted medical history.
 * All medical data is encrypted before storage and decrypted on retrieval.
 */

/**
 * Insert a new pet with encrypted medical history
 * @param petData - Pet data with plain text medical history
 * @returns The created pet with encrypted medical history
 */
export async function insertPet(petData: PetInput): Promise<SupabasePet> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  // Encrypt medical history before storing
  const encryptedMedicalHistory = encryptMedicalData(petData.medical_history);

  const { data, error } = await supabase
    .from('pets')
    .insert({
      owner_id: petData.owner_id,
      name: petData.name,
      species: petData.species,
      medical_history: encryptedMedicalHistory,
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to insert pet: ${error.message}`);
  }

  return data as SupabasePet;
}

/**
 * Get all pets for a specific owner with decrypted medical histories
 * @param ownerId - The owner's user ID
 * @returns Array of pets with decrypted medical histories
 */
export async function getPetsByOwner(ownerId: string): Promise<DecryptedPet[]> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase query error:', error);
    throw new Error(`Failed to fetch pets: ${error.message}`);
  }

  // Decrypt medical history for each pet
  const decryptedPets: DecryptedPet[] = (data as SupabasePet[]).map(pet => ({
    ...pet,
    medical_history: decryptMedicalData(pet.medical_history),
  }));

  return decryptedPets;
}

/**
 * Get a single pet by ID with decrypted medical history
 * @param petId - The pet's ID
 * @returns Pet with decrypted medical history
 */
export async function getPetById(petId: string): Promise<DecryptedPet | null> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', petId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Pet not found
    }
    console.error('Supabase query error:', error);
    throw new Error(`Failed to fetch pet: ${error.message}`);
  }

  const pet = data as SupabasePet;
  return {
    ...pet,
    medical_history: decryptMedicalData(pet.medical_history),
  };
}

/**
 * Update a pet's information (encrypts medical history if updated)
 * @param petId - The pet's ID
 * @param updates - Partial pet data to update
 * @returns Updated pet with decrypted medical history
 */
export async function updatePet(
  petId: string,
  updates: Partial<PetInput>
): Promise<DecryptedPet> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  // Encrypt medical history if it's being updated
  const dataToUpdate: any = { ...updates };
  if (updates.medical_history !== undefined) {
    dataToUpdate.medical_history = encryptMedicalData(updates.medical_history);
  }

  const { data, error } = await supabase
    .from('pets')
    .update(dataToUpdate)
    .eq('id', petId)
    .select()
    .single();

  if (error) {
    console.error('Supabase update error:', error);
    throw new Error(`Failed to update pet: ${error.message}`);
  }

  const pet = data as SupabasePet;
  return {
    ...pet,
    medical_history: decryptMedicalData(pet.medical_history),
  };
}

/**
 * Delete a pet by ID
 * @param petId - The pet's ID
 * @returns True if deleted successfully
 */
export async function deletePet(petId: string): Promise<boolean> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', petId);

  if (error) {
    console.error('Supabase delete error:', error);
    throw new Error(`Failed to delete pet: ${error.message}`);
  }

  return true;
}

/**
 * Get pets count for an owner (useful for pagination)
 * @param ownerId - The owner's user ID
 * @returns Number of pets owned
 */
export async function getPetsCount(ownerId: string): Promise<number> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check your environment variables.');
  }

  const { count, error } = await supabase
    .from('pets')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', ownerId);

  if (error) {
    console.error('Supabase count error:', error);
    throw new Error(`Failed to count pets: ${error.message}`);
  }

  return count || 0;
}

