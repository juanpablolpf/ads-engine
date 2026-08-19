import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { strategyEngine } from "./rules/strategyEngine";
import { buildPrompt } from "./ai/promptBuilder";
import { generateAdWithHF } from "./ai/llmClient";
import { exportAd } from "./output/exporter";
import { sendAdEmail } from "./services/emailService";
import { getHistory } from "./services/historyService";
import { Produto } from "./types";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "AdsEngine Pro API",
    version: "1.0.0",
    hasHfKey: !!process.env.HF_API_KEY,
    hasResendKey: !!process.env.RESEND_API_KEY
  });
});

// 2. Pre-calculated Strategy preview (live as user types)
app.post("/api/strategy-preview", (req, res) => {
  try {
    const produto: Produto = req.body;
    const estrategia = strategyEngine(produto);
    res.json({ success: true, estrategia });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 3. Full Ad Generation with LLM & Validation
app.post("/api/generate", async (req, res) => {
  try {
    const produto: Produto = {
      id: req.body.id || Date.now().toString(),
      nome: req.body.nome,
      preco: req.body.preco,
      categoria: req.body.categoria,
      plataforma: req.body.plataforma || "ML",
      material: req.body.material,
      diferenciais: req.body.diferenciais || [],
      peso: req.body.peso,
      objetivo: req.body.objetivo
    };

    if (!produto.nome || !produto.preco || !produto.categoria) {
      return res.status(400).json({
        success: false,
        error: "Campos obrigatórios ausentes: nome, preco e categoria."
      });
    }

    const estrategia = strategyEngine(produto);
    const prompt = buildPrompt(produto, estrategia);

    console.log(`[API] Gerando anúncio para '${produto.nome}' (${produto.plataforma})...`);
    const anuncio = await generateAdWithHF(prompt, produto);

    const savedFile = exportAd(produto.id, anuncio);

    res.json({
      success: true,
      produto,
      estrategia,
      anuncio,
      savedFile
    });
  } catch (error: any) {
    console.error("[API Error] Falha na geração:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Erro interno ao gerar anúncio."
    });
  }
});

// 4. Send Email
app.post("/api/email", async (req, res) => {
  try {
    const { produto, anuncio, email } = req.body;
    if (!produto || !anuncio) {
      return res.status(400).json({
        success: false,
        error: "Dados do produto e anúncio são necessários."
      });
    }

    const result = await sendAdEmail(produto, anuncio, email);
    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json({ success: true, id: result.id });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. History
app.get("/api/history", (req, res) => {
  try {
    const history = getHistory();
    res.json({ success: true, history });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Predefined Templates for quick testing
app.get("/api/templates", (req, res) => {
  const templates: Produto[] = [
    {
      id: "tpl-01",
      nome: "Grelha Inox para Churrasco Modelo Moeda",
      categoria: "Churrasco",
      material: "Aço Inox 430",
      diferenciais: ["Modelo moeda", "Fácil de limpar", "Alta durabilidade"],
      preco: 129.90,
      peso: 1.8,
      plataforma: "SHOPEE",
      objetivo: "Destacar durabilidade e facilidade de limpeza"
    },
    {
      id: "tpl-02",
      nome: "Faqueiro Inox 24 Pecas com Cabo Ergonomico",
      categoria: "Cozinha",
      material: "Aço Inox",
      diferenciais: ["Lâminas temperadas", "Alta durabilidade", "Acabamento em brilho"],
      preco: 89.90,
      peso: 1.2,
      plataforma: "ML",
      objetivo: "Venda rápida e busca direta no Mercado Livre"
    },
    {
      id: "tpl-03",
      nome: "Mochila Impermeavel para Notebook 15.6 Pol",
      categoria: "Acessórios",
      material: "Nylon 600D",
      diferenciais: ["Resistente à água", "Compartimento acolchoado", "Entrada USB lateral"],
      preco: 199.90,
      peso: 0.8,
      plataforma: "AMAZON",
      objetivo: "Enfatizar especificações técnicas e proteção"
    },
    {
      id: "tpl-04",
      nome: "Fone de Ouvido Bluetooth TWS com Cancelamento de Ruido",
      categoria: "Eletrônicos",
      material: "Plástico ABS",
      diferenciais: ["Bateria 30h", "Bluetooth 5.3", "Microfone duplo HD"],
      preco: 149.90,
      peso: 0.2,
      plataforma: "SHOPEE",
      objetivo: "Apelo comercial jovem e alta conversão"
    }
  ];

  res.json({ success: true, templates });
});

app.listen(PORT, () => {
  console.log(`\n🚀 AdsEngine Pro API rodando em http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponíveis: /api/health, /api/generate, /api/strategy-preview, /api/history, /api/templates\n`);
});
