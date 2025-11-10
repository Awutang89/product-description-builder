import OpenAI from 'openai';

/**
 * OpenAI Configuration
 * Provides a singleton instance of the OpenAI client
 */

let openaiInstance;

export function getOpenAIClient() {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
}

export default {
  getOpenAIClient,
};
