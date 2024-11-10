# fllteacher
fine-llama-teacher-prototype

Project: Fine-Tuning LLaMA 3.1 with GPT-4 Data
Project Structure
Data Processor (DataProcessor): Prepares GPT-4 data.
Model Trainer (ModelTrainer): Performs fine-tuning.
Logging System: Logs all actions and errors.
Getting Started
Install Dependencies
npm install
		
Configure Environment
Copy .env.example to .env.
Set the following paths in .env:
LLaMA model (MODEL_PATH)
GPT-4 data (TRAINING_DATA_PATH)
Output directory (OUTPUT_DIR)
Run the Project
There are several ways to run the project:

Full Process (Data Processing + Training)
npm start
		
Only Data Processing
npm start process-data
		
Training with Custom Parameters
npm start train --epochs 3 --batch-size 8
		
where:

epochs - number of training epochs
batch-size - batch size
Monitoring
All logs are written to files:
error.log - only errors
combined.log - all actions
Logs are also printed to the console.
