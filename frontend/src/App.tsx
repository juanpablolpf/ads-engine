import { useState, useEffect, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { ProductForm } from "./components/ProductForm";
import { MarketplaceMockup } from "./components/MarketplaceMockup";
import { CopyActionBar } from "./components/CopyActionBar";
import { HistoryDrawer } from "./components/HistoryDrawer";
import {
  fetchHealth,
  fetchTemplates,
  fetchHistory,
  calculateLocalStrategy,
  generateAd
} from "./services/api";
import type {
  ProdutoInput,
  AnuncioResult,
  HistoryItem
} from "./services/api";
import {
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export function App() {
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "checking">("checking");
  const [templates, setTemplates] = useState<ProdutoInput[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Form & Product State
  const [formData, setFormData] = useState<ProdutoInput>({
    nome: "Grelha Inox para Churrasco Modelo Moeda",
    preco: 129.90,
    categoria: "Churrasco",
    material: "Aço Inox 430",
    diferenciais: ["Modelo moeda", "Fácil de limpar", "Alta durabilidade"],
    peso: 1.8,
    plataforma: "ML",
    objetivo: "Destacar durabilidade e facilidade de limpeza"
  });

  // Strategy is computed synchronously in 0ms without network overhead!
  const estrategiaPreview = useMemo(() => {
    return calculateLocalStrategy(formData);
  }, [formData]);

  const [currentAnuncio, setCurrentAnuncio] = useState<AnuncioResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load initial backend data
  useEffect(() => {
    async function init() {
      try {
        const health = await fetchHealth();
        if (health.status === "online") setApiStatus("online");
      } catch {
        setApiStatus("offline");
      }

      try {
        const tpls = await fetchTemplates();
        setTemplates(tpls);
      } catch (err) {
        console.error("Falha ao carregar templates:", err);
      }

      try {
        const hist = await fetchHistory();
        setHistory(hist);
        if (hist.length > 0) {
          setCurrentAnuncio(hist[0].conteudo);
        }
      } catch (err) {
        console.error("Falha ao carregar histórico:", err);
      }
    }
    init();
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await generateAd(formData);
      if (res.success) {
        setCurrentAnuncio(res.anuncio);
        // Refresh history
        const updatedHistory = await fetchHistory();
        setHistory(updatedHistory);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro ao gerar o anúncio.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (tpl: ProdutoInput) => {
    setFormData(tpl);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentAnuncio(item.conteudo);
    setFormData({
      id: item.produtoId,
      nome: item.conteudo.titulo || formData.nome,
      preco: formData.preco,
      categoria: formData.categoria,
      plataforma: formData.plataforma
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <Navbar
        apiStatus={apiStatus}
        templates={templates}
        onSelectTemplate={handleSelectTemplate}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Workspace */}
      <main style={{ flex: 1, maxWidth: 1380, width: "100%", margin: "0 auto", padding: "24px 20px 48px 20px" }}>
        {/* Hero Section Banner */}
        <div style={{
          marginBottom: 24,
          padding: "20px 24px",
          borderRadius: "var(--radius-lg)",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)",
          border: "1px solid var(--border-glow)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span className="badge badge-pro">🎯 MOTOR DE CONVERSÃO</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>•</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Otimizado para Mercado Livre, Shopee e Amazon</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              Crie Anúncios Imbatíveis que Vendem Mais no Piloto Automático
            </h1>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
              <ShieldCheck size={16} color="var(--accent-emerald)" />
              <span>Validação de Verbos & Preço</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
              <Zap size={16} color="var(--accent-amber)" />
              <span>SEO de Alta Frequência</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
              <TrendingUp size={16} color="var(--accent-primary)" />
              <span>Gatilhos de Upsell</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: "rgba(244, 63, 94, 0.15)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            color: "#fca5a5",
            padding: "14px 18px",
            borderRadius: "var(--radius-md)",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <AlertTriangle size={18} />
            <span style={{ fontSize: 14 }}>{errorMsg}</span>
          </div>
        )}

        {/* 2-Column Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24, alignItems: "start" }}>
          {/* Left Column: Form */}
          <div>
            <ProductForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleGenerate}
              isLoading={isLoading}
              estrategiaPreview={estrategiaPreview}
            />
          </div>

          {/* Right Column: Results / Mockup */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {currentAnuncio ? (
              <>
                <CopyActionBar anuncio={currentAnuncio} produto={formData} />
                <MarketplaceMockup
                  anuncio={currentAnuncio}
                  produto={formData}
                  activePlatform={formData.plataforma}
                />
              </>
            ) : (
              <div className="glass-panel" style={{
                padding: 48,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 480,
                gap: 16
              }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: "rgba(99, 102, 241, 0.1)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Sparkles size={32} color="var(--accent-primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, color: "var(--text-primary)", marginBottom: 6 }}>
                    Pronto para Gerar o Anúncio Perfeito
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 420 }}>
                    Preencha os dados do produto ao lado ou escolha um dos <strong>Exemplos Rápidos</strong> acima para visualizar a copy calibrada em tempo real.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  style={{ marginTop: 8 }}
                >
                  <Sparkles size={16} />
                  <span>Gerar Primeiro Anúncio</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistory}
      />
    </div>
  );
}

export default App;
