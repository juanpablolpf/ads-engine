import React, { useState } from "react";
import { Sparkles, Plus, X, Info } from "lucide-react";
import type { ProdutoInput, EstrategiasResult } from "../services/api";


interface ProductFormProps {
  formData: ProdutoInput;
  onChange: (updated: ProdutoInput) => void;
  onSubmit: () => void;
  isLoading: boolean;
  estrategiaPreview: EstrategiasResult | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
  estrategiaPreview
}) => {
  const [differentialInput, setDifferentialInput] = useState("");

  const updateField = (field: keyof ProdutoInput, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  const addDifferential = () => {
    const trimmed = differentialInput.trim();
    if (!trimmed) return;
    const current = formData.diferenciais || [];
    if (!current.includes(trimmed)) {
      updateField("diferenciais", [...current, trimmed]);
    }
    setDifferentialInput("");
  };

  const removeDifferential = (index: number) => {
    const current = formData.diferenciais || [];
    updateField(
      "diferenciais",
      current.filter((_, i) => i !== index)
    );
  };

  // Platform title limit helper
  const getCharLimit = () => {
    switch (formData.plataforma) {
      case "ML":
        return 60;
      case "SHOPEE":
        return 120;
      case "AMAZON":
        return 150;
      default:
        return 60;
    }
  };

  const titleLength = formData.nome ? formData.nome.length : 0;
  const limit = getCharLimit();
  const isOverLimit = titleLength > limit;

  return (
    <div className="glass-panel" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 18, color: "var(--text-primary)" }}>⚙️ Dados do Produto</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Preencha os detalhes para a IA calibrar a melhor estratégia de copy
          </p>
        </div>
      </div>

      {/* Marketplace Selector Tabs */}
      <div className="form-group">
        <label className="form-label">
          <span>Marketplace de Destino</span>
          <span style={{ fontSize: 11, color: "var(--text-accent)" }}>Regras específicas de SEO & Copy</span>
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { id: "ML", name: "Mercado Livre", color: "var(--ml-yellow)", badge: "Até 60 carac." },
            { id: "SHOPEE", name: "Shopee", color: "var(--shopee-orange)", badge: "Emojis & Promo" },
            { id: "AMAZON", name: "Amazon", color: "var(--amazon-gold)", badge: "Técnico & Prime" }
          ].map((plat) => {
            const isSelected = formData.plataforma === plat.id;
            return (
              <button
                key={plat.id}
                type="button"
                onClick={() => updateField("plataforma", plat.id)}
                style={{
                  padding: "12px 8px",
                  borderRadius: "var(--radius-md)",
                  border: isSelected ? `2px solid ${plat.color}` : "1px solid var(--border-subtle)",
                  background: isSelected ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.5)",
                  color: isSelected ? "#ffffff" : "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  transition: "var(--transition-normal)"
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 13 }}>{plat.name}</span>
                <span style={{ fontSize: 10, color: isSelected ? plat.color : "var(--text-muted)", fontWeight: 500 }}>
                  {plat.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Name */}
      <div className="form-group">
        <label className="form-label">
          <span>Nome Principal do Produto *</span>
          <span style={{ color: isOverLimit ? "var(--accent-rose)" : "var(--text-muted)", fontSize: 12 }}>
            {titleLength} / {limit} carac. {isOverLimit && "(Recomendado encurtar)"}
          </span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: Grelha Inox para Churrasco Modelo Moeda"
          value={formData.nome || ""}
          onChange={(e) => updateField("nome", e.target.value)}
        />
      </div>

      {/* Price & Category in 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="form-group">
          <label className="form-label">Preço (R$) *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: 129.90"
            value={formData.preco || ""}
            onChange={(e) => updateField("preco", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Categoria *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: Churrasco, Cozinha, etc."
            value={formData.categoria || ""}
            onChange={(e) => updateField("categoria", e.target.value)}
          />
        </div>
      </div>

      {/* Material & Weight in 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="form-group">
          <label className="form-label">Material (opcional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: Aço Inox 430, Nylon 600D..."
            value={formData.material || ""}
            onChange={(e) => updateField("material", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Peso em kg (opcional)</label>
          <input
            type="number"
            step="0.1"
            className="form-input"
            placeholder="Ex: 1.8 (≤2kg ativa frete grátis)"
            value={formData.peso || ""}
            onChange={(e) => updateField("peso", e.target.value)}
          />
        </div>
      </div>

      {/* Differentials with tag manager */}
      <div className="form-group">
        <label className="form-label">Diferenciais e Características</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Digite um diferencial e aperte Enter..."
            value={differentialInput}
            onChange={(e) => setDifferentialInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addDifferential();
              }
            }}
          />
          <button type="button" onClick={addDifferential} className="btn-secondary" style={{ padding: "0 14px" }}>
            <Plus size={16} />
          </button>
        </div>
        {formData.diferenciais && formData.diferenciais.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {formData.diferenciais.map((diff, index) => (
              <span
                key={index}
                style={{
                  background: "rgba(99, 102, 241, 0.15)",
                  color: "#c7d2fe",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                {diff}
                <X
                  size={14}
                  style={{ cursor: "pointer", opacity: 0.7 }}
                  onClick={() => removeDifferential(index)}
                />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Goal / Objective */}
      <div className="form-group">
        <label className="form-label">Objetivo do Anúncio (opcional)</label>
        <input
          type="text"
          className="form-input"
          placeholder="Ex: Venda rápida, queima de estoque, posicionamento premium..."
          value={formData.objetivo || ""}
          onChange={(e) => updateField("objetivo", e.target.value)}
        />
      </div>

      {/* Live Strategy Trigger Pill Box */}
      {estrategiaPreview && (
        <div style={{
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid var(--border-glow)",
          borderRadius: "var(--radius-md)",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 6
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--accent-primary)" }}>
            <Info size={14} />
            <span>Gatilhos Estratégicos Detectados em Tempo Real:</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {estrategiaPreview.freteGratis && (
              <span className="badge badge-success">🚚 Frete Grátis Ativado (≤ 2kg)</span>
            )}
            {estrategiaPreview.beneficios.map((b, i) => (
              <span key={i} className="badge badge-pro">✨ {b}</span>
            ))}
            {estrategiaPreview.upsell.map((u, i) => (
              <span key={i} className="badge badge-warning">💡 Upsell: {u}</span>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        className="btn-primary animate-glow"
        onClick={onSubmit}
        disabled={isLoading || !formData.nome || !formData.preco || !formData.categoria}
        style={{ width: "100%", padding: "14px 20px", marginTop: 6 }}
      >
        {isLoading ? (
          <>
            <span className="animate-spin-slow">✨</span>
            <span>Otimizando Copy com IA (Llama-3.1)...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>Gerar Anúncio de Alta Conversão</span>
          </>
        )}
      </button>
    </div>
  );
};
