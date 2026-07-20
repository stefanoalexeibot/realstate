# ETAPA 6 — FACEBOOK/META ADS MASTER SYSTEM
> Dueño: Media Buyer Meta · Presupuesto inicial: $30,000 MXN/mes → escala a $120,000 (README §3)
> ⚠️ REGLA LEGAL CRÍTICA: los anuncios de venta de inmuebles entran en la **categoría especial de anuncios de VIVIENDA** de Meta. Segmentación limitada (sin edad/género fino, radios amplios, sin lookalikes clásicos en housing según región). Verificar categoría en cada campaña. El copy compensa lo que la segmentación no puede hacer: **el anuncio se auto-segmenta por el dolor que nombra.**

---

## 1. FUNDAMENTOS TÉCNICOS (setup, semana 1)

### Checklist de configuración
- [ ] Business Manager propio (nunca de agencia externa) con 2 admins y verificación de negocio
- [ ] Dominio verificado (cimapropiedades.mx) en Brand Safety
- [ ] Pixel instalado en todas las landings (E8) vía GTM
- [ ] **Conversions API** activa (server-side, vía stack E11) — con iOS/ATT, sin CAPI se pierde 20-40% de señal
- [ ] Eventos configurados y priorizados: `Lead` (formulario enviado), `Schedule` (cita agendada — evento de MÁXIMA calidad), `Contact` (clic a WhatsApp), `ViewContent` (landing vista), evento custom `ExclusivaFirmada` (subido offline desde Cima Pro para optimización por valor real)
- [ ] Cuenta publicitaria con método de pago respaldo (las cuentas de real estate sufren revisiones)
- [ ] Página de FB e IG con contenido activo ANTES de lanzar (E5) — la página vacía mata la confianza y el CTR
- [ ] WhatsApp Business API conectado a la página

### Naming convention (obligatoria)
```
Campaña:  [OBJ]-[CLUSTER/PERSONA]-[OFERTA]-[FECHA]     ej: LEADS-P27-DIAGNOSTICO-2026-07
Conjunto: [AUDIENCIA]-[ZONA]                            ej: AMPLIO-MTY25KM
Anuncio:  [HOOK#]-[FORMATO]-[VERSION]                   ej: H03-REEL45-V2
```
Sin esto, los dashboards (E13) no pueden cruzar persona × creativo × CPL.

---

## 2. AUDIENCIAS (bajo categoría vivienda)

| Tipo | Definición | Uso |
|------|-----------|-----|
| **Amplia geográfica** | MTY + área metro (radio permitido por categoría especial) | Prospección principal — Advantage+ con creativo segmentador |
| **Custom: visitantes web** | Pixel 180 días, por landing (dolor) | Remarketing por dolor específico |
| **Custom: interacción** | IG/FB engagers 365d, video viewers >50% | Remarketing tibio (más barato que web) |
| **Custom: base CRM** | Leads Cima Pro (sync E11); segmentos: no-contactados, citas no-show, "no por ahora" | Reactivación |
| **Exclusiones** | Clientes cerrados, exclusivas activas, empleados | En TODA campaña de prospección |

**Estrategia real de segmentación:** con housing category, la segmentación vive en el CREATIVO. Un reel que abre con "¿Heredaste una casa y no sabes qué hacer con ella?" solo detiene el scroll de herederos. Meta optimiza hacia quien responde. Por eso E2 y E5 son la verdadera segmentación.

---

## 3. ARQUITECTURA DE CAMPAÑAS

```
NIVEL 1 — PROSPECCIÓN (70% presupuesto)
├── C1: LEADS-AVALUO (siempre activa, CBO) — lead magnet universal, P30
│     └── formato: Instant Form (CPL bajo) + variante landing (calidad alta) — comparar calidad en Cima Pro
├── C2: LEADS-URGENCIA (ABO testing → ganadores a CBO) — P01-P08, oferta O3
├── C3: LEADS-ATORADOS — P27/P28, oferta O7 diagnóstico
└── C4: LEADS-HERENCIAS / rotación de cluster del mes — O5

NIVEL 2 — REMARKETING (20%)
├── R1: web visitors 30d sin conversión → testimonio + oferta de su landing
├── R2: video viewers + engagers → caso de éxito → avalúo
└── R3: leads sin cita 14d (desde CRM) → video "qué pasa en la Sesión de Estrategia" + urgencia suave

NIVEL 3 — MARCA/AUTORIDAD (10%)
└── B1: alcance MTY con mejores piezas orgánicas (E5) — construye el "los veo en todos lados"
```

### Fase de testing (semanas 1-4) — protocolo
1. Por campaña de prospección: 1 conjunto amplio, 4-6 anuncios (2 hooks × 2 formatos + variantes).
2. Presupuesto por conjunto: mínimo para ~50 leads/semana de aprendizaje ($500-700 MXN/día).
3. **No tocar nada durante 72h** (learning phase).
4. Decisión a los 7 días o 50 conversiones, lo que llegue primero (matriz §5).
5. Testear en este orden de impacto: **hook (0-3s) > oferta > formato > audiencia > placement**.

### Fase de escalado
- **Vertical:** +20% de presupuesto cada 72h si CPL ≤ objetivo y volumen de citas se sostiene. Nunca duplicar de golpe (resetea aprendizaje).
- **Horizontal:** duplicar conjunto ganador con nueva variante creativa; expandir a cluster/persona vecina.
- **Regla Q4:** CPMs +30-40% (E0) → en oct-dic derivar 20% del presupuesto Meta a Google (E7) y remarketing.

---

## 4. CREATIVOS — SISTEMA DE PRODUCCIÓN

- Fuente #1: ganadores orgánicos (E5, retención >50%).
- Fuente #2: Agente Ads (E12) genera 10 variantes de copy por hook ganador (E17 §2 hooks).
- **Formatos ranking real estate:** 1º video testimonial/caso 30-60s, 2º video talking-head con hook de dolor, 3º carrusel antes/después o "los 4 caminos", 4º imagen estática con dato duro (backup barato).
- Todo video: subtítulos siempre, hook visual + textual en 2s, formato 9:16 y 1:1, CTA verbal Y en pantalla.
- Anti-fatiga: frecuencia >3 en 30d o CTR cae >30% desde pico → rotar creativo (checklist semanal E16).

---

## 5. MATRIZ DE DECISIÓN SEMANAL (el corazón de la optimización)

| Condición (7 días) | Acción |
|--------------------|--------|
| CPL ≤ objetivo Y cita/lead ≥ 20% | ESCALAR +20%/72h |
| CPL ≤ objetivo Y cita/lead < 10% | Problema de CALIDAD → revisar pregunta filtro del form, cambiar a landing, revisar velocidad de contacto (E9) antes de culpar al anuncio |
| CPL > objetivo ×1.5 Y CTR < 0.9% | Creativo no detiene el scroll → matar anuncio, nuevo hook |
| CPL > objetivo ×1.5 Y CTR ≥ 1.5% | La landing/form rompe la promesa → revisar congruencia anuncio-landing (E8) |
| CTR ok, CPL ok, volumen bajo | Ampliar audiencia/presupuesto, revisar solapamiento |
| Frecuencia > 3.5 (remarketing > 6) | Rotar creativo |

**KPIs objetivo Meta:**

| Métrica | Objetivo |
|---------|----------|
| CPM MTY housing | $80-150 MXN (referencia; medir línea base propia) |
| CTR (link) | ≥ 1.2% frío / ≥ 2% remarketing |
| CPL instant form | ≤ $120 MXN |
| CPL landing | ≤ $180 MXN (mayor calidad) |
| Lead → cita | ≥ 20% |
| Costo por cita | ≤ $700 MXN |
| Costo por exclusiva (Meta) | ≤ $6,000 MXN |
| Gasto sin reporte | $0 — dashboard diario E13 |

---

## 6. PROCEDIMIENTOS RECURRENTES

**Diario (15 min, media buyer):** gasto vs plan, CPL por campaña, leads llegando a Cima Pro (integridad del tracking), anuncios rechazados/cuenta sana.
**Semanal (60 min):** matriz §5 sobre cada conjunto; matar al peor anuncio y documentar por qué (E17 §7 registro de aprendizajes); 2 creativos nuevos a testing; revisar solapamiento de audiencias.
**Mensual:** informe CPL→cita→exclusiva por persona/cluster; rebalanceo de presupuesto entre clusters (E2 §clusters); auditoría de eventos Pixel/CAPI; revisión de biblioteca de anuncios de competencia (E0 SOP-014).
