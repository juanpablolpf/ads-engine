export function buildPrompt(produto: any, estrategia: any) {

  const regrasPorPlataforma: Record<string, string> = {
    ML: `
- Título com no máximo 60 caracteres
- Palavra principal obrigatoriamente no início
- Não usar emojis
- Linguagem direta e objetiva
- Foco em clareza e busca direta
- SEO oculto com variações reais da palavra principal
`,

    SHOPEE: `
- Título entre 80 e 120 caracteres
- Pode repetir a palavra principal 2 vezes de forma natural
- Pode usar até 2 emojis leves
- Linguagem mais comercial e envolvente
- SEO oculto com termos amplos e populares
`,

    AMAZON: `
- Título entre 100 e 150 caracteres
- Estrutura: Palavra principal + atributo + benefício
- Não usar emojis
- Linguagem mais técnica e descritiva
- Destacar material, peso ou especificações
- SEO oculto com termos mais específicos e técnicos
`
  }

  const regrasPlataforma = regrasPorPlataforma[produto.plataforma] || ""

  return `
Você é um copywriter especialista em marketplaces brasileiros.

Escreva de forma natural, humana e comercial.
Use frases curtas.
Evite estrutura robótica.
Evite parecer texto gerado por IA.

PRINCÍPIOS:
- Priorizar benefícios antes de características.
- Não inventar informações.
- Não exagerar com adjetivos.
- Nunca alterar o preço informado.
- Usar exatamente: R$ ${produto.preco}

PLATAFORMA SELECIONADA: ${produto.plataforma}

REGRAS DA PLATAFORMA:
${regrasPlataforma}

PALAVRA PRINCIPAL:
Use obrigatoriamente "${produto.nome}" no título.
Pode repetir na descrição de forma natural.

DADOS DO PRODUTO:
Nome: ${produto.nome}
Categoria: ${produto.categoria}
Material: ${produto.material ?? "Não informado"}
Diferenciais: ${produto.diferenciais?.join(', ') ?? "Não informado"}
Peso: ${produto.peso ?? "Não informado"}kg
Preço: R$ ${produto.preco}

ESTRATÉGIAS ATIVAS:
Benefícios: ${estrategia.beneficios.join(', ')}
Frete grátis: ${estrategia.freteGratis ? 'Sim' : 'Não'}
Upsell: ${estrategia.upsell.join(', ')}

REGRAS DE ESTRUTURA:

TÍTULO:
- Claro e específico
- Focado na busca
- Sem exageros

BULLETS:
- No máximo 4
- Começar com verbo no infinitivo
- Até 15 palavras
- Foco em benefício prático

DESCRIÇÃO:
- Máximo 3 parágrafos curtos
- Fácil leitura no celular
- Benefício primeiro, detalhe depois
- Não começar com "Este produto"

SEO_OCULTO:
- Entre 6 e 10 palavras-chave
- Separadas por vírgula
- Não repetir frases idênticas

UPSELL:
- Só preencher se houver complemento real
- Máximo 2 linhas
- Natural, sem parecer forçado

IMPORTANTE:
- Retorne APENAS JSON válido
- Não usar markdown
- Não explicar nada
- Não escrever texto fora do JSON
- Nunca remover chaves
- Se não aplicável, usar ""

SAÍDA OBRIGATÓRIA:

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
