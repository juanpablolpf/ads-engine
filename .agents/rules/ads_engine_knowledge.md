# Memória Permanente do Projeto: AdsEngine Pro (SaaS)

Este documento registra todo o histórico de evolução, arquitetura, decisões técnicas e estado do projeto para todas as sessões futuras.

---

## 📌 Visão Geral do Produto
O **AdsEngine Pro** é uma plataforma SaaS fullstack projetada para automatizar e otimizar a criação de anúncios em marketplaces brasileiros (**Mercado Livre**, **Shopee** e **Amazon**), combinando LLMs (Meta Llama 3.1 via HuggingFace), um motor de regras de negócio em tempo real e emulação visual de interfaces oficiais.

---

## 🏗️ Arquitetura do Sistema

### 1. Backend REST API (`Express + TypeScript`)
- **Ponto de Entrada:** `src/server.ts` (Porta `3001`).
- **Core Engine:**
  - `src/ai/llmClient.ts`: Conecta à API HuggingFace (`meta-llama/Llama-3.1-8B-Instruct`), possui **mecanismo de retry automático (até 2 tentativas)** enviando erros de validação como feedback e valida regras de copy (verbos no infinitivo e integridade de preços).
  - `src/ai/promptBuilder.ts`: Constrói prompts estruturados por marketplace (SEO oculto, limites de caracteres e regras anti-alucinação).
  - `src/rules/strategyEngine.ts`: Aplica regras de negócio (frete grátis para peso ≤ 2kg, alta durabilidade/calor para Inox 430, upsell de kits e banners).
  - `src/services/emailService.ts`: Disparo de e-mails via Resend (`onboarding@resend.dev`).
  - `src/services/historyService.ts`: Leitura e indexação dos anúncios exportados em `output/`.
  - `src/output/exporter.ts`: Salvamento de arquivos JSON formatados na pasta `output/`.
  - `src/types/index.ts`: Interfaces TypeScript centrais (`Produto`, `Estrategias`, `AnuncioOutput`).

### 2. Frontend SaaS (`React + Vite + TypeScript`)
- **Diretório:** `frontend/` (Porta `5173`).
- **Design System:** `frontend/src/index.css` (Dark Obsidian Glassmorphism, aceleração por hardware sem repaints no scroll, tipografia *Outfit* + *Inter*).
- **Componentes:**
  - `Navbar.tsx`: Header de produto, status da API, seleção de templates rápidos e botão com contador de histórico.
  - `ProductForm.tsx`: Seleção de canal (**ML**, **Shopee**, **Amazon**), contador de caracteres em tempo real com limites, gerenciador de tags e preview instantâneo de estratégias via `useMemo` (0ms).
  - `MarketplaceMockup.tsx`: Simulador visual que renderiza o anúncio como na tela oficial do **Mercado Livre** (selo FULL e parcelas), **Shopee** (descontos e cupons) e **Amazon** (Prime e Buy Box).
  - `CopyActionBar.tsx`: Ações de 1 clique para copiar seções do anúncio, baixar JSON e disparar por e-mail.
  - `HistoryDrawer.tsx`: Gaveta lateral para busca e restauração de anúncios anteriores.

---

## 🛠️ Comandos de Execução
- `npm run dev:all` — Inicia simultaneamente o Backend (`3001`) e o Frontend (`5173`).
- `npm run server` — Inicia somente a API Express.
- `npm run frontend` — Inicia somente o Vite frontend.
- `npm run generate` — Executa a CLI interativa no terminal com envio por e-mail.
- `npm run dev` — Processa em lote a lista de `produtos.json`.
- `npm run build:all` — Compila tanto o backend TypeScript quanto o frontend para produção.

---

## 🔑 Variáveis de Ambiente (`.env`)
- `HF_API_KEY`: Chave de API da HuggingFace para inferência LLM.
- `RESEND_API_KEY`: Chave do Resend para envio transacional de e-mails.
- `NOTIFICATION_EMAIL`: E-mail destinatário padrão para notificações de anúncios prontos.
- `HF_MODEL`: (Opcional) Modelo padrão, default `meta-llama/Llama-3.1-8B-Instruct`.
