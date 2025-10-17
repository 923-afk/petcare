import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || "fallback-secret";

// Mock pets data
const MOCK_PETS = [
  {
    id: "pet-1",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: 3,
    ownerId: "owner-demo-id",
    medicalHistory: [],
    vaccinations: []
  },
  {
    id: "pet-2", 
    name: "Whiskers",
    species: "Cat",
    breed: "Persian",
    age: 2,
    ownerId: "owner-demo-id",
    medicalHistory: [],
    vaccinations: []
  }
];

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
    
    if (req.method === 'GET') {
      // Return pets for owner demo user
      if (decoded.userId === "owner-demo-id") {
        res.json(MOCK_PETS);
      } else {
        res.json([]);
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Pets API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
