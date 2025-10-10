import express from 'express';
import { registerRoutes } from '../server/routes';
import { registerSupabasePetsRoutes } from '../server/routes/supabase-pets.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Register routes
(async () => {
  await registerRoutes(app);
  registerSupabasePetsRoutes(app);
})();

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

export default app;
