export default function handler(req, res) {
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

    // Demo accounts
    const demoUsers = {
      'owner.demo@example.com': {
        id: 'owner-demo-id',
        email: 'owner.demo@example.com',
        name: 'Demo Owner',
        userType: 'owner',
        password: 'demo1234'
      },
      'clinic.demo@example.com': {
        id: 'clinic-demo-id',
        email: 'clinic.demo@example.com',
        name: 'Demo Clinic',
        userType: 'clinic',
        password: 'demo1234'
      }
    };

    const user = demoUsers[email];
    
    if (user && user.password === password) {
      // Generate a simple token
      const token = `demo-token-${user.userType}-${Date.now()}`;
      
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType
        }
      });
    }

    return res.status(400).json({ message: 'Invalid credentials' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
