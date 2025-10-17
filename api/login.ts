import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
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

    // Simple demo login check
    if (email === 'owner.demo@example.com' && password === 'demo1234') {
      return res.json({
        token: 'demo-token-owner',
        user: {
          id: 'owner-demo-id',
          email: 'owner.demo@example.com',
          name: 'Demo Owner',
          userType: 'owner'
        }
      });
    }

    if (email === 'clinic.demo@example.com' && password === 'demo1234') {
      return res.json({
        token: 'demo-token-clinic',
        user: {
          id: 'clinic-demo-id',
          email: 'clinic.demo@example.com',
          name: 'Demo Clinic',
          userType: 'clinic'
        }
      });
    }

    return res.status(400).json({ message: 'Invalid credentials' });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
