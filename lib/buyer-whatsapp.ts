export interface BuyerAttribution {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
}

// Attribution describes the ad; opening WhatsApp is not a confirmed lead.
export function buyerWhatsAppUrl(message: string, attribution: BuyerAttribution = {}) {
  const attributionLines = [
    ["Origen", attribution.utmSource],
    ["Medio", attribution.utmMedium],
    ["Campaña", attribution.utmCampaign],
    ["Anuncio", attribution.utmContent],
  ].flatMap(([label, value]) => value ? [`${label}: ${value.replace(/[\r\n]/g, " ").slice(0, 120)}`] : []);
  const number = (process.env.NEXT_PUBLIC_CIMA_WA || "528121980008").replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent([message, ...attributionLines].join("\n"))}`;
}
