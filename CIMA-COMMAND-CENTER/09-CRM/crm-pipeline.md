# ETAPA 9 — CRM: PIPELINE DE CAPTACIÓN EN CIMA PRO
> Dueño: Ops · Stack: **Cima Pro** (nuestro CRM — dogfooding: cada mejora que necesitemos aquí es roadmap de producto y argumento de venta del CRM)
> Regla suprema: **si no está en Cima Pro, no existe.** Leads en WhatsApp personal = falta grave.

---

## 1. PIPELINE DE CAPTACIÓN (10 estados)

| # | Estado | Definición de entrada | SLA para salir | Dueño |
|---|--------|----------------------|----------------|-------|
| 1 | **NUEVO** | Lead entra por cualquier canal | 5 min → contactado | Agente IA |
| 2 | **CONTACTADO** | Recibió y abrió/respondió primer mensaje | 48h → calificado o secuencia | IA + Setter |
| 3 | **EN CALIFICACIÓN** | Conversación activa; aplicando BANT-Inmo (§2) | 72h | Setter |
| 4 | **CALIFICADO** | Cumple criterios; aún sin cita | 24h → cita propuesta | Setter |
| 5 | **CITA AGENDADA** | Sesión de Estrategia con fecha/hora | hasta la cita (confirmaciones automáticas) | Closer |
| 6 | **PRESENTADO** | Sesión realizada, plan presentado | 7 días → decisión | Closer |
| 7 | **EN NEGOCIACIÓN** | Objeciones activas / comparando | 14 días | Closer |
| 8 | **EXCLUSIVA FIRMADA** ✅ | Contrato firmado | → pipeline de comercialización | Closer→Ops |
| 9 | **NURTURING** | "No por ahora" con potencial real | revisión cada 30-90 días (automático) | Sistema |
| 10 | **DESCARTADO** | Sin propiedad, fuera de zona, spam — con motivo obligatorio | — | — |

**Estados espejo de excepción:** NO-SHOW (cita fallida → secuencia de reagendado, máx 2 intentos), SIN-RESPUESTA (14 toques/30 días sin contestar → nurturing largo).

### Campos obligatorios del lead (validación al crear)
`fuente` (meta/google/seo/gbp/referido/orgánico) · `utm_*` · `landing` · `persona` (E2, inferida por formulario, confirmada por setter) · `colonia` · `tipo_propiedad` · `motivo_venta` · `urgencia` (1-3) · `valor_estimado` · `score` (§3)

---

## 2. CALIFICACIÓN — BANT-INMO

- **B — Bien raíz:** ¿Es dueño o decide? (¿escrituras a su nombre? ¿copropietarios?)
- **A — Apuro (timing):** ¿Para cuándo necesita/quiere vender? (≤3 meses = caliente)
- **N — Número:** ¿Expectativa de precio vs. realidad de mercado? (delta >20% = objeción de precio anticipada)
- **T — Terreno legal:** ¿Escrituras, adeudos, sucesión, gravámenes?

**Score automático (0-100) para priorizar la cola del setter:**
+30 urgencia ≤3 meses · +20 es dueño único · +15 zona Tier A/B · +15 respondió <1h · +10 fuente Search (intención) · +10 delta precio <10% · −20 sin escrituras/sucesión sin iniciar (→ ruta O5) · −30 "solo curiosidad" (→ nurturing P30).
**≥70 = HOT:** llamada humana inmediata, no esperar la secuencia.

---

## 3. CADENCIA DE SEGUIMIENTO (los 14 toques / 30 días)

El 80% de las exclusivas se firma entre el toque 5 y el 12. Esta cadencia corre AUTOMÁTICA (E11) y se pausa en cuanto el lead responde (pasa a conversación humana/IA).

| Día | Canal | Contenido (plantillas E17 §5) |
|-----|-------|-------------------------------|
| 0 (0-5 min) | WhatsApp | Bienvenida + valor inmediato (rango de avalúo) + 1 pregunta |
| 0 (+2h) | WhatsApp | "¿Te llegó tu estimado? Pregunta rápida sobre tu [colonia]…" |
| 1 | Llamada | Setter: llamada 1 (script E10 §2) |
| 2 | WhatsApp | Caso de éxito del mismo cluster (video 60s) |
| 4 | Email | "Los 4 caminos para vender tu casa" (comparativa) |
| 6 | WhatsApp | Dato de su colonia ("en [Cumbres] el m² subió a $X") |
| 8 | Llamada | Setter: llamada 2 (otro horario) |
| 11 | WhatsApp | Testimonio + oferta de cita con 2 horarios concretos |
| 14 | Email | Guía del dolor de su persona (E4 lead magnets) |
| 18 | WhatsApp | "¿Sigue en pie la idea de vender? Responde 1, 2 o 3: 1) sí, hablemos 2) más adelante 3) ya no" |
| 22 | Llamada | Setter: llamada 3 (última) |
| 26 | WhatsApp | Contenido de valor (video mito) |
| 30 | WhatsApp+Email | Mensaje de puerta abierta → pasa a NURTURING |
| 90+ | Auto | Reporte trimestral del valor de su colonia (para siempre, hasta que compre o pida baja) |

---

## 4. AUTOMATIZACIONES DENTRO DEL CRM (specs para Cima Pro + E11)

1. **Lead nuevo →** asignación round-robin con límite de carga; disparo de respuesta IA <1 min; notificación push al setter si score ≥70.
2. **Cita agendada →** evento en Google Calendar de ambos + confirmación WhatsApp inmediata + recordatorio 24h (con video "qué esperar") + recordatorio 2h (con confirmación 1-clic) → reduce no-show de ~35% a <15%.
3. **No-show →** reagendado automático 2 intentos → si falla, NURTURING.
4. **Sin actividad 48h en estados 2-4 →** tarea urgente al setter + alerta al Dir. Comercial en el daily.
5. **EXCLUSIVA FIRMADA →** checklist de onboarding 48h (E3 F5) + alta en pipeline de comercialización + evento offline `ExclusivaFirmada` a Meta/Google (optimización por valor, E6/E7).
6. **Motivo de descarte →** reporte mensual de basura por fuente (feedback a media buyers).

## 5. KPIs DEL CRM (dashboard E13, revisión en daily)

| KPI | Objetivo |
|-----|----------|
| Tiempo lead→primer contacto (p90) | < 5 min |
| Leads con persona + fuente completas | 100% |
| Contact rate (lead→conversación) | ≥ 70% |
| Lead→cita | ≥ 20-25% |
| No-show | < 15% |
| Toques promedio antes de cita | medir (esperado 4-7) |
| Leads huérfanos (sin tarea futura) | 0 — auditoría semanal E16 |
| Ciclo lead→exclusiva por cluster | URGENCIA <21d · TRANSICIÓN <60d |
