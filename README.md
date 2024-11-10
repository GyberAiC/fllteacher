# fll-teacher
fine-llama-teacher-prototype

**Project: Fine-Tuning LLaMA 3.1 with GPT-4 Data**
===========================================================

### Project Structure

* **Data Processor (DataProcessor)**: Prepares GPT-4 data.
* **Model Trainer (ModelTrainer)**: Performs fine-tuning.
* **Logging System**: Logs all actions and errors.

### Getting Started
---------------

#### Install Dependencies

```bash
npm install
```

#### Configure Environment

1. Copy `.env.example` to `.env`.
2. Set the following paths in `.env`:
	* LLaMA model (`MODEL_PATH`)
	* GPT-4 data (`TRAINING_DATA_PATH`)
	* Output directory (`OUTPUT_DIR`)

### Run the Project
-----------------

#### Full Process (Data Processing + Training)

```bash
npm start
```

#### Only Data Processing

```bash
npm start process-data
```

#### Training with Custom Parameters

```bash
npm start train --epochs 3 --batch-size 8
```

where:

* `epochs` - number of training epochs
* `batch-size` - batch size

### Monitoring
-------------

* All logs are written to files:
	+ `error.log` - only errors
	+ `combined.log` - all actions
* Logs are also printed to the console.
