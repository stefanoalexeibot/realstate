import { formatPrice } from "./utils";
import type { Property } from "./types";

/**
 * Generates a professional WhatsApp share URL for a property.
 * Includes title, price, and a link to the landing page.
 */
export function getWhatsAppShareUrl(property: Property, origin: string): string {
    const priceStr = formatPrice(property.price);
    const operationLabel = property.operation_type === "renta" ? "/mes" : "";

    const message = `Hola, te comparto la ficha técnica de esta propiedad de *Cima Propiedades*:

🏠 *${property.title}*
📍 ${property.neighborhood}, ${property.city}
💰 *${priceStr}${operationLabel}*

✨ Ver detalles completos aquí:
${origin}/propiedades/${property.slug}`;

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
