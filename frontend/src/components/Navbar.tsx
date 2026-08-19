import React from "react";
import { Sparkles, History } from "lucide-react";
import type { ProdutoInput } from "../services/api";


interface NavbarProps {
  onOpenHistory: () => void;
  templates: ProdutoInput[];
  onSelectTemplate: (tpl: ProdutoInput) => void;
  historyCount: number;
  apiStatus: "online" | "offline" | "checking";
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  templates,
  onSelectTemplate,
  historyCount,
  apiStatus
}) => {
  return (
    <header style={{
      borderBottom: "1px solid var(--border-subtle)",
      background: "rgba(10, 13, 20, 0.8)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 40,
      padding: "14px 24px"
    }}>
      <div style={{
        maxWidth: 1380,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16
      }}>
        {/* Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}>
                AdsEngine<span style={{ color: "var(--accent-primary)" }}>.pro</span>
              </span>
              <span className="badge badge-pro">PRO SAAS</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
              Geração de Anúncios com IA para Marketplaces
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Status Pill */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 9999,
            fontSize: 12,
            color: "var(--text-secondary)"
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: apiStatus === "online" ? "var(--accent-emerald)" : apiStatus === "checking" ? "var(--accent-amber)" : "var(--accent-rose)",
              boxShadow: apiStatus === "online" ? "0 0 8px #10b981" : "none"
            }} />
            <span>Llama-3.1 Engine</span>
          </div>

          {/* Quick Templates Selector */}
          <div style={{ position: "relative" }}>
            <select
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                padding: "8px 12px",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                outline: "none"
              }}
              defaultValue=""
              onChange={(e) => {
                const found = templates.find((t) => t.id === e.target.value);
                if (found) onSelectTemplate(found);
                e.target.value = "";
              }}
            >
              <option value="" disabled style={{ background: "#101623" }}>
                ⚡ Exemplos Rápidos
              </option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id} style={{ background: "#101623" }}>
                  {tpl.plataforma} • {tpl.nome.slice(0, 30)}...
                </option>
              ))}
            </select>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="btn-secondary"
            style={{ position: "relative" }}
          >
            <History size={16} />
            <span>Histórico</span>
            {historyCount > 0 && (
              <span style={{
                background: "var(--accent-primary)",
                color: "white",
                fontSize: 11,
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: 9999,
                marginLeft: 4
              }}>
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
