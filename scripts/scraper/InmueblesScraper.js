/**
 * Inmuebles24 Scraper - Protocol "Elite"
 * Extrae contactos de trato directo usando el loophole de meta-tags.
 */

const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

chromium.use(stealth);

async function runScraper(targetUrl) {
    console.log('🚀 Iniciando Scraper Elite...');

    const browser = await chromium.launch({
        headless: false, // Cambiar a true para producción
        slowMo: 50
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();
    const results = [];

    try {
        console.log(`📡 Accediendo a: ${targetUrl}`);
        // Usar domcontentloaded para evitar esperas infinitas por trackers
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });

        console.log('⏳ Esperando 5 segundos para que carguen scripts dinámicos...');
        await page.waitForTimeout(5000);

        // Esperar a que carguen las cards
        try {
            await page.waitForSelector('div[data-qa="posting-card"]', { timeout: 30000 });
            console.log('✅ Propiedades detectadas en el DOM.');
        } catch (e) {
            console.error('❌ No se detectaron propiedades. Capturando error...');
            await page.screenshot({ path: path.join(__dirname, 'debug_error.png') });
            const pageTitle = await page.title();
            console.log(`Título de la página detectado: "${pageTitle}"`);
            if (pageTitle.includes('Cloudflare') || pageTitle.includes('Just a moment')) {
                console.error('🚫 Bloqueo de Cloudflare detectado. Se necesita intervención manual o proxies de mayor calidad.');
            }
            throw e;
        }

        // Obtener hrefs de las propiedades
        const propertyLinks = await page.$$eval('div[data-qa="posting-card"] a', anchors => {
            // Filtrar links duplicados y solo quedarse con los de detalle
            const links = anchors.map(a => a.href).filter(href => href.includes('.html'));
            return [...new Set(links)];
        });

        console.log(`✅ Se encontraron ${propertyLinks.length} propiedades. Procesando...`);

        for (let i = 0; i < Math.min(propertyLinks.length, 10); i++) { // Límite de 10 para prueba
            const link = propertyLinks[i];
            console.log(`🔍 Escaneando (${i + 1}/${propertyLinks.length}): ${link}`);

            try {
                const detailPage = await context.newPage();
                await detailPage.goto(link, { waitUntil: 'domcontentloaded' });

                // EXTRAER CONTACTO - ESTRATEGIA ELITE (Loophole de Meta Tags)
                const contactData = await detailPage.evaluate(() => {
                    const metaDesc = document.querySelector('meta[property="og:description"]')?.content || '';
                    const fullDesc = document.querySelector('.posting-description')?.innerText || '';
                    const title = document.title;
                    const price = document.querySelector('.re-price-amount')?.innerText || 'N/A';

                    // Regex para detectar teléfonos (10 dígitos con formatos variados)
                    const phoneRegex = /(?:\+?52\s?)?(?:\(?\d{2,3}\)?[\s\.-]?)?\d{3,4}[\s\.-]?\d{4}/g;
                    const phones = (metaDesc + fullDesc).match(phoneRegex) || [];

                    return {
                        title,
                        price,
                        phones: [...new Set(phones)], // Unificar únicos
                        metaDescSnippet: metaDesc.substring(0, 100)
                    };
                });

                results.push({
                    url: link,
                    ...contactData,
                    scrapedAt: new Date().toISOString()
                });

                await detailPage.close();

                // Espera aleatoria para evitar detección
                await page.waitForTimeout(Math.random() * 3000 + 1000);
            } catch (err) {
                console.error(`❌ Error en propiedad ${link}:`, err.message);
            }
        }

        // Guardar resultados
        const outputPath = path.join(__dirname, 'leads_inmuebles24.json');
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
        console.log(`\n🎉 Scraping completado. ${results.length} leads guardados en: ${outputPath}`);

    } catch (error) {
        console.error('💥 Error crítico en el scraper:', error);
    } finally {
        await browser.close();
    }
}

// URL por defecto (puedes cambiarla o pasarla por argumento)
const DEFAULT_URL = 'https://www.inmuebles24.com/casas-en-venta-en-monterrey-trato-directo.html';
runScraper(DEFAULT_URL);
