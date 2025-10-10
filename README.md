# PetCare Pro 🐾

A modern veterinary management platform with **FREE AI chatbot assistance**!

## 🎉 NEW Features!

### 1. FREE AI Chatbot 🤖
This app includes a **100% FREE AI chatbot** powered by Google Gemini! 

- ✅ **No credit card required**
- ✅ **1,500 free requests per day**
- ✅ **Works offline with built-in responses** if you don't set up an API key

👉 **See [AI_SETUP_GUIDE.md](./AI_SETUP_GUIDE.md) for detailed setup instructions.**

### 2. Supabase + AES-256 Encryption 🔐
**NEW:** Secure medical records with end-to-end encryption!

- ✅ **AES-256 encryption** for sensitive medical data
- ✅ **Supabase (EU region)** for GDPR compliance
- ✅ **Row Level Security** built-in
- ✅ **Auto encrypt/decrypt** on save/retrieve

👉 **See [SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md) to get started in 5 minutes!**

### Quick Start for AI Chatbot:

1. Get a free API key: [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create `.env` file (copy from `ENV_TEMPLATE.txt`)
3. Add your key: `GEMINI_API_KEY=your-key-here`
4. Run `npm install` and `npm run dev`

**The chatbot appears as a floating button in the bottom-right corner when logged in!**

## Features

- 🏥 **For Clinics**: Manage appointments, patient records, medical notes
- 🐕 **For Pet Owners**: Book appointments, track vaccinations, view medical history
- 💬 **AI Assistant**: Get instant help with the platform (FREE!)
- 🔐 **Encrypted Records**: AES-256 encryption for medical data (Supabase)
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🇪🇺 **GDPR Compliant**: EU region hosting with Row Level Security

## Getting Started

### Prerequisites

- Node.js 18+ installed
- **At least 500MB free disk space** (currently needed for dependencies)

### Installation

1. **Clone the repository** (or you already have it)

2. **Free up disk space** (if needed):
   ```bash
   # Check available space
   df -h
   
   # Clear npm cache if needed
   npm cache clean --force
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   ```bash
   # Copy the template
   cp ENV_TEMPLATE.txt .env
   
   # Edit .env and add your keys
   # GEMINI_API_KEY=your-free-api-key (optional but recommended)
   # SESSION_SECRET=any-random-string
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**: The app will be running (usually at `http://localhost:5000` or similar)

## Demo Accounts

### Pet Owner
- Email: `owner.demo@example.com`
- Password: `demo1234`

### Clinic Staff
- Email: `clinic.demo@example.com`
- Password: `demo1234`

## AI Chatbot Location

Once logged in, look for the **purple floating button** with a chat icon in the **bottom-right corner** of the screen. It's available on all authenticated pages!

### What the Chatbot Can Help With:

**For Pet Owners:**
- How to book appointments
- Adding and managing pets
- Understanding vaccination schedules
- Viewing medical records
- Emergency guidance

**For Clinic Staff:**
- Managing appointments
- Accessing patient records
- Adding medical notes
- Dashboard navigation
- Workflow optimization

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: Drizzle ORM + Supabase (with encryption)
- **Encryption**: AES-256 (crypto-js)
- **AI**: Google Gemini API (FREE tier)
- **Authentication**: JWT

## Troubleshooting

### "No space left on device"
- Free up disk space on your Mac
- Try: `npm cache clean --force`
- Remove unused files in Downloads folder

### Chatbot not responding
- Check if `GEMINI_API_KEY` is set in `.env`
- If no API key: chatbot uses built-in responses (still works!)
- Restart server after changing `.env`

### Can't see chatbot button
- Make sure you're logged in
- Refresh the page
- Check browser console for errors

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

## License

MIT

---

**Questions?** Try asking the AI chatbot - it's designed to help you use this platform! 🤖
