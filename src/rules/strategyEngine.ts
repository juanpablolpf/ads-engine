import { Produto, Estrategias } from "../types";

export function strategyEngine(produto: Produto): Estrategias {
  const estrategias: Estrategias = {
    beneficios: [],
    freteGratis: false,
    upsell: [],
    banners: []
  };

  if (produto.material?.toLowerCase().includes("inox")) {
    estrategias.beneficios.push(
      "Alta durabilidade",
      "Resistente ao calor"
    );
    estrategias.banners.push("INOX 430 – RESISTENTE AO CALOR");
  }

  const pesoNum = produto.peso !== undefined ? Number(produto.peso) : NaN;
  if (!isNaN(pesoNum) && pesoNum <= 2) {
    estrategias.freteGratis = true;
    estrategias.banners.push(
      "ADICIONE MAIS PRODUTOS E GANHE FRETE GRÁTIS"
    );
  }

  if (produto.nome?.toLowerCase().includes("grelha")) {
    estrategias.upsell.push("Escova para limpeza de grelha");
    estrategias.banners.push("KIT COMPLETO PARA CHURRASCO");
  }

  return estrategias;
}

