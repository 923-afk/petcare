import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || "fallback-secret";

// Demo users data
const DEMO_USERS = {
  "owner-demo-id": {
    id: "owner-demo-id",
    email: "owner.demo@example.com",
    name: "Demo Owner",
    userType: "owner"
  },
  "clinic-demo-id": {
    id: "clinic-demo-id", 
    email: "clinic.demo@example.com",
    name: "Demo Clinic",
    userType: "clinic"
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = DEMO_USERS[decoded.userId as keyof typeof DEMO_USERS];
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
