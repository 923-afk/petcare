# 🐾 Vetcepi - Modern Pet Care Management System

**A comprehensive full-stack application for veterinary clinics and pet owners**

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Features

### **For Pet Owners**
- 📅 **Book Appointments** - Easy online booking with clinic selection
- 🐾 **Pet Management** - Complete pet profiles with medical history
- 📊 **Dashboard** - Track appointments, vaccinations, and health records
- 🏥 **Find Clinics** - Browse and discover veterinary clinics
- 💉 **Vaccination Tracking** - Automatic reminders for vaccines

### **For Veterinary Clinics**
- 📋 **Appointment Management** - Full scheduling system with status tracking
- 👥 **Patient Database** - Complete pet and owner records
- 💊 **Inventory Management** - Track medicines, vaccines, and supplies
- 💉 **Vaccination Schedule** - Manage and monitor pet vaccinations
- 📊 **Analytics Dashboard** - Revenue, appointments, and performance metrics
- 🔍 **Search & Filter** - Quick access to patient information

---

## 🚀 Quick Start

### **1. Clone the Repository**
```bash
git clone https://github.com/YOUR_USERNAME/vetcepi.git
cd vetcepi
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment (Optional)**
```bash
cp ENV_TEMPLATE.txt .env
# Edit .env and add your API keys (optional for demo)
```

### **4. Start Development Server**
```bash
PORT=3000 npm run dev
```

### **5. Open in Browser**
```
http://localhost:3000
```

---

## 🧪 Demo Accounts

### **Pet Owner Account**
```
Email: owner.demo@example.com
Password: demo1234
```

### **Clinic Account**
```
Email: clinic.demo@example.com
Password: demo1234
```

---

## 📚 Tech Stack

### **Frontend**
- ⚛️ **React 18.3** - UI framework
- 📘 **TypeScript 5.6** - Type safety
- ⚡ **Vite 5.4** - Build tool
- 🎨 **Tailwind CSS** - Styling
- 🧩 **shadcn/ui** - Component library
- 🔄 **React Query** - Data fetching
- 🧭 **Wouter** - Routing

### **Backend**
- 🟢 **Node.js** - Runtime
- 🚂 **Express 4.21** - Web framework
- 📘 **TypeScript** - Type safety
- 🔐 **JWT** - Authentication
- 💾 **Demo Storage** - In-memory for testing

### **Optional (Production)**
- 🗄️ **Supabase** - Database (PostgreSQL)
- 🔐 **Drizzle ORM** - Database toolkit
- 🔒 **AES-256-GCM** - Data encryption
- 🤖 **Google Gemini** - AI chatbot

---

## 📖 Documentation

Comprehensive guides included:

- 📋 **README.md** - Main project documentation
- 🚀 **PRODUCTION_DEPLOYMENT_GUIDE.md** - Deploy to production
- ✅ **QUICK_DEPLOY_CHECKLIST.md** - Deployment checklist
- 🧪 **MANUAL_TEST_GUIDE.md** - Testing procedures
- 👥 **CUSTOMER_ONBOARDING_TEMPLATES.md** - Onboarding docs
- 🤖 **AI_SETUP_GUIDE.md** - AI chatbot configuration
- 🔧 **CLINIC_DEMO_TEST_GUIDE.md** - Clinic feature testing

---

## 🏗️ Project Structure

```
vetcepi/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── owner/        # Pet owner pages
│   │   │   ├── clinic/       # Clinic pages
│   │   │   └── auth/         # Login/Register
│   │   ├── components/       # Reusable components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utilities
│   └── index.html
│
├── server/                    # Backend Express application
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API routes
│   ├── storage.ts            # Demo data storage
│   ├── lib/                  # Server utilities
│   └── services/             # Business logic
│
├── shared/                    # Shared TypeScript types
│   └── schema.ts             # Common interfaces
│
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
├── tailwind.config.ts        # Tailwind config
└── ENV_TEMPLATE.txt          # Environment variables template
```

---

## 🎯 Available Routes

### **Public Routes**
- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/clinics` - Browse veterinary clinics

### **Pet Owner Routes** (Requires login)
- `/dashboard` - Owner dashboard
- `/booking` - Book appointments
- `/pets` - Manage pets
- `/pets/:id` - Pet profile

### **Clinic Routes** (Requires login)
- `/dashboard` - Clinic dashboard
- `/appointments` - Manage appointments
- `/patients` - Patient database
- `/inventory` - Inventory management
- `/vaccinations` - Vaccination schedule

---

## 🔧 Development

### **Install Dependencies**
```bash
npm install
```

### **Run Development Server**
```bash
PORT=3000 npm run dev
```

### **Build for Production**
```bash
npm run build
```

### **Start Production Server**
```bash
npm start
```

---

## 🌐 Environment Variables

Optional environment variables (see `ENV_TEMPLATE.txt`):

```env
# Server
PORT=3000
SESSION_SECRET=your-session-secret

# Supabase (Optional - for production database)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
ENCRYPTION_KEY=your-encryption-key

# AI Chatbot (Optional)
GEMINI_API_KEY=your-gemini-api-key
```

**Note:** The app works without these - demo mode uses in-memory storage!

---

## 📱 Screenshots

### **Landing Page**
Beautiful hero section with call-to-action buttons and feature showcase

### **Owner Dashboard**
- Pet cards with photos and details
- Upcoming appointments
- Vaccination reminders
- Quick statistics

### **Clinic Dashboard**
- Today's appointments
- Analytics (revenue, patients, urgent cases)
- Quick action buttons
- Weekly performance metrics

### **Additional Pages**
- Inventory management with low stock alerts
- Vaccination schedule with overdue tracking
- Patient database with search
- Appointment booking system

---

## 🧪 Testing

### **Run Development Server**
```bash
PORT=3000 npm run dev
```

### **Test Accounts**
```
Owner: owner.demo@example.com / demo1234
Clinic: clinic.demo@example.com / demo1234
```

### **Test Features**
1. Login as owner - manage pets and appointments
2. Login as clinic - view dashboard and manage patients
3. Test inventory management
4. Test vaccination scheduling
5. Test appointment booking

---

## 🚀 Deployment

### **Recommended Platforms**

**Frontend + Backend:**
- **Railway** - Easy full-stack deployment
- **Render** - Free tier available
- **Vercel** - Frontend (with serverless backend)
- **DigitalOcean** - Production apps

**Steps:**
1. Create account on chosen platform
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy!

See `PRODUCTION_DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **PetPalette** - Design inspiration for dashboards
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool
- **React Query** - Powerful data synchronization

---

## 📞 Support

For questions, issues, or feature requests:
- 📧 Email: support@vetcepi.com
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/vetcepi/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/YOUR_USERNAME/vetcepi/discussions)

---

## 🎯 Roadmap

### **✅ Implemented**
- Pet owner and clinic dashboards
- Appointment management
- Patient database
- Inventory tracking
- Vaccination scheduling
- Demo data and testing

### **🚧 Planned**
- Email/SMS notifications
- Payment integration
- Advanced analytics
- Mobile app
- Telemedicine features
- Multi-clinic support

---

## 💖 Made with Love

Built with ❤️ for pets and their families.

**Star this repository if you find it useful!** ⭐

---

**Happy coding! 🐾**
