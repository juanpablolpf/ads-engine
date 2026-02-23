🚀 AI Ad Engine

An intelligent ad copy generation pipeline powered by LLMs.

This project generates structured marketing ads based on product and target audience input, using a validation layer to ensure reliable output.

Built as part of my journey from junior developer to AI-focused engineer.

🧠 Problem

Generating marketing copy manually is time-consuming and inconsistent.

Large Language Models can help — but they often return unpredictable or malformed outputs.

This project solves that by:

Structuring prompts

Extracting JSON safely

Validating responses before use

Formatting clean output

🏗 Architecture

Pipeline flow:

User Input (CLI)
        ↓
Prompt Builder
        ↓
LLM Client (HuggingFace)
        ↓
JSON Extraction
        ↓
Validation Layer
        ↓
Formatted Output
Core Components

promptBuilder.ts → Builds structured prompt

huggingFaceClient.ts → Handles LLM API call

extractJSON.ts → Extracts JSON from raw response

validateAd.ts → Ensures output structure

cli.ts → Entry point

🛠 Tech Stack

Node.js

TypeScript

HuggingFace Inference API

dotenv

▶ How to Run


Install dependencies

npm install

Create .env file

HF_API_KEY=your_api_key_here

Run

npm run dev

🎯 Current Version

v0.1 – CLI-based structured ad generator

Features:

Structured prompt engineering

JSON extraction from LLM output

Response validation layer

Error handling

🔮 Roadmap

 REST API layer

 Multiple ad variations

 Strategy engine

 Context memory

 Automated optimization loop

📈 Why I Built This

I wanted to move beyond tutorials and build a real AI-powered system with:

Clear architecture

Validation logic

Production-oriented thinking

This project was also inspired by a real demand inside the company where I currently work.
I saw an opportunity to explore how AI could support marketing and copy generation workflows in a more structured and reliable way.

Building in public 🚀



⚠ This project is under active development.