# ETAPA 17 — BIBLIOTECA MAESTRA (copies, hooks, scripts, prompts)
> Dueño: Copywriting · Regla: **nadie escribe desde cero.** Todo lo que funciona vive aquí con su métrica. Todo lo que muere, se archiva con su causa. Este documento crece cada semana (junta de lunes).

---

## 1. FÓRMULAS DE COPY (los 6 esqueletos)

1. **PAS:** Problema → Agitación → Solución. (El caballo de batalla de ads de dolor.)
2. **AIDA:** Atención → Interés → Deseo → Acción. (Landings y emails.)
3. **BAB:** Before → After → Bridge. ("Hoy tu casa lleva 8 meses publicada. Imagina firmarla en notaría en 45 días. El puente se llama método.")
4. **4U:** Útil, Urgente, Único, Ultra-específico. (Titulares y asuntos de email.)
5. **Los 2 caminos:** comparativa iBuyer/solo vs. CIMA con números. (Nuestra firma.)
6. **Testimonio-esqueleto:** situación → escepticismo → proceso → número final → recomendación.

## 2. HOOKS MAESTROS (banco inicial — registrar CTR real de cada uno)

**De dolor (cluster URGENCIA):**
1. "¿Necesitas vender tu casa YA? Lee esto antes de aceptar la primera oferta."
2. "Te van a ofrecer comprarte la casa 'en 10 días'. Esto es lo que no te dicen."
3. "¿Debes mensualidades y temes perder tu casa? Todavía tienes 3 salidas."
4. "Vender la casa por el divorcio no tiene que ser otra guerra."

**De situación (TRANSICIÓN):**
5. "Heredaste una casa. Y con ella, un problema que nadie te explicó."
6. "Su casa ya hizo su trabajo. Ahora le toca trabajar para ustedes."
7. "¿Te mudas de ciudad y la casa te ancla? Hay una forma de irte tranquilo."
8. "La casa donde crecieron tus hijos hoy vale más que nunca. Dato, no opinión."

**De autoridad/dato (Sabio):**
9. "Una casa en Monterrey tarda 4 a 9 meses en venderse. La tuya no tiene por qué."
10. "El m² en [colonia] subió a $X este trimestre. ¿Sabes cuánto vale tu casa HOY?"
11. "El error #1 al vender tu casa en Monterrey: ponerle el precio que dijo el vecino."

**De atorado:**
12. "8 meses publicada y ni una oferta seria. No es tu casa: es una de estas 3 cosas."
13. "¿Tu exclusiva venció y la casa sigue ahí? El problema no fue la exclusiva. Fue el plan."

**De curiosidad (P30):**
14. "¿Cuánto vale tu casa hoy? Gratis, 2 minutos, y sin que nadie te ande hablando. Prometido."

## 3. ANUNCIOS COMPLETOS (2 ejemplos patrón; generar variantes con A2)

**AD-P27 (PAS, video talking-head):**
> HOOK: "8 meses publicada y puros curiosos." · CUERPO: "No es tu casa. Es el precio, las fotos o el canal. En 20 minutos te decimos cuál de los tres — gratis, sin pedirte la exclusiva ni nada a cambio. Diagnóstico con datos de TU colonia." · CTA: "Agenda tu diagnóstico gratis 👉" · (Landing /por-que-no-se-vende)

**AD-AVALUO (4U, imagen dato):**
> "Tu casa en [Cumbres] vale ~9% más que hace un año. ¿Cuánto exactamente? Averígualo gratis en 2 minutos, con datos reales de tu colonia. Sin llamadas si no las pides." · CTA: "Calcular el valor de mi casa"

## 4. MATRIZ DE OBJECIONES (viva — versión operativa en E10 §3)
Formato de registro semanal: `OBJECIÓN literal · persona · frecuencia · mejor respuesta (transcrita del roleplay/llamada real) · resultado`. Las 7 core están en E10; aquí se agregan las nuevas cada lunes.

## 5. PLANTILLAS WHATSAPP Y EMAIL (sincronizadas con cadencia E9 §3)

**WA-00 Bienvenida (0-5 min):**
> "¡Hola [nombre]! 👋 Soy el asistente de CIMA. Ya tengo el estimado de tu casa en [colonia]: entre $[X] y $[Y]. El número fino depende de 3 detalles que se ven en la propiedad. Cuéntame, ¿la idea es vender pronto o apenas están explorando?"

**WA-18 Cierre de cadencia (1-2-3):**
> "[Nombre], no quiero saturarte. Dime con un número y listo: 1️⃣ Sí, quiero hablar con un asesor · 2️⃣ Más adelante, mándame info de vez en cuando · 3️⃣ Ya no me interesa. Cualquiera está perfecto 🙂"

**WA-REVIEW (día +2 post-cheque):**
> "¡[Nombre]! Todavía andamos celebrando tu firma 🎉 ¿Nos regalas 1 minuto? Tu reseña ayuda a que otra familia como la tuya venda bien: [link]. ¡Gracias por confiar!"

**EMAIL-04 Los 4 caminos (asunto: "las 4 formas de vender tu casa (y cuánto deja cada una)"):**
> Tabla comparativa solo/agente tradicional/iBuyer/CIMA: precio esperado, tiempo, esfuerzo, riesgo → caso real → CTA cita.

**Recordatorio 24h cita / 2h / reporte semanal / reactivación 90 días:** textos base en cadencia E9 §3 y flujo F07 — mantener las 12 plantillas aprobadas en WhatsApp Manager (E11 §3).

## 6. PROMPTS DE AGENTES (versionados)

**A1-WHATSAPP-v1.0 (system prompt, resumen operativo):**
```
Eres el asistente digital de CIMA Propiedades (Monterrey). Objetivo: ayudar a
propietarios que quieren vender y agendar su cita de valuación.
TONO: cálido, regio moderado, breve. 1 pregunta por mensaje. Nunca corporativo.
CONTEXTO DEL LEAD: {persona_E2}, {landing}, {colonia}, {historial}.
PROCESO: 1) saluda con valor (rango de avalúo) 2) descubre motivo y timing
3) completa BANT-Inmo sin interrogar 4) propone cita con 2 horarios.
LÍMITES DUROS: no des precio final ni comisiones ni consejo legal/fiscal; no
prometas plazos; nunca digas que eres humano; máx 6 turnos sin avance → humano.
ESCALA A HUMANO si: piden humano, urgencia extrema, embargo/legal, molestia.
Al escalar: resume la conversación en 3 líneas para el asesor.
```

**A2-COPYWRITER-v1.0 (instrucción de tarea):**
```
Rol: copywriter senior de CIMA. Genera {N} variantes de {pieza} para {persona E2}
usando {fórmula §1} y el hook base {hook §2}. Respeta brand voice (E1 §7):
héroe=propietario, ratio tú/nosotros 3:1, números concretos, cero hype.
Prohibido: inventar cifras/testimonios, prometer plazos no aprobados, superlativos
sin prueba. Devuelve: variante + racional psicológico (1 línea) + CTA.
```

**A8-DIRECTOR-v1.0:** "Analiza {datos semana}: funnel por persona/canal/closer vs. objetivos {README §3}. Entrega: 3 hipótesis accionables con el dato que las sostiene, 1 riesgo emergente, 1 pregunta incómoda. Formato: máx 1 página. Si un dato falta, dilo — no rellenes."

(A3-A7: misma estructura; redactar al construir cada flujo. Changelog al final de este archivo.)

## 7. BITÁCORA DE APRENDIZAJES (formato)
`FECHA · PIEZA/TEST · HIPÓTESIS · RESULTADO (métrica) · DECISIÓN · APRENDIZAJE en 1 línea`
Se llena cada lunes (anuncio muerto de la semana + test CRO E8 §4). Trimestral: los 10 mejores aprendizajes se leen en la retro (SOP-013).

---
**Changelog de la Biblioteca:** v1.0 — julio 2026: banco inicial.
