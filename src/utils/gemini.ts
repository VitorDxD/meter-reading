import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const generationConfig = { temperature: 0.4, topP: 1, topK: 32, maxOutputTokens: 4096 };

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig });

async function fileToGenerativePart(path: string) {
    return {
        inlineData: {
            data: Buffer.from(await fs.readFile(path)).toString("base64"),
            mimeType: "image/png",
        },
    };
}

async function aiQuery(prompt: string, filePath: string) {
    try {  
        const imagePart = fileToGenerativePart(filePath);

        const result = await model.generateContent([prompt, await imagePart]);
        return result.response.text();
    } catch (error) {
        console.error('Erro ao tentar gerar conteúdo:', error);
    }
}
  
export default aiQuery;