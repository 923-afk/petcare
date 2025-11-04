-- 插入演示數據
-- 注意：這需要在創建用戶後手動執行，因為需要真實的 auth.users ID

-- 此腳本用於參考，實際數據應該通過應用程序創建
-- 或者使用 Supabase Dashboard 的 SQL Editor 手動插入

-- 示例：創建演示用戶資料（需要先創建 auth.users）
-- INSERT INTO public.profiles (id, email, first_name, last_name, user_type, phone, address)
-- VALUES 
--   ('<owner-user-id>', 'owner.demo@example.com', 'Pet', 'Owner', 'owner', '555-0101', '123 Pet Street'),
--   ('<clinic-user-id>', 'clinic.demo@example.com', 'Clinic', 'Admin', 'clinic', '555-0102', '456 Veterinary Ave');

-- 注意：在 Supabase Dashboard 中創建用戶後，使用觸發器自動創建 profile
-- 見 004_triggers.sql
