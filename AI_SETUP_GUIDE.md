# AI Chatbot Setup Guide - 100% FREE! 🎉

The PetCare Pro application now includes a FREE AI chatbot powered by Google Gemini!

## 🌟 Features

- **100% Free** - No credit card required
- **Generous limits** - 60 requests/minute, 1,500 requests/day
- **Smart fallback** - If you don't set up an API key, it uses built-in rule-based responses
- **Context-aware** - Different responses for pet owners vs clinic staff

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your Free API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key

### Step 2: Configure Your App

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   GEMINI_API_KEY=your-actual-api-key-here
   SESSION_SECRET=any-random-string-here
   ```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the App

```bash
npm run dev
```

That's it! 🎉

## 💬 Where to Find the Chatbot

Once you're logged in, look for the **floating chat button** in the bottom-right corner of the screen:
- Purple circular button with a message icon
- Sparkle icon to indicate AI features
- Available on all authenticated pages

## 🆓 No API Key? No Problem!

If you don't configure the `GEMINI_API_KEY`, the chatbot will still work using intelligent rule-based responses. It can help with:

### For Pet Owners:
- ✅ How to book appointments
- ✅ Adding new pets
- ✅ Vaccination information
- ✅ Emergency guidance
- ✅ Viewing medical records

### For Clinic Staff:
- ✅ Managing appointments
- ✅ Accessing patient records
- ✅ Adding medical notes
- ✅ Dashboard overview
- ✅ Workflow tips

## 📊 Comparison: With vs Without API Key

| Feature | With Gemini API | Without API Key |
|---------|----------------|-----------------|
| **Cost** | FREE (generous limits) | FREE |
| **Setup** | 5 minutes | None needed |
| **Response Quality** | Advanced AI, natural language | Rule-based, still helpful |
| **Understanding** | Can understand complex questions | Best with specific keywords |
| **Personalization** | Highly adaptive | Fixed responses |

## 🔧 Troubleshooting

### "Failed to process chat request"
- Check that your `GEMINI_API_KEY` is correct in `.env`
- Verify you haven't exceeded the free tier limits (1,500/day)
- Restart the server after changing `.env`

### Chat button not visible
- Make sure you're logged in (chatbot only shows for authenticated users)
- Try refreshing the page

### API key not working
1. Double-check the key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Make sure there are no extra spaces in `.env`
3. Restart the development server

## 🆚 Why Gemini Instead of OpenAI?

| Feature | Google Gemini | OpenAI GPT |
|---------|--------------|------------|
| **Free Tier** | ✅ 1,500 requests/day | ❌ None |
| **Credit Card** | ✅ Not required | ❌ Required |
| **Setup** | ✅ Simple | ⚠️ More complex |
| **Quality** | ✅ Excellent | ✅ Excellent |
| **Cost (paid tier)** | Lower | Higher |

## 📝 Example Conversations

### Pet Owner Examples:
```
You: "How do I book an appointment for my dog?"
AI: Provides step-by-step booking instructions

You: "What vaccinations does my cat need?"
AI: Explains vaccination schedules and recommendations

You: "My pet is having trouble breathing!"
AI: Provides emergency guidance and clinic contacts
```

### Clinic Staff Examples:
```
You: "How do I view today's appointments?"
AI: Guides through appointment management

You: "How can I add medical notes for a patient?"
AI: Explains the medical record system

You: "What's the best way to organize my schedule?"
AI: Provides workflow optimization tips
```

## 🎯 Next Steps

1. **Get your free API key** (recommended for best experience)
2. **Test the chatbot** with different questions
3. **Enjoy unlimited AI assistance** for pet care management!

---

**Need help?** The chatbot works immediately with built-in responses, but adding the free Gemini API key unlocks its full potential! 🚀

