import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TO    = process.env.CIMA_NOTIFICATION_EMAIL ?? "";
const FROM  = "Cima Propiedades <notificaciones@cimapropiedades.mx>";

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

export async function notifyNewLead(data: {
  name: string; phone: string; email?: string | null;
  neighborhood?: string | null; operation_type?: string;
  estimated_price?: number | null; message?: string | null;
}) {
  if (!resend || !TO) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `🏠 Nuevo lead: ${data.name} (${data.operation_type ?? "venta"})`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#090A0D;color:#E2D9C9;padding:32px;border-radius:12px;">
          <div style="margin-bottom:24px;">
            <p style="color:#C8A96E;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 4px;">Cima Propiedades</p>
            <h1 style="font-size:22px;margin:0;color:#FFFFFF;">Nuevo propietario interesado</h1>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#999;font-size:13px;width:130px;">Nombre</td><td style="padding:8px 0;font-size:13px;font-weight:600;">${data.name}</td></tr>
            <tr><td style="padding:8px 0;color:#999;font-size:13px;">Teléfono</td><td style="padding:8px 0;font-size:13px;">${data.phone}</td></tr>
            ${data.email ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Email</td><td style="padding:8px 0;font-size:13px;">${data.email}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#999;font-size:13px;">Operación</td><td style="padding:8px 0;font-size:13px;text-transform:capitalize;">${data.operation_type ?? "venta"}</td></tr>
            ${data.neighborhood ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Colonia</td><td style="padding:8px 0;font-size:13px;">${data.neighborhood}</td></tr>` : ""}
            ${data.estimated_price ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Precio estimado</td><td style="padding:8px 0;font-size:13px;color:#C8A96E;font-weight:600;">${formatPrice(data.estimated_price)}</td></tr>` : ""}
            ${data.message ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Mensaje</td><td style="padding:8px 0;font-size:13px;">${data.message}</td></tr>` : ""}
          </table>
          <div style="margin-top:24px;">
            <a href="https://wa.me/52${data.phone.replace(/\D/g,"")}?text=Hola+${encodeURIComponent(data.name)},+te+contactamos+de+Cima+Propiedades"
               style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      `,
    });
  } catch {
    // Notifications are non-critical — never throw
  }
}

export async function notifyNewVisit(data: {
  name: string; phone: string; email?: string | null;
  propertyTitle: string; preferred_date?: string | null; message?: string | null;
}) {
  if (!resend || !TO) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `📅 Visita solicitada: ${data.propertyTitle}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#090A0D;color:#E2D9C9;padding:32px;border-radius:12px;">
          <div style="margin-bottom:24px;">
            <p style="color:#C8A96E;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 4px;">Cima Propiedades</p>
            <h1 style="font-size:22px;margin:0;color:#FFFFFF;">Solicitud de visita</h1>
          </div>
          <div style="background:#13151A;border-radius:8px;padding:12px 16px;margin-bottom:16px;">
            <p style="margin:0;font-size:12px;color:#999;">Propiedad</p>
            <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#C8A96E;">${data.propertyTitle}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#999;font-size:13px;width:130px;">Nombre</td><td style="padding:8px 0;font-size:13px;font-weight:600;">${data.name}</td></tr>
            <tr><td style="padding:8px 0;color:#999;font-size:13px;">Teléfono</td><td style="padding:8px 0;font-size:13px;">${data.phone}</td></tr>
            ${data.email ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Email</td><td style="padding:8px 0;font-size:13px;">${data.email}</td></tr>` : ""}
            ${data.preferred_date ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Fecha preferida</td><td style="padding:8px 0;font-size:13px;">${data.preferred_date}</td></tr>` : ""}
            ${data.message ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Mensaje</td><td style="padding:8px 0;font-size:13px;">${data.message}</td></tr>` : ""}
          </table>
          <div style="margin-top:24px;">
            <a href="https://wa.me/52${data.phone.replace(/\D/g,"")}?text=Hola+${encodeURIComponent(data.name)},+te+contactamos+de+Cima+para+confirmar+tu+visita"
               style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">
              Confirmar por WhatsApp
            </a>
          </div>
        </div>
      `,
    });
  } catch {
    // Notifications are non-critical — never throw
  }
}
