import inquirer from "inquirer"
import { strategyEngine } from "./rules/strategyEngine"
import { buildPrompt } from "./ai/promptBuilder"
import { generateAdWithHF } from "./ai/llmClient"
import { exportAd } from "./output/exporter"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    },
    {
      type: "list",
      name: "plataforma",
      message: "🛒 Selecione a plataforma:",
      choices: [
        { name: "Mercado Livre", value: "ML" },
        { name: "Shopee", value: "SHOPEE" },
        { name: "Amazon", value: "AMAZON" }
      ]
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

  const anuncio = await generateAdWithHF(prompt, produto)

  console.log("\n🔥 ===== ANÚNCIO GERADO ===== 🔥\n")
  console.log(JSON.stringify(anuncio, null, 2))

  exportAd(produto.id, anuncio)

  console.log("\n✅ Processo finalizado.\n")

  exportAd(produto.id, anuncio)

  // 📧 ENVIO DE EMAIL
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'juan.pablo290102@gmail.com',
    subject: 'Seu anúncio está pronto 🚀',
    html: `
      <h2>📦 ${produto.nome}</h2>
      <p><strong>Preço:</strong> ${produto.preco}</p>
      <p><strong>Categoria:</strong> ${produto.categoria}</p>
      <hr/>
      <h3>🧠 Anúncio Gerado:</h3>
      <h3>🧠 ${anuncio.titulo}</h3>

        <ul>
          ${anuncio.bullets.map((b: string) => `<li>${b}</li>`).join("")}
        </ul>

        <p>${anuncio.descricao}</p>

        <hr/>

        <p><strong>💡 Upsell:</strong> ${anuncio.upsell}</p>
      `
  });
}

runCLI()
