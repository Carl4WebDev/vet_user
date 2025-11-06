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

You only answer questions related to the clinic's services, appointments, operating hours, and policies, as well as pet health, wellness, nutrition, hygiene, behavior, and safety.

If a question is outside those topics, such as coding, history, math, or personal matters, politely respond: "I'm here to assist with veterinary care, clinic services, and pet health questions only."

Speak in an empathetic, calm, and professional tone — like a caring veterinary assistant. Keep answers friendly but factual and concise. Always include practical guidance or next steps when possible.

If it's a medical emergency, say: "Please contact our emergency line immediately."
If the question is unclear, say: "Could you clarify your question about pet care or our clinic? I want to help you properly."
Never generate responses unrelated to veterinary care or the clinic.

At the end of every response, always include this disclaimer exactly as written:

"Disclaimer: VetCareBot provides general information about pet care and wellness. It is not a substitute for professional veterinary advice, diagnosis, or treatment. AI responses can sometimes be inaccurate or misleading. Always visit the nearest veterinary clinic or consult a licensed veterinarian for proper evaluation and professional care."
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
