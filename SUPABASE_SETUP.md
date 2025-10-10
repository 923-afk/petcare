# 🔐 Supabase + AES Encryption Setup Guide

## Overview

This implementation provides **secure, encrypted medical records** using:
- **Supabase** as the database (EU region for GDPR compliance)
- **AES-256 encryption** via crypto-js
- **Express.js API routes** for CRUD operations
- **TypeScript** for type safety

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [Supabase](https://app.supabase.com)
2. Click **"New Project"**
3. **Important:** Select **EU region** for GDPR compliance
4. Choose a database password and save it securely

### 2. Create the Pets Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create pets table with encrypted medical history
CREATE TABLE pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  species text NOT NULL,
  medical_history text, -- This will store ENCRYPTED data
  created_at timestamp with time zone DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX idx_pets_owner_id ON pets(owner_id);

-- Enable Row Level Security (RLS)
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own pets
CREATE POLICY "Users can view their own pets"
  ON pets FOR SELECT
  USING (auth.uid() = owner_id);

-- Policy: Users can insert their own pets
CREATE POLICY "Users can insert their own pets"
  ON pets FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can update their own pets
CREATE POLICY "Users can update their own pets"
  ON pets FOR UPDATE
  USING (auth.uid() = owner_id);

-- Policy: Users can delete their own pets
CREATE POLICY "Users can delete their own pets"
  ON pets FOR DELETE
  USING (auth.uid() = owner_id);
```

### 3. Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 4. Generate Encryption Key

Run this command to generate a secure encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Configure Environment Variables

Copy `ENV_TEMPLATE.txt` to `.env` and fill in:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Encryption
ENCRYPTION_KEY=a1b2c3d4e5f6... # Your generated 64-char hex key

# Other existing vars...
GEMINI_API_KEY=...
SESSION_SECRET=...
```

### 6. Install Dependencies

```bash
npm install @supabase/supabase-js crypto-js
npm install --save-dev @types/crypto-js
```

### 7. Start the Server

```bash
npm run dev
```

## 📡 API Endpoints

All routes are prefixed with `/api/supabase/pets`

### Create Pet (with encrypted medical history)
```http
POST /api/supabase/pets
Content-Type: application/json

{
  "owner_id": "uuid-here",
  "name": "Buddy",
  "species": "Dog",
  "medical_history": "Allergic to chicken. Previous surgery on left paw."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pet created successfully with encrypted medical records",
  "data": {
    "id": "uuid",
    "owner_id": "uuid",
    "name": "Buddy",
    "species": "Dog",
    "medical_history": "U2FsdGVkX1...", // Encrypted
    "created_at": "2025-10-08T..."
  }
}
```

### Get Owner's Pets (with decrypted medical history)
```http
GET /api/supabase/pets/owner/:ownerId
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "owner_id": "uuid",
      "name": "Buddy",
      "species": "Dog",
      "medical_history": "Allergic to chicken. Previous surgery on left paw.", // Decrypted!
      "created_at": "2025-10-08T..."
    }
  ],
  "count": 1,
  "message": "Found 1 pet(s) with decrypted medical records"
}
```

### Get Single Pet
```http
GET /api/supabase/pets/:id
```

### Update Pet
```http
PUT /api/supabase/pets/:id
Content-Type: application/json

{
  "name": "Buddy Jr.",
  "medical_history": "Updated medical history..."
}
```

### Delete Pet
```http
DELETE /api/supabase/pets/:id
```

### Test Encryption
```http
GET /api/supabase/pets/test/encryption
```

**Response:**
```json
{
  "success": true,
  "test": {
    "original": "Patient has chronic allergies...",
    "encrypted": "U2FsdGVkX1+abc123...",
    "decrypted": "Patient has chronic allergies...",
    "match": true
  },
  "message": "Encryption test completed"
}
```

## 🔒 Security Features

### 1. **AES-256 Encryption**
- All medical history is encrypted before storage
- Automatic encryption on insert/update
- Automatic decryption on retrieval
- Uses industry-standard crypto-js library

### 2. **Row Level Security (RLS)**
- Users can only access their own pets
- Enforced at database level
- Cannot be bypassed via API

### 3. **Environment Variables**
- Encryption keys stored securely in `.env`
- Never committed to version control
- Different keys for dev/staging/production

### 4. **Type Safety**
- Full TypeScript support
- Validated inputs with Zod
- Type-safe database operations

## 📁 File Structure

```
server/
├── lib/
│   ├── supabase.ts          # Supabase client config
│   └── encryption.ts         # AES encryption utilities
├── services/
│   └── supabase-pets.service.ts  # CRUD operations
└── routes/
    └── supabase-pets.routes.ts   # Express API routes
```

## 🧪 Testing with cURL

### Create a pet:
```bash
curl -X POST http://localhost:5000/api/supabase/pets \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": "your-user-id",
    "name": "Max",
    "species": "Cat",
    "medical_history": "Sensitive stomach. Requires grain-free diet."
  }'
```

### Get pets:
```bash
curl http://localhost:5000/api/supabase/pets/owner/your-user-id
```

### Test encryption:
```bash
curl http://localhost:5000/api/supabase/pets/test/encryption
```

## 🔄 Integration with Existing App

This Supabase implementation **works alongside** the existing Drizzle/PostgreSQL setup:

- **Existing routes:** `/api/pets` (Drizzle ORM, unencrypted)
- **New routes:** `/api/supabase/pets` (Supabase, encrypted)

You can:
1. Use both systems simultaneously
2. Migrate gradually from Drizzle to Supabase
3. Use Supabase only for sensitive data

## 🆚 Supabase vs Current Setup

| Feature | Current (Drizzle) | Supabase |
|---------|-------------------|----------|
| **Database** | PostgreSQL/Neon | Supabase (PostgreSQL) |
| **ORM** | Drizzle | Supabase Client |
| **Auth** | JWT (custom) | Supabase Auth (built-in) |
| **Encryption** | ❌ None | ✅ AES-256 |
| **Row Security** | App-level | Database-level (RLS) |
| **Real-time** | ❌ | ✅ Built-in |
| **Files/Storage** | ❌ | ✅ Built-in |

## 🚨 Important Notes

### Production Checklist
- [ ] Use strong encryption key (64 hex chars)
- [ ] Enable Supabase RLS policies
- [ ] Use EU region for GDPR compliance
- [ ] Rotate encryption keys periodically
- [ ] Never log decrypted medical data
- [ ] Use HTTPS in production
- [ ] Set up Supabase backups
- [ ] Monitor encryption/decryption errors

### Key Rotation
If you need to rotate encryption keys:

1. Generate new key
2. Decrypt all records with old key
3. Re-encrypt with new key
4. Update `.env` with new key
5. Deploy atomically

### GDPR Compliance
- ✅ Data stored in EU region
- ✅ End-to-end encryption
- ✅ User data isolation (RLS)
- ✅ Right to deletion (DELETE endpoint)
- ✅ Data export capability (GET endpoints)

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [crypto-js Documentation](https://cryptojs.gitbook.io/docs/)
- [AES Encryption Explained](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🐛 Troubleshooting

### "Supabase client not initialized"
- Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`
- Restart the server after adding env vars

### "Failed to decrypt medical data"
- Encryption key changed or missing
- Data corrupted in database
- Check `ENCRYPTION_KEY` in `.env`

### "Permission denied"
- RLS policies not configured correctly
- User ID doesn't match owner_id
- Check Supabase dashboard → Authentication

### Encryption test fails
- Missing `crypto-js` package
- Invalid encryption key format
- Run: `npm install crypto-js @types/crypto-js`

---

**Need help?** Check the example routes in `server/routes/supabase-pets.routes.ts` for implementation details.

