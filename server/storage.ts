import { type User, type InsertUser, type Pet, type InsertPet, type Appointment, type InsertAppointment, type Clinic, type InsertClinic, type MedicalRecord, type InsertMedicalRecord, type Vaccination, type InsertVaccination } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Pet methods
  getPet(id: string): Promise<Pet | undefined>;
  getPetsByOwner(ownerId: string): Promise<Pet[]>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: string, pet: Partial<Pet>): Promise<Pet>;
  deletePet(id: string): Promise<void>;
  
  // Clinic methods
  getClinics(): Promise<Clinic[]>;
  getClinic(id: string): Promise<Clinic | undefined>;
  getClinicByUserId(userId: string): Promise<Clinic | undefined>;
  createClinic(clinic: InsertClinic): Promise<Clinic>;
  
  // Appointment methods
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointmentsByOwner(ownerId: string): Promise<Appointment[]>;
  getAppointmentsByClinic(clinicId: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment>;
  
  // Medical Record methods
  getMedicalRecord(id: string): Promise<MedicalRecord | undefined>;
  getMedicalRecordsByPet(petId: string): Promise<MedicalRecord[]>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  
  // Vaccination methods
  getVaccination(id: string): Promise<Vaccination | undefined>;
  getVaccinationsByPet(petId: string): Promise<Vaccination[]>;
  createVaccination(vaccination: InsertVaccination): Promise<Vaccination>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private pets: Map<string, Pet>;
  private clinics: Map<string, Clinic>;
  private appointments: Map<string, Appointment>;
  private medicalRecords: Map<string, MedicalRecord>;
  private vaccinations: Map<string, Vaccination>;

  constructor() {
    this.users = new Map();
    this.pets = new Map();
    this.clinics = new Map();
    this.appointments = new Map();
    this.medicalRecords = new Map();
    this.vaccinations = new Map();
    
    // Create demo users
    this.initDemoData();
  }

  private initDemoData() {
    // Demo owner user
    const ownerId = randomUUID();
    const ownerUser: User = {
      id: ownerId,
      email: "owner.demo@example.com",
      password: "demo1234", // In real app, this would be hashed
      firstName: "Pet",
      lastName: "Owner",
      userType: "owner",
      phone: "555-0101",
      address: "123 Pet Street",
      createdAt: new Date(),
    };
    this.users.set(ownerId, ownerUser);
    
    // Demo clinic user
    const clinicUserId = randomUUID();
    const clinicUser: User = {
      id: clinicUserId,
      email: "clinic.demo@example.com",
      password: "demo1234", // In real app, this would be hashed
      firstName: "Clinic",
      lastName: "Admin",
      userType: "clinic",
      phone: "555-0102",
      address: "456 Veterinary Ave",
      createdAt: new Date(),
    };
    this.users.set(clinicUserId, clinicUser);
    
    // Demo clinic
    const clinicId = randomUUID();
    const clinic: Clinic = {
      id: clinicId,
      userId: clinicUserId,
      name: "Sunshine Veterinary Clinic",
      description: "Your trusted partner in pet healthcare",
      address: "456 Veterinary Ave, Pet City, PC 12345",
      phone: "555-0102",
      email: "clinic@example.com",
      hours: JSON.stringify({ "Mon-Fri": "8:00-18:00", "Sat": "9:00-15:00" }),
      services: ["Checkups", "Vaccinations", "Surgery", "Dental Care", "Emergency Care"],
      createdAt: new Date(),
    };
    this.clinics.set(clinicId, clinic);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Pet methods
  async getPet(id: string): Promise<Pet | undefined> {
    return this.pets.get(id);
  }

  async getPetsByOwner(ownerId: string): Promise<Pet[]> {
    return Array.from(this.pets.values()).filter(pet => pet.ownerId === ownerId);
  }

  async createPet(insertPet: InsertPet): Promise<Pet> {
    const id = randomUUID();
    const pet: Pet = { 
      ...insertPet, 
      id,
      createdAt: new Date(),
    };
    this.pets.set(id, pet);
    return pet;
  }

  async updatePet(id: string, petUpdate: Partial<Pet>): Promise<Pet> {
    const existing = this.pets.get(id);
    if (!existing) throw new Error("Pet not found");
    const updated = { ...existing, ...petUpdate };
    this.pets.set(id, updated);
    return updated;
  }

  async deletePet(id: string): Promise<void> {
    this.pets.delete(id);
  }

  // Clinic methods
  async getClinics(): Promise<Clinic[]> {
    return Array.from(this.clinics.values());
  }

  async getClinic(id: string): Promise<Clinic | undefined> {
    return this.clinics.get(id);
  }

  async getClinicByUserId(userId: string): Promise<Clinic | undefined> {
    return Array.from(this.clinics.values()).find(clinic => clinic.userId === userId);
  }

  async createClinic(insertClinic: InsertClinic): Promise<Clinic> {
    const id = randomUUID();
    const clinic: Clinic = { 
      ...insertClinic, 
      id,
      createdAt: new Date(),
    };
    this.clinics.set(id, clinic);
    return clinic;
  }

  // Appointment methods
  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointmentsByOwner(ownerId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(apt => apt.ownerId === ownerId);
  }

  async getAppointmentsByClinic(clinicId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(apt => apt.clinicId === clinicId);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = { 
      ...insertAppointment, 
      id,
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: string, appointmentUpdate: Partial<Appointment>): Promise<Appointment> {
    const existing = this.appointments.get(id);
    if (!existing) throw new Error("Appointment not found");
    const updated = { ...existing, ...appointmentUpdate };
    this.appointments.set(id, updated);
    return updated;
  }

  // Medical Record methods
  async getMedicalRecord(id: string): Promise<MedicalRecord | undefined> {
    return this.medicalRecords.get(id);
  }

  async getMedicalRecordsByPet(petId: string): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values()).filter(record => record.petId === petId);
  }

  async createMedicalRecord(insertRecord: InsertMedicalRecord): Promise<MedicalRecord> {
    const id = randomUUID();
    const record: MedicalRecord = { 
      ...insertRecord, 
      id,
      createdAt: new Date(),
    };
    this.medicalRecords.set(id, record);
    return record;
  }

  // Vaccination methods
  async getVaccination(id: string): Promise<Vaccination | undefined> {
    return this.vaccinations.get(id);
  }

  async getVaccinationsByPet(petId: string): Promise<Vaccination[]> {
    return Array.from(this.vaccinations.values()).filter(vax => vax.petId === petId);
  }

  async createVaccination(insertVaccination: InsertVaccination): Promise<Vaccination> {
    const id = randomUUID();
    const vaccination: Vaccination = { 
      ...insertVaccination, 
      id,
      createdAt: new Date(),
    };
    this.vaccinations.set(id, vaccination);
    return vaccination;
  }
}

export const storage = new MemStorage();
