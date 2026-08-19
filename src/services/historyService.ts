import fs from "fs";
import path from "path";
import { AnuncioOutput } from "../types";

export interface HistoryItem {
  id: string;
  fileName: string;
  produtoId: string;
  timestamp: number;
  dataCriacao: string;
  conteudo: AnuncioOutput;
}

export function getHistory(): HistoryItem[] {
  const outputDir = "./output";
  if (!fs.existsSync(outputDir)) {
    return [];
  }

  const files = fs.readdirSync(outputDir).filter((file) => file.endsWith(".json"));
  const items: HistoryItem[] = [];

  for (const file of files) {
    try {
      const fullPath = path.join(outputDir, file);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const conteudo: AnuncioOutput = JSON.parse(raw);

      // filename format: anuncio-{produtoId}-{timestamp}.json or anuncio-{produtoId}.json
      const parts = file.replace(".json", "").split("-");
      const timestamp = parts.length >= 3 ? Number(parts[parts.length - 1]) : fs.statSync(fullPath).mtimeMs;
      const produtoId = parts.length >= 2 ? parts[1] : "001";

      items.push({
        id: file,
        fileName: file,
        produtoId,
        timestamp: isNaN(timestamp) ? Date.now() : timestamp,
        dataCriacao: new Date(isNaN(timestamp) ? Date.now() : timestamp).toLocaleString("pt-BR"),
        conteudo
      });
    } catch {
      // ignore invalid json files
    }
  }

  // Sort descending by timestamp
  return items.sort((a, b) => b.timestamp - a.timestamp);
}
