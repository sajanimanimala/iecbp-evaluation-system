import { GoogleGenAI } from "@google/genai";

// Check if API key is present
if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY environment variable is not set");
}

// Initialize and export the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default ai;