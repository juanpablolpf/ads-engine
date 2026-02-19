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

    return response.data.choices[0].message.content;

  } catch (error: any) {
    console.error("Erro HuggingFace:", error.response?.data || error.message);
    throw error;
  }
}


function extractJSON(text: string) {
  const match = text.match(/\{[\s\S]*\}/);

  if (!match) throw new Error("JSON não encontrado");

  return JSON.parse(match[0]);
}
