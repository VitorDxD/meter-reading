import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const generationConfig = { temperature: 0.4, topP: 1, topK: 32, maxOutputTokens: 4096 };

const model = genAI.getGenerativeModel({ model: "gemini-pro-vision", generationConfig });

async function aiQuery(prompt: string, imageBase64: string) {
  try {
    const parts = [
      { text: prompt + ":\n" },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64
        }
      },
    ];

    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const response = await result.response;
    return await response.text();
  } catch (error) {
    console.error('Erro ao tentar gerar conteúdo:', error);
  }
}
  
export default aiQuery;