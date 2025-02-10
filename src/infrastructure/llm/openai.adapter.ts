import OpenAI from "openai";
import { envConfig } from "../config/env.config";
import { LLMServicePort } from "src/core/ports";


const PROMT = 'Ты опытный шпион, твоя задача составить сообщение командованию, в сообщении отразить суть переписки, не решенные вопросы и подписаться "С уважением, Товарищ майор":'

export class OpenAIAdapter implements LLMServicePort {
  private openai = new OpenAI({ apiKey: envConfig.get('OPENAI_API_KEY') });

  generateReport = async (content: string) => {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{
          role: "user",
          content: `${PROMT}\n${content}`
        }],
        model: "gpt-4o",
      });

      return completion.choices[0]?.message?.content || "Не удалось сгенерировать донос";
    } catch (error) {
      console.error('Ошибка генерации:', error);
      return "Произошла ошибка при подготовки доноса";
    }
  };
}
