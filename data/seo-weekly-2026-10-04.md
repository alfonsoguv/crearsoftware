# Informe semanal SEO/GEO — 4 de octubre de 2026

Ejecución programada. Primera semana de mes: además del ciclo semanal, toca leer clics
(`seo:gsc` y `seo:gsc:analysis`).

---

## El hallazgo: «Google no reconoce esta URL» no es un estado, es ruido de la API

El punto abierto 1 decía que lo único accionable de la no indexación eran las URLs en
estado **«Google no reconoce esta URL»**, como candidatas a pedir indexación a mano.
**Esa premisa es falsa.** Medido hoy:

1. Reuní todas las URLs que han salido con ese estado en las 11 ejecuciones de
   `seo:gsc:indexation` desde abril: **22 URLs distintas**. En su última lectura
   tenían algo en común que parecía una pista fuerte: **0 referentes y 0 sitemaps**
   conocidos por Google, frente a las 322 restantes, que tenían todas al menos un
   referente. Pero en el sitio están en el sitemap, responden 200 y tienen entre 3 y
   24 enlaces internos.
2. Al reinspeccionarlas, **18 de las 22 ya no están en ese estado**: 9 indexadas, 3
   rastreadas sin indexar y 6 descubiertas. Y no solo con el tiempo:
   `velneo-v7-y-skype` salió «no reconocida» en la muestra de las 18:26 y
   «Descubierta» (4 referentes, 1 sitemap) a las 18:50.
3. **La prueba decisiva:** reinspeccioné las 5 dudosas dos veces seguidas, con 30
   segundos de diferencia. Tres cambiaron de estado entre una llamada y la siguiente,
   en los dos sentidos (`quien-triunfa-en-internet`: Descubierta → no reconoce;
   `trabajar-mucho-es-bueno`: no reconoce → Descubierta). `problemas-innovacion-en-espana`
   ya había ido y vuelto entre semanas (no reconoce el 02-ago → Descubierta el 26-sep
   → no reconoce hoy).
4. **Control:** 10 URLs indexadas de la muestra de hoy, 3 inspecciones cada una:
   **30 de 30 «Enviada e indexada»**, estables.

**Conclusión:** para las URLs que Google no ha rastreado, la API de inspección no es
determinista. Alterna entre «no reconoce» (sin datos) y «Descubierta» (con referentes y
sitemap): parece que unas réplicas tienen el registro y otras no. Consecuencias:

- **La tasa de indexación no está sesgada.** La inestabilidad va entre dos estados de no
  indexación; las indexadas no la sufren. El 74,6 % sigue valiendo.
- **«No reconoce» y «Descubierta» son la misma población:** URLs que Google conoce por
  enlaces y no ha rastreado nunca. No son un grupo especial, así que **no hay motivo
  para pedir indexación a mano de esas URLs en concreto**. Quito esa recomendación del
  punto abierto 1, y con ella las dos URLs que los informes del 26 y 27-sep proponían.
- La pregunta que queda es otra: ¿llegan a rastrearse alguna vez? De las 22, 12 han
  acabado rastreadas (9 indexadas y 3 sin indexar), así que sí, con meses de retraso.

**Infraestructura nueva: `scripts/gsc-unknown-panel.mjs`** (`npm run seo:gsc:unknown`,
encadenado a `seo:gsc:indexation`). Mantiene un **panel fijo** con las 22 URLs, que
crece solo con las nuevas que aparezcan, y las reinspecciona cada semana, acumulando la
historia en `data/gsc-unknown-panel.json`. La muestra rotativa ve cada URL una vez por
vuelta al sitemap y nunca habría detectado esto. Cuesta 22 llamadas de un cupo de 2000
al día. `inspectUrl` pasa a `scripts/lib/google-search-console.mjs` para compartirlo.

---

## Issue #35: siete días completos solapados, los agentes en vivo coinciden exactos

| Día | KV | Borde | Borde / KV | Vivo KV | Vivo borde |
| --- | --- | --- | --- | --- | --- |
| 27-sep | 134 | 154 | 1,15 | 17 | 17 |
| 28-sep | 133 | 140 | 1,05 | 14 | 14 |
| 29-sep | 139 | 143 | 1,03 | 10 | 10 |
| 30-sep | 1.207 | 1.249 | 1,03 | 15 | 15 |
| 01-oct | 154 | 158 | 1,03 | 10 | 10 |
| 02-oct | 1.441 | 1.428 | 0,99 | 8 | 8 |
| 03-oct | 164 | 165 | 1,01 | 9 | 9 |
| **Total** | **3.372** | **3.437** | **1,02** | **83** | **83** |

- **Agentes en vivo: 83 = 83, coincidencia exacta los siete días**, igual que en las dos
  ventanas parciales de la semana pasada. Para la métrica del encargo las dos fuentes son
  intercambiables.
- En el total, el borde cuenta un 2 % más (la semana pasada parecía un 7-12 %, con dos
  ventanas parciales). Las diferencias están en los rastreadores de ráfaga.
- **Una anomalía sin explicar:** el 02-oct, KV contó **más** que el borde en GPTBot
  (1.302 frente a 1.278), cuando la pérdida conocida de KV va en el otro sentido. Una
  posibilidad es el muestreo adaptativo de `httpRequestsAdaptiveGroups` en ráfagas; no
  lo he comprobado. No afecta a los agentes en vivo, que nunca llegan en ráfaga.
- **Recomendación:** el plan era 2-3 semanas en paralelo antes de borrar nada. Llevamos
  una semana completa y dos ventanas parciales. Si la semana que viene se repite la
  coincidencia exacta, se puede retirar `recordHit`, `/api/bots` y `AI_AGENTS`. Ojo
  entonces con `scripts/healthcheck-prod.mjs`, que comprueba `/api/bots`, y con **no
  tocar el binding de KV**, que sigue usando el alta de newsletter.

---

## Métricas semanales

**Agentes en vivo (borde), serie diaria:**

| 20-sep | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 01-oct | 02 | 03 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 9 | 27 | 29 | 31 | 17 | 11 | 13 | 17 | 14 | 10 | 15 | 10 | 8 | 9 |

El pico del 21-23 de septiembre no ha vuelto; la semana se ha quedado en 8-17 al día,
alrededor de la media previa (9,0/día). Lo describo y no lo testeo (la serie es
sobredispersa). Ventana de 28 días en KV: 6.088 peticiones, 232 de agentes en vivo
(ChatGPT-User 213, Claude-User 19). Las dos ráfagas de la semana (Meta-ExternalAgent
el 30-sep, ~1.090; GPTBot el 02-oct, ~1.280) son de entrenamiento.

**Markdown en agentes en vivo:** **0 de 220** en los 14 días del borde (IC 95 % superior
≈ 1,7 %). Sigue acumulando hacia ~500.

**Indexación:** n = 25, `errorCount` = 0, tasa 88,0 % (IC 70,0-95,8 %). Es una muestra
de 25: no cambia el 74,6 % establecido, que su IC contiene. Cobertura acumulada **406 de
708** URLs, 9 ejecuciones del muestreo rotativo.

**Bing:** 45 clics y 4.121 impresiones en la ventana del panel. La consulta con más
clics de la semana es «que es algoritmo» (4 clics el 02-oct, posición 9), la del post
del 26-sep. Es un dato suelto; lo apunto y no lo interpreto.

**Audit:** build limpio, 855 páginas HTML. Mismos avisos heredados de WordPress (273
imágenes rotas en 174 posts antiguos, 2 shortcodes de vídeo, 13 enlaces al dominio viejo).

---

## Clics (primera semana de mes)

- **Últimos 28 días (04-sep → 01-oct): 273 clics**, 41.027 impresiones, CTR 0,67 %,
  posición media 9,4. La ventana del 26-sep (27-ago → 23-sep) dio 265: el nivel nuevo se
  mantiene.
- **Trimestre (06-jul → 03-oct) frente al anterior: 516 clics frente a 356 (+45 %)**,
  impresiones +41 %, posición 11,8 (mejora de 2,7 puestos). México aporta 207 de los 516.
- La concentración sigue igual: el post de input/output trae 74 de los 273 clics.
- Con un mes más de datos no hay nada que añadir a la explicación del 26-sep. La
  comparación que decide (oct-nov 2026 frente a oct-nov 2025) se podrá hacer a primeros
  de diciembre.

---

## Publicado esta semana

**Artículo: [Qué es una variable en programación](https://crearsoftware.com/blog/que-es-una-variable-en-programacion/)**
— definición, sus tres partes (nombre, valor, tipo), declarar y asignar, por qué
`x ← x + 1` no es una ecuación, los cuatro tipos básicos, tipado estático y dinámico,
constante, contador y acumulador (con el ejercicio de la media), el intercambio con
variable auxiliar, el ámbito, las reglas para poner nombres, seis errores frecuentes y
una tabla que separa el sentido de «variable» en programación, matemáticas, estadística y
control de gestión. Seis preguntas frecuentes con FAQPage.

Es la cuarta pieza de la serie algoritmo → diagrama de flujo → pseudocódigo. El post de
pseudocódigo ya usaba «variable» sin explicarla. Enlazado desde el pseudocódigo (donde
aparece la asignación) y desde el algoritmo; enlaza a su vez a *variables de control*,
el post de 2009 que rankea por «variable de control» (1.718 impresiones) en el sentido de
gestión, para que ninguno de los dos le quite la consulta al otro.

**Infraestructura:** el panel fijo de URLs no rastreadas (arriba).

---

## Correcciones al encargo

- **El `sameAs` del autor ya estaba hecho** desde el 23-ago-2026: `build-blog.js` emite
  todos los perfiles declarados, incluido el GitHub. El punto 6 de «palancas GEO no
  hechas» está desfasado; solo falta el LinkedIn, que está vacío en
  `authors/alfonso-gutierrez.json` y tiene que rellenarlo Alfonso.
- **Punto abierto 1:** «Google no reconoce esta URL» no es una categoría accionable
  (arriba). Lo que queda abierto es «Rastreada: actualmente sin indexar», sin cambios.
- **El token de GSC sobrevivió al 30-sep:** cerrado, como ya recoge la memoria.

---

## Estado de las comprobaciones bloqueantes

| # | Comprobación | Estado |
| --- | --- | --- |
| 1 | Token de GSC | ✅ vivo el 04-oct, pasado el 30-sep: cerrado |
| 2 | Rastreadores de IA | ✅ 200 en `/robots.txt` con ChatGPT-User |
| 3 | Cuota de KV | ✅ sin riesgo |
| 4 | Despliegue en producción | ✅ healthcheck 6/6 antes de empezar; despliegue de hoy verificado contra el HTML real |

---

## Abierto

1. **Issue #35:** una semana más en paralelo y se decide (ver arriba qué no romper).
2. **«Rastreada: actualmente sin indexar»** sigue sin explicación. El panel dirá cuánto
   tardan en rastrearse las URLs descubiertas.
3. **Markdown en agentes en vivo:** 0 de 220; seguir hasta ~500.
4. **Pendiente de Alfonso:** exportar los CSV de «AI Performance» de Bing a
   `data/bing-ai-performance/`. La última exportación es de agosto; **si pasa de este
   mes, septiembre se pierde**. Y rellenar el LinkedIn del autor si quiere que entre en
   `sameAs`.
