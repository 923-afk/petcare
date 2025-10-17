# 🔍 Debug Vercel Login Issues

**Step-by-step troubleshooting for Vercel sign-in problems**

---

## 🚨 Common Vercel Login Issues

### **Issue 1: 404 Errors**
- API endpoints not found
- Wrong Vercel configuration
- Functions not deployed

### **Issue 2: 500 Errors**
- Function execution failed
- Missing dependencies
- Runtime errors

### **Issue 3: CORS Errors**
- Frontend can't reach API
- Missing CORS headers
- Preflight request failed

### **Issue 4: Authentication Errors**
- Token not generated
- JWT verification failed
- User not found

---

## 🔧 Step-by-Step Debugging

### **Step 1: Check Vercel Deployment Status**

1. Go to https://vercel.com/dashboard
2. Find your project
3. Check if latest deployment is ✅ **Ready**
4. Look for any ❌ **Failed** deployments

**If deployment failed:**
- Check build logs for errors
- Look for missing dependencies
- Verify TypeScript compilation

### **Step 2: Test API Endpoints Directly**

**Test Login API:**
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner.demo@example.com","password":"demo1234"}' \
  -v
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "owner-demo-id",
    "email": "owner.demo@example.com",
    "name": "Demo Owner",
    "userType": "owner"
  }
}
```

**If you get 404:**
- API functions not deployed
- Wrong URL
- Vercel configuration issue

**If you get 500:**
- Function execution error
- Check Vercel function logs

### **Step 3: Check Vercel Function Logs**

1. Go to Vercel dashboard
2. Click on your project
3. Go to "Functions" tab
4. Click on any function
5. Check "Logs" for errors

**Look for:**
- Import errors
- Runtime errors
- Console.log messages

### **Step 4: Test in Browser Console**

Open browser dev tools and run:

```javascript
// Test login API
fetch('https://your-app.vercel.app/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'owner.demo@example.com',
    password: 'demo1234'
  })
})
.then(res => res.json())
.then(data => console.log('Login result:', data))
.catch(err => console.error('Login error:', err));
```

---

## 🛠️ Quick Fixes

### **Fix 1: Check Vercel URL**

Make sure you're using the correct URL:
- Format: `https://your-project-name.vercel.app`
- Not: `https://your-project-name-git-main.vercel.app`
- Check Vercel dashboard for exact URL

### **Fix 2: Verify Environment Variables**

1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Add if missing:
   ```
   SESSION_SECRET = your-secret-key-here
   NODE_ENV = production
   ```

### **Fix 3: Check Function Build**

1. Go to Vercel dashboard
2. Click on your project
3. Go to "Functions" tab
4. Verify these functions exist:
   - `/api/auth/login`
   - `/api/users/me`
   - `/api/pets`

### **Fix 4: Test Individual Functions**

**Test each function separately:**

1. **Login Function:**
   ```
   https://your-app.vercel.app/api/auth/login
   ```

2. **Users Function:**
   ```
   https://your-app.vercel.app/api/users/me
   ```

3. **Pets Function:**
   ```
   https://your-app.vercel.app/api/pets
   ```

---

## 🧪 Create Test Page

Let me create a test page you can use:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Vercel Login</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test { margin: 10px 0; padding: 10px; border: 1px solid #ccc; }
        .success { background: #d4edda; }
        .error { background: #f8d7da; }
        button { padding: 10px 20px; margin: 5px; }
        pre { background: #f8f9fa; padding: 10px; }
    </style>
</head>
<body>
    <h1>🧪 Test Vercel Login</h1>
    
    <div>
        <label>Vercel URL: </label>
        <input type="text" id="vercelUrl" placeholder="https://your-app.vercel.app" style="width: 300px;">
        <button onclick="testLogin()">Test Login</button>
    </div>

    <div id="results"></div>

    <script>
        async function testLogin() {
            const baseUrl = document.getElementById('vercelUrl').value;
            if (!baseUrl) {
                alert('Please enter your Vercel URL');
                return;
            }

            const resultDiv = document.getElementById('results');
            resultDiv.innerHTML = '';

            // Test 1: Login
            const loginDiv = document.createElement('div');
            loginDiv.className = 'test';
            loginDiv.innerHTML = '<h3>1. Testing Login API</h3>';
            resultDiv.appendChild(loginDiv);

            try {
                const response = await fetch(`${baseUrl}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: 'owner.demo@example.com',
                        password: 'demo1234'
                    })
                });

                const data = await response.json();
                
                if (response.ok) {
                    loginDiv.className += ' success';
                    loginDiv.innerHTML += `<p>✅ Login successful! (${response.status})</p>`;
                    loginDiv.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                    
                    // Test 2: Get User
                    const userDiv = document.createElement('div');
                    userDiv.className = 'test';
                    userDiv.innerHTML = '<h3>2. Testing Get User API</h3>';
                    resultDiv.appendChild(userDiv);

                    try {
                        const userResponse = await fetch(`${baseUrl}/api/users/me`, {
                            headers: {
                                'Authorization': `Bearer ${data.token}`
                            }
                        });
                        
                        const userData = await userResponse.json();
                        
                        if (userResponse.ok) {
                            userDiv.className += ' success';
                            userDiv.innerHTML += `<p>✅ Get user successful! (${userResponse.status})</p>`;
                            userDiv.innerHTML += `<pre>${JSON.stringify(userData, null, 2)}</pre>`;
                        } else {
                            userDiv.className += ' error';
                            userDiv.innerHTML += `<p>❌ Get user failed (${userResponse.status})</p>`;
                            userDiv.innerHTML += `<pre>${JSON.stringify(userData, null, 2)}</pre>`;
                        }
                    } catch (userError) {
                        userDiv.className += ' error';
                        userDiv.innerHTML += `<p>❌ Get user error: ${userError.message}</p>`;
                    }

                } else {
                    loginDiv.className += ' error';
                    loginDiv.innerHTML += `<p>❌ Login failed (${response.status})</p>`;
                    loginDiv.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                }
            } catch (error) {
                loginDiv.className += ' error';
                loginDiv.innerHTML += `<p>❌ Network error: ${error.message}</p>`;
            }
        }
    </script>
</body>
</html>
```

---

## 🎯 Most Likely Issues

### **Issue 1: Wrong Vercel URL**
- Using old URL
- URL has extra characters
- **Fix:** Check Vercel dashboard for exact URL

### **Issue 2: Functions Not Deployed**
- Build failed
- TypeScript errors
- **Fix:** Check Vercel build logs

### **Issue 3: CORS Issues**
- Frontend can't reach API
- **Fix:** Check browser console for CORS errors

### **Issue 4: Environment Variables**
- Missing SESSION_SECRET
- **Fix:** Add environment variables in Vercel

---

## 🚀 Quick Test Commands

**Test 1: Check if API exists**
```bash
curl -I https://your-app.vercel.app/api/auth/login
# Should return 405 (Method Not Allowed) not 404
```

**Test 2: Test login**
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner.demo@example.com","password":"demo1234"}'
```

**Test 3: Check Vercel functions**
```bash
curl https://your-app.vercel.app/api/users/me
# Should return 401 (Unauthorized) not 404
```

---

## 📞 Need Help?

**Please provide:**
1. **Your Vercel URL** (so I can test it)
2. **Error message** you see in browser
3. **Vercel deployment status** (Ready/Failed)
4. **Browser console errors** (if any)

**This will help me identify the exact issue!** 🔍
