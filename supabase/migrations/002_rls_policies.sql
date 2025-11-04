-- Row Level Security (RLS) 策略
-- 確保用戶只能訪問自己的數據

-- Profiles 策略
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Clinics 策略
CREATE POLICY "Anyone can view clinics"
  ON public.clinics FOR SELECT
  USING (true);

CREATE POLICY "Clinic owners can manage their clinic"
  ON public.clinics FOR ALL
  USING (user_id = (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Pets 策略
CREATE POLICY "Owners can view their pets"
  ON public.pets FOR SELECT
  USING (
    owner_id = (SELECT id FROM public.profiles WHERE id = auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM public.clinics 
      WHERE user_id = (SELECT id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Owners can manage their pets"
  ON public.pets FOR ALL
  USING (owner_id = (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Appointments 策略
CREATE POLICY "Owners can view their appointments"
  ON public.appointments FOR SELECT
  USING (
    owner_id = (SELECT id FROM public.profiles WHERE id = auth.uid())
    OR
    clinic_id IN (
      SELECT id FROM public.clinics 
      WHERE user_id = (SELECT id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Owners can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (owner_id = (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Clinic owners can update appointments"
  ON public.appointments FOR UPDATE
  USING (
    clinic_id IN (
      SELECT id FROM public.clinics 
      WHERE user_id = (SELECT id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- Medical Records 策略
CREATE POLICY "Owners can view their pet medical records"
  ON public.medical_records FOR SELECT
  USING (
    pet_id IN (
      SELECT id FROM public.pets 
      WHERE owner_id = (SELECT id FROM public.profiles WHERE id = auth.uid())
    )
    OR
    clinic_id IN (
      SELECT id FROM public.clinics 
      WHERE user_id = (SELECT id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Clinics can create medical records"
  ON public.medical_records FOR INSERT
  WITH CHECK (
    clinic_id IN (
      SELECT id FROM public.clinics 
      WHERE user_id = (SELECT id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Clinics can update medical records"
  ON public.medical_records FOR UPDATE
  USING (
    clinic_id IN (
      SELECT id FROM public.clinics 
      WHERE user_id = (SELECT id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- Vaccinations 策略
CREATE POLICY "Owners can view their pet vaccinations"
  ON public.vaccinations FOR SELECT
  USING (
    pet_id IN (
      SELECT id FROM public.pets 
      WHERE owner_id = (SELECT id FROM public.profiles WHERE id = auth.uid())
    )
    OR
    clinic_id IN (
      SELECT id FROM public.clinics 
      WHERE user_id = (SELECT id FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Clinics can manage vaccinations"
  ON public.vaccinations FOR ALL
  USING (
    clinic_id IN (
      SELECT id FROM public.clinics 
      WHERE user_id = (SELECT id FROM public.profiles WHERE id = auth.uid())
    )
  );
