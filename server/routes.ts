import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, registerSchema, insertPetSchema, insertAppointmentSchema, insertMedicalRecordSchema, insertVaccinationSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getChatResponse } from "./lib/gemini";
import { getMedicineByBarcode, getAllMedicines, createMedicine } from "./services/supabase-medicines.service";

const JWT_SECRET = process.env.SESSION_SECRET || "fallback-secret";

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const insertAppointmentServerSchema = insertAppointmentSchema.extend({
    appointmentDate: z.coerce.date(),
  });
  const insertMedicalRecordServerSchema = insertMedicalRecordSchema.extend({
    recordDate: z.coerce.date().optional(),
  });
  const insertVaccinationServerSchema = insertVaccinationSchema.extend({
    dateGiven: z.coerce.date(),
    nextDueDate: z.union([z.coerce.date(), z.null()]).optional(),
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const user = await storage.createUser({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        userType: data.userType,
        phone: data.phone,
        address: data.address,
      });

      // Generate token
      const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET);

      res.json({ token, user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);

      // Check demo accounts
      if (data.email === "owner.demo@example.com" && data.password === "demo1234") {
        const user = await storage.getUserByEmail(data.email);
        if (user) {
          const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET);
          return res.json({ token, user: { ...user, password: undefined } });
        }
      }

      if (data.email === "clinic.demo@example.com" && data.password === "demo1234") {
        const user = await storage.getUserByEmail(data.email);
        if (user) {
          const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET);
          return res.json({ token, user: { ...user, password: undefined } });
        }
      }

      // Find user
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Verify password
      let isValid = false;
      if (user.password?.startsWith("$2b$")) {
        isValid = await bcrypt.compare(data.password, user.password);
      }
      if (!isValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET);

      res.json({ token, user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User routes
  app.get("/api/users/me", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Pet routes
  app.get("/api/pets/:id", authenticateToken, async (req: any, res) => {
    try {
      const pet = await storage.getPet(req.params.id);
      if (!pet) return res.status(404).json({ message: "Pet not found" });
      if (pet.ownerId !== req.user.userId && req.user.userType !== 'clinic') {
        return res.status(403).json({ message: "Forbidden" });
      }
      res.json(pet);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get("/api/pets", authenticateToken, async (req: any, res) => {
    try {
      const pets = await storage.getPetsByOwner(req.user.userId);
      res.json(pets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/pets", authenticateToken, async (req: any, res) => {
    try {
      const data = insertPetSchema.parse({ ...req.body, ownerId: req.user.userId });
      const pet = await storage.createPet(data);
      res.json(pet);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/pets/:id", authenticateToken, async (req: any, res) => {
    try {
      const pet = await storage.updatePet(req.params.id, req.body);
      res.json(pet);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/pets/:id", authenticateToken, async (req: any, res) => {
    try {
      await storage.deletePet(req.params.id);
      res.json({ message: "Pet deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Clinic routes
  app.get("/api/clinics", async (req, res) => {
    try {
      const clinics = await storage.getClinics();
      res.json(clinics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/clinics/my", authenticateToken, async (req: any, res) => {
    try {
      const clinic = await storage.getClinicByUserId(req.user.userId);
      if (clinic) {
        // Parse hours JSON and format for frontend
        let hours = { weekdays: "Mon-Fri: 8:00-18:00", saturday: "Sat: 9:00-15:00", sunday: "Sun: Closed" };
        try {
          const parsedHours = JSON.parse(clinic.hours || '{}');
          hours = {
            weekdays: parsedHours["Mon-Fri"] || "Mon-Fri: 8:00-18:00",
            saturday: parsedHours["Sat"] || "Sat: 9:00-15:00", 
            sunday: parsedHours["Sun"] || "Sun: Closed"
          };
        } catch (e) {
          // Use default hours if parsing fails
        }

        const formattedClinic = {
          id: clinic.id,
          clinicName: clinic.name,
          address: clinic.address,
          phone: clinic.phone,
          email: clinic.email,
          hours: hours,
          services: clinic.services || []
        };
        res.json(formattedClinic);
      } else {
        res.status(404).json({ message: "Clinic not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Appointment routes
  app.get("/api/appointments", authenticateToken, async (req: any, res) => {
    try {
      let appointments;
      if (req.user.userType === 'owner') {
        appointments = await storage.getAppointmentsByOwner(req.user.userId);
      } else {
        const clinic = await storage.getClinicByUserId(req.user.userId);
        if (clinic) {
          appointments = await storage.getAppointmentsByClinic(clinic.id);
        } else {
          appointments = [];
        }
      }

      // Enrich appointments with pet and owner names
      const enrichedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          const pet = await storage.getPet(appointment.petId);
          const owner = pet ? await storage.getUser(pet.ownerId) : null;
          
          return {
            ...appointment,
            petName: pet?.name || 'Unknown Pet',
            ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner'
          };
        })
      );

      res.json(enrichedAppointments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/appointments", authenticateToken, async (req: any, res) => {
    try {
      const data = insertAppointmentServerSchema.parse({
        ...req.body,
        ownerId: req.user.userId,
      });
      const appointment = await storage.createAppointment(data);
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/appointments/:id", authenticateToken, async (req: any, res) => {
    try {
      const appointment = await storage.updateAppointment(req.params.id, req.body);
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Medical records routes
  app.get("/api/medical-records/:id", authenticateToken, async (req: any, res) => {
    try {
      const record = await storage.getMedicalRecord(req.params.id);
      if (!record) return res.status(404).json({ message: "Record not found" });
      res.json(record);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.get("/api/pets/:petId/medical-records", authenticateToken, async (req: any, res) => {
    try {
      const records = await storage.getMedicalRecordsByPet(req.params.petId);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/medical-records", authenticateToken, async (req: any, res) => {
    try {
      const data = insertMedicalRecordServerSchema.parse(req.body);
      const record = await storage.createMedicalRecord(data);
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Vaccination routes
  app.get("/api/vaccinations/:id", authenticateToken, async (req: any, res) => {
    try {
      const vaccination = await storage.getVaccination(req.params.id);
      if (!vaccination) return res.status(404).json({ message: "Vaccination not found" });
      res.json(vaccination);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/pets/:petId/vaccinations", authenticateToken, async (req: any, res) => {
    try {
      const vaccinations = await storage.getVaccinationsByPet(req.params.petId);
      res.json(vaccinations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/vaccinations", authenticateToken, async (req: any, res) => {
    try {
      const data = insertVaccinationServerSchema.parse(req.body);
      const vaccination = await storage.createVaccination(data);
      res.json(vaccination);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Chat route
  const chatSchema = z.object({
    message: z.string(),
    history: z.array(z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })).optional().default([]),
  });

  app.post("/api/chat", authenticateToken, async (req: any, res) => {
    try {
      const { message, history } = chatSchema.parse(req.body);
      const user = await storage.getUser(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const response = await getChatResponse(message, history, user.userType as "owner" | "clinic");
      res.json({ response });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat request" });
    }
  });

  // Medicine routes (for barcode scanning)
  app.get("/api/medicines", authenticateToken, async (req: any, res) => {
    try {
      const barcode = req.query.barcode as string;

      if (barcode) {
        // Lookup medicine by barcode
        const medicine = await getMedicineByBarcode(barcode);
        if (medicine) {
          return res.json(medicine);
        } else {
          return res.status(404).json({ message: "Medicine not found" });
        }
      } else {
        // Get all medicines
        const medicines = await getAllMedicines();
        return res.json(medicines);
      }
    } catch (error: any) {
      console.error("Medicine lookup error:", error);
      res.status(500).json({ message: error.message || "Failed to lookup medicine" });
    }
  });

  app.post("/api/medicines", authenticateToken, async (req: any, res) => {
    try {
      const { barcode, name, dosage, form, species, indication, manufacturer } = req.body;

      if (!barcode || !name) {
        return res.status(400).json({ message: "Barcode and name are required" });
      }

      const medicine = await createMedicine({
        barcode: barcode.trim(),
        name: name.trim(),
        dosage: dosage?.trim() || undefined,
        form: form?.trim() || undefined,
        species: species?.trim() || undefined,
        indication: indication?.trim() || undefined,
        manufacturer: manufacturer?.trim() || undefined,
      });

      res.json(medicine);
    } catch (error: any) {
      console.error("Medicine creation error:", error);
      res.status(500).json({ message: error.message || "Failed to create medicine" });
    }
  });

  return createServer(app);
}
