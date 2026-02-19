import inquirer from "inquirer"
import { strategyEngine } from "./rules/strategyEngine"
import { buildPrompt } from "./ai/promptBuilder"
import { generateAdWithHF } from "./ai/huggingFaceClient"
import { exportAd } from "./output/exporter"

async function runCLI() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "nome",
      message: "📦 Nome do produto:"
    },
    {
      type: "input",
      name: "preco",
      message: "💰 Preço:"
    },
    {
      type: "input",
      name: "categoria",
      message: "🏷 Categoria:"
    },
    {
      type: "input",
      name: "objetivo",
      message: "🎯 Objetivo do anúncio:"
    }
  ])

  const produto = {
    id: Date.now().toString(),
    ...answers
  }

  console.log("\n🧠 Gerando estratégia...\n")

  const estrategia = strategyEngine(produto)
  const prompt = buildPrompt(produto, estrategia)

  console.log("🤖 Gerando anúncio com IA...\n")

  const anuncio = await generateAdWithHF(prompt)

  console.log("\n🔥 ===== ANÚNCIO GERADO ===== 🔥\n")
  console.log(JSON.stringify(anuncio, null, 2))

  exportAd(produto.id, anuncio)

  console.log("\n✅ Processo finalizado.\n")
}

runCLI()
