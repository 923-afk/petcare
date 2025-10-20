// 單一入口點 API 函數
export default function handler(req, res) {
  // 啟用 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  // 路由處理
  if (pathname === '/api/test') {
    return res.json({
      message: 'API is working!',
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  }
  
  if (pathname === '/api/auth/login') {
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
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  if (pathname === '/api/users/me') {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Access token required' });
      }
      
      // Demo users data
      const demoUsers = {
        'owner-demo-id': {
          id: 'owner-demo-id',
          email: 'owner.demo@example.com',
          name: 'Demo Owner',
          userType: 'owner'
        },
        'clinic-demo-id': {
          id: 'clinic-demo-id',
          email: 'clinic.demo@example.com',
          name: 'Demo Clinic',
          userType: 'clinic'
        }
      };
      
      // Simple token validation
      if (token.startsWith('demo-token-owner-')) {
        return res.json(demoUsers['owner-demo-id']);
      } else if (token.startsWith('demo-token-clinic-')) {
        return res.json(demoUsers['clinic-demo-id']);
      } else {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // 404 for unknown routes
  res.status(404).json({ message: 'Not found' });
}
