/**
 * CONFIGURACIÓN DE MARCA MAESTRA
 * Modifica este archivo para personalizar la plataforma para nuevos clientes.
 */

export const BRAND_CONFIG = {
    // Identidad Básica
    companyName: "Cima",
    companyType: "Propiedades",
    logo: {
        icon: "Building2", // Lucide icon name
        primaryColor: "#C8A96E", // Oro Cima
        secondaryColor: "#1A1A1A", // Negro Fondo
    },

    // Contenido del Hero (Landing Page)
    hero: {
        title: {
            line1: "Vendemos tu casa",
            line2: "en menos de 30 días.",
            line3: "Garantizado.",
        },
        description: "Comisión desde 6%, se paga al escriturar. Exclusiva de 60 días con dedicación total. Si no vendemos en 30 días, no cobramos.",
        rotatingZones: ["San Pedro", "Monterrey", "Cumbres", "Carretera Nacional"],
    },

    // Datos de Contacto
    contact: {
        whatsapp: "528112345678", // Sin el "+" para el enlace
        whatsappMessage: "Hola, quiero vender mi casa con {companyName}",
        email: "contacto@cimapropiedades.com",
        address: "Monterrey, N.L. México",
    },

    // Estrategia de Negocio
    business: {
        commissionRate: "6%",
        sellingGuaranteeDays: 30,
        exclusiveDays: 60,
    },

    // Redes Sociales
    socials: {
        instagram: "https://instagram.com/cimapropiedades",
        facebook: "https://facebook.com/cimapropiedades",
    }
};
