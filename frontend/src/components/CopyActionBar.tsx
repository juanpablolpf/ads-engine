import React, { useState } from "react";
import { Copy, Check, Mail, Download, Send } from "lucide-react";
import { sendEmail } from "../services/api";
import type { AnuncioResult, ProdutoInput } from "../services/api";


interface CopyActionBarProps {
  anuncio: AnuncioResult;
  produto: ProdutoInput;
}

export const CopyActionBar: React.FC<CopyActionBarProps> = ({ anuncio, produto }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(anuncio, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `anuncio-${produto.nome.slice(0, 20).toLowerCase().replace(/\s+/g, "-")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    setEmailStatus(null);
    try {
      const res = await sendEmail(produto, anuncio, emailInput.trim() || undefined);
      if (res.success) {
        setEmailStatus("✅ E-mail enviado com sucesso!");
        setTimeout(() => {
          setIsEmailModalOpen(false);
          setEmailStatus(null);
        }, 2000);
      } else {
        setEmailStatus(`❌ Erro: ${res.error || "Falha ao enviar"}`);
      }
    } catch (err: any) {
      setEmailStatus(`❌ Erro: ${err.message}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <>
      <div className="glass-panel" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
            ⚡ Ações Rápidas de Seller:
          </span>
          <button
            className="btn-secondary"
            style={{ padding: "6px 12px", fontSize: 12 }}
            onClick={() => copyToClipboard(anuncio.titulo, "title")}
          >
            {copiedKey === "title" ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>Copiar Título</span>
          </button>
          <button
            className="btn-secondary"
            style={{ padding: "6px 12px", fontSize: 12 }}
            onClick={() => copyToClipboard(anuncio.bullets.join("\n"), "bullets")}
          >
            {copiedKey === "bullets" ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>Copiar Bullets</span>
          </button>
          <button
            className="btn-secondary"
            style={{ padding: "6px 12px", fontSize: 12 }}
            onClick={() => copyToClipboard(anuncio.descricao, "desc")}
          >
            {copiedKey === "desc" ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>Copiar Descrição</span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            className="btn-secondary"
            style={{ padding: "6px 12px", fontSize: 12 }}
            onClick={handleDownloadJSON}
          >
            <Download size={14} />
            <span>Baixar JSON</span>
          </button>

          <button
            className="btn-primary"
            style={{ padding: "8px 16px", fontSize: 13 }}
            onClick={() => setIsEmailModalOpen(true)}
          >
            <Mail size={14} />
            <span>Enviar por E-mail</span>
          </button>
        </div>
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          padding: 20
        }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: 440, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mail size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: 18, color: "var(--text-primary)" }}>Disparo por E-mail</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
              Enviaremos o anúncio pronto e formatado com todas as seções para o destinatário informado.
            </p>

            <div className="form-group">
              <label className="form-label">E-mail de Destino</label>
              <input
                type="email"
                className="form-input"
                placeholder="juan.pablo290102@gmail.com (ou deixe em branco para o padrão)"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>

            {emailStatus && (
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: emailStatus.includes("✅") ? "var(--accent-emerald)" : "var(--accent-rose)"
              }}>
                {emailStatus}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsEmailModalOpen(false)}
                disabled={isSendingEmail}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSendEmail}
                disabled={isSendingEmail}
              >
                {isSendingEmail ? "Enviando..." : (
                  <>
                    <Send size={14} />
                    <span>Confirmar Envio</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
