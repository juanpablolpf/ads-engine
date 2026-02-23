import produtos from './data/produtos.json'
import { strategyEngine } from './rules/strategyEngine'
import { buildPrompt } from './ai/promptBuilder'
import { exportAd } from './output/exporter'
import { generateAdWithHF } from "./ai/llmClient";


async function run() {
  for (const produto of produtos as any[]) {
    const estrategia = strategyEngine(produto)
    const prompt = buildPrompt(produto, estrategia)

    const anuncio = await generateAdWithHF(prompt, produto)
    console.log(`\n🔥 ===== PRODUTO ${produto.id} ===== 🔥\n`)
    console.log(JSON.stringify(anuncio, null, 2))

    exportAd(produto.id, anuncio)
  }
}

run()

