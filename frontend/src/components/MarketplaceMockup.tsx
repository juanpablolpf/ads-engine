import React, { useState } from "react";
import {
  Zap,
  Copy,
  Check,
  Code2
} from "lucide-react";
import type { AnuncioResult, ProdutoInput } from "../services/api";


interface MarketplaceMockupProps {
  anuncio: AnuncioResult;
  produto: ProdutoInput;
  activePlatform: string;
}

export const MarketplaceMockup: React.FC<MarketplaceMockupProps> = ({
  anuncio,
  produto,
  activePlatform
}) => {
  const [selectedTab, setSelectedTab] = useState<"ML" | "SHOPEE" | "AMAZON" | "JSON">(
    (activePlatform.toUpperCase() as any) || "ML"
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const precoNumerico = typeof produto.preco === "number" ? produto.preco : parseFloat(String(produto.preco).replace(",", ".")) || 99.90;
  const precoFormatado = precoNumerico.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parcelas = (precoNumerico / 10).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="glass-panel" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Top Marketplace View Switcher */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "rgba(10, 13, 20, 0.9)",
        borderBottom: "1px solid var(--border-subtle)",
        flexWrap: "wrap",
        gap: 8
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
            Visualizar Como:
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              onClick={() => setSelectedTab("ML")}
              style={{
                background: selectedTab === "ML" ? "#ffe600" : "rgba(255, 255, 255, 0.05)",
                color: selectedTab === "ML" ? "#111827" : "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "var(--transition-normal)"
              }}
            >
              🟡 Mercado Livre
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("SHOPEE")}
              style={{
                background: selectedTab === "SHOPEE" ? "#ee4d2d" : "rgba(255, 255, 255, 0.05)",
                color: selectedTab === "SHOPEE" ? "#ffffff" : "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "var(--transition-normal)"
              }}
            >
              🟠 Shopee
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("AMAZON")}
              style={{
                background: selectedTab === "AMAZON" ? "#ff9900" : "rgba(255, 255, 255, 0.05)",
                color: selectedTab === "AMAZON" ? "#111827" : "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "var(--transition-normal)"
              }}
            >
              ⚡ Amazon
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("JSON")}
              style={{
                background: selectedTab === "JSON" ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.05)",
                color: selectedTab === "JSON" ? "#ffffff" : "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "var(--transition-normal)"
              }}
            >
              <Code2 size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
              JSON Puro
            </button>
          </div>
        </div>

        <button
          className="btn-secondary"
          style={{ padding: "6px 12px", fontSize: 12 }}
          onClick={() =>
            handleCopy(
              `${anuncio.titulo}\n\n${anuncio.bullets.join("\n")}\n\n${anuncio.descricao}`,
              "full"
            )
          }
        >
          {copiedKey === "full" ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          <span>{copiedKey === "full" ? "Copiado!" : "Copiar Tudo"}</span>
        </button>
      </div>

      {/* Mockup Container */}
      <div style={{ padding: 24, flex: 1, overflowY: "auto", maxHeight: 680 }}>
        {/* ==================== MERCADO LIVRE MOCKUP ==================== */}
        {selectedTab === "ML" && (
          <div style={{
            background: "#ffffff",
            color: "#333333",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            fontFamily: "Arial, sans-serif"
          }}>
            {/* Header / Breadcrumbs */}
            <div style={{ fontSize: 12, color: "#666", marginBottom: 12, display: "flex", gap: 6 }}>
              <span>Início</span> &gt; <span>{produto.categoria}</span> &gt; <strong style={{ color: "#333" }}>{produto.nome}</strong>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 24 }}>
              {/* Product Visual Frame */}
              <div>
                <div style={{
                  aspectRatio: "1/1",
                  background: "#f4f4f4",
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #e5e5e5",
                  position: "relative",
                  padding: 16,
                  textAlign: "center"
                }}>
                  <span style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "#ff7733",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: "bold",
                    padding: "2px 6px",
                    borderRadius: 4
                  }}>
                    MAIS VENDIDO
                  </span>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>📦</div>
                  <span style={{ fontSize: 13, color: "#555", fontWeight: "bold" }}>{produto.nome}</span>
                  <span style={{ fontSize: 11, color: "#888" }}>{produto.material || "Modelo Premium"}</span>
                </div>

                {anuncio.sugestao_imagens && anuncio.sugestao_imagens.length > 0 && (
                  <div style={{ marginTop: 12, background: "#f8fafc", padding: 10, borderRadius: 6, border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>📸 Sugestão de Fotos da IA:</span>
                    <ul style={{ margin: "4px 0 0 16px", padding: 0, fontSize: 11, color: "#64748b" }}>
                      {anuncio.sugestao_imagens.map((img, i) => (
                        <li key={i}>{img}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Product Buy Column */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#999" }}>Novo | +1.000 vendidos</span>
                  <span style={{ color: "#3483fa", fontSize: 12 }}>★★★★★ (4.9)</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <h1 style={{ fontSize: 20, fontWeight: 600, color: "#333333", lineHeight: 1.3, margin: "4px 0 8px 0" }}>
                    {anuncio.titulo}
                  </h1>
                  <button
                    onClick={() => handleCopy(anuncio.titulo, "title-ml")}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#3483fa" }}
                    title="Copiar Título"
                  >
                    {copiedKey === "title-ml" ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                {/* Price Box */}
                <div style={{ margin: "12px 0" }}>
                  <div style={{ fontSize: 32, fontWeight: 300, color: "#333" }}>
                    R$ <span style={{ fontWeight: 600 }}>{precoFormatado}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#00a650", fontWeight: "bold" }}>
                    em 10x de R$ {parcelas} sem juros
                  </div>
                </div>

                {/* Shipping Badge */}
                <div style={{
                  background: "#e6f7ee",
                  color: "#00a650",
                  padding: "8px 12px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14
                }}>
                  <Zap size={16} color="#00a650" />
                  <span>{anuncio.texto_frete_gratis || "Chegará grátis amanhã com FULL"}</span>
                </div>

                {/* Bullets Highlight */}
                <div style={{ borderTop: "1px solid #eee", paddingTop: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: "bold", color: "#333" }}>O que você precisa saber sobre este produto:</span>
                  <ul style={{ margin: "8px 0 0 16px", padding: 0, fontSize: 13, color: "#444" }}>
                    {anuncio.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* Buy Button Mockup */}
                <button
                  type="button"
                  style={{
                    width: "100%",
                    background: "#3483fa",
                    color: "#fff",
                    border: "none",
                    padding: "14px",
                    borderRadius: 6,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "default"
                  }}
                >
                  Comprar agora
                </button>
              </div>
            </div>

            {/* Description Section */}
            <div style={{ borderTop: "1px solid #eee", marginTop: 24, paddingTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ fontSize: 18, color: "#333", margin: 0 }}>Descrição do Anúncio</h3>
                <button
                  onClick={() => handleCopy(anuncio.descricao, "desc-ml")}
                  style={{ background: "#f5f5f5", border: "1px solid #ddd", borderRadius: 4, padding: "4px 8px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  {copiedKey === "desc-ml" ? <Check size={14} color="#00a650" /> : <Copy size={14} />}
                  <span>{copiedKey === "desc-ml" ? "Copiado" : "Copiar Descrição"}</span>
                </button>
              </div>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {anuncio.descricao}
              </p>
            </div>

            {/* Hidden SEO Section */}
            {anuncio.seo_oculto && (
              <div style={{ marginTop: 20, background: "#f8fafc", padding: 12, borderRadius: 6, border: "1px dashed #cbd5e1" }}>
                <strong style={{ fontSize: 12, color: "#475569" }}>🔍 Termos SEO Ocultos / Tags de Busca:</strong>
                <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#64748b" }}>{anuncio.seo_oculto}</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== SHOPEE MOCKUP ==================== */}
        {selectedTab === "SHOPEE" && (
          <div style={{
            background: "#ffffff",
            color: "#222222",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            fontFamily: "Arial, sans-serif"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 24 }}>
              <div>
                <div style={{
                  aspectRatio: "1/1",
                  background: "#fff1ee",
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ffd8d0",
                  textAlign: "center",
                  padding: 16
                }}>
                  <span style={{ background: "#ee4d2d", color: "#fff", padding: "2px 8px", borderRadius: 2, fontSize: 11, fontWeight: "bold", marginBottom: 8 }}>
                    SHOPEE OFICIAL
                  </span>
                  <div style={{ fontSize: 50, margin: "8px 0" }}>🔥</div>
                  <span style={{ fontSize: 13, fontWeight: "bold", color: "#ee4d2d" }}>{produto.nome}</span>
                </div>

                {anuncio.upsell && (
                  <div style={{ marginTop: 12, background: "#fff7ed", border: "1px solid #ffedd5", padding: 12, borderRadius: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: "bold", color: "#c2410c" }}>🎁 Oferta de Upsell:</span>
                    <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#9a3412" }}>{anuncio.upsell}</p>
                  </div>
                )}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <span style={{ background: "#ee4d2d", color: "#fff", fontSize: 10, fontWeight: "bold", padding: "1px 4px", borderRadius: 2 }}>
                    Indicado
                  </span>
                  <h1 style={{ fontSize: 18, fontWeight: 500, color: "#222", margin: 0, lineHeight: 1.4 }}>
                    {anuncio.titulo}
                  </h1>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#ee4d2d", margin: "8px 0" }}>
                  <span>⭐ 4.9 (842 avaliações)</span>
                  <span style={{ color: "#777" }}>• 2.3k Vendidos</span>
                </div>

                {/* Shopee Price Bar */}
                <div style={{ background: "#fafafa", padding: "12px 16px", borderRadius: 4, margin: "12px 0" }}>
                  <div style={{ fontSize: 28, fontWeight: "bold", color: "#ee4d2d" }}>
                    R$ {precoFormatado}
                  </div>
                  <div style={{ fontSize: 12, color: "#26aa99", marginTop: 4 }}>
                    🎟️ Cupom de R$ 10 OFF disponível
                  </div>
                </div>

                {/* Bullets Highlight */}
                <div style={{ margin: "12px 0" }}>
                  <span style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>Destaques do Produto:</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
                    {anuncio.bullets.map((b, i) => (
                      <div key={i} style={{ fontSize: 13, color: "#333", display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ color: "#ee4d2d" }}>✓</span> {b}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  style={{
                    width: "100%",
                    background: "#ee4d2d",
                    color: "#fff",
                    border: "none",
                    padding: "12px",
                    borderRadius: 4,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "default"
                  }}
                >
                  Comprar com Cupom
                </button>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #f2f2f2", marginTop: 20, paddingTop: 16 }}>
              <h3 style={{ fontSize: 16, color: "#222", marginBottom: 8 }}>Descrição do Produto</h3>
              <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {anuncio.descricao}
              </p>
            </div>
          </div>
        )}

        {/* ==================== AMAZON MOCKUP ==================== */}
        {selectedTab === "AMAZON" && (
          <div style={{
            background: "#ffffff",
            color: "#0f1111",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            fontFamily: "Arial, sans-serif"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 0.9fr", gap: 20 }}>
              {/* Product Visual */}
              <div>
                <div style={{
                  aspectRatio: "1/1",
                  background: "#ffffff",
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #e7e7e7",
                  textAlign: "center",
                  padding: 16
                }}>
                  <div style={{ fontSize: 50 }}>📦</div>
                  <span style={{ fontSize: 13, fontWeight: "bold", marginTop: 8 }}>{produto.nome}</span>
                </div>
              </div>

              {/* Middle Product Details */}
              <div>
                <h1 style={{ fontSize: 19, fontWeight: 500, color: "#0f1111", lineHeight: 1.35, margin: "0 0 6px 0" }}>
                  {anuncio.titulo}
                </h1>
                <div style={{ fontSize: 13, color: "#007185", marginBottom: 12 }}>
                  Marca: <span style={{ textDecoration: "underline" }}>Genérica Premium</span>
                </div>

                <div style={{ fontSize: 13, color: "#de7921", marginBottom: 8 }}>
                  ★★★★☆ 4.8 de 5 estrelas (489)
                </div>

                <div style={{ borderTop: "1px solid #e7e7e7", paddingTop: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 26, fontWeight: 400, color: "#0f1111" }}>
                    <span style={{ fontSize: 14, verticalAlign: "super" }}>R$</span>
                    {precoFormatado}
                  </div>
                  <div style={{ fontSize: 13, color: "#007185", fontWeight: "bold", display: "flex", alignItems: "center", gap: 4 }}>
                    <Zap size={14} color="#ff9900" />
                    <span>Prime • Entrega GRÁTIS</span>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #e7e7e7", paddingTop: 12 }}>
                  <strong style={{ fontSize: 14, color: "#0f1111", display: "block", marginBottom: 8 }}>Sobre este item:</strong>
                  <ul style={{ margin: "0 0 0 16px", padding: 0, fontSize: 13, color: "#333", lineHeight: 1.5 }}>
                    {anuncio.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Buy Box Box */}
              <div style={{
                border: "1px solid #d5d9d9",
                borderRadius: 8,
                padding: 16,
                background: "#fafafa",
                height: "fit-content"
              }}>
                <div style={{ fontSize: 20, color: "#b12704", fontWeight: "bold", marginBottom: 8 }}>
                  R$ {precoFormatado}
                </div>
                <div style={{ fontSize: 12, color: "#007185", marginBottom: 12 }}>
                  Entrega GRÁTIS: <strong>Amanhã</strong>
                </div>
                <div style={{ fontSize: 14, color: "#007600", fontWeight: "bold", marginBottom: 16 }}>
                  Em estoque
                </div>

                <button
                  type="button"
                  style={{
                    width: "100%",
                    background: "#ffd814",
                    borderColor: "#fcd200",
                    borderRadius: 20,
                    padding: "10px",
                    fontWeight: 600,
                    fontSize: 13,
                    marginBottom: 8,
                    cursor: "default",
                    border: "1px solid"
                  }}
                >
                  Adicionar ao carrinho
                </button>
                <button
                  type="button"
                  style={{
                    width: "100%",
                    background: "#ffa41c",
                    borderColor: "#ff8f00",
                    borderRadius: 20,
                    padding: "10px",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "default",
                    border: "1px solid"
                  }}
                >
                  Comprar agora
                </button>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #e7e7e7", marginTop: 24, paddingTop: 16 }}>
              <h3 style={{ fontSize: 16, color: "#0f1111", marginBottom: 8 }}>Descrição do produto</h3>
              <p style={{ fontSize: 13, color: "#333", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {anuncio.descricao}
              </p>
            </div>
          </div>
        )}

        {/* ==================== JSON VIEW ==================== */}
        {selectedTab === "JSON" && (
          <pre style={{
            background: "#0f172a",
            color: "#38bdf8",
            padding: 20,
            borderRadius: 8,
            overflowX: "auto",
            fontSize: 13,
            lineHeight: 1.6,
            fontFamily: "monospace"
          }}>
            {JSON.stringify(anuncio, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
