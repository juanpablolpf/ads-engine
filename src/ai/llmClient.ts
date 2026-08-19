import axios from "axios";
import dotenv from "dotenv";
import { Produto, AnuncioOutput } from "../types";

dotenv.config();

const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const MODEL_NAME = process.env.HF_MODEL || "meta-llama/Llama-3.1-8B-Instruct";

export async function generateAdWithHF(
  prompt: string,
  produto: Produto,
  maxRetries: number = 2
): Promise<AnuncioOutput> {
  let currentPrompt = prompt;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`🔄 Tentativa ${attempt} de ${maxRetries}...`);
      }

      const response = await axios.post(
        HF_API_URL,
        {
          model: MODEL_NAME,
          messages: [
            {
              role: "user",
              content: currentPrompt
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

      const rawText = response.data?.choices?.[0]?.message?.content;
      if (!rawText) {
        throw new Error("Resposta vazia da API do HuggingFace");
      }

      const parsed: AnuncioOutput = extractJSON(rawText);
      const errors = validateAd(parsed, produto);

      if (errors.length > 0) {
        console.warn(`⚠️ Validação falhou na tentativa ${attempt}:`, errors);
        currentPrompt = `${prompt}\n\nIMPORTANTE: A tentativa anterior falhou nos seguintes pontos:\n${errors.map((e) => `- ${e}`).join("\n")}\nPor favor, corrija e retorne APENAS o JSON válido.`;
        throw new Error(`Erros de validação: ${errors.join(", ")}`);
      }

      return parsed;
    } catch (error: any) {
      lastError = error;
      const apiErrorMessage = error.response?.data?.error || error.response?.data || error.message;
      console.error(`Erro na geração (tentativa ${attempt}/${maxRetries}):`, apiErrorMessage);

      if (attempt === maxRetries) {
        throw new Error(`Falha ao gerar anúncio após ${maxRetries} tentativas: ${lastError?.message}`);
      }
    }
  }

  throw lastError || new Error("Falha desconhecida na geração do anúncio");
}

function extractJSON(text: string): AnuncioOutput {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("JSON não encontrado na resposta da IA");
  }

  const jsonString = cleaned.slice(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(jsonString) as AnuncioOutput;
  } catch (err) {
    console.error("Erro ao fazer parse do JSON:", jsonString);
    throw new Error("JSON inválido retornado pela IA");
  }
}

function validateAd(ad: AnuncioOutput, produto: Produto): string[] {
  const errors: string[] = [];

  if (!ad.titulo || typeof ad.titulo !== "string" || ad.titulo.trim().length === 0) {
    errors.push("Título vazio");
  }

  if (!Array.isArray(ad.bullets)) {
    errors.push("Bullets inválidos (deve ser um array)");
    return errors;
  }

  if (ad.bullets.length > 4) {
    errors.push(`Mais de 4 bullets (recebeu ${ad.bullets.length})`);
  }

  ad.bullets.forEach((b: string, i: number) => {
    const trimmed = (b || "").trim().replace(/^[-*•]\s*/, "");
    if (!trimmed.match(/^[A-Za-zÀ-ú]+(ar|er|ir)\b/i)) {
      errors.push(`Bullet ${i + 1} ("${trimmed.slice(0, 20)}...") não começa com verbo no infinitivo`);
    }
  });

  if (ad.descricao && produto.preco) {
    const precoFormatadoPonto = typeof produto.preco === "number" ? produto.preco.toFixed(2) : String(produto.preco);
    const precoFormatadoVirgula = precoFormatadoPonto.replace(".", ",");
    
    // Se a descrição menciona R$, checar se contém o valor correto em qualquer formato comum
    if (
      ad.descricao.includes("R$") &&
      !ad.descricao.includes(`R$ ${precoFormatadoPonto}`) &&
      !ad.descricao.includes(`R$ ${precoFormatadoVirgula}`) &&
      !ad.descricao.includes(`R$${precoFormatadoPonto}`) &&
      !ad.descricao.includes(`R$${precoFormatadoVirgula}`) &&
      !ad.descricao.includes(String(produto.preco))
    ) {
      errors.push(`Preço alterado na descrição (esperado R$ ${precoFormatadoVirgula} ou R$ ${precoFormatadoPonto})`);
    }
  }

  return errors;
}