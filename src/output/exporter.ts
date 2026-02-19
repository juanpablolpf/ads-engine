import fs from 'fs'

export function exportAd(produtoId: string, conteudo: any) {
  const timestamp = Date.now()

  const fileName = `anuncio-${produtoId}-${timestamp}.json`

  fs.writeFileSync(
    `./output/${fileName}`,
    JSON.stringify(conteudo, null, 2)
  )

  console.log(`📁 Arquivo salvo: ${fileName}`)
}

