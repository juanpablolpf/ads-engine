# AdsEngine Pro - Knowledge & Context

## Resumo do Projeto
O **AdsEngine Pro** é uma solução SaaS completa para geração de anúncios em marketplaces (**Mercado Livre**, **Shopee** e **Amazon**).

## Estrutura do Repositório
- `src/`: Backend API com Express, motor de IA com HuggingFace (`Llama-3.1-8B-Instruct`), sistema de retry automático, validações de copy (infinitivo e preços), integração com Resend e exportador.
- `frontend/`: Frontend React SPA com Vite, TypeScript, Tailwind/Modern CSS, simuladores visuais fiéis de cada marketplace, ações de cópia/download e histórico de anúncios.
- `output/`: Pasta onde os anúncios gerados são salvos em formato JSON.

## Comandos Principais
- `npm run dev:all` -> Roda Backend (3001) e Frontend (5173) juntos
- `npm run server` -> Roda o servidor Express
- `npm run frontend` -> Roda o frontend Vite
- `npm run generate` -> Roda a CLI interativa no terminal
- `npm run dev` -> Roda o processamento em lote de `produtos.json`
- `npm run build:all` -> Build de produção do backend e frontend
