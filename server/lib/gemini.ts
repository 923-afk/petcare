import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with free tier
// Get your free API key from: https://makersuite.google.com/app/apikey
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function getChatResponse(
  message: string,
  history: ChatMessage[],
  userType: "owner" | "clinic"
): Promise<string> {
  // Fallback responses if no API key is configured
  if (!genAI || !process.env.GEMINI_API_KEY) {
    return getFallbackResponse(message, userType);
  }

  const systemPrompt = userType === "owner"
    ? `You are a helpful AI assistant for PetCare Pro, a veterinary management platform. You're helping a pet owner who uses the platform to manage their pets' health and book veterinary appointments.

Key features you can help with:
- Booking appointments with veterinary clinics
- Managing pet profiles (adding pets, viewing health records)
- Understanding vaccination schedules
- Viewing medical records and history
- Emergency care guidance (always advise to contact emergency services for urgent situations)
- General pet care advice

Be friendly, concise, and helpful. If asked about features not in the platform, politely explain what the platform does offer.`
    : `You are a helpful AI assistant for PetCare Pro, a veterinary management platform. You're helping a veterinary clinic staff member who uses the platform to manage their practice.

Key features you can help with:
- Managing appointments (viewing, updating, scheduling)
- Accessing patient (pet) records
- Adding medical notes and records
- Tracking vaccinations
- Organizing daily schedules
- Patient management best practices

Be professional, concise, and helpful. Focus on clinic workflow efficiency and patient care management.`;

  try {
    // Use Gemini 1.5 Flash (free tier with generous limits)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert chat history to Gemini format
    const chatHistory = history.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    // Send message with system context
    const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${message}`);
    const response = await result.response;
    return response.text() || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API error:", error);
    // Fallback to rule-based responses if API fails
    return getFallbackResponse(message, userType);
  }
}

// Rule-based fallback responses when API is not available
function getFallbackResponse(message: string, userType: "owner" | "clinic"): string {
  const lowerMessage = message.toLowerCase();

  // Common responses for pet owners
  if (userType === "owner") {
    if (lowerMessage.includes("book") || lowerMessage.includes("appointment")) {
      return "To book an appointment:\n1. Go to the 'Booking' page from the navigation menu\n2. Select your pet\n3. Choose a clinic and available time slot\n4. Confirm your booking\n\nYou can view all your appointments on your dashboard.";
    }
    
    if (lowerMessage.includes("add") && lowerMessage.includes("pet")) {
      return "To add a new pet:\n1. Navigate to the 'My Pets' page\n2. Click the 'Add New Pet' button\n3. Fill in your pet's details (name, species, breed, etc.)\n4. Save the profile\n\nOnce added, you can book appointments and view medical records for your pet.";
    }
    
    if (lowerMessage.includes("vaccination") || lowerMessage.includes("vaccine")) {
      return "You can view your pet's vaccination records in their profile. Vaccination schedules vary by species and age. Common vaccinations include:\n\n• Dogs: Rabies, Distemper, Parvovirus\n• Cats: Rabies, Feline Distemper, Feline Leukemia\n\nAlways consult with your veterinarian about the appropriate vaccination schedule for your pet.";
    }
    
    if (lowerMessage.includes("emergency") || lowerMessage.includes("urgent")) {
      return "⚠️ For emergencies:\n1. Contact your nearest 24-hour emergency veterinary clinic immediately\n2. Call ahead if possible so they can prepare\n3. Transport your pet safely\n\nCommon emergencies include: difficulty breathing, severe bleeding, seizures, suspected poisoning, or inability to urinate.\n\nYou can find emergency clinics in the 'Booking' section.";
    }
    
    if (lowerMessage.includes("medical record") || lowerMessage.includes("history")) {
      return "To view your pet's medical records:\n1. Go to 'My Pets'\n2. Click on your pet's profile\n3. Scroll to the 'Medical Records' section\n\nHere you'll find visit notes, diagnoses, treatments, and prescriptions from your veterinarian.";
    }
  }

  // Common responses for clinic staff
  if (userType === "clinic") {
    if (lowerMessage.includes("appointment") || lowerMessage.includes("schedule")) {
      return "To manage appointments:\n1. Go to the 'Appointments' page\n2. View upcoming, pending, or completed appointments\n3. Click on any appointment to update status or add notes\n4. Filter by date or status to organize your schedule\n\nAppointments show pet details, owner contact info, and appointment type.";
    }
    
    if (lowerMessage.includes("patient") || lowerMessage.includes("record")) {
      return "To access patient records:\n1. Navigate to the 'Patients' page\n2. Search for the pet by name or owner\n3. Click on the patient to view full medical history\n4. Add medical notes, treatments, or prescriptions as needed\n\nAll records are securely stored and accessible to the pet owner.";
    }
    
    if (lowerMessage.includes("medical note") || lowerMessage.includes("add note")) {
      return "To add medical notes:\n1. Go to 'Patients' and select the pet\n2. Click 'Add Medical Record'\n3. Enter diagnosis, treatment, and any notes\n4. Save the record\n\nThe pet owner will be able to view these notes in their pet's profile.";
    }
    
    if (lowerMessage.includes("dashboard") || lowerMessage.includes("overview")) {
      return "Your clinic dashboard shows:\n• Today's appointments\n• Upcoming appointments\n• Recent patients\n• Quick access to common tasks\n\nUse the dashboard to get an overview of your daily schedule and manage your workflow efficiently.";
    }
  }

  // Generic response
  return `I'm here to help you with PetCare Pro! ${
    userType === "owner" 
      ? "I can assist with booking appointments, managing your pets, viewing medical records, and understanding pet care."
      : "I can help you manage appointments, access patient records, and organize your clinic workflow."
  }\n\nCould you please rephrase your question or ask about a specific feature?`;
}

