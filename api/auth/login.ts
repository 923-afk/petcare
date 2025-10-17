import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { loginSchema } from '../../shared/schema';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || "fallback-secret";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = loginSchema.parse(req.body);

    // Check demo accounts
    if (data.email === "owner.demo@example.com" && data.password === "demo1234") {
      const user = await storage.getUserByEmail(data.email);
      if (user) {
        const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET);
        return res.json({ token, user: { ...user, password: undefined } });
      }
    }

    if (data.email === "clinic.demo@example.com" && data.password === "demo1234") {
      const user = await storage.getUserByEmail(data.email);
      if (user) {
        const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET);
        return res.json({ token, user: { ...user, password: undefined } });
      }
    }

    // Find user
    const user = await storage.getUserByEmail(data.email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // For demo purposes, accept any password for existing users
    const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET);
    res.json({ token, user: { ...user, password: undefined } });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message || 'Login failed' });
  }
}
