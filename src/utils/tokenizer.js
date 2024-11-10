import { HfTokenizer } from 'tokenizers';
import path from 'path';
import fs from 'fs/promises';
import { setupLogger } from './logger.js';

const logger = setupLogger();

export class TokenizerWrapper {
  constructor() {
    this.tokenizer = null;
    this.vocabSize = 0;
  }

  async initialize(modelPath) {
    try {
      this.tokenizer = await HfTokenizer.fromFile(modelPath);
      this.vocabSize = await this.tokenizer.getVocabSize();
      logger.info(`Tokenizer initialized with vocab size: ${this.vocabSize}`);
    } catch (error) {
      logger.error('Error initializing tokenizer:', error);
      throw error;
    }
  }

  async encode(text) {
    if (!this.tokenizer) {
      throw new Error('Tokenizer not initialized');
    }
    
    const encoding = await this.tokenizer.encode(text);
    return {
      ids: encoding.getIds(),
      attentionMask: encoding.getAttentionMask()
    };
  }

  async decode(ids) {
    if (!this.tokenizer) {
      throw new Error('Tokenizer not initialized');
    }
    
    return await this.tokenizer.decode(ids);
  }

  async getVocabSize() {
    return this.vocabSize;
  }
}