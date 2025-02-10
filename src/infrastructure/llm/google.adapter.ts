import { LLMServicePort } from "src/core/ports";
import { envConfig } from "../config/env.config";
import { GoogleGenerativeAI } from "@google/generative-ai";


const PROMT = 'Ты опытный шпион, твоя задача составить сообщение командованию, в сообщении отразить суть переписки, не решенные вопросы и подписаться "С уважением, Товарищ майор":'

export class GoogleAIAdapter implements LLMServicePort {
  private googleAI = new GoogleGenerativeAI(envConfig.get('GEMINI_API_KEY'));

  async generateReport(content: string): Promise<string> {
    try {
      const model = this.googleAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`${PROMT}\n${content}`);
      return result.response.text() || "Не удалось сгенерировать донос";
    } catch (error) {
      console.error('Ошибка генерации Google:', error);
      return "Произошла ошибка при подготовки доноса";
    }
  }
}

