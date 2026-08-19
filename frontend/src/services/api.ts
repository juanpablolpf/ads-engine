export interface ProdutoInput {
  id?: string;
  nome: string;
  categoria: string;
  preco: number | string;
  plataforma: "ML" | "SHOPEE" | "AMAZON" | string;
  material?: string;
  diferenciais?: string[];
  peso?: number | string;
  objetivo?: string;
}

export interface EstrategiasResult {
  beneficios: string[];
  freteGratis: boolean;
  upsell: string[];
  banners: string[];
}

export interface AnuncioResult {
  titulo: string;
  bullets: string[];
  descricao: string;
  seo_oculto: string;
  texto_frete_gratis: string;
  upsell: string;
  sugestao_imagens: string[];
}

export interface GenerateResponse {
  success: boolean;
  produto: ProdutoInput;
  estrategia: EstrategiasResult;
  anuncio: AnuncioResult;
  savedFile?: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  fileName: string;
  produtoId: string;
  timestamp: number;
  dataCriacao: string;
  conteudo: AnuncioResult;
}

const API_BASE = "/api";

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchTemplates(): Promise<ProdutoInput[]> {
  const res = await fetch(`${API_BASE}/templates`);
  const data = await res.json();
  return data.templates || [];
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE}/history`);
  const data = await res.json();
  return data.history || [];
}

export async function fetchStrategyPreview(produto: ProdutoInput): Promise<EstrategiasResult> {
  const res = await fetch(`${API_BASE}/strategy-preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produto)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.estrategia;
}

export async function generateAd(produto: ProdutoInput): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(produto)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Falha ao gerar anúncio.");
  }
  return data;
}

export async function sendEmail(
  produto: ProdutoInput,
  anuncio: AnuncioResult,
  email?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ produto, anuncio, email })
  });
  return res.json();
}

export function calculateLocalStrategy(produto: ProdutoInput): EstrategiasResult {
  const estrategias: EstrategiasResult = {
    beneficios: [],
    freteGratis: false,
    upsell: [],
    banners: []
  };

  if (produto.material?.toLowerCase().includes("inox")) {
    estrategias.beneficios.push("Alta durabilidade", "Resistente ao calor");
    estrategias.banners.push("INOX 430 – RESISTENTE AO CALOR");
  }

  const pesoNum = produto.peso !== undefined && produto.peso !== "" ? Number(produto.peso) : NaN;
  if (!isNaN(pesoNum) && pesoNum <= 2) {
    estrategias.freteGratis = true;
    estrategias.banners.push("ADICIONE MAIS PRODUTOS E GANHE FRETE GRÁTIS");
  }

  if (produto.nome?.toLowerCase().includes("grelha")) {
    estrategias.upsell.push("Escova para limpeza de grelha");
    estrategias.banners.push("KIT COMPLETO PARA CHURRASCO");
  }

  return estrategias;
}

