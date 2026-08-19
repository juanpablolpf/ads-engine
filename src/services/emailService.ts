import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";
import { Produto, AnuncioOutput } from "../types";

export async function sendAdEmail(
  produto: Produto,
  anuncio: AnuncioOutput,
  targetEmail?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: "RESEND_API_KEY não configurada no servidor."
    };
  }

  const recipient = targetEmail || process.env.NOTIFICATION_EMAIL || "juan.pablo290102@gmail.com";

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: recipient,
      subject: `🚀 Seu anúncio para ${produto.nome} está pronto!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; border-radius: 12px 12px 0 0; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">🚀 AdsEngine Pro</h1>
            <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Seu anúncio otimizado por IA</p>
          </div>

          <div style="background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #4f46e5;">
              <h2 style="margin: 0 0 8px 0; font-size: 18px; color: #0f172a;">📦 ${produto.nome}</h2>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Preço:</strong> R$ ${typeof produto.preco === "number" ? produto.preco.toFixed(2) : produto.preco}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Categoria:</strong> ${produto.categoria}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Plataforma:</strong> ${produto.plataforma}</p>
            </div>

            <h3 style="color: #0f172a; font-size: 16px; margin-bottom: 8px;">📌 Título Otimizado</h3>
            <p style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-weight: bold; color: #1e293b; margin-top: 0;">${anuncio.titulo}</p>

            <h3 style="color: #0f172a; font-size: 16px; margin-bottom: 8px;">✨ Bullet Points de Benefícios</h3>
            <ul style="padding-left: 20px; margin-top: 0;">
              ${anuncio.bullets.map((b) => `<li style="margin-bottom: 6px;">${b}</li>`).join("")}
            </ul>

            <h3 style="color: #0f172a; font-size: 16px; margin-bottom: 8px;">📝 Descrição do Anúncio</h3>
            <div style="background: #f8fafc; padding: 14px; border-radius: 6px; white-space: pre-wrap; font-size: 14px;">${anuncio.descricao}</div>

            ${
              anuncio.seo_oculto
                ? `
              <h3 style="color: #0f172a; font-size: 16px; margin: 16px 0 8px 0;">🔍 Palavras-chave SEO</h3>
              <p style="color: #64748b; font-size: 13px; margin: 0;">${anuncio.seo_oculto}</p>
            `
                : ""
            }

            ${
              anuncio.upsell
                ? `
              <div style="margin-top: 20px; background: #fef3c7; border: 1px solid #fde68a; padding: 14px; border-radius: 8px; color: #92400e;">
                <strong>💡 Oportunidade de Upsell:</strong> ${anuncio.upsell}
              </div>
            `
                : ""
            }

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="text-align: center; color: #94a3b8; font-size: 12px; margin: 0;">Gerado por AdsEngine Pro • Inteligência Artificial para Marketplaces</p>
          </div>
        </div>
      `
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro ao disparar e-mail" };
  }
}
