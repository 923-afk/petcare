import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function getChatResponse(
  message: string,
  history: ChatMessage[],
  userType: "owner" | "clinic"
): Promise<string> {
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
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message }
      ],
      max_completion_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get chat response");
  }
}
