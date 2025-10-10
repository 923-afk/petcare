import type { Express, Request, Response } from "express";
import { 
  insertPet, 
  getPetsByOwner, 
  getPetById,
  updatePet,
  deletePet,
  getPetsCount
} from "../services/supabase-pets.service";
import { z } from "zod";

/**
 * Supabase Pets API Routes with Encrypted Medical Records
 * 
 * These routes demonstrate how to use Supabase with AES encryption
 * for medical records in an Express.js application.
 * 
 * Base path: /api/supabase/pets
 */

// Validation schemas
const createPetSchema = z.object({
  owner_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  species: z.string().min(1).max(50),
  medical_history: z.string().optional().default(''),
});

const updatePetSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  species: z.string().min(1).max(50).optional(),
  medical_history: z.string().optional(),
});

export function registerSupabasePetsRoutes(app: Express): void {
  /**
   * POST /api/supabase/pets
   * Create a new pet with encrypted medical history
   */
  app.post("/api/supabase/pets", async (req: Request, res: Response) => {
    try {
      const petData = createPetSchema.parse(req.body);
      const pet = await insertPet(petData);
      
      res.status(201).json({
        success: true,
        message: 'Pet created successfully with encrypted medical records',
        data: pet,
      });
    } catch (error: any) {
      console.error('Create pet error:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create pet',
      });
    }
  });

  /**
   * GET /api/supabase/pets/owner/:ownerId
   * Get all pets for a specific owner (with decrypted medical history)
   */
  app.get("/api/supabase/pets/owner/:ownerId", async (req: Request, res: Response) => {
    try {
      const { ownerId } = req.params;
      
      if (!ownerId) {
        return res.status(400).json({
          success: false,
          message: 'Owner ID is required',
        });
      }

      const pets = await getPetsByOwner(ownerId);
      const count = await getPetsCount(ownerId);
      
      res.json({
        success: true,
        data: pets,
        count,
        message: `Found ${count} pet(s) with decrypted medical records`,
      });
    } catch (error: any) {
      console.error('Get pets error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch pets',
      });
    }
  });

  /**
   * GET /api/supabase/pets/:id
   * Get a single pet by ID (with decrypted medical history)
   */
  app.get("/api/supabase/pets/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Pet ID is required',
        });
      }

      const pet = await getPetById(id);
      
      if (!pet) {
        return res.status(404).json({
          success: false,
          message: 'Pet not found',
        });
      }
      
      res.json({
        success: true,
        data: pet,
        message: 'Pet retrieved with decrypted medical records',
      });
    } catch (error: any) {
      console.error('Get pet error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch pet',
      });
    }
  });

  /**
   * PUT /api/supabase/pets/:id
   * Update a pet's information (encrypts medical history if updated)
   */
  app.put("/api/supabase/pets/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = updatePetSchema.parse(req.body);
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Pet ID is required',
        });
      }

      const pet = await updatePet(id, updates);
      
      res.json({
        success: true,
        data: pet,
        message: 'Pet updated successfully',
      });
    } catch (error: any) {
      console.error('Update pet error:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update pet',
      });
    }
  });

  /**
   * DELETE /api/supabase/pets/:id
   * Delete a pet by ID
   */
  app.delete("/api/supabase/pets/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Pet ID is required',
        });
      }

      await deletePet(id);
      
      res.json({
        success: true,
        message: 'Pet deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete pet error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete pet',
      });
    }
  });

  /**
   * GET /api/supabase/pets/test/encryption
   * Test encryption/decryption functionality
   */
  app.get("/api/supabase/pets/test/encryption", async (req: Request, res: Response) => {
    try {
      const { encryptMedicalData, decryptMedicalData } = await import("../lib/encryption");
      
      const testData = "Patient has chronic allergies to chicken. Previous surgery on left paw in 2023.";
      const encrypted = encryptMedicalData(testData);
      const decrypted = decryptMedicalData(encrypted);
      
      res.json({
        success: true,
        test: {
          original: testData,
          encrypted: encrypted,
          decrypted: decrypted,
          match: testData === decrypted,
        },
        message: 'Encryption test completed',
      });
    } catch (error: any) {
      console.error('Encryption test error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Encryption test failed',
      });
    }
  });
}

