# 🚀 Supabase Quick Start (5 Minutes)

Get your secure, encrypted pet medical platform running in 5 minutes!

## Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com](https://app.supabase.com)
2. Click **"New Project"** → Select **EU region** 🇪🇺
3. Save your database password

## Step 2: Create Database Table (1 min)

In Supabase SQL Editor, paste and run:

```sql
CREATE TABLE pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  species text NOT NULL,
  medical_history text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_pets_owner_id ON pets(owner_id);
```

## Step 3: Get Your Credentials (1 min)

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon public key**

## Step 4: Configure Environment (1 min)

Create `.env` file:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Generate encryption key (run this command):
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your-64-char-hex-key-here

# Other vars
SESSION_SECRET=your-secret
GEMINI_API_KEY=optional
```

## Step 5: Install & Run

```bash
# Install new dependencies
npm install @supabase/supabase-js crypto-js

# Start server
npm run dev
```

## ✅ Test It!

### Test Encryption (Quick Check)
```bash
curl http://localhost:5000/api/supabase/pets/test/encryption
```

**Expected Response:**
```json
{
  "success": true,
  "test": {
    "original": "Patient has chronic allergies...",
    "encrypted": "U2FsdGVkX1+abc...",
    "decrypted": "Patient has chronic allergies...",
    "match": true
  }
}
```

### Create Pet with Encrypted Medical History
```bash
curl -X POST http://localhost:5000/api/supabase/pets \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Buddy",
    "species": "Dog",
    "medical_history": "Allergic to chicken. Previous surgery on left paw."
  }'
```

### Get Pets (Medical History Auto-Decrypted!)
```bash
curl http://localhost:5000/api/supabase/pets/owner/123e4567-e89b-12d3-a456-426614174000
```

## 🎯 What You Just Built

✅ **Secure Database** - Supabase (EU region, GDPR compliant)  
✅ **AES-256 Encryption** - Medical records encrypted at rest  
✅ **Auto Decrypt** - Seamless decryption on retrieval  
✅ **REST API** - Full CRUD operations  
✅ **Type Safe** - TypeScript with validation  

## 📚 Next Steps

- Read full docs: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Test with REST Client: [test-supabase.http](./test-supabase.http)
- Add Row Level Security (see setup guide)
- Integrate with frontend

## 🔧 Quick Commands

```bash
# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test encryption
curl http://localhost:5000/api/supabase/pets/test/encryption

# View server logs
npm run dev

# Check if Supabase is configured
echo $SUPABASE_URL
```

## 🆘 Troubleshooting

**"Supabase client not initialized"**
→ Check `.env` has `SUPABASE_URL` and `SUPABASE_ANON_KEY`

**"Failed to decrypt"**
→ `ENCRYPTION_KEY` is missing or wrong format (needs 64 hex chars)

**"Permission denied"**
→ Add Row Level Security policies (see full setup guide)

---

**🎉 Done!** Your secure pet medical platform with encrypted records is ready!

