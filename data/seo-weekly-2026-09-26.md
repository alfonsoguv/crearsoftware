# Informe semanal SEO/GEO — 26 de septiembre de 2026

Ejecución manual, a petición de Alfonso. La anterior con informe fue la del 30-ago:
el ciclo del 20-sep arrancó pero se desvió a otras tareas y no llegó a producir informe,
así que **hay cuatro semanas sin medición** (6, 13 y 20 de septiembre).

---

## ⚠️ El hallazgo de la semana: el contador de agentes llevaba seis días caído, y fue culpa mía

`/api/bots` devolvía **503 «CS_KV no está enlazado a este proyecto»**. No es un fallo de
Cloudflare ni de cuota: es una regresión que introduje yo el 20-sep.

**Qué pasó.** El 20-sep el despliegue estaba roto porque GitHub retiró la acción
`cloudflare/pages-action`. La sustituí por `cloudflare/wrangler-action@v3`. Lo que no
previne es que **`wrangler pages deploy` aplica `wrangler.toml` al proyecto**: lo que no
esté escrito en ese fichero se borra del panel de Cloudflare. El `wrangler.toml` del repo
tenía el bloque `kv_namespaces` **comentado** desde la migración inicial (con un
`NAMESPACE_ID` de plantilla), así que el primer despliegue con wrangler —`f646180`, 20-sep
20:33— borró el binding `CS_KV` de producción.

**Qué se perdió.** Del 20-sep 20:33 al 26-sep 13:05, seis días:

| Afectado | Consecuencia |
| --- | --- |
| `/api/bots` + middleware | **Cero peticiones de agentes contabilizadas.** Seis días de la métrica del encargo, irrecuperables |
| `/api/subscribe` | **Las altas de newsletter devolvían 503.** Si alguien intentó suscribirse en esos seis días, se perdió |
| `compatibility_date` de producción | Cayó de 2026-03-29 a 2024-01-01, la del fichero |

Preview conservó el binding —de ahí saqué el namespace id— porque wrangler solo
sobrescribió el entorno al que desplegaba.

**Por qué nadie se enteró.** Las seis ejecuciones de GitHub Actions entre el 20 y el 26
terminaron **en verde**. El HTML se servía perfecto; lo único roto eran dos endpoints que
nada comprueba. Ni el despliegue ni mirar la web lo delataban.

**Arreglado** (`a45521d`): `wrangler.toml` declara ahora el binding para producción y
preview, con `compatibility_date` correcta y un comentario explicando por qué no se puede
volver a comentar. Verificado contra la API de Cloudflare (bindings restaurados en los dos
entornos) y con `/api/bots` respondiendo 200.

**Corrección a lo que dije el 20-sep.** Cuando sustituí la acción de despliegue, di por
bueno que «los mismos secretos» bastaban. No comprobé los *bindings*, que es justo lo que
distingue a las dos acciones. El despliegue en verde me confirmó el sesgo.

---

## La métrica del encargo: agentes de IA

4.653 peticiones en la ventana de 28 días, **pero la ventana está mutilada**: del 21 al 26
no hay datos. Los 22 días con datos van del 30-ago al 20-sep.

### Agentes en vivo (los que generan la cita)

| | Valor |
| --- | --- |
| Media | **9,0 peticiones/día** (n = 22 días) |
| Varianza | 12,5 |
| Índice de dispersión φ | **1,40** |
| Referencia de agosto | 8,4/día, φ = 3,45 |

**No hay cambio.** 9,0 frente a 8,4 está dentro del ruido de una serie sobredispersa, y
con φ = 1,40 ni siquiera hace falta discutirlo. Lo interesante es que **φ ha bajado de 3,45
a 1,40**: la sobredispersión de agosto venía de ráfagas puntuales (la de 1.248 peticiones de
GPTBot el 12-ago), y este periodo no ha tenido ninguna. Sigue sin ser Poisson, pero está
más cerca.

Reparto: ChatGPT-User 173 · Claude-User 22 · Perplexity-User 2.

### Por familia

| Familia | Peticiones | % Markdown |
| --- | --- | --- |
| Entrenamiento | 3.099 | 13,3 % |
| Búsqueda generativa | 753 | 19,8 % |
| Buscador clásico | 604 | 0 % |
| **Agentes en vivo** | **197** | **0 %** |

**El cero de Markdown en agentes en vivo aguanta: 0 de 197 en esta ventana.** Acumulado con
las mediciones anteriores (0 de 64 el 16-ago), vamos por 0 de 261. El umbral que fijamos
para reconfirmarlo era ~500, así que sigue abierto, pero la dirección no cambia: **el gemelo
`.md` es palanca de corpus, no de citación.** Lo que lee el agente que responde a un
usuario es el HTML.

### Páginas más leídas por agentes

La home (339) y `/blog/` (87) dominan, como siempre. Detrás, el patrón conocido: los posts
de conceptos básicos. `input y output` (48), `¿qué es un producto?` (38), `qué es un
algoritmo` (27). Y una sorpresa razonable: `/2025/03/29/plataformas-de-agentes-de-voz-con-ia`
con 59, tercera del sitio.

---

## Indexación

Ejecución n = 25, **`errorCount` = 0** (sin sesgo por timeouts, que es lo primero que hay
que mirar).

| | Valor |
| --- | --- |
| Tasa | **76,0 %** (19 de 25) |
| Cobertura acumulada | **369 de 706 URLs** del sitemap (7 ejecuciones) |

Encaja con el 74,6 % establecido (IC 69,8-78,9 %). Sin novedad: **la tasa lleva estable
todo el año**. No la vuelvo a declarar a partir de esta muestra suelta.

De las 6 no indexadas: 4 «Rastreada: actualmente sin indexar», 1 «Descubierta», y **1
«Google no reconoce esta URL»** (`/2007/07/12/el-poder-de-la-comunicacion/`). Esta última
sigue siendo la categoría accionable: está en el sitio, responde 200 y Google dice no
conocerla.

---

## Bing (canal de la citación generativa)

33 clics y 3.237 impresiones en la ventana. La serie diaria de impresiones sube en la
última semana (112 el 23-sep, el máximo del periodo) con los clics planos en 0-2/día.

**Las consultas confirman de qué se cita este sitio**, y no deja lugar a dudas:

| Consulta | Posición |
| --- | --- |
| qué es un algoritmo | 9 |
| ¿cuál es la diferencia entre un algoritmo en la vida cotidiana y uno informático? | 2 |
| input y output ejemplos | 1 |
| ejemplos de inputs de una empresa | 1 |
| datos de entrada (inputs) dame un ejemplo | 8 |
| entradas input definición en producción | 5 |

Son **preguntas de módulo formativo pegadas literalmente en el buscador**. Es exactamente
lo que el panel de AI Performance ya decía en agosto (el 37,5 % de citation share de una
pregunta de e-learning), y ahora se ve también en las consultas orgánicas.

Nota: el post de algoritmo, publicado el 30-ago, ya aparece en posición 9 con 91
impresiones. Menos de un mes.

---

## Publicado esta semana

**Artículo: [Qué es un diagrama de flujo](https://crearsoftware.com/blog/que-es-un-diagrama-de-flujo/)**
— símbolos ISO 5807, un ejemplo resuelto, las seis reglas, los cuatro errores frecuentes y
la comparación con algoritmo y pseudocódigo.

La elección no es por gusto: es la pieza que falta entre los dos posts que más se citan
(`input/output` y `algoritmo`), no había **nada** publicado sobre diagramas de flujo en 835
posts, y la demanda medida en Bing es formativa. Enlazado desde el post de algoritmo, que
ya posiciona.

**Infraestructura: `scripts/healthcheck-prod.mjs`**, enganchado al workflow después del
despliegue. Comprueba home, `/api/bots`, `/api/subscribe`, sitemap, `llms.txt` y que
ChatGPT-User no esté bloqueado; si algo falla, **tumba el workflow**. Probado en los dos
sentidos: 6/6 contra producción, y 4 fallos detectados contra un origen que no los sirve.
Ya ha corrido en el despliegue de hoy.

Es la lección directa del fallo del KV: un despliegue en verde no significa que el sitio
funcione. Ahora, si un despliegue vuelve a borrar un binding, Actions se pone en rojo en
45 segundos en vez de tardar seis días.

**Además, durante la semana** (fuera de ciclo, a petición de Alfonso): los artículos de
[servicio nativo de IA](https://crearsoftware.com/blog/que-es-un-servicio-nativo-de-ia/) y
[forward deployed engineer](https://crearsoftware.com/blog/que-es-un-forward-deployed-engineer/),
la retirada de la cabecera de presentación de la home, y el arreglo del diseño móvil
(el contenido desbordaba el ancho de la pantalla: columna de grid `1fr` sin `minmax(0,…)`,
URLs largas sin corte y tablas anchas).

---

## Estado de las comprobaciones bloqueantes

| # | Comprobación | Estado |
| --- | --- | --- |
| 1 | Token de GSC | ✅ vivo (cliente `deepdna-youtube`; se cierra el 30-sep) |
| 2 | Rastreadores de IA | ✅ 200 para ChatGPT-User, Claude-User, PerplexityBot y GPTBot |
| 3 | Cuota de KV | ✅ Workers Paid, sin riesgo (y ahora, además, vigilada por el healthcheck) |
| 4 | Despliegue en producción | ✅ verificado contra el HTML real |

---

## Abierto

1. **«Rastreada: actualmente sin indexar»** sigue sin explicación. Descartados: longitud,
   duplicación semántica, antigüedad, el `¿` del slug, enlaces internos. Lo accionable
   sigue siendo pedir indexación a mano de las URLs en «Google no reconoce esta URL».
2. **Predicción de las guías pilar**: la ventana de 28 días que cierra a finales de
   septiembre debe superar las 150 impresiones. **Se comprueba la semana que viene**, en la
   primera ejecución de octubre, que además lleva análisis de clics.
3. **Reconfirmar el cero de Markdown en agentes en vivo** al llegar a ~500 de muestra
   (vamos por 261).
4. **Issue #35** (derivar el contador del GraphQL de Cloudflare): sin urgencia. Nota nueva
   a favor: el contador propio se puede romper en silencio con un cambio de despliegue,
   cosa que al GraphQL no le pasa.
5. **Pendiente de Alfonso:** exportar a mano los dos CSV de «AI Performance» de Bing a
   `data/bing-ai-performance/`. Es la única fuente cuantitativa de citación y la ventana
   del panel es limitada. Cadencia razonable: mensual. La última es de agosto.

---

## Ficheros sin commitear que ya estaban al empezar

`data/cf-traffic-2026-08-01.*`, `data/cf-traffic-latest.*`, `data/bing-report-2026-08-05.*`
y `guides/guia-agentes-ia-empresas.md`. No los toco por si quieres publicarlos tú.
