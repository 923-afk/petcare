/**
 * Supabase 數據庫服務層
 * 提供所有 CRUD 操作的類型安全接口
 */

import { supabase } from './supabase';
import type { 
  Pet, InsertPet, 
  Appointment, InsertAppointment,
  Clinic, InsertClinic,
  MedicalRecord, InsertMedicalRecord,
  Vaccination, InsertVaccination
} from '@shared/schema';

// ==================== Profiles ====================
export const profileDb = {
  async getCurrent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(data: Partial<{ first_name: string; last_name: string; phone: string; address: string }>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: updated, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }
};

// ==================== Pets ====================
export const petsDb = {
  async getAll(): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapPetFromDb);
  },

  async getById(id: string): Promise<Pet | null> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return mapPetFromDb(data);
  },

  async create(pet: InsertPet): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .insert(mapPetToDb(pet))
      .select()
      .single();

    if (error) throw error;
    return mapPetFromDb(data);
  },

  async update(id: string, pet: Partial<Pet>): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .update(mapPetToDb(pet as any))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapPetFromDb(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// 映射函數：數據庫格式 <-> 應用格式
function mapPetFromDb(dbPet: any): Pet {
  return {
    id: dbPet.id,
    ownerId: dbPet.owner_id,
    name: dbPet.name,
    species: dbPet.species,
    breed: dbPet.breed || null,
    gender: dbPet.gender || null,
    birthDate: dbPet.birth_date || null,
    weight: dbPet.weight || null,
    color: dbPet.color || null,
    microchipId: dbPet.microchip_id || null,
    photoUrl: dbPet.photo_url || null,
    medicalNotes: dbPet.medical_notes || null,
    createdAt: dbPet.created_at
  };
}

function mapPetToDb(pet: any): any {
  return {
    owner_id: pet.ownerId,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    gender: pet.gender,
    birth_date: pet.birthDate,
    weight: pet.weight,
    color: pet.color,
    microchip_id: pet.microchipId,
    photo_url: pet.photoUrl,
    medical_notes: pet.medicalNotes
  };
}

// ==================== Clinics ====================
export const clinicsDb = {
  async getAll(): Promise<Clinic[]> {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapClinicFromDb);
  },

  async getById(id: string): Promise<Clinic | null> {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return mapClinicFromDb(data);
  },

  async getByUserId(userId: string): Promise<Clinic | null> {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data ? mapClinicFromDb(data) : null;
  },

  async create(clinic: InsertClinic): Promise<Clinic> {
    const { data, error } = await supabase
      .from('clinics')
      .insert(mapClinicToDb(clinic))
      .select()
      .single();

    if (error) throw error;
    return mapClinicFromDb(data);
  }
};

function mapClinicFromDb(dbClinic: any): Clinic {
  return {
    id: dbClinic.id,
    userId: dbClinic.user_id,
    name: dbClinic.name,
    description: dbClinic.description || null,
    address: dbClinic.address,
    phone: dbClinic.phone,
    email: dbClinic.email,
    hours: typeof dbClinic.hours === 'string' ? dbClinic.hours : JSON.stringify(dbClinic.hours || {}),
    services: dbClinic.services || [],
    createdAt: dbClinic.created_at
  };
}

function mapClinicToDb(clinic: any): any {
  return {
    user_id: clinic.userId,
    name: clinic.name,
    description: clinic.description,
    address: clinic.address,
    phone: clinic.phone,
    email: clinic.email,
    hours: typeof clinic.hours === 'string' ? JSON.parse(clinic.hours) : clinic.hours,
    services: clinic.services
  };
}

// ==================== Appointments ====================
export const appointmentsDb = {
  async getAll(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: false });

    if (error) throw error;
    return data.map(mapAppointmentFromDb);
  },

  async getById(id: string): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return mapAppointmentFromDb(data);
  },

  async create(appointment: InsertAppointment): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert(mapAppointmentToDb(appointment))
      .select()
      .single();

    if (error) throw error;
    return mapAppointmentFromDb(data);
  },

  async update(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update(mapAppointmentToDb(appointment as any))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapAppointmentFromDb(data);
  }
};

function mapAppointmentFromDb(dbAppt: any): Appointment {
  return {
    id: dbAppt.id,
    petId: dbAppt.pet_id,
    clinicId: dbAppt.clinic_id,
    ownerId: dbAppt.owner_id,
    doctorName: dbAppt.doctor_name || null,
    appointmentDate: dbAppt.appointment_date,
    duration: dbAppt.duration || 30,
    serviceType: dbAppt.service_type,
    status: dbAppt.status,
    reason: dbAppt.reason || null,
    notes: dbAppt.notes || null,
    diagnosis: dbAppt.diagnosis || null,
    treatment: dbAppt.treatment || null,
    cost: dbAppt.cost || null,
    createdAt: dbAppt.created_at
  };
}

function mapAppointmentToDb(appt: any): any {
  return {
    pet_id: appt.petId,
    clinic_id: appt.clinicId,
    owner_id: appt.ownerId,
    doctor_name: appt.doctorName,
    appointment_date: appt.appointmentDate,
    duration: appt.duration,
    service_type: appt.serviceType,
    status: appt.status,
    reason: appt.reason,
    notes: appt.notes,
    diagnosis: appt.diagnosis,
    treatment: appt.treatment,
    cost: appt.cost
  };
}

// ==================== Medical Records ====================
export const medicalRecordsDb = {
  async getByPetId(petId: string): Promise<MedicalRecord[]> {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('pet_id', petId)
      .order('record_date', { ascending: false });

    if (error) throw error;
    return data.map(mapMedicalRecordFromDb);
  },

  async create(record: InsertMedicalRecord): Promise<MedicalRecord> {
    const { data, error } = await supabase
      .from('medical_records')
      .insert(mapMedicalRecordToDb(record))
      .select()
      .single();

    if (error) throw error;
    return mapMedicalRecordFromDb(data);
  }
};

function mapMedicalRecordFromDb(dbRecord: any): MedicalRecord {
  return {
    id: dbRecord.id,
    petId: dbRecord.pet_id,
    appointmentId: dbRecord.appointment_id || null,
    clinicId: dbRecord.clinic_id,
    recordType: dbRecord.record_type,
    title: dbRecord.title,
    description: dbRecord.description || null,
    diagnosis: dbRecord.diagnosis || null,
    treatment: dbRecord.treatment || null,
    medications: dbRecord.medications || [],
    weight: dbRecord.weight || null,
    temperature: dbRecord.temperature || null,
    notes: dbRecord.notes || null,
    documentUrls: dbRecord.document_urls || [],
    recordDate: dbRecord.record_date || dbRecord.created_at,
    createdAt: dbRecord.created_at
  };
}

function mapMedicalRecordToDb(record: any): any {
  return {
    pet_id: record.petId,
    appointment_id: record.appointmentId,
    clinic_id: record.clinicId,
    record_type: record.recordType,
    title: record.title,
    description: record.description,
    diagnosis: record.diagnosis,
    treatment: record.treatment,
    medications: record.medications,
    weight: record.weight,
    temperature: record.temperature,
    notes: record.notes,
    document_urls: record.documentUrls,
    record_date: record.recordDate
  };
}

// ==================== Vaccinations ====================
export const vaccinationsDb = {
  async getByPetId(petId: string): Promise<Vaccination[]> {
    const { data, error } = await supabase
      .from('vaccinations')
      .select('*')
      .eq('pet_id', petId)
      .order('date_given', { ascending: false });

    if (error) throw error;
    return data.map(mapVaccinationFromDb);
  },

  async create(vaccination: InsertVaccination): Promise<Vaccination> {
    const { data, error } = await supabase
      .from('vaccinations')
      .insert(mapVaccinationToDb(vaccination))
      .select()
      .single();

    if (error) throw error;
    return mapVaccinationFromDb(data);
  }
};

function mapVaccinationFromDb(dbVax: any): Vaccination {
  return {
    id: dbVax.id,
    petId: dbVax.pet_id,
    clinicId: dbVax.clinic_id,
    vaccineName: dbVax.vaccine_name,
    manufacturer: dbVax.manufacturer || null,
    lotNumber: dbVax.lot_number || null,
    dateGiven: dbVax.date_given,
    nextDueDate: dbVax.next_due_date || null,
    veterinarian: dbVax.veterinarian || null,
    notes: dbVax.notes || null,
    createdAt: dbVax.created_at
  };
}

function mapVaccinationToDb(vax: any): any {
  return {
    pet_id: vax.petId,
    clinic_id: vax.clinicId,
    vaccine_name: vax.vaccineName,
    manufacturer: vax.manufacturer,
    lot_number: vax.lotNumber,
    date_given: vax.dateGiven,
    next_due_date: vax.nextDueDate,
    veterinarian: vax.veterinarian,
    notes: vax.notes
  };
}
