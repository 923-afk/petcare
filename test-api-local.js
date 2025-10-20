// 本地測試 API 函數
import loginHandler from './api/auth/login.js';

// 模擬 Vercel 請求
const mockReq = {
  method: 'POST',
  body: {
    email: 'owner.demo@example.com',
    password: 'demo1234'
  },
  headers: {}
};

const mockRes = {
  status: (code) => ({
    json: (data) => console.log('Status:', code, 'Response:', data),
    end: () => console.log('Status:', code, 'Response: OK')
  }),
  json: (data) => console.log('Response:', data),
  setHeader: (key, value) => console.log('Header:', key, '=', value)
};

console.log('🧪 測試本地登入函數...');
loginHandler(mockReq, mockRes);
