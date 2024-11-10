import { setupLogger } from '../utils/logger.js';
import { openai } from '../config/openai.js';
import fs from 'fs/promises';
import path from 'path';

const logger = setupLogger();

export class DataProcessor {
  constructor() {
    this.processedData = [];
    this.augmentationConfig = {
      temperature: [0.7, 1.0, 1.2],
      maxTokens: [100, 150, 200]
    };
  }

  async processData() {
    try {
      logger.info('Starting data processing');
      
      const rawData = await this.loadRawData();
      const cleanedData = await this.cleanData(rawData);
      const augmentedData = await this.augmentData(cleanedData);
      const balancedData = await this.balanceDataset(augmentedData);
      const formattedData = await this.formatData(balancedData);
      
      await this.saveProcessedData(formattedData);
      await this.generateDatasetStats(formattedData);
      
      logger.info('Data processing completed');
      return true;
    } catch (error) {
      logger.error('Error in data processing:', error);
      throw error;
    }
  }

  async loadRawData() {
    try {
      const dataPath = process.env.TRAINING_DATA_PATH || './data/raw';
      const files = await fs.readdir(dataPath);
      const data = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await fs.readFile(path.join(dataPath, file), 'utf-8');
          data.push(...JSON.parse(content));
        }
      }

      return data;
    } catch (error) {
      logger.error('Error loading raw data:', error);
      throw error;
    }
  }

  async cleanData(data) {
    return data.filter(item => {
      if (!item.text || typeof item.text !== 'string') return false;
      if (item.text.length < 10) return false;
      
      item.text = item.text
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s.,?!-]/g, '');
      
      return true;
    });
  }

  async augmentData(data) {
    const augmentedData = [];
    
    for (const item of data) {
      augmentedData.push(item);
      
      try {
        const variations = await this.generateVariations(item.text);
        augmentedData.push(...variations.map(text => ({ text })));
      } catch (error) {
        logger.warn(`Failed to augment data for item: ${item.text.substring(0, 50)}...`);
      }
    }
    
    return augmentedData;
  }

  async generateVariations(text) {
    const variations = [];
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Generate a variation of the following text while preserving its meaning."
          },
          { role: "user", content: text }
        ],
        temperature: 0.8,
        max_tokens: 150
      });
      
      if (response.choices && response.choices[0]) {
        variations.push(response.choices[0].message.content);
      }
    } catch (error) {
      logger.error('Error generating variations:', error);
    }
    
    return variations;
  }

  async balanceDataset(data) {
    const lengthDistribution = data.reduce((acc, item) => {
      const length = item.text.length;
      acc[length] = (acc[length] || 0) + 1;
      return acc;
    }, {});
    
    const avgCount = Object.values(lengthDistribution)
      .reduce((a, b) => a + b, 0) / Object.keys(lengthDistribution).length;
    
    return data.filter(item => {
      const length = item.text.length;
      return lengthDistribution[length] <= avgCount * 1.5;
    });
  }

  async formatData(data) {
    return data.map(item => ({
      text: item.text,
      tokens: item.text.split(/\s+/).length,
      metadata: {
        length: item.text.length,
        processed: new Date().toISOString()
      }
    }));
  }

  async saveProcessedData(data) {
    try {
      const outputDir = process.env.OUTPUT_DIR || './data/processed';
      await fs.mkdir(outputDir, { recursive: true });
      
      const outputPath = path.join(outputDir, 'processed_data.json');
      await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
      
      logger.info(`Processed data saved to ${outputPath}`);
    } catch (error) {
      logger.error('Error saving processed data:', error);
      throw error;
    }
  }

  async generateDatasetStats(data) {
    const stats = {
      totalExamples: data.length,
      averageLength: data.reduce((acc, item) => acc + item.text.length, 0) / data.length,
      tokenDistribution: data.reduce((acc, item) => {
        acc[item.tokens] = (acc[item.tokens] || 0) + 1;
        return acc;
      }, {}),
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    try {
      const outputDir = process.env.OUTPUT_DIR || './data/processed';
      const statsPath = path.join(outputDir, 'dataset_stats.json');
      await fs.writeFile(statsPath, JSON.stringify(stats, null, 2));
      
      logger.info('Dataset statistics generated successfully');
    } catch (error) {
      logger.error('Error generating dataset statistics:', error);
      throw error;
    }
  }
}