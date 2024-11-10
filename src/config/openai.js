import OpenAI from 'openai';
import { setupLogger } from '../utils/logger.js';

const logger = setupLogger();

if (!process.env.OPENAI_API_KEY) {
  logger.warn('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});