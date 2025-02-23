import { LLMServicePort } from "src/core/ports";
import { envConfig } from "../config/env.config";
import { GoogleGenerativeAI } from "@google/generative-ai";


const PROMT = 'Ты опытный помощник ведения встреч, твоя задача подвести промежуточные итоги обсуждений, требуется в сообщении отразить краткий пересказ основных тем обсуждения и не решенные вопросы, если такие остались. Ответ оформи в разговорном стиле для поста в telegram:'

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

