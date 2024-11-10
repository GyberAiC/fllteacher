# LLaMA Fine-tuning Project

This project provides tools for processing training data and fine-tuning LLaMA models.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Add your OpenAI API key
- Adjust other settings as needed

## Usage

### Process Training Data
```bash
npm run start process-data
```

### Start Training
```bash
npm run start train
```

### Options
- `-e, --epochs`: Number of training epochs (default: 10)
- `-b, --batch-size`: Batch size (default: 32)

## Project Structure

```
src/
├── config/         # Configuration files
├── processors/     # Data processing modules
├── trainers/      # Model training modules
└── utils/         # Utility functions
```

