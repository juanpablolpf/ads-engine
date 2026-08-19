import dotenv from "dotenv";
dotenv.config();

import inquirer from "inquirer";
import { Resend } from "resend";
import { strategyEngine } from "./rules/strategyEngine";
import { buildPrompt } from "./ai/promptBuilder";
import { generateAdWithHF } from "./ai/llmClient";
import { exportAd } from "./output/exporter";
import { Produto } from "./types";

async function runCLI() {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "nome",
        message: "📦 Nome do produto:",
        validate: (input) => (input.trim() ? true : "O nome do produto é obrigatório.")
      },
      {
        type: "input",
        name: "preco",
        message: "💰 Preço (ex: 129.90):",
        validate: (input) => (input.trim() ? true : "O preço é obrigatório.")
      },
      {
        type: "input",
        name: "categoria",
        message: "🏷 Categoria:",
        validate: (input) => (input.trim() ? true : "A categoria é obrigatória.")
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
    ]);

    const produto: Produto = {
      id: Date.now().toString(),
      nome: answers.nome,
      preco: answers.preco,
      categoria: answers.categoria,
      objetivo: answers.objetivo,
      plataforma: answers.plataforma
    };

    console.log("\n🧠 Gerando estratégia...\n");
    const estrategia = strategyEngine(produto);
    const prompt = buildPrompt(produto, estrategia);

    console.log("🤖 Gerando anúncio com IA...\n");
    const anuncio = await generateAdWithHF(prompt, produto);

    console.log("\n🔥 ===== ANÚNCIO GERADO ===== 🔥\n");
    console.log(JSON.stringify(anuncio, null, 2));

    const savedPath = exportAd(produto.id, anuncio);
    console.log(`\n✅ Anúncio exportado com sucesso em: ${savedPath}`);

    // 📧 ENVIO DE EMAIL (se a chave RESEND_API_KEY estiver configurada)
    if (process.env.RESEND_API_KEY) {
      const recipientEmail = process.env.NOTIFICATION_EMAIL || "juan.pablo290102@gmail.com";
      console.log(`\n📧 Enviando notificação para: ${recipientEmail}...`);
      
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: recipientEmail,
        subject: "Seu anúncio está pronto 🚀",
        html: `
          <h2>📦 ${produto.nome}</h2>
          <p><strong>Preço:</strong> R$ ${produto.preco}</p>
          <p><strong>Categoria:</strong> ${produto.categoria}</p>
          <hr/>
          <h3>🧠 Anúncio Gerado:</h3>
          <h4>${anuncio.titulo}</h4>

          <ul>
            ${anuncio.bullets.map((b: string) => `<li>${b}</li>`).join("")}
          </ul>

          <p>${anuncio.descricao}</p>

          <hr/>

          <p><strong>💡 Upsell:</strong> ${anuncio.upsell || "Nenhum"}</p>
        `
      });
      console.log("✉️ E-mail enviado com sucesso!");
    } else {
      console.log("ℹ️ RESEND_API_KEY não informada no .env. Envio de e-mail ignorado.");
    }

    console.log("\n✅ Processo finalizado com sucesso.\n");
  } catch (error: any) {
    console.error("\n❌ Ocorreu um erro no processo:", error.message);
  }
}

runCLI();

