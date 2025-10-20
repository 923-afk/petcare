# 🚀 Supabase 登入功能設定指南

## 📋 設定步驟

### **步驟 1: 創建 Supabase 專案**

1. 前往 [supabase.com](https://supabase.com)
2. 點擊 "Start your project"
3. 使用 GitHub 登入
4. 創建新專案
5. 記下您的專案 URL 和 API Key

### **步驟 2: 設定環境變數**

在 `client/.env.local` 檔案中添加：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### **步驟 3: 在 Supabase 中創建用戶**

1. 前往 Supabase 儀表板
2. 點擊 "Authentication" → "Users"
3. 點擊 "Add user"
4. 創建以下測試用戶：

**寵物主人帳號：**
- Email: `owner.demo@example.com`
- Password: `demo1234`
- User Metadata: `{"userType": "owner", "name": "Demo Owner"}`

**獸醫診所帳號：**
- Email: `clinic.demo@example.com`
- Password: `demo1234`
- User Metadata: `{"userType": "clinic", "name": "Demo Clinic"}`

### **步驟 4: 測試登入功能**

1. 啟動應用程式：`npm run dev`
2. 前往登入頁面
3. 使用 demo 帳號登入

## 🎯 功能特色

- ✅ **安全的認證系統**
- ✅ **JWT Token 管理**
- ✅ **會話持久化**
- ✅ **自動刷新 Token**
- ✅ **多種登入方式支援**

## 🔧 故障排除

如果遇到問題，請檢查：
1. 環境變數是否正確設定
2. Supabase 專案是否已創建
3. 用戶是否已在 Supabase 中創建
4. 網路連接是否正常