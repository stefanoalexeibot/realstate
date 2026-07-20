# ETAPA 12 — AGENTES DE INTELIGENCIA ARTIFICIAL
> Dueño: IA/Ops · Modelos: Claude (conversación/redacción larga), GPT (clasificación/estructurado barato), Gemini (multimodal/volumen). Orquestación: n8n (E11).
> Doctrina: **la IA opera, el humano decide.** Todo agente tiene límites duros, escalamiento a humano y su output es medible. Los prompts completos y versionados viven en E17 §6; aquí, la especificación de cada agente.

---

## FICHA ESTÁNDAR DE AGENTE
`Nombre · Misión · Entradas · Salidas · Herramientas · Límites duros · Escalamiento · KPI · Revisión humana`

---

### A1 — AGENTE WHATSAPP (el más crítico)
- **Misión:** primer contacto <1 min 24/7, conversación de calificación BANT-Inmo, agendar citas.
- **Entradas:** lead + landing de origen + persona inferida + historial Cima Pro.
- **Personalidad:** setter humano regio: cálido, breve, 1 pregunta por mensaje, cero corporativo. Se presenta como "asistente del equipo CIMA" — **nunca finge ser humano** (si preguntan: "soy el asistente digital; un asesor te acompaña en cuanto lo necesites").
- **Límites duros:** NO da precio final ("eso te lo confirma el especialista con comparables en la visita"), NO cotiza comisiones, NO da asesoría legal/fiscal, NO promete plazos, máx 6 turnos sin avance → humano.
- **Escalamiento:** score ≥70, palabra "urgente/embargo/abogado", sentimiento negativo, solicitud de humano.
- **KPI:** respuesta <1 min (p99) · conversaciones→cita ≥15% · handoffs correctos ≥95% · quejas por tono = 0.

### A2 — AGENTE COPYWRITER
- **Misión:** producir borradores de todo copy (ads, captions, emails, guiones E5) desde la Biblioteca (E17) y el brand voice (E1 §7).
- **Regla:** genera 10 variantes → humano elige/edita → la ganadora (por métrica) vuelve a la Biblioteca como ejemplo. El agente aprende del feedback loop.
- **Límites:** nunca publica directo; prohibido inventar cifras, testimonios o garantías no aprobadas (E4).
- **KPI:** % de borradores aprobados sin reescritura mayor (meta ≥60%) · tiempo de producción de campaña (meta −70%).

### A3 — AGENTE ADS
- **Misión:** vigilancia diaria de Meta/Google: aplica la matriz E6 §5 como RECOMENDACIÓN (no ejecuta cambios de presupuesto solo — el media buyer aprueba con 1 clic).
- **Salidas:** reporte diario 7:30am (gasto, CPL por campaña, anomalías, 3 acciones recomendadas con su regla citada).
- **Límites:** puede pausar SOLO anuncios rechazados o con gasto >2× CPL sin conversiones en el día (regla F11); jamás toca campañas de marca.
- **KPI:** anomalías detectadas antes que el humano ≥80% · falsos positivos <10%.

### A4 — AGENTE SEO
- **Misión:** transcribir video YT semanal → borrador de blog optimizado (E7 §3) + metas + schema; monitoreo mensual de posiciones y de páginas de colonia desactualizadas.
- **KPI:** 1 blog/semana publicado · datos de colonia con antigüedad <90 días.

### A5 — AGENTE COMERCIAL (copiloto del closer)
- **Misión:** antes de cada cita, genera el "brief de cita": persona, motivo, historial, comparables de la colonia, objeciones probables (matriz E10 §3) con sus respuestas. Después: transcribe la llamada/visita (con consentimiento) y extrae compromisos → tareas en Cima Pro.
- **KPI:** 100% de citas con brief · compromisos capturados vs. perdidos.

### A6 — AGENTE CRM (higiene de datos)
- **Misión:** resumir conversaciones largas en el lead, detectar campos vacíos y pedirlos al setter, detectar leads huérfanos (sin tarea futura), sugerir cambio de estado cuando la conversación lo evidencia.
- **KPI:** leads huérfanos = 0 · % campos obligatorios completos ≥98%.

### A7 — AGENTE REPORTES
- **Misión:** redactar el reporte semanal a propietarios (F07, E11) y el resumen ejecutivo semanal interno (lunes 8am: funnel completo vs. objetivos README §3, con desviaciones señaladas).
- **Límites:** solo lee datos reales de Cima Pro/BigQuery; si un dato falta, lo dice — prohibido rellenar.
- **KPI:** 100% reportes a tiempo · correcciones humanas <10%.

### A8 — AGENTE DIRECTOR (capa de análisis)
- **Misión:** cada lunes cruza TODO (CPL por persona × conversión por closer × oferta × zona) y produce 3 hipótesis de optimización con datos ("la persona P09 tiene CPL 40% menor y conversión 2× — subir presupuesto del cluster herencias"), 1 riesgo y 1 pregunta incómoda para la junta semanal.
- **Regla:** sus hipótesis se discuten en la junta semanal (E16); las aceptadas se convierten en tests con dueño y fecha. Es input, nunca autoridad.
- **KPI:** hipótesis aceptadas/mes ≥2 · % de hipótesis que mejoraron la métrica al testearse.

---

## GOBERNANZA IA
1. **Versionado de prompts** en E17 §6 (`AGENTE-vN.M` + changelog). Cambios se prueban en 20 conversaciones ejemplo antes de producción.
2. **Auditoría semanal:** Ops revisa 10 conversaciones aleatorias de A1 contra rúbrica (tono, límites, handoff). Score <8/10 → retrain del prompt.
3. **Datos:** los agentes ven solo lo necesario por tarea; nada de base completa en contexto; sin datos sensibles en logs de terceros.
4. **Honestidad:** ningún agente finge ser humano; testimonios y cifras solo del repositorio aprobado.
5. **Kill switch:** cualquier agente se apaga desde n8n en 1 clic y su fallback manual (E11 §4) se activa.
