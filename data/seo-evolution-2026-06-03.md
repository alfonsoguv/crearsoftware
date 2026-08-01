# Informe de evolución SEO — crearsoftware.com

**Fecha del informe:** 2026-06-03
**Director SEO:** síntesis multi-dimensión con verificación adversarial
**Veredicto global:** MIXTO

---

## 1. Resumen ejecutivo

El sitio crece de forma modesta pero real en clics entre la ventana de marzo (snapshots 01/02-abr) y la de mayo (snapshots 31-may/01-jun): **119 → 136 clics (+14,3%)** con **impresiones casi planas (+2,3%)**. La mejora viene de captura/CTR, no de mayor visibilidad ni de mejor ranking general (la posición media de hecho **empeora**). El motor aritmético del crecimiento es una sola página (percepción-y-cultura), mientras el activo histórico principal (input/output) **se deteriora en posición y clics**. Estructura aún en crisis de CTR (0,66% para posición media ~13,8).

**Advertencia metodológica que condiciona todo el informe:** todos los cambios SEO (batch 1, batch 2, PRs #9–#27) se commitearon entre el **31-may 19:52 y el 01-jun 10:12**, DESPUÉS del cierre de los periodos de ambos snapshots de mayo. Con la latencia GSC de 2-3 días, **ningún snapshot disponible mide el efecto de las optimizaciones**. Lo que vemos es la línea base pre-intervención. Cualquier mejora actual NO es atribuible a los cambios SEO. La efectividad solo será evaluable con datos GSC de la 2ª-3ª semana de junio.

---

## 2. Tabla de evolución por snapshot

| Snapshot | Periodo (28d) | Clicks | Impresiones | CTR medio | Pos. media | Sitemap enviado | Sitemap indexado* |
|---|---|---|---|---|---|---|---|
| 2026-04-01 | 04-mar → 31-mar | 119 | 20.184 | 0,59% | 12,98 | 0 | 0 |
| 2026-04-02 | 05-mar → 01-abr | 121 | 19.806 | 0,61% | 12,84 | 0 | 0 |
| 2026-05-31 | 03-may → 30-may | 132 | 20.609 | 0,64% | 13,80 | 690 | 0 |
| 2026-06-01 | 04-may → 31-may | 136 | 20.657 | 0,66% | 13,82 | 690 | 0 |

\* `sitemapIndexed=0` es un **artefacto del endpoint Sitemaps de GSC**, NO falta de indexación. La auditoría URL Inspection del 31-may confirma 19/25 URLs indexadas, 0 errores, home "Enviada e indexada".

**Lectura honesta de la serie:** son 2 mediciones reales (marzo vs mayo), no 4 puntos independientes. Los pares 01-abr/02-abr y 31-may/01-jun solapan 27 de 28 días: los deltas internos (+2 en abril, +4 en mayo) son latencia GSC, no evolución. Hay además un **gap de ~2 meses sin datos** (entre el 02-abr y el 31-may) que impide fechar cuándo ocurrieron los cambios de comportamiento.

---

## 3. Evolución de las métricas globales (marzo → mayo, verificado)

- **Clics:** 119 → 136 = **+17 clics (+14,3%)**. Dirección real (confianza media-alta), pero modesto en absoluto: el sitio entero mueve ~130 clics/mes, así que ±5 clics por página está cerca del suelo de ruido.
- **Impresiones:** 20.184 → 20.657 = **+2,3% (planas)**. El crecimiento de clics NO viene de más visibilidad sino de mejor captura.
- **CTR medio:** 0,59% → 0,66% = **+0,07 p.p. (+11,7% relativo)**. Mejora real pero desde un suelo crítico; la media está dominada por input/output (~50% de las impresiones), cuyo CTR de hecho BAJÓ.
- **Posición media:** 12,98 → 13,82 = **empeora +0,84 puestos**. La ganancia es por cabeza de distribución/CTR, no por ranking general.

---

## 4. Hallazgos por dimensión (solo los verificados como supported=true)

### 4.1 Tendencia global
- **[MEJORA, alta] Crecimiento sostenido de clics +14,3%** — dirección real, no ruido de un único salto. Matiz del verificador: confianza de la dirección media-alta, no "alta"; magnitud modesta.
- **[MIXTO, alta] Impresiones planas → el crecimiento es por CTR**, no por alcance. Limita el techo: sin más impresiones, el margen por CTR se agota.
- **[MEJORA, baja] CTR sigue en crisis estructural** pese a la subida: 0,66% para pos ~13,8 es muy bajo (un sitio sano rondaría 1,5-3%).
- **[EMPEORA, baja] Posición media global empeora +0,84.** Caveat: avgPosition es ruido-adyacente sobre base 13; no necesariamente erosión confirmada.
- **[ESTABLE, media] Veta de striking distance sin capturar:** miles de impresiones en variantes input/output en pos 6-11 con 0 clics.

### 4.2 Páginas ganadoras / perdedoras
- **[EMPEORA, alta] input/output se deteriora** — el activo principal: clics 43→37 (-14%), posición 3,66→7,52 (-3,86 puestos), CTR 0,47%→0,35%, impresiones 9.083→10.476 (+15%). Más exposición en peores posiciones. **Hallazgo negativo más sólido del dataset.**
- **[verificado, alta] que-es-pmm: pos 9,3 con 225 impr y 0 clics** — problema de title/meta puro (no de ranking). Único subgrupo de la "bolsa de CTR cero" verdaderamente accionable y sólido.
- **[verificado, alta] que-es-un-producto: impr 362→703, pos 54→35,6, 0→1 clic** — fuera de striking distance, sangra impresiones.
- **[EMPEORA, media] MCP (guía protocolo de contexto):** clics 7→2 (-71%), posición 7,29→13,40 (-6 puestos), CTR 1,48%→0,48%. Contenido IA de valor perdiendo SERP (señal de posición independiente del conteo de clics).
- **[verificado, media] factores-activos-y-pasivos estable de cola:** clics 3→4, pos ~4,6→4,2. Sirve de contraejemplo de input/output (CTR sano 2,5% en pos ~4). Matiz: CTR de hecho baja 2,83%→2,55%; el +1 clic es ruido.

### 4.3 Queries y striking distance
- **[EMPEORA, alta] El cluster input/output pierde ranking** (mismo hallazgo confirmado por 3 dimensiones independientes).
- **[verificado, alta] Striking distance ~2.500-3.000 impresiones con 0 clics en el cluster input/output** (junio): `inputs` 919 impr / pos 8,5 / 0 clics; `que es input y output` 564 / 8,7 / 0; `outputs` 276 / 11,1 / 0; `input output` 206 / 9,9 / 0. **La mayor palanca de clics del sitio sin crear contenido.**
- **[verificado, media] Páginas comerciales atascadas en pos 26-55:** como-crear-programas (334 impr, pos 26), como-vender-software (212 impr, pos 55). Demanda comercial real pero fuera de striking distance.

### 4.4 Indexación
- **[MEJORA, alta] Sitemap pasa de NO registrado a enviado (690 URLs)** y empieza a asociarse a URLs indexadas: refs de sitemap en URLs 0/25 (abril) → 18/25 (mayo). Avance de indexación más importante del periodo.
- **[ESTABLE, alta] `sitemapIndexed:0` es limitación del reporte, NO falta de cobertura.** URL Inspection: 19/25 indexadas, home "Enviada e indexada". No es un problema a resolver.
- **[ESTABLE, alta] Indexación estable en muestra comparable:** 25 URLs idénticas abril/mayo, 20/25 → 19/25 (variación de 1 URL = ruido).
- **[MEJORA, baja] Mejora de descubrimiento:** /blog/ y /reflexiones-agi pasan de "Google no reconoce" a "Descubierta". /sobre/ sigue sin reconocerse.
- **[EMPEORA, baja] Regresión puntual:** /2025/01/04/modelos-de-voz-a-voz-s2s/ pasa de "Enviada e indexada" a "Rastreada: sin indexar". Única deindexación; sin contagio probado al cluster de voz.
- **[ESTABLE, media] Bloque AI dic-2024 atascado:** /2024/12/26/ y /2024/12/27/ en "Rastreada: sin indexar" ~60 días sin progreso. Matiz: /2024/12/28/ SÍ está indexado (no es silo entero).
- **[ESTABLE, media] 22% del catálogo en noindex deliberado (152/690).** 32 posts dudosos sin revisar desde el 30-mar.

### 4.5 Efectividad de los cambios SEO
- **[ESTABLE, alta] Imposibilidad temporal: 0 días de exposición.** Hallazgo descalificante: ningún snapshot puede medir el efecto. Confirmado contra git.
- **[verificado, alta] percepción-y-cultura (5→29 clics) NO es atribuible al SEO:** el salto ya estaba consolidado (29 clics en snapshot 31-may, cierre 05-30) antes del commit que toca el post (31-may 21:19).
- **[verificado, alta] Nokia 888: clics preceden al desbloqueo noindex (PR#26, 01-jun 09:13).** El post ya indexaba y recibía tráfico → la etiqueta "noindex con demanda" es dudosa para este caso.

---

## 5. Top wins (verificados)

1. **Sitemap enviado (690 URLs) y asociándose a URLs indexadas** (0/25 → 18/25 refs). Mejora de infraestructura más sólida del periodo.
2. **+14,3% clics (119→136) con impresiones planas** — mejora de captura real, sostenida.
3. **CTR medio +0,07 p.p. (0,59%→0,66%)** — mejora real, aunque desde suelo crítico y dominada por una sola página.
4. **Mejora de descubrimiento de /blog/ y /reflexiones-agi** ("no reconocida" → "Descubierta").

## 6. Top losses (verificados)

1. **input/output cae de pos 3,66 a 7,52 (-3,86) perdiendo 6 clics** pese a +15% impresiones. CTR 0,47%→0,35%. La amenaza estructural más grave.
2. **MCP cae de pos 7,3 a 13,4 (7→2 clics, -71%)** — silo IA perdiendo SERP.
3. **Posición media global empeora +0,84 puestos** (12,98→13,82).
4. **Regresión de indexación: post s2s deindexado** ("Enviada e indexada" → "Rastreada: sin indexar").

> **Atribuciones tumbadas por el verificador (NO usar como wins):** "percepción-y-cultura motor de éxito SEO replicable" (patrón anómalo: +480% clics pero -58% impresiones y peor posición 3,12→4,50; no atribuible a optimización). "Páginas nuevas con tracción por el sitemap" (atribución causal imposible: sitemap enviado el 31-may, al final de la ventana; muestra de 3-6 clics). "crear software empieza a convertir" (0→1 clic es ruido puro con impresiones cayendo -38%).

---

## 7. Caveats de datos (de obligada lectura)

1. **Exposición cero de los cambios SEO:** todo commiteado el 31-may/01-jun, tras cerrar los periodos. Ningún snapshot mide efectividad.
2. **Snapshots no independientes:** son 2 mediciones reales (marzo vs mayo). Los pares internos solapan 27/28 días → deltas internos = latencia GSC.
3. **Gap de ~2 meses sin datos** (02-abr → 31-may): los cambios de comportamiento no se pueden fechar ni atribuir.
4. **Muestra pequeña:** ~130 clics/mes en todo el sitio; ±1-2 clics por query es ruido estadístico.
5. **Discrepancia páginas vs queries:** totalClicks páginas = 136, pero a nivel query GSC solo reporta 19 clics / 4.393 impresiones (anonimiza ~79-85%). El striking distance opera sobre muestra parcial; las cifras absolutas de cola larga están infraestimadas (lo que refuerza la oportunidad: hay más demanda oculta).
6. **`sitemapIndexed=0` es artefacto** del endpoint Sitemaps de GSC, no realidad. Medir cobertura SIEMPRE con URL Inspection.
7. **Anomalía percepción-y-cultura:** clics 5→29 con impresiones -58% y peor posición. Patrón sospechoso (reasignación de queries por GSC), no caso replicable.
8. **noindex-review.json sin re-auditar desde 30-mar:** el 22% (152/690) refleja estado de marzo, puede no coincidir con el sitemap actual.

---

## 8. Próximas palancas priorizadas

| # | Palanca | Impacto esperado | Esfuerzo | Racional |
|---|---|---|---|---|
| 1 | **Recuperar posición de input/output (pos 7,5 → top 3)** | Alto | Medio | Concentra ~10.476 impr (50,7% del sitio) con CTR 0,35%. Investigar causa de la caída de -3,86 puestos (canonical/URL en migración, canibalización, pérdida de enlaces internos) antes de asumir que el nuevo title la arregla. Mayor clic-upside del sitio. |
| 2 | **Capturar la veta de striking distance del cluster input/output** | Alto | Bajo | ~2.500-3.000 impr en pos 6-11 con 0 clics (`inputs` 919, `que es input y output` 564, `outputs` 276). Title/meta/H1 + bloque FAQ con las variantes literales. Sin contenido nuevo. |
| 3 | **Reescribir snippet de páginas con buena posición y CTR 0** | Medio | Bajo | que-es-pmm (pos 9,3, 225 impr, 0 clics) es problema de title/meta puro. Quick win de bajo esfuerzo. |
| 4 | **Medir efectividad real con snapshots post-deploy (14-jun y 21-jun)** | Alto | Bajo | Imprescindible: los cambios tienen 0 días de exposición. Congelar línea base por URL del snapshot 01-jun y medir delta limpio en julio. Sin esto, cualquier juicio de efectividad es atribución errónea. |
| 5 | **Frenar deterioro del silo IA + recuperar post s2s deindexado** | Medio | Medio | MCP cayó pos 7→13; s2s deindexado. Enlazado interno entre posts IA 2025, refrescar fechas, revisar thin content/canonical y solicitar reindexación. |
| 6 | **Forzar indexación del bloque AI dic-2024 atascado** | Bajo | Bajo | /2024/12/26/ y /2024/12/27/ llevan ~60 días en "Rastreada: sin indexar". Enlazado interno desde páginas que rankean. Excluir /2024/12/28/ (ya indexado). |

---

## 9. Conclusión

**Veredicto: MIXTO.** El sitio crece modestamente en clics (+14,3%) y CTR (+0,07 p.p.) con mejora real de infraestructura (sitemap enviado, indexación estable), pero su activo principal (input/output) se degrada en posición y arrastra el rendimiento, y la posición media global empeora. La mejora aparente más grande (percepción-y-cultura) es un patrón anómalo no atribuible a optimización. **Crítico:** los snapshots NO miden el efecto de los cambios SEO (exposición cero); el próximo snapshot post-deploy (≥14-jun) es la única forma de evaluar si el programa SEO funciona. No celebrar mejoras como éxito del loop SEO: estamos midiendo la línea base.
