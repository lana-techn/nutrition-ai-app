import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const geminiApiKey = secret("GeminiApiKey");

interface ChatRequest {
  message: string;
  context?: string;
}

interface ChatResponse {
  response: string;
}

// Provides AI-powered nutrition advice and answers questions.
export const chatWithNutritionist = api<ChatRequest, ChatResponse>(
  { expose: true, method: "POST", path: "/chat" },
  async (req) => {
    const systemPrompt = `You are a professional nutritionist AI assistant. Your role is to provide helpful, accurate, and evidence-based nutrition advice. 

Guidelines:
- Always provide scientifically accurate information
- Give practical, actionable advice
- Be encouraging and supportive
- Suggest consulting healthcare professionals for serious concerns
- Focus on balanced, sustainable approaches to nutrition
- Consider individual needs and preferences
- Avoid extreme or fad diet recommendations

Context about the user: ${req.context || "No additional context provided"}

User question: ${req.message}

Please provide a helpful, professional response:`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: systemPrompt }]
          }]
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${result.error?.message || 'Unknown error'}`);
      }

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No response from Gemini API');
      }

      return { response: text.trim() };

    } catch (error) {
      return { 
        response: "I'm sorry, but I'm having trouble connecting right now. Please try again later. In the meantime, remember that a balanced diet with plenty of fruits, vegetables, whole grains, and lean proteins is always a good foundation for healthy eating!" 
      };
    }
  }
);
