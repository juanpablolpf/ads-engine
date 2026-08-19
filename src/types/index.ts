export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: number | string;
  plataforma: "ML" | "SHOPEE" | "AMAZON" | string;
  material?: string;
  diferenciais?: string[];
  peso?: number | string;
  objetivo?: string;
}

export interface Estrategias {
  beneficios: string[];
  freteGratis: boolean;
  upsell: string[];
  banners: string[];
}

export interface AnuncioOutput {
  titulo: string;
  bullets: string[];
  descricao: string;
  seo_oculto: string;
  texto_frete_gratis: string;
  upsell: string;
  sugestao_imagens: string[];
}
