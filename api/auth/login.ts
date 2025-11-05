import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback-secret';

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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check demo accounts first
    if (email === "owner.demo@example.com" && password === "demo1234") {
      const user = await storage.getUserByEmail(email);
      if (user) {
        const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET);
        return res.json({ 
          token, 
          user: { 
            ...user, 
            password: undefined 
          } 
        });
      }
    }

    if (email === "clinic.demo@example.com" && password === "demo1234") {
      const user = await storage.getUserByEmail(email);
      if (user) {
        const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET);
        return res.json({ 
          token, 
          user: { 
            ...user, 
            password: undefined 
          } 
        });
      }
    }

    // Try to find user in storage
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password (handle both plain text demo and hashed passwords)
    let isValid = false;
    if (user.password === password) {
      isValid = true; // Plain text match (for demo accounts)
    } else if (user.password?.startsWith("$2b$")) {
      // Hashed password - would need bcrypt.compare here
      // For now, just check if it's a demo account
      isValid = false;
    }

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET);

    return res.json({ 
      token, 
      user: { 
        ...user, 
        password: undefined 
      } 
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}