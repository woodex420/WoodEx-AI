import { GoogleGenAI } from "@google/genai";
import { Contact, Message } from '../types';

// Initialize Gemini
// Note: In a real production build, ensure API_KEY is securely handled.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSmartReply = async (contact: Contact, context?: string): Promise<string> => {
  if (!apiKey) return "Simulated AI: Please configure API_KEY to use Gemini.";

  const historyText = contact.messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n');
  
  const prompt = `
    You are a professional CRM assistant. 
    Draft a polite, concise, and business-appropriate reply to the following conversation history for a customer named ${contact.name}.
    
    Context/Goal: ${context || "Follow up on their last query."}

    Conversation History:
    ${historyText}

    Reply (text only):
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating reply. Please check your connection.";
  }
};

export const analyzeLeadSentiment = async (messages: Message[]): Promise<{score: number, summary: string}> => {
   if (!apiKey) return { score: 50, summary: "API Key missing." };

   const historyText = messages.slice(-10).map(m => `${m.sender}: ${m.text}`).join('\n');
   
   const prompt = `
     Analyze the sentiment of this customer conversation.
     Return a JSON object with:
     - "score": number between 0 (Angry/Lost) and 100 (Happy/Ready to buy).
     - "summary": A 10-word summary of their intent.

     Conversation:
     ${historyText}
   `;

   try {
     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: prompt,
       config: { responseMimeType: "application/json" }
     });
     
     const json = JSON.parse(response.text);
     return json;
   } catch (error) {
     return { score: 50, summary: "Could not analyze." };
   }
};