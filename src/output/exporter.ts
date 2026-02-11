import fs from 'fs'

export function exportAd(produtoId: string, conteudo: any) {
  fs.writeFileSync(
    `./output/anuncio-${produtoId}.json`,
    JSON.stringify(conteudo, null, 2)
  )
}
