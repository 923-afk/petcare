import express from 'express';
import { registerRoutes } from '../server/routes';
import { registerSupabasePetsRoutes } from '../server/routes/supabase-pets.routes';
import { storage } from '../server/storage';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for Vercel
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize demo data for Vercel serverless functions
// This ensures demo data is available on each cold start
console.log('🚀 Initializing Vercel serverless function...');
console.log('✅ Demo data status:', {
  users: storage.users.size,
  pets: storage.pets.size,
  clinics: storage.clinics.size,
  appointments: storage.appointments.size
});

// Register routes - for Vercel, we need to handle this differently
let routesRegistered = false;

async function initializeRoutes() {
  if (!routesRegistered) {
    // registerRoutes returns a Server, but we don't need it for Vercel
    const server = await registerRoutes(app);
    registerSupabasePetsRoutes(app);
    routesRegistered = true;
    console.log('✅ Routes registered successfully');
  }
}

// Initialize routes immediately
initializeRoutes().catch(err => {
  console.error('❌ Failed to initialize routes:', err);
});

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('❌ API Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  // Ensure routes are registered before handling request
  await initializeRoutes();
  // Handle the request
  return app(req, res);
}
