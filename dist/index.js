"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const produtos_json_1 = __importDefault(require("./data/produtos.json"));
const strategyEngine_1 = require("./rules/strategyEngine");
const promptBuilder_1 = require("./ai/promptBuilder");
const exporter_1 = require("./output/exporter");
const llmClient_1 = require("./ai/llmClient");
const produtos = produtos_json_1.default;
async function run() {
    for (const produto of produtos) {
        console.log(`\n🚀 Processando produto: ${produto.nome} (${produto.id})...`);
        const estrategia = (0, strategyEngine_1.strategyEngine)(produto);
        const prompt = (0, promptBuilder_1.buildPrompt)(produto, estrategia);
        const anuncio = await (0, llmClient_1.generateAdWithHF)(prompt, produto);
        console.log(`\n🔥 ===== PRODUTO ${produto.id} ===== 🔥\n`);
        console.log(JSON.stringify(anuncio, null, 2));
        (0, exporter_1.exportAd)(produto.id, anuncio);
    }
}
run().catch((error) => {
    console.error("❌ Falha na execução da pipeline:", error.message);
});
