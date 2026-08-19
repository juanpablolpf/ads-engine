import React, { useState } from "react";
import { History, X, Search, FileText, Calendar, ArrowRight } from "lucide-react";
import type { HistoryItem } from "../services/api";


interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filtered = history.filter((item) => {
    const title = item.conteudo.titulo?.toLowerCase() || "";
    const file = item.fileName.toLowerCase();
    const query = searchTerm.toLowerCase();
    return title.includes(query) || file.includes(query);
  });

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(6px)",
      zIndex: 100,
      display: "flex",
      justifyContent: "flex-end"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 480,
        height: "100%",
        background: "var(--bg-surface)",
        borderLeft: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-10px 0 30px rgba(0,0,0,0.7)"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <History size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: 18, color: "var(--text-primary)" }}>Histórico de Anúncios</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 36 }}
              placeholder="Buscar por título ou arquivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
              <FileText size={40} style={{ opacity: 0.3, margin: "0 auto 12px auto" }} />
              <p style={{ fontSize: 14 }}>Nenhum anúncio encontrado no histórico.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="glass-panel-interactive"
                style={{ padding: 16, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}
                onClick={() => {
                  onSelectHistory(item);
                  onClose();
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} />
                    {item.dataCriacao}
                  </span>
                  <span className="badge badge-pro">Salvo</span>
                </div>

                <h4 style={{ fontSize: 14, color: "var(--text-primary)", margin: 0, lineHeight: 1.4 }}>
                  {item.conteudo.titulo || "Anúncio sem título"}
                </h4>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>
                    {item.fileName}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--accent-primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: 2 }}>
                    Carregar <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
