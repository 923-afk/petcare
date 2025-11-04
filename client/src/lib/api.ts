/**
 * 統一的 API 層
 * 使用 Supabase 數據庫服務替代舊的 REST API
 */

import { 
  petsDb, 
  clinicsDb, 
  appointmentsDb, 
  medicalRecordsDb, 
  vaccinationsDb,
  profileDb 
} from './supabase-db';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import type { 
  Pet, InsertPet,
  Clinic, InsertClinic,
  Appointment, InsertAppointment,
  MedicalRecord, InsertMedicalRecord,
  Vaccination, InsertVaccination
} from '@shared/schema';

// 獲取當前用戶 ID（從 Supabase session）
async function getCurrentUserId(): Promise<string> {
  const { supabase } = await import('./supabase');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

// ==================== Pets API ====================
export const petsApi = {
  async getAll(): Promise<Pet[]> {
    return petsDb.getAll();
  },

  async getById(id: string): Promise<Pet | null> {
    return petsDb.getById(id);
  },

  async create(pet: InsertPet): Promise<Pet> {
    const userId = await getCurrentUserId();
    return petsDb.create({ ...pet, ownerId: userId });
  },

  async update(id: string, pet: Partial<Pet>): Promise<Pet> {
    return petsDb.update(id, pet);
  },

  async delete(id: string): Promise<void> {
    return petsDb.delete(id);
  }
};

// ==================== Clinics API ====================
export const clinicsApi = {
  async getAll(): Promise<Clinic[]> {
    return clinicsDb.getAll();
  },

  async getById(id: string): Promise<Clinic | null> {
    return clinicsDb.getById(id);
  },

  async getMy(): Promise<Clinic | null> {
    const userId = await getCurrentUserId();
    return clinicsDb.getByUserId(userId);
  },

  async create(clinic: InsertClinic): Promise<Clinic> {
    const userId = await getCurrentUserId();
    return clinicsDb.create({ ...clinic, userId });
  }
};

// ==================== Appointments API ====================
export const appointmentsApi = {
  async getAll(): Promise<Appointment[]> {
    return appointmentsDb.getAll();
  },

  async getById(id: string): Promise<Appointment | null> {
    return appointmentsDb.getById(id);
  },

  async create(appointment: InsertAppointment): Promise<Appointment> {
    const userId = await getCurrentUserId();
    return appointmentsDb.create({ ...appointment, ownerId: userId });
  },

  async update(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
    return appointmentsDb.update(id, appointment);
  }
};

// ==================== Medical Records API ====================
export const medicalRecordsApi = {
  async getByPetId(petId: string): Promise<MedicalRecord[]> {
    return medicalRecordsDb.getByPetId(petId);
  },

  async create(record: InsertMedicalRecord): Promise<MedicalRecord> {
    return medicalRecordsDb.create(record);
  }
};

// ==================== Vaccinations API ====================
export const vaccinationsApi = {
  async getByPetId(petId: string): Promise<Vaccination[]> {
    return vaccinationsDb.getByPetId(petId);
  },

  async create(vaccination: InsertVaccination): Promise<Vaccination> {
    return vaccinationsDb.create(vaccination);
  }
};

// ==================== 向後兼容的 apiRequest ====================
// 為了保持現有代碼的兼容性，提供一個 apiRequest 函數
// 但實際上它會調用 Supabase API

export async function apiRequest<T = any>(
  method: string,
  url: string,
  data?: unknown
): Promise<T> {
  // 解析 URL 和路由到對應的 Supabase API
  if (url === '/api/pets' && method === 'GET') {
    return petsApi.getAll() as Promise<T>;
  }
  
  if (url === '/api/pets' && method === 'POST') {
    return petsApi.create(data as InsertPet) as Promise<T>;
  }
  
  if (url.startsWith('/api/pets/') && method === 'PUT') {
    const id = url.split('/api/pets/')[1];
    return petsApi.update(id, data as Partial<Pet>) as Promise<T>;
  }
  
  if (url.startsWith('/api/pets/') && method === 'DELETE') {
    const id = url.split('/api/pets/')[1];
    await petsApi.delete(id);
    return { message: 'Deleted successfully' } as T;
  }
  
  if (url === '/api/clinics' && method === 'GET') {
    return clinicsApi.getAll() as Promise<T>;
  }
  
  if (url === '/api/clinics/my' && method === 'GET') {
    return clinicsApi.getMy() as Promise<T>;
  }
  
  if (url === '/api/appointments' && method === 'GET') {
    return appointmentsApi.getAll() as Promise<T>;
  }
  
  if (url === '/api/appointments' && method === 'POST') {
    return appointmentsApi.create(data as InsertAppointment) as Promise<T>;
  }
  
  if (url.startsWith('/api/appointments/') && method === 'PUT') {
    const id = url.split('/api/appointments/')[1];
    return appointmentsApi.update(id, data as Partial<Appointment>) as Promise<T>;
  }
  
  if (url.startsWith('/api/pets/') && url.includes('/medical-records') && method === 'GET') {
    const petId = url.split('/api/pets/')[1].split('/medical-records')[0];
    return medicalRecordsApi.getByPetId(petId) as Promise<T>;
  }
  
  if (url === '/api/medical-records' && method === 'POST') {
    return medicalRecordsApi.create(data as InsertMedicalRecord) as Promise<T>;
  }
  
  if (url.startsWith('/api/pets/') && url.includes('/vaccinations') && method === 'GET') {
    const petId = url.split('/api/pets/')[1].split('/vaccinations')[0];
    return vaccinationsApi.getByPetId(petId) as Promise<T>;
  }
  
  if (url === '/api/vaccinations' && method === 'POST') {
    return vaccinationsApi.create(data as InsertVaccination) as Promise<T>;
  }
  
  throw new Error(`Unsupported API endpoint: ${method} ${url}`);
}

// 更新 queryClient 以使用 Supabase
export const getQueryFn: <T>(options: {
  on401: "returnNull" | "throw";
}) => any =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join('/') as string;
    
    try {
      // 路由到對應的 Supabase API
      if (url === '/api/pets') {
        return petsApi.getAll();
      }
      
      if (url === '/api/clinics') {
        return clinicsApi.getAll();
      }
      
      if (url === '/api/clinics/my') {
        return clinicsApi.getMy();
      }
      
      if (url === '/api/appointments') {
        return appointmentsApi.getAll();
      }
      
      // 如果沒有匹配，返回 null
      if (unauthorizedBehavior === 'returnNull') {
        return null;
      }
      
      throw new Error(`Unknown query key: ${url}`);
    } catch (error: any) {
      if (unauthorizedBehavior === 'returnNull' && error.message?.includes('Not authenticated')) {
        return null;
      }
      throw error;
    }
  };
