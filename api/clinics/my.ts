import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
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

  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    
    if (!user || user.userType !== 'clinic') {
      return res.status(404).json({ message: "Clinic not found" });
    }

    if (req.method === 'GET') {
      const clinic = await storage.getClinic(decoded.userId);
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      res.json(clinic);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('My clinic API error:', error);
    res.status(500).json({ message: error.message || 'Failed to get clinic' });
  }
}
