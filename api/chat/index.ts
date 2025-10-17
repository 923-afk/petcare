import { VercelRequest, VercelResponse } from '@vercel/node';
import { getChatResponse } from '../../server/lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: 'Message is required' });
      }

      const response = await getChatResponse(message);
      res.json({ response });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Chat API error:', error);
    res.status(500).json({ message: error.message || 'Failed to get chat response' });
  }
}
