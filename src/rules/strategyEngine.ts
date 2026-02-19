type Estrategias = {
  beneficios: string[]
  freteGratis: boolean
  upsell: string[]
  banners: string[]
}

export function strategyEngine(produto: any): Estrategias {
  const estrategias: Estrategias = {
    beneficios: [],
    freteGratis: false,
    upsell: [],
    banners: []
  }

  if (produto.material?.toLowerCase().includes("inox")) {
    estrategias.beneficios.push(
      "Alta durabilidade",
      "Resistente ao calor"
    )
    estrategias.banners.push("INOX 430 – RESISTENTE AO CALOR")
  }

  if (produto.peso <= 2) {
    estrategias.freteGratis = true
    estrategias.banners.push(
      "ADICIONE MAIS PRODUTOS E GANHE FRETE GRÁTIS"
    )
  }

  if (produto.nome.toLowerCase().includes("grelha")) {
    estrategias.upsell.push("Escova para limpeza de grelha")
    estrategias.banners.push("KIT COMPLETO PARA CHURRASCO")
  }

  return estrategias
}
