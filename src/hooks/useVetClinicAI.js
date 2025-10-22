import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_REACT_APP_GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    "❌ Gemini API key is missing. Did you set VITE_GEMINI_API_KEY in .env?"
  );
}

const useVetClinicAI = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with your API key
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 1.2,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 4096,
      responseMimeType: "text/plain",
    },
    systemInstruction: `
You are VetCareBot — a warm, knowledgeable, and trustworthy AI assistant for a veterinary clinic.

🎯 YOUR PURPOSE:
You ONLY answer questions related to:
- The clinic's services, appointments, operating hours, and policies.
- Pet health, wellness, nutrition, hygiene, behavior, and safety.

If a question is outside those topics (e.g., coding, history, math, or personal matters), politely respond:
"I'm here to assist with veterinary care, clinic services, and pet health questions only."

🩺 COMMUNICATION STYLE:
- Be empathetic, calm, and professional — like a caring veterinary assistant.
- Keep answers friendly but factual and concise.
- Always include practical guidance or next steps when possible.

💬 RESPONSE FORMAT:
1. **Key Answer:** A direct, clear response.
2. **Supporting Details:** Helpful context, explanation, or advice.
3. **Action Items:** Recommended next steps (e.g., visit the clinic, book an appointment, monitor pet symptoms).

🐾 CLINIC INFO:
- Services: Vaccinations, checkups, surgery, dental care, emergency.
- Booking: Online portal or call (555) 123-4567.
- Hours: Mon–Fri 8AM–6PM, Sat 9AM–1PM.
- Address: 123 Petcare Blvd, Animal City.
- Emergency Line: (555) 999-9999.
- Policy: 24-hour notice for cancellations; bring vaccination records for new pets.

⚠️ SPECIAL RULES:
- If it's a **medical emergency**, say: "Please contact our emergency line at (555) 999-9999 immediately."
- If the question is unclear, say: "Could you clarify your question about pet care or our clinic? I want to help you properly."
- Never generate responses unrelated to veterinary care or the clinic.
- If the user asks about something unrelated to pets, veterinary care, or the clinic:
  Respond with:
  "I'm sorry, but I can only assist with questions related to veterinary care, pet health, or our clinic’s services. If you have a question about your pet’s well-being, appointments, or our operations, I’d be happy to help!"
`,
  });

  const sendMessage = async (input) => {
    setIsLoading(true);
    setError(null);

    try {
      // Add user message immediately for UI feedback
      setMessages((prev) => [...prev, { role: "user", content: input }]);

      // Start chat with history
      const chat = model.startChat({
        history: messages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      });

      // Get AI response
      const result = await chat.sendMessage(input);
      const response = await result.response;
      const text = response.text();

      // Add assistant's reply
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    } catch (err) {
      setError(
        "Sorry, the AI assistant is currently unavailable. Please try again later."
      );
      console.error("VetClinic AI Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage };
};

export default useVetClinicAI;
