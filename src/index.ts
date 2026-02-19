import produtos from './data/produtos.json'
import { strategyEngine } from './rules/strategyEngine'
import { buildPrompt } from './ai/promptBuilder'
import { generateAd } from './ai/openaiClient'
import { exportAd } from './output/exporter'
import { generateAdWithHF } from "./ai/huggingFaceClient";


async function run() {
  for (const produto of produtos as any[]) {
    const estrategia = strategyEngine(produto)
    const prompt = buildPrompt(produto, estrategia)

    const anuncio = await generateAdWithHF(prompt)
    console.log(`\n🔥 ===== PRODUTO ${produto.id} ===== 🔥\n`)
    console.log(JSON.stringify(anuncio, null, 2))

    exportAd(produto.id, anuncio)
  }
}

run()

