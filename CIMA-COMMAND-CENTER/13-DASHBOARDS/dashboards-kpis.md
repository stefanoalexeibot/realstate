# ETAPA 13 — DASHBOARDS Y SISTEMA DE MÉTRICAS
> Dueño: Analítica · Stack fase 1: Looker Studio + Sheets · Fase 2 (mes 4+): BigQuery vía F12 (E11) · Power BI solo si un socio/corporativo lo exige.
> Principio: **un número sin dueño ni decisión asociada es decoración.** Cada métrica de esta etapa tiene dueño, frecuencia y umbral de acción.

---

## 1. EL ÁRBOL DE MÉTRICAS (de norte a raíz)

```
EXCLUSIVAS FIRMADAS/MES (North Star)
├── Leads/mes × (Lead→Cita) × (Cita→Show) × (Presentación→Firma)
│     ├── Leads = Σ por canal (Meta, Google, SEO/GBP, referidos, orgánico)
│     │     └── por canal: Gasto ÷ CPL · CTR · CPM · conv. landing
│     ├── Lead→Cita ← velocidad 1er contacto · contact rate · score · cadencia
│     ├── Show rate ← confirmaciones F05
│     └── Firma ← closer (por persona/oferta) · calidad de lead (por fuente)
└── ECONOMÍA: CAC por exclusiva · comisión promedio · ciclo de cierre
      └── LTV (comisión + referidos + recompra) → LTV:CAC ≥ 15:1
```

## 2. DEFINICIONES CANÓNICAS (para que nadie discuta números)

| Métrica | Fórmula | Fuente |
|---------|---------|--------|
| CPL | gasto canal ÷ leads válidos del canal (excluye DESCARTADO spam/fuera-de-zona) | Ads + Cima Pro |
| CPC/CPM/CTR | nativas de plataforma | Meta/Google |
| Costo por cita | gasto ÷ citas presentadas (show) | cruzado |
| CAC exclusiva | (gasto ads + costo comercial prorrateado) ÷ exclusivas | cruzado |
| ROAS del sistema | comisiones COBRADAS ÷ gasto total marketing | Cima Pro finanzas |
| Ciclo de cierre | mediana días lead→exclusiva y exclusiva→venta | Cima Pro |
| LTV | comisión promedio × (1 + tasa referido + tasa recompra 5 años) | cohortes |
| Atribución | first-touch para canal + last-touch para creativo; referido gana sobre ads si media <30 días | regla fija |

## 3. LOS 4 DASHBOARDS

### D1 — DIARIO OPERATIVO (TV de la oficina, auto-refresh)
Leads hoy/ayer · CPL por campaña vs. objetivo (semáforo) · leads sin contactar >10 min (ROJO = actuar ya) · citas hoy y confirmadas · alertas F11. **Dueño: Ops. Umbral: cualquier rojo se resuelve antes de las 10am.**

### D2 — SEMANAL DE MARKETING (junta de lunes)
Funnel completo semana vs. anterior y vs. objetivo trimestral (README §3) · CPL/CTR/frecuencia por campaña y creativo · conversión por landing · matriz E6 §5 aplicada (qué se mató, qué se escaló) · CPL y lead→cita POR PERSONA (E2) — la vista que nadie de la competencia tiene. **Dueño: media buyers. Decisión: rebalanceo de presupuesto.**

### D3 — SEMANAL COMERCIAL
Citas por closer · show rate · presentación→firma por closer y por oferta (E4) · objeciones más frecuentes de la semana · pipeline por estado con antigüedad (leads podridos en amarillo) · exclusivas firmadas vs. meta. **Dueño: Dir. Comercial. Decisión: coaching dirigido + roleplay del jueves.**

### D4 — MENSUAL EJECUTIVO (CEO)
North Star vs. plan · CAC/LTV/ROAS por canal · mezcla de ofertas · share of voice (E0 SOP-014) · reviews y marca (E1 §8) · avance roadmap 90 días · 3 decisiones del mes (documentadas). **Dueño: CEO.**

## 4. IMPLEMENTACIÓN
- **Semana 1:** Sheets maestro alimentado por n8n F12 (pestañas: leads, gasto diario por canal, citas, exclusivas) → Looker Studio D1 y D2 básicos.
- **Mes 2:** D3, D4; conversiones offline subiendo a Meta/Google (cierra el loop de optimización por valor).
- **Mes 4:** migrar a BigQuery; cohortes por persona; atribución multi-touch simple.
- **Integridad de datos (regla):** auditoría semanal de 10 leads aleatorios end-to-end (anuncio→UTM→Cima Pro→estado). El tracking roto se arregla el mismo día — un dashboard con datos sucios es peor que no tener dashboard.

## 5. UMBRALES DE ALARMA (accionables, no informativos)
| Señal | Umbral | Acción inmediata |
|-------|--------|------------------|
| CPL del día | >1.5× objetivo | Agente Ads (A3) analiza; media buyer decide antes de 12pm |
| Leads sin contacto | >10 min | Ops llama al setter de guardia |
| Show rate semana | <75% | Revisar F05 y calidad de agendado |
| Firma mensual | <80% de meta al día 20 | War room: CEO + comercial + marketing |
| ROAS trimestre | <8× | Revisión completa de mezcla de canales y ofertas |
