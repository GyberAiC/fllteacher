import express from 'express';
import { Server } from 'socket.io';
import { setupLogger } from './logger.js';

const logger = setupLogger();

export class TrainingMonitor {
  constructor(port = 3000) {
    this.port = port;
    this.app = express();
    this.metrics = {
      loss: [],
      accuracy: [],
      validationLoss: [],
      validationAccuracy: []
    };
  }

  async start() {
    try {
      this.server = this.app.listen(this.port);
      logger.info(`Training monitor started on port ${this.port}`);
    } catch (error) {
      logger.error('Failed to start training monitor:', error);
    }
  }

  async stop() {
    if (this.server) {
      await new Promise(resolve => this.server.close(resolve));
      logger.info('Training monitor stopped');
    }
  }

  createCallback() {
    return {
      onEpochEnd: (epoch, logs) => {
        this.metrics.loss.push(logs.loss);
        this.metrics.accuracy.push(logs.accuracy);
        this.metrics.validationLoss.push(logs.val_loss);
        this.metrics.validationAccuracy.push(logs.val_accuracy);
        
        logger.info(`Epoch ${epoch + 1} - loss: ${logs.loss.toFixed(4)}, accuracy: ${logs.accuracy.toFixed(4)}`);
      }
    };
  }
}