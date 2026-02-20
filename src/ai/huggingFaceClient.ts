import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HF_API_URL =
   "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

export async function generateAdWithHF(prompt: string) {
  try {
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 800
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const rawText = response.data.choices[0].message.content;

    const parsed = extractJSON(rawText);

    return parsed;

  } catch (error: any) {
    console.error("Erro HuggingFace:", error.response?.data || error.message);
    throw error;
  }
}



function extractJSON(text: string) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\n/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("JSON não encontrado");
  }

  const jsonString = cleaned.slice(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Erro ao fazer parse do JSON:", jsonString);
    throw new Error("JSON inválido retornado pela IA");
  }
}

