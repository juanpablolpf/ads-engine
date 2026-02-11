import produtos from './data/produtos.json'
import { strategyEngine } from './rules/strategyEngine'
import { buildPrompt } from './ai/promptBuilder'
import { generateAd } from './ai/openaiClient'
import { exportAd } from './output/exporter'

async function run() {
  for (const produto of produtos as any[]) {
    const estrategia = strategyEngine(produto)
    const prompt = buildPrompt(produto, estrategia)

    const anuncio = await generateAd(prompt)

    exportAd(produto.id, anuncio)
  }
}

run()

