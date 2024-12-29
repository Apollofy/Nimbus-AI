import { GoogleGenerativeAI } from "@google/generative-ai";
import { formatGeminiResponse } from "../utils/textUtils";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getGeminiResponse = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  console.log(formatGeminiResponse(response));
  return formatGeminiResponse(response.text());

};