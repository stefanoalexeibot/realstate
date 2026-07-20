# ETAPA 15 — SOPs (PROCEDIMIENTOS OPERATIVOS ESTÁNDAR)
> Dueño: Ops · Formato estándar: `Objetivo · Dueño · Disparador · Pasos · Herramientas · KPI · Errores comunes`
> Regla viva: si algo se hace 2 veces, se documenta; si un SOP falla 2 veces, se corrige. Versión y fecha en cada SOP.

---

## ÍNDICE
Marketing: 001-005 · Comercial: 006-010 · Reputación: 011-012 · Dirección: 013-014 · Ops/Tech: 015-017 · RH: 018

---

### SOP-001 — Lanzamiento de campaña Meta
**Disparador:** nueva oferta/cluster aprobado en junta semanal. **Dueño:** media buyer.
1. Verificar persona (E2) y oferta (E4) → definir hook desde biblioteca (E17 §2)
2. Solicitar 4-6 creativos (A2 + editor) → checklist de marca E1 §7.4
3. Confirmar landing viva y testeada (checklist E8 §4) → naming E6 §1
4. Categoría especial VIVIENDA marcada → presupuesto según plan → conjunto amplio
5. QA: preview en móvil, UTM, evento Lead dispara → lanzar lunes-martes (nunca viernes)
6. No tocar 72h → registrar en bitácora de campañas
**KPI:** 0 campañas lanzadas sin checklist completo. **Error común:** lanzar sin probar el formulario end-to-end.

### SOP-002 — Optimización semanal de ads
Lunes 9-10am. Aplicar matriz E6 §5 conjunto por conjunto → matar peor anuncio y documentar → 2 creativos nuevos a testing → actualizar D2 → informar en junta. **KPI:** 100% de lunes ejecutado.

### SOP-003 — Producción quincenal de contenido
Ver E5 §5 (guiones jueves → grabación viernes → edición lunes → programación martes). **KPI:** 0 semanas sin contenido programado.

### SOP-004 — Publicación de blog SEO semanal
A4 transcribe YT → borrador on-page (E7 §3) → humano edita (voz E1) → schema + interlinks → publicar miércoles → GSC indexación. **KPI:** 52/52 semanas.

### SOP-005 — Actualización trimestral de datos de mercado
Día 1 de trimestre: actualizar tabla m²/colonia (calculadora /avaluo), páginas de colonia, reporte de mercado (contenido + PR local). **Dueño:** analítica + SEO.

### SOP-006 — Gestión del lead entrante (humano)
**Disparador:** alerta HOT (score ≥70) o handoff de IA. Setter: leer resumen IA → llamar antes de 10 min → BANT-Inmo → registrar TODO en Cima Pro → cita con doble alternativa → si no contesta: 2º intento +2h, luego cadencia F04. **KPI:** p90 <10 min en HOT.

### SOP-007 — Preparación de cita de valuación
24h antes: brief de A5 → comparables impresos → confirmación 24h/2h automática corre (verificar) → carpeta física para Tier A. **KPI:** 100% citas con brief.

### SOP-008 — Sesión de Estrategia
Ejecutar E10 §2-C3 completo. Registrar resultado + objeciones en Cima Pro el mismo día. **KPI:** 100% de C3 con resultado registrado <24h.

### SOP-009 — Firma de exclusiva y onboarding 48h
Contrato con garantía escrita (E4) → F06 dispara → sesión de fotos agendada ≤48h → carpeta legal iniciada → primer reporte al dueño día 7. **KPI:** 100% ≤48h.

### SOP-010 — Exclusiva que no avanza (semana 3 sin ofertas)
M4 del journey: llamada proactiva ANTES del reclamo → plan B documentado (ajuste precio según escalera pactada / refresh creativo de la propiedad / open house) → registrar. **KPI:** 0 cancelaciones por silencio.

### SOP-011 — Solicitud de reviews
Ver E7 §2. Presencial día del cheque + automático día +2. **KPI:** ≥60% de cierres dejan review.

### SOP-012 — Gestión de crisis de reputación
Review ≤3★ o queja pública: 1) alerta automática (F09) 2) NO responder en caliente; Dir. Comercial llama al cliente <4h 3) resolver de fondo 4) respuesta pública sobria <48h contando la resolución 5) post-mortem: ¿qué SOP falló? **KPI:** 100% quejas con post-mortem.

### SOP-013 — Retrospectiva mensual
Primer viernes: D4 + informe A8 → 3 aprendizajes, 3 decisiones, 1 SOP nuevo/corregido → minuta en este repositorio. **Dueño:** CEO.

### SOP-014 — Inteligencia competitiva mensual
Ver E0 §4: Ad Library + mystery lead + informe 1 página día ≤5. **Dueño:** analista/marketing.

### SOP-015 — Alta de nueva automatización
Spec en E11 → staging → prueba lead ficticio → alerta de error configurada (F11) → producción → doc actualizado. **KPI:** 0 flujos sin spec/alerta.

### SOP-016 — Auditoría semanal de datos
10 leads aleatorios end-to-end (E13 §4) + leads huérfanos (A6) + verificación webhooks. Viernes 4pm. **KPI:** hallazgos corregidos mismo día.

### SOP-017 — Respaldo y seguridad
Semanal: backup BD Cima Pro y flujos n8n (export) · accesos por rol revisados mensual · offboarding = revocación mismo día. **Dueño:** Ops.

### SOP-018 — Onboarding de nuevo integrante (cualquier rol)
Día 1: README + etapa de su rol · Día 2-3: shadow · Día 4-5: roleplay/simulacro con checklist de certificación · Semana 2: opera con supervisión · Certificación formal antes de tocar leads reales o presupuesto. **KPI:** 100% certificados antes de operar.
