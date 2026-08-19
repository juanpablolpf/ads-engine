import dotenv from "dotenv";
dotenv.config();

import produtosJson from "./data/produtos.json";
import { strategyEngine } from "./rules/strategyEngine";
import { buildPrompt } from "./ai/promptBuilder";
import { exportAd } from "./output/exporter";
import { generateAdWithHF } from "./ai/llmClient";
import { Produto } from "./types";

const produtos: Produto[] = produtosJson as Produto[];

async function run() {
  for (const produto of produtos) {
    console.log(`\n🚀 Processando produto: ${produto.nome} (${produto.id})...`);

    const estrategia = strategyEngine(produto);
    const prompt = buildPrompt(produto, estrategia);

    const anuncio = await generateAdWithHF(prompt, produto);
    console.log(`\n🔥 ===== PRODUTO ${produto.id} ===== 🔥\n`);
    console.log(JSON.stringify(anuncio, null, 2));

    exportAd(produto.id, anuncio);
  }
}

run().catch((error) => {
  console.error("❌ Falha na execução da pipeline:", error.message);
});


