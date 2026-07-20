# ETAPA 8 — SISTEMA DE LANDING PAGES
> Dueño: CRO + Dev · Stack: el sitio Next.js existente de CIMA (repo propiedades-mty) · Regla: **una landing = un dolor = una oferta = un CTA.**

---

## 1. INVENTARIO DE LANDINGS (mapeo 1:1 con E2/E4)

| URL | Persona(s) | Oferta | Prioridad |
|-----|-----------|--------|-----------|
| /avaluo | P30 + todas | Avalúo CIMA | ⭐ Semana 1 |
| /vender-rapido | P02, P03, P24 | O3 Urgente | ⭐ Semana 1 |
| /por-que-no-se-vende | P27, P28 | O7 Diagnóstico | ⭐ Semana 1 |
| /herencia | P09, P10, P16, P29 | O5 Herencias | Semana 3 |
| /me-mudo | P04, P05, P14, P25 | O6 Cambio de Ciudad | Semana 3 |
| /vender-por-divorcio | P01, P06 | O3/neutral | Semana 4 |
| /downsizing | P07, P11, P13 | O1 Premium | Mes 2 |
| /casa-mas-grande | P12 | Vende-y-Compra | Mes 2 |
| /tal-como-esta | P15, P22 | O3/inversionista | Mes 2 |
| /inversionistas | P19-P21, P23, P26 | O4 | Mes 3 |
| /vender-mi-casa | genérica Search (E7) | plan de venta | Semana 2 |

---

## 2. ANATOMÍA OBLIGATORIA (wireframe de 9 bloques)

```
[1. HERO]           Headline dolor/resultado + subhead con mecanismo + CTA + imagen real MTY
                    (headline pasa el test: ¿la persona E2 diría "esto es PARA MÍ"?)
[2. BARRA CONFIANZA] ★4.9 Google · +N casas vendidas · Respuesta < 5 min · AMPI
[3. PROBLEMA]       Agitación empática del dolor (3 viñetas espejo del lenguaje de la persona)
[4. SOLUCIÓN/PLAN]  Los 3 pasos StoryBrand (E1 §3): Avalúo → Plan → Firma cuando estés listo
[5. PRUEBA SOCIAL]  2-3 testimonios VIDEO del mismo cluster + casos con cifras
[6. BENEFICIOS]     4-6, formulados como resultado ("sabrás el precio real hoy mismo")
[7. OFERTA+GARANTÍA] La oferta E4 con su garantía por escrito
[8. FAQ]            5-8 objeciones de la persona (E2) respondidas — schema FAQPage
[9. CTA FINAL]      Formulario + alternativa WhatsApp directo
```

### Formulario (estándar)
- **Paso 1 (micro-compromiso):** dirección/colonia de la propiedad (pregunta fácil, sin datos personales).
- **Paso 2:** tipo de propiedad + situación ("¿qué describe mejor tu caso?" → asigna persona E2 automáticamente).
- **Paso 3:** nombre + WhatsApp (+ email opcional). 
- Multi-paso convierte 30-80% más que formulario plano en este vertical. Barra de progreso visible.
- Al enviar: página de gracias con video "qué sigue" + botón "adelanta tu avalúo: mándanos 5 fotos por WhatsApp" (micro-conversión que dispara el evento `Schedule` intent).
- Campos ocultos: UTM completos, landing de origen, persona inferida → Cima Pro (E9).

### Requisitos técnicos
- [ ] Velocidad: LCP < 2.5s móvil (85%+ del tráfico será móvil)
- [ ] Pixel + CAPI + GA4 + GTM en todas
- [ ] Botón WhatsApp flotante con mensaje precargado por landing ("Hola, vengo de la página de herencias…" → contexto para el agente IA E12)
- [ ] Teléfono clicable; número con tracking (E13)
- [ ] Congruencia anuncio→landing: mismo hook, misma imagen si es posible (regla de Message Match — su violación es la causa #1 de CPL alto con CTR bueno, ver matriz E6 §5)

---

## 3. LA CALCULADORA DE AVALÚO (/avaluo — el activo central)

**Flujo:** colonia → m² terreno/construcción → recámaras/baños → estado general → situación (persona) → contacto → **resultado inmediato en pantalla**: rango de valor (dato m² por colonia, tabla propia actualizada trimestralmente) + "un especialista afina tu número en 24h".
**Por qué en pantalla y no "te lo mandamos":** dar el valor de inmediato construye reciprocidad y confianza (Cialdini); reservamos el avalúo completo (nivel 2, E4 §1) para la conversación humana.
**KPI:** conversión ≥ 25% desde tráfico tibio; ≥ 40% de resultados aceptan cita de afinación.

---

## 4. PROGRAMA DE CRO (optimización continua)

### Protocolo de testing
1. Solo se testea con ≥ 1,000 visitas/variante o ≥ 100 conversiones (significancia).
2. Un test a la vez por landing. Prioridad de impacto: **headline > oferta/garantía > formulario (# pasos y labels) > prueba social (posición) > CTA (texto) > diseño**.
3. Registro obligatorio de cada test en la bitácora (hipótesis → resultado → aprendizaje) — plantilla en E17 §7.
4. Herramientas: GA4 + Microsoft Clarity (heatmaps/grabaciones, gratis) + test A/B nativo (Next.js middleware o Vercel Edge).

### KPIs por landing

| Métrica | Mínimo aceptable | Objetivo |
|---------|------------------|----------|
| Conversión tráfico frío Meta | 8% | 12-15% |
| Conversión tráfico Search | 10% | 15-20% |
| Conversión remarketing | 15% | 25% |
| Rebote | < 60% | < 45% |
| Scroll al bloque de oferta | > 40% | > 60% |
| Tiempo de carga (LCP móvil) | < 3s | < 2s |

### Checklist pre-lanzamiento de toda landing (E16 lo referencia)
- [ ] Test de formulario end-to-end: lead llega a Cima Pro con UTM y persona
- [ ] Evento Lead dispara en Pixel Y CAPI (verificar en Events Manager)
- [ ] WhatsApp precargado correcto · [ ] móvil perfecto en 360px · [ ] 9 bloques presentes
- [ ] Headline aprobado contra checklist de marca (E1 §7.4)
- [ ] Página de gracias con siguiente paso
