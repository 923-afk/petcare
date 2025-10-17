// Test script for Vercel deployment
// Replace with your actual Vercel URL
const VERCEL_URL = 'https://your-app-name.vercel.app';

async function testAPI() {
  console.log('🧪 Testing Vercel API...\n');

  // Test 1: Login API
  console.log('1. Testing Login API...');
  try {
    const loginResponse = await fetch(`${VERCEL_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'owner.demo@example.com',
        password: 'demo1234'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('Token:', loginData.token ? 'Present' : 'Missing');
      console.log('User:', loginData.user?.email);
      
      // Test 2: Get User Info
      console.log('\n2. Testing Get User API...');
      const userResponse = await fetch(`${VERCEL_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('✅ Get user successful!');
        console.log('User type:', userData.userType);
      } else {
        console.log('❌ Get user failed:', userResponse.status);
      }

      // Test 3: Get Pets
      console.log('\n3. Testing Get Pets API...');
      const petsResponse = await fetch(`${VERCEL_URL}/api/pets`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });

      if (petsResponse.ok) {
        const petsData = await petsResponse.json();
        console.log('✅ Get pets successful!');
        console.log('Pets count:', petsData.length);
      } else {
        console.log('❌ Get pets failed:', petsResponse.status);
      }

    } else {
      console.log('❌ Login failed:', loginResponse.status);
      const errorText = await loginResponse.text();
      console.log('Error:', errorText);
    }

  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Test 4: Test Clinic Login
  console.log('\n4. Testing Clinic Login...');
  try {
    const clinicResponse = await fetch(`${VERCEL_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'clinic.demo@example.com',
        password: 'demo1234'
      })
    });

    if (clinicResponse.ok) {
      const clinicData = await clinicResponse.json();
      console.log('✅ Clinic login successful!');
      console.log('User type:', clinicData.user?.userType);
    } else {
      console.log('❌ Clinic login failed:', clinicResponse.status);
    }

  } catch (error) {
    console.log('❌ Clinic login error:', error.message);
  }
}

// Run the test
testAPI().catch(console.error);
