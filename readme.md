# 🚀 AdsEngine Pro • Gerador Inteligente de Anúncios com IA para Marketplaces

Um produto SaaS completo projetado para gerar anúncios de alta conversão para os principais marketplaces brasileiros (**Mercado Livre**, **Shopee** e **Amazon**), combinando inteligência artificial (Meta Llama 3.1), validação estrutural de copywriting e regras estratégicas de venda em tempo real.

---

## 🌟 Recursos Principais (SaaS)

- **Frontend Moderno (React + Vite + TypeScript)**: Interface Dark Glassmorphism, responsiva e pronta para comercialização.
- **Simulador Real de Marketplaces**: Visualização interativa que emula os layouts oficiais do **Mercado Livre**, **Shopee** e **Amazon** (com selos de frete grátis, cálculo de parcelas, badges de reputação e botões de compra).
- **Motor de Estratégias em Tempo Real**: Disparo automático de regras de frete grátis (produtos ≤ 2kg), resistência de materiais (Inox 430), banners promocionais e sugestões de upsell conforme você digita.
- **Camada de Validação & Retry com IA**: Garante títulos com limites de caracteres por canal, bullets começando estritamente com verbos no infinitivo e integridade dos preços.
- **Ações Rápidas de Seller**: Cópia com 1 clique (anúncio completo ou seções isoladas), download em JSON e disparo formatado para o e-mail do cliente via Resend.
- **Histórico & Gestão**: Consulta a todos os anúncios gerados anteriormente com busca e recarga imediata.

---

## 🏗️ Arquitetura do Sistema

```
ads-engine/
├── src/                          # Backend API & Engine
│   ├── ai/
│   │   ├── llmClient.ts          # Chamada à API HuggingFace com Retry e Validação
│   │   └── promptBuilder.ts      # Construção de prompts calibrados por plataforma
│   ├── rules/
│   │   └── strategyEngine.ts     # Regras de negócio, frete grátis e upsell
│   ├── services/
│   │   ├── emailService.ts       # Disparo de e-mails via Resend
│   │   └── historyService.ts     # Leitura e indexação do histórico salvo
│   ├── output/
│   │   └── exporter.ts           # Exportação segura de JSON
│   ├── types/
│   │   └── index.ts              # Tipos TypeScript compartilhados
│   └── server.ts                 # Servidor Express REST (Porta 3001)
├── frontend/                     # Frontend SPA (Vite + React)
│   ├── src/
│   │   ├── components/           # Navbar, ProductForm, MarketplaceMockup, etc.
│   │   ├── services/api.ts       # Cliente HTTP com proxy
│   │   └── App.tsx               # Interface principal
│   └── index.html
└── package.json
```

---

## 🛠️ Como Executar

### 1. Configurar Variáveis de Ambiente
Crie ou edite o arquivo `.env` na raiz do projeto:

```env
HF_API_KEY=sua_chave_huggingface_aqui
RESEND_API_KEY=sua_chave_resend_aqui
NOTIFICATION_EMAIL=seu_email@exemplo.com
```

### 2. Instalar Dependências
```bash
npm install
npm --prefix frontend install
```

### 3. Iniciar o Produto Completo (Backend + Frontend)
Execute ambos com um único comando:
```bash
npm run dev:all
```

- **Frontend Web App:** [http://localhost:5173](http://localhost:5173)
- **API REST Backend:** [http://localhost:3001](http://localhost:3001)

### 4. Outros Comandos Úteis
- `npm run server` — Inicia somente o servidor backend Express.
- `npm run frontend` — Inicia somente a aplicação web Vite.
- `npm run generate` — Executa a CLI interativa no terminal.
- `npm run dev` — Executa o processamento em lote via script `index.ts`.
- `npm run build:all` — Compila tanto o backend TypeScript quanto o frontend para produção.