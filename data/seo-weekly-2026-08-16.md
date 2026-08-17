# Informe semanal SEO/GEO — 2026-08-16

## Bloqueos

- **⚠️ La cuota diaria de KV se agotó dos veces.** El 05-ago (1027 hits) y el 12-ago
  (1253, de los que **1248 fueron una sola ráfaga de GPTBot**) superaron el cupo de
  ~1000 escrituras/día de la cuenta. Ese cupo se comparte con el alta de newsletter,
  así que **es probable que esos dos días se perdieran altas de suscriptores**. Ya no
  es un riesgo teórico del issue #35: ha ocurrido. Mitigado esta semana (ver abajo),
  pero la migración a Analytics Engine sigue siendo lo correcto y sigue necesitando
  el panel de Cloudflare.
- **Token de GSC caducado.** `npm run seo:gsc:indexation` falla con `invalid_grant`.
  Segunda semana consecutiva sin poder avanzar el muestreo rotativo de indexación:
  el cursor sigue congelado. Lo desbloquea publicar la app OAuth de Google Cloud.
- Rastreadores de IA: **no bloqueados**. ChatGPT-User, Claude-User y PerplexityBot
  reciben 200.
- Despliegue: verificado en producción descargando el HTML real, no solo por Actions.

## Corrección: la «caída real» de agentes en vivo del informe anterior era ruido

El informe del 09-ago concluyó que la bajada de agentes en vivo de los días 6-8 de
agosto era una caída real y no ruido, con un `p ≈ 2·10⁻⁴` calculado bajo un modelo de
Poisson con tasa constante. **Esa conclusión era incorrecta, y por partida doble.**

Primero, la serie posterior la desmiente sin necesidad de estadística:

| Día | Agentes en vivo |
| --- | --- |
| 2026-08-06 | 1 |
| 2026-08-07 | 5 |
| 2026-08-08 | 2 |
| 2026-08-09 | 13 |
| 2026-08-10 | 12 |
| 2026-08-11 | 11 |
| 2026-08-12 | 0 |
| 2026-08-13 | 11 |
| 2026-08-14 | 12 |
| 2026-08-15 | 2 |

No hubo cambio de nivel: hubo un valle de tres días dentro de una serie que oscila
entre 0 y 18 sin tendencia.

Segundo, y esto es lo que hay que retener: **el modelo estaba mal elegido**. Sobre los
15 días completos (media 8,4/día) la varianza es 29,0, así que el índice de dispersión
es **φ = 3,45**. Poisson exige φ = 1. Con esa sobredispersión, rehacer el mismo test —
8 observados frente a 24 esperados, varianza 24·3,45— da `z = −1,76`, **p ≈ 0,08**. No
significativo.

La lección es general y conviene dejarla escrita: **el tráfico de rastreadores llega en
ráfagas, no en un goteo aleatorio independiente.** Un solo agente puede hacer 1248
peticiones en un día. Cualquier test que asuma Poisson sobre estos contadores va a
producir significaciones falsas. Para esta serie hay que usar quasi-Poisson o binomial
negativa, o directamente mirar la serie y no testear.

## Hallazgo: los `.md` los piden los rastreadores de entrenamiento, no los que citan

Es el punto abierto nº 3 del encargo, y ya tiene respuesta. Sobre **1936 peticiones
medidas** desde que se instrumentó el formato el 09-ago:

| Agente | Familia | Medidas | En Markdown | % md |
| --- | --- | --- | --- | --- |
| GPTBot | Entrenamiento | 1266 | 470 | 37,1% |
| ClaudeBot | Entrenamiento | 32 | 12 | 37,5% |
| Amazonbot | Entrenamiento | 131 | 28 | 21,4% |
| Bingbot | Búsqueda | 207 | 3 | 1,4% |
| Googlebot | Búsqueda | 214 | 0 | 0% |
| PerplexityBot | Búsqueda | 21 | 0 | 0% |
| ChatGPT-User | **En vivo** | 59 | 0 | 0% |
| Claude-User | **En vivo** | 5 | 0 | 0% |

La separación cae justo sobre la frontera que importa. Tres rastreadores de
entrenamiento de tres empresas distintas piden Markdown de forma sistemática; los de
búsqueda casi nunca; **los agentes en vivo, que son los que generan la cita, cero de 64**.

Los límites, explícitos:

- Cero de 64 no es «nunca»: el IC 95% de Wilson es **[0% – 5,7%]**. Lo que sí descarta
  es la hipótesis optimista — a la tasa de GPTBot (37%) habríamos visto ~24 de 64.
- De las 1266 peticiones medidas de GPTBot, **1248 son el barrido del 12-ago**. Ese
  37,1% describe un evento, no una tasa estable. Lo que sostiene el patrón son
  Amazonbot (131 peticiones repartidas en 8 días) y ClaudeBot, que son independientes.

**Consecuencia práctica, y es casi la contraria al discurso habitual de GEO:** el gemelo
Markdown es una palanca de *corpus* (entrenamiento, horizonte de meses, inatribuible),
no de *citación*. Lo que lee el agente que responde ahora mismo a un usuario es el HTML,
siempre. Si el objetivo es que te citen, el trabajo está en el HTML.

No se retira el gemelo `.md`: cuesta poco y el canal de entrenamiento es real. Pero deja
de contar como palanca de citación a corto plazo.

## Contaminación de la métrica: reincidencia

El informe anterior avisó de que comprobar los rastreadores con
`curl -A "ChatGPT-User" https://crearsoftware.com/` inyecta hits en la familia de menor
volumen, y recomendó usar `/robots.txt`. **Esta semana la comprobación se volvió a hacer
contra la home**, porque el comando sigue escrito así en la definición de la tarea. Son
3 hits inyectados hoy (ChatGPT-User, Claude-User, PerplexityBot).

El caveat está en el script y sale en todos los informes, pero eso no basta: mientras el
comando de la tarea diga `/`, se seguirá contaminando. **Solo Alfonso puede editar
`~/.claude/scheduled-tasks/crear-softaware/SKILL.md`.**

## Infraestructura: el contador deja de escribir un `put` por hit

El middleware hacía un `get` + un `put` en KV por **cada** petición de rastreador. Con
1248 peticiones de GPTBot en un día, eso es 1248 escrituras: el cupo entero de la cuenta.

Los hits se agregan ahora en memoria del isolate y se vuelcan por lotes (`flushBuffer`),
con volcado cuando se acumulan 50 hits, cuando pasa un minuto, o cuando el buffer
arrastra claves de una hora ya cerrada. Medido sobre la ráfaga real del 12-ago:

| Escenario | Escrituras antes | Escrituras ahora | Hits perdidos |
| --- | --- | --- | --- |
| Ráfaga de 1248 hits (12-ago) | 1248 | **25** | 0 |
| 400 hits, 4 agentes concurrentes | 400 | **32** | 0 |
| 20 hits dispersos (>60 s entre sí) | 20 | **20** | 0 |

Reducción de 50× donde importa, y en el caso disperso el coste es idéntico al anterior:
**nunca es peor que antes**. La contrapartida asumida es que si el isolate muere con el
buffer sin volcar se pierden esos hits; el contador ya era aproximado por diseño y está
documentado en el fichero.

Esto **no cierra el issue #35**: mitiga el síntoma. Añadir el binding de Analytics Engine
requiere el panel de Cloudflare.

## Bing Webmaster Tools: 365 impresiones, 0 clics

Diez días con datos (04 al 13 de agosto). El dato relevante no es el volumen sino el
cero: **0 clics sobre 365 impresiones** tiene un IC 95% superior del **1,0%**. Un CTR
normal en esas posiciones (medias de 3 a 9) estaría entre el 2% y el 10%. Es decir, el
CTR observado es incompatible con el esperado: las impresiones **se están resolviendo
sin visita**, que es exactamente la firma de la respuesta generativa.

Refuerza la lectura la forma de las consultas, cada vez más claramente pegadas desde un
chat: *«hablame de la ia mcp q sacara odo santadrd»*, *«quiero crear una empresa de
ingeniería de software… enfocado en chile»*, *«qué es en lo que te destacas como ai
frente a otros servicios similares?»*. No son búsquedas, son prompts.

Consulta con más volumen: *«que es mcp»*, 20 impresiones en posición 9 el 14-ago.

Detalle menor a vigilar: hay **dos sitemaps** dados de alta, con y sin `www`
(695 y 694 URLs). Conviene dejar solo el canónico, pero no parece estar causando daño.

Sigue pendiente que Alfonso mire **«AI Performance»** a mano en bing.com/webmasters: es
donde vive el *citation share* y no tiene endpoint en la API.

## Salud del build

`npm run audit`: sin regresiones. 0 assets heredados faltantes, 0 páginas noindex en el
sitemap, 404 en su sitio. Los hallazgos de siempre (enlaces a `alfonsogu.com`, imágenes
rotas de WordPress, un shortcode de VideoPress) siguen siendo deuda heredada conocida.

Build: 842 páginas HTML, 696 URLs en sitemap, 5 guías.

## Publicado

- **Artículo:** [Quién pide de verdad tus ficheros .md: una semana midiendo qué formato
  consume la IA](https://crearsoftware.com/blog/quien-pide-markdown-agentes-ia-medicion/)
  — 200 verificado en producción con el contenido nuevo, gemelo `.md` también 200,
  presente en el sitemap, `<link rel="alternate">` emitido.
- **Infraestructura:** agregación en memoria del contador de rastreadores; 50× menos
  escrituras de KV en ráfaga, sin pérdida de hits.
- IndexNow enviado tras el despliegue: HTTP 200.

## Pendiente de Alfonso

1. **Issue #35 / cuota de KV — ya no es hipotético.** El cupo se agotó el 05 y el 12 de
   agosto, y con él pudieron perderse altas de newsletter. La mitigación de esta semana
   compra margen; el binding de Analytics Engine sigue requiriendo el panel.
2. **Publicar la app OAuth de Google Cloud.** Segunda semana sin medición de indexación.
3. **Cambiar el chequeo de rastreadores a `/robots.txt`** en la definición de la tarea.
   Es la segunda semana que se contamina la métrica principal por esto.
4. **Mirar «AI Performance»** en bing.com/webmasters.
5. **Borrar el token de Cloudflare** expuesto en una conversación anterior.
6. Menor: dejar un solo sitemap dado de alta en Bing (con o sin `www`).

## Nota sobre ficheros del repo

Seguían sin commitear al empezar la semana y **no** se han incluido, por si quieres
revisarlos tú: `data/cf-traffic-2026-08-01.json|md`, `data/cf-traffic-latest.json|md`,
`guides/guia-agentes-ia-empresas.md`, y `data/bing-report-2026-08-05.json|md` (sin
seguimiento). Llevan dos semanas así.

## Cadencia

Tercera semana de agosto: **no se han mirado clics ni impresiones de Google**, por
diseño. La próxima revisión de rendimiento toca la primera semana de septiembre.

Sigue viva la predicción falsable sobre las guías pilar: enlazadas desde la home desde el
02-ago, deben superar **150 impresiones** en la ventana de 28 días que cierre a finales
de septiembre. Si se quedan por debajo de 60, el enlazado interno no era el cuello de
botella. Dato colateral de esta semana: las cinco guías reciben tráfico de agentes
(17, 13, 12 y 11 peticiones las cuatro más leídas), así que sí están siendo descubiertas.

---

## Addenda 2026-08-17: GSC desbloqueado y corrección de la tasa de indexación

El token de GSC ya funciona. La app OAuth pasó a **«En producción»**, que es lo que quita la
caducidad de 7 días —esa regla solo aplica en estado *Prueba*—, y se emitió un refresh token
nuevo. El bloqueo que arrastraban los dos informes anteriores queda cerrado.

Con eso se pudo ejecutar `seo:gsc:indexation`, y el resultado **corrige una conclusión previa**.

### El «60% de tasa de indexación» era ruido de muestreo

El informe del 02-ago declaró que «la tasa de indexación real del sitio es del 60%, no el 84%».
La serie completa de ejecuciones dice otra cosa:

| Fecha | n válidas | Indexadas | Tasa |
| --- | --- | --- | --- |
| 2026-04-01 | 99 | 73 | **73,7%** |
| 2026-04-02 | 25 | 20 | 80,0% |
| 2026-05-31 | 25 | 19 | 76,0% |
| 2026-07-31 | 25 | 20 | 80,0% |
| 2026-08-01 | 25 | 21 | 84,0% |
| 2026-08-02 | 25 | 15 | **60,0%** |
| 2026-08-17 | 21 | 20 | **95,2%** |

El 60% y el 95,2% son los dos extremos de la dispersión de una muestra de 25, no dos estados
del sitio. El propio IC del 60% (41-77%) ya contenía al resto de ejecuciones: **nunca hubo
contradicción con el 84%, hubo sobreinterpretación de una muestra suelta.** La lectura correcta
es que la tasa ronda el **75-80% y lleva estable todo el año**, con la ejecución de abril
(n=99, IC 64-81%) como la más informativa.

Tampoco hay que leer el 95,2% de hoy como una mejora: es una muestra de 21 y arrastra el sesgo
del punto siguiente.

### Los timeouts de la API de inspección no son aleatorios

De las 25 URLs inspeccionadas hoy, 4 dieron timeout. **Las 4 son exactamente las 4 que llevan
`%C2%BF` en el slug** —el `¿` heredado de WordPress—, y ninguna de las 20 sin ese signo falló.
Con 5 URLs de ese tipo en la muestra, 4 fallaron.

Importa porque el script **excluye los errores del denominador**: hoy eso da 95,2% (20/21), y
contarlos como no indexados daría 80% (20/25), que encaja con toda la serie histórica. Como el
sitio tiene 218 posts con ese slug, el sesgo es estructural, no anecdótico.

**Regla para los próximos informes: mirar `errorCount` antes que `indexedRatePercent`.**

Cobertura acumulada del muestreo rotativo: 50 de 696 URLs, ejecución nº 2 del ciclo actual.
