
import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI strictly using process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getServiceRecommendation = async (problemDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given this user problem: "${problemDescription}", recommend the most appropriate professional category from: Plumber, Cleaner, Carpenter, Painter, Auto-Repair, or Healthcare. Also provide a brief reason. Format as JSON with "category" and "reason" keys.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { category: 'General', reason: 'Unable to process recommendation.' };
  }
};
