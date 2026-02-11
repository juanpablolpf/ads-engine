export function buildPrompt(produto: any, estrategia: any) {
  const regrasPlataforma =
    produto.plataforma === 'Shopee'
      ? `
- Título longo
- Linguagem comercial
- Emojis moderados
`
      : `
- Título até 60 caracteres
- Sem emojis
- Linguagem objetiva
`

  return `
Você é um especialista em anúncios para marketplaces.

Plataforma: ${produto.plataforma}

REGRAS DA PLATAFORMA:
${regrasPlataforma}

DADOS DO PRODUTO:
Nome: ${produto.nome}
Categoria: ${produto.categoria}
Material: ${produto.material}
Diferenciais: ${produto.diferenciais.join(', ')}
Preço: R$ ${produto.preco}
Peso: ${produto.peso}kg

ESTRATÉGIAS ATIVAS:
Benefícios: ${estrategia.beneficios.join(', ')}
Frete grátis: ${estrategia.freteGratis ? 'Sim' : 'Não'}
Upsell: ${estrategia.upsell.join(', ')}

SAÍDA OBRIGATÓRIA EM JSON:
{
  "titulo": "",
  "bullets": [],
  "descricao": "",
  "seo_oculto": "",
  "texto_frete_gratis": "",
  "upsell": "",
  "sugestao_imagens": []
}
`
}
