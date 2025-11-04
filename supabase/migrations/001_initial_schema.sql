-- Supabase 數據庫初始化腳本
-- 在 Supabase Dashboard → SQL Editor 中執行此腳本

-- 啟用 UUID 擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 用戶表（擴展 Supabase auth.users）
-- 注意：Supabase 已經有 auth.users 表，我們創建一個 profiles 表來存儲額外信息
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('owner', 'clinic')),
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 診所表
CREATE TABLE IF NOT EXISTS public.clinics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  hours JSONB, -- 存儲營業時間
  services TEXT[], -- 服務列表數組
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 寵物表
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  gender TEXT,
  birth_date TIMESTAMP WITH TIME ZONE,
  weight DECIMAL(5, 2),
  color TEXT,
  microchip_id TEXT,
  photo_url TEXT,
  medical_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 預約表
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_name TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 30, -- 分鐘
  service_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')),
  reason TEXT,
  notes TEXT,
  diagnosis TEXT,
  treatment TEXT,
  cost DECIMAL(8, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 醫療記錄表
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
  record_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  diagnosis TEXT,
  treatment TEXT,
  medications TEXT[],
  weight DECIMAL(5, 2),
  temperature DECIMAL(4, 1),
  notes TEXT,
  document_urls TEXT[],
  record_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 疫苗接種表
CREATE TABLE IF NOT EXISTS public.vaccinations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
  vaccine_name TEXT NOT NULL,
  manufacturer TEXT,
  lot_number TEXT,
  date_given TIMESTAMP WITH TIME ZONE NOT NULL,
  next_due_date TIMESTAMP WITH TIME ZONE,
  veterinarian TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引以提升查詢性能
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON public.pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_owner_id ON public.appointments(owner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id ON public.appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_pet_id ON public.appointments(pet_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_pet_id ON public.medical_records(pet_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_pet_id ON public.vaccinations(pet_id);
CREATE INDEX IF NOT EXISTS idx_clinics_user_id ON public.clinics(user_id);

-- 啟用 Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;

-- RLS 策略將在 002_rls_policies.sql 中定義
