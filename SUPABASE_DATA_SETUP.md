# 🗄️ Supabase 數據庫設定指南

## 📋 完整設定步驟

### **步驟 1: 創建 Supabase 專案**

1. 前往 [supabase.com](https://supabase.com)
2. 登入並創建新專案
3. 記下您的專案 URL 和 API Key

### **步驟 2: 執行數據庫遷移**

在 Supabase Dashboard → SQL Editor 中，按順序執行以下 SQL 腳本：

1. **`supabase/migrations/001_initial_schema.sql`**
   - 創建所有數據表
   - 設置索引

2. **`supabase/migrations/002_rls_policies.sql`**
   - 設置 Row Level Security (RLS) 策略
   - 確保數據安全

3. **`supabase/migrations/004_triggers.sql`**
   - 設置自動創建 profile 的觸發器

### **步驟 3: 設定環境變數**

在 `client/.env.local` 中創建：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### **步驟 4: 創建測試用戶**

#### 方法 1: 通過 Supabase Dashboard

1. 前往 **Authentication** → **Users**
2. 點擊 **"Add user"** → **"Create new user"**
3. 創建以下用戶：

**寵物主人：**
- Email: `owner.demo@example.com`
- Password: `demo1234`
- User Metadata (JSON):
  ```json
  {
    "firstName": "Pet",
    "lastName": "Owner",
    "userType": "owner"
  }
  ```

**獸醫診所：**
- Email: `clinic.demo@example.com`
- Password: `demo1234`
- User Metadata (JSON):
  ```json
  {
    "firstName": "Clinic",
    "lastName": "Admin",
    "userType": "clinic"
  }
  ```

#### 方法 2: 通過應用程序註冊

1. 啟動應用：`npm run dev`
2. 前往註冊頁面
3. 註冊新用戶（會自動創建 profile）

### **步驟 5: 測試數據存儲**

1. 登入應用
2. 添加寵物 → 檢查 Supabase Dashboard → Table Editor → `pets` 表
3. 預約診所 → 檢查 `appointments` 表
4. 確認數據已保存

## 🔒 Row Level Security (RLS) 說明

RLS 確保：
- ✅ 用戶只能查看自己的寵物
- ✅ 診所只能管理自己的預約
- ✅ 醫療記錄只能由相關用戶訪問
- ✅ 數據自動隔離

## 📊 數據表結構

### **profiles**
- 擴展 Supabase auth.users
- 存儲用戶額外信息（姓名、類型、電話等）

### **pets**
- 寵物信息
- 關聯到 owner_id

### **clinics**
- 診所信息
- 關聯到 user_id

### **appointments**
- 預約記錄
- 關聯 pet、clinic、owner

### **medical_records**
- 醫療記錄
- 關聯 pet、clinic

### **vaccinations**
- 疫苗接種記錄
- 關聯 pet、clinic

## 🛠️ 故障排除

### **問題 1: "relation does not exist"**
- **解決**: 確保已執行 `001_initial_schema.sql`

### **問題 2: "permission denied"**
- **解決**: 確保已執行 `002_rls_policies.sql`

### **問題 3: "profile not found"**
- **解決**: 確保已執行 `004_triggers.sql`，或手動創建 profile

### **問題 4: 數據不顯示**
- **檢查**: Supabase Dashboard → Table Editor
- **檢查**: 瀏覽器控制台是否有錯誤
- **檢查**: RLS 策略是否正確

## 📝 驗證步驟

執行以下 SQL 查詢驗證設置：

```sql
-- 檢查表是否存在
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- 檢查 RLS 是否啟用
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';

-- 檢查觸發器
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

## ✅ 完成後

- ✅ 數據會自動保存到 Supabase
- ✅ 數據會持久化（不會因為重啟而丟失）
- ✅ 數據受到 RLS 保護
- ✅ 可以通過 Supabase Dashboard 查看數據

## 🎯 下一步

1. 在 Supabase Dashboard 中查看數據
2. 使用 Supabase 的實時功能（可選）
3. 設置數據備份（可選）
4. 配置 Supabase 存儲（用於圖片上傳）

## 📚 相關文檔

- [Supabase 文檔](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase 客戶端](https://supabase.com/docs/reference/javascript/introduction)
