// Simple test for Vercel login API
const VERCEL_URL = 'https://your-app-name.vercel.app'; // Replace with your actual URL

async function testLogin() {
  console.log('🧪 Testing Vercel Login API...\n');

  try {
    // Test login
    const response = await fetch(`${VERCEL_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'owner.demo@example.com',
        password: 'demo1234'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log('Token:', data.token ? 'Present' : 'Missing');
      console.log('User:', data.user);
      
      // Test get user
      console.log('\n🧪 Testing Get User API...');
      const userResponse = await fetch(`${VERCEL_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('✅ Get user successful!');
        console.log('User data:', userData);
      } else {
        console.log('❌ Get user failed:', userResponse.status);
        const errorText = await userResponse.text();
        console.log('Error:', errorText);
      }
      
    } else {
      console.log('❌ Login failed:', response.status);
      const errorText = await response.text();
      console.log('Error:', errorText);
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Run the test
testLogin().catch(console.error);
