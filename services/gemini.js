// services/gemini.js
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const VITE_GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!VITE_GEMINI_API_KEY) {
  console.error(
    "Missing GEMINI_API_KEY. Set it in your environment variables."
  );
}

const genAI = new GoogleGenerativeAI(VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function runChat(prompt) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error with Google Gemini API:", error);
    return "Unable to generate prediction.";
  }
}

export default runChat;
