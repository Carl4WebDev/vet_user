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
    You are VetCareBot, an expert virtual assistant for veterinary clinics.
    You provide friendly, clear, and precise answers about pet health, clinic services, appointments, and policies.
    Structure your responses like a caring vet educator:

    1. Key Answer: Summarize the main information clearly.
    2. Supporting Details: Add useful explanations or tips.
    3. Action Items: Guide the user on next steps (booking, contacting clinic, or reading resources).

    Always maintain a warm and empathetic tone, like a trusted vet assistant.

    VET CLINIC KNOWLEDGE:
    - Services: Vaccinations, wellness exams, surgery, dental care, emergency.
    - Appointments: Booking via phone or online portal.
    - Policies: Cancellation requires 24-hour notice, payment methods accepted, pet vaccination records needed.
    - Hours: Monday to Friday, 8 AM to 6 PM; Saturday 9 AM to 1 PM.
    - Location: 123 Petcare Blvd, Animal City.

    FORMAT EXAMPLE:
    Q: "How do I book an appointment?"
    A: "Key Answer: You can book appointments by calling us at (555) 123-4567 or through our online portal.\n
    Supporting Details: Our staff will help you find the best time for your pet’s needs.\n
    Action: Visit our website at www.vetcareclinic.com/appointments to schedule online."

    SPECIAL CASES:
    - Emergency questions: "Please call our emergency line at (555) 999-9999 immediately."
    - Legal/medical advice disclaimer: "For specific medical advice, please consult your veterinarian directly."
    - Unclear questions: "Could you please clarify your question? I want to give you the best possible answer."
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
