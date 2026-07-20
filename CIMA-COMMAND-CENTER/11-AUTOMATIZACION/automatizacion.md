# ETAPA 11 — ARQUITECTURA DE AUTOMATIZACIÓN
> Dueño: Ops · Stack elegido: **n8n (self-hosted, núcleo) + WhatsApp Cloud API + Cima Pro (API propia) + OpenAI/Claude + Google Calendar + Meta/Google APIs**
> Criterio de stack: n8n sobre Make/Zapier por costo a escala (miles de ejecuciones/mes), control de datos (leads = activo crítico) y nodos IA nativos. Zapier solo para conexiones puntuales que n8n no tenga. Todo flujo documentado aquí ANTES de construirse.

---

## 1. MAPA MAESTRO DE INTEGRACIONES

```
   Meta Lead Ads ─┐                                  ┌─► Google Calendar (citas)
   Landings (E8) ─┤                                  ├─► Meta CAPI (eventos offline)
   GBP/llamadas  ─┼─► n8n ─► CIMA PRO (fuente única) ┼─► Google Ads (conversiones offline)
   WhatsApp API  ─┤     ▲          │                 ├─► Looker Studio (E13, vía BigQuery/Sheets)
   Referidos     ─┘     │          ▼                 └─► Slack/Push (alertas equipo)
                        └── Agentes IA (E12): respuesta, calificación, resumen
```

## 2. LOS 12 FLUJOS CORE (specs)

**F01 — Ingesta universal de leads.** Trigger: webhook (landing) / Meta Leads / GBP. Acciones: normalizar → dedupe por teléfono (si existe: merge + alerta "lead recurrente = caliente") → alta en Cima Pro con UTM/persona → score inicial (E9 §3) → dispara F02. SLA: <60 seg.

**F02 — Primer contacto <5 min (el flujo que paga todo el sistema).** Trigger: lead nuevo. Acciones: Agente WhatsApp (E12) envía bienvenida personalizada por persona/landing + valor inmediato (rango de avalúo) + 1 pregunta abierta. Si score ≥70: además llamada-alerta al setter de guardia (push + timbre). Horario: 24/7 (la IA no duerme; el humano entra 8:00-21:00).

**F03 — Conversación IA → calificación.** El Agente WhatsApp conversa (máx 6 turnos), completa BANT-Inmo, actualiza campos y score en Cima Pro. Handoff a humano si: pide humano, score ≥70, objeción compleja, tema legal, o sentimiento negativo. Resumen de conversación escrito en el lead (Agente CRM E12).

**F04 — Cadencia 14 toques/30 días.** Implementa E9 §3. Pausa automática al responder. Reanuda si la conversación muere 72h.

**F05 — Máquina de citas.** Slots de closers en Google Calendar → propuesta de 2 horarios → confirmación → invitación a ambos → recordatorio 24h (video) → recordatorio 2h (confirmación 1-clic) → no-show: reagendado ×2.

**F06 — Post-firma onboarding 48h.** Trigger: estado EXCLUSIVA. Checklist a Ops (fotos, legal, publicación), mensaje WOW al cliente, evento offline `ExclusivaFirmada` → Meta CAPI + Google (optimización por valor real).

**F07 — Reporte semanal al propietario (F6 del journey).** Cada viernes: extrae métricas de la propiedad de Cima Pro (visitas, leads compradores, feedback) → Agente Reportes redacta → revisión humana 1-clic → WhatsApp al dueño. Silencio = cancelación; este flujo es retención pura.

**F08 — Nurturing eterno (P30).** Trimestral: valor m² actualizado de su colonia a toda la base NURTURING. Bajo costo, mantiene viva la marca hasta que decidan.

**F09 — Máquina de reviews (E7 §2).** Día +2 post-cheque: WhatsApp con enlace directo GBP. Si review ≤3★: alerta inmediata a Dir. Comercial (SOP-012).

**F10 — Referidos (F8).** Día +7 post-cierre: activación del programa. Día +90 recurrente: contenido de valor. Registro de referidos con atribución en Cima Pro.

**F11 — Alertas de integridad (el guardián).** Cada hora: ¿leads sin contactar >10 min? ¿webhooks caídos (0 leads en ventana donde ads gastan)? ¿campañas gastando sin conversiones (>2× CPL objetivo en el día)? → alerta a Ops/media buyer. **Este flujo evita las pérdidas silenciosas.**

**F12 — ETL de datos.** Nightly: Cima Pro + Meta + Google Ads + GA4 → BigQuery (o Sheets en fase 1) → alimenta Looker Studio (E13).

---

## 3. WHATSAPP CLOUD API — reglas de juego
- Ventana de 24h: dentro, conversación libre; fuera, solo plantillas aprobadas (mantener 10-12 plantillas aprobadas: bienvenida, recordatorios, reporte semanal, reactivación, review — textos en E17 §5).
- Calidad del número: monitorear rating; si baja, reducir volumen de plantillas y revisar opt-outs. **Opt-out inmediato y sagrado** ("BAJA" → flag en Cima Pro, cero mensajes). Proteger el número es proteger el canal entero.
- Un número oficial. Prohibido WhatsApp personal para leads (regla E9).

## 4. GOBERNANZA DE AUTOMATIZACIONES
- Toda automatización tiene: dueño, doc de spec (este archivo), plan de fallback manual y alerta de error (F11).
- Cambios: en staging de n8n → prueba con lead ficticio interno → producción. Log de cambios con fecha/autor.
- Datos personales: acceso por rol, retención definida, aviso de privacidad en landings (LFPDPPP). Nunca exportar la base a archivos sueltos.

## 5. ROADMAP DE CONSTRUCCIÓN
| Semana | Flujos |
|--------|--------|
| 1 | F01, F02 (mínimo: bienvenida plantilla sin IA), F05 |
| 2 | F03 (IA conversacional), F04 |
| 3 | F06, F07, F11 |
| 4 | F09, F10, F12 |
| 5+ | F08 + refinamiento continuo |

**KPIs:** uptime flujos ≥ 99% · p90 lead→primer mensaje <5 min · % conversaciones resueltas por IA sin humano (meta 60%) · errores/semana con causa documentada · 0 leads perdidos por fallas (auditoría E16).
