# Informe semanal SEO/GEO — 11 de octubre de 2026

Ejecución programada. Segunda semana de mes: no toca leer clics (la última lectura fue
el 04-oct, hace una semana).

---

## El hallazgo: dos tercios de los «agentes en vivo» piden la home, no un artículo

La familia «agentes en vivo» (ChatGPT-User, Claude-User, Perplexity-User) es la métrica
del encargo porque se supone que cada petición es un agente leyendo una página para
responder a un usuario, es decir, una cita posible. Desglosada por ruta en el contador
de borde (21 días, 20-sep → 10-oct):

| | Peticiones | % |
| --- | --- | --- |
| Home (`/`) | 202 | 68 % |
| Cualquier otra página | 95 | 32 % |
| **Total** | **297** | |

- La home aparece **los 21 días** y siempre como la ruta más pedida de la familia. Las
  peticiones se reparten por todas las horas del día (en la semana del 04 al 10-oct, de
  1 a 2 por hora, con huecos), sin ráfagas.
- **El pico del 21-23 de septiembre (27-31 al día) era sobre todo la home**: 20 al día
  frente a 7-11 de contenido. El informe del 04-oct lo leyó como un pico de la métrica;
  lo de contenido sí subió (la semana del post de servicio nativo de IA, 21 peticiones
  a ese post), pero la mayor parte del salto era la home.
- **La señal de contenido es de 4,5 peticiones al día** (95 en 21 días), no las ~10-14
  que da el total de la familia. Serie diaria de contenido: 4, 7, 9, 11, 7, 5, 5, 4, 4,
  3, 2, 3, 0, 3, 1, 7, 2, 5, 5, 8, 0. La describo sin testear (sobredispersa).

**¿Son de verdad de OpenAI?** Sí. He comprobado con la dimensión `verifiedBotCategory`
del GraphQL de Cloudflare, que verifica el bot por su IP: en los 8 días que retiene la
API, **74 de 74 peticiones de páginas de ChatGPT-User están verificadas** («AI
Assistant»), incluidas las de la home. No es suplantación ni autoinyección (el
healthcheck usa `/robots.txt`, como manda el encargo).

Qué **no** sé: por qué un agente en vivo de OpenAI pide la home entre 5 y 20 veces al
día. Candidatos que no puedo distinguir con estos datos: usuarios que pegan el dominio
en ChatGPT, una tarea programada de alguien en ChatGPT, o la vista previa de enlaces.
Ninguno es «un artículo citado». **Consecuencia para la métrica:** a partir de ahora el
número que cuenta es la columna `contenido`, no el total de la familia.

### De paso: escáneres que se hacen pasar por ChatGPT-User

En el mismo desglose aparecen ráfagas con el user-agent de ChatGPT-User pidiendo
`/.env`, `/.aws/credentials`, `/.git/HEAD`, `/docker-compose.yml`, `wp-config.php`, etc.
(el 07-oct, 259 peticiones entre las 13:00 y las 15:00 UTC, **todas sin verificar**, desde Japón, Singapur,
EE. UU., Taiwán, Bélgica…). Todas responden 404, 405 o 301; es un sitio estático y no
hay nada que filtrar. **No contaminan la métrica** porque el contador solo admite
páginas. Pero demuestran que el user-agent se suplanta, así que la verificación pasa a
quedar registrada (abajo).

Resto de la verificación, mismas 8 jornadas, solo páginas con 200:

| Agente | Peticiones | Sin verificar |
| --- | --- | --- |
| ClaudeBot | 428 | 0 % |
| Amazonbot | 334 | 0 % |
| Bingbot | 273 | 0 % |
| Googlebot | 257 | **7 %** (18 suplantaciones) |
| Meta-ExternalAgent | 84 | 0 % |
| ChatGPT-User | 74 | 0 % |
| CCBot | 47 | 100 % |
| PerplexityBot | 41 | 100 % |
| OAI-SearchBot | 28 | 0 % |
| Claude-User | 12 | 33 % (4) |
| GPTBot | 10 | 0 % |

Ojo con PerplexityBot y CCBot: Cloudflare no los tiene como bots verificados, así que el
100 % no significa suplantación.

### Infraestructura: el contador de borde registra la verificación y separa la home

`scripts/geo-agents-edge.mjs` pide ahora `verifiedBotCategory` y guarda por agente un
campo `unverified`. La tabla que imprime `npm run geo:agents` tiene dos columnas nuevas,
`home` y `contenido`, y una de agentes en vivo sin verificar. Los días anteriores al
04-oct no tienen el campo (la API no retiene más) y salen con «-».

---

## Una idea que los datos desmontan antes de construirla: IndexNow en cada despliegue

Iba a añadir `seo:indexnow` al workflow de despliegue, para no depender del ciclo
semanal. Antes de hacerlo medí cuánto tarda Bingbot en pedir un post nuevo, con las
rutas del borde:

| Post | Publicado | Primer Bingbot |
| --- | --- | --- |
| servicio nativo de IA | 20-sep | 20-sep |
| forward deployed engineer | 21-sep | 22-sep |
| diagrama de flujo | 26-sep | 26-sep |
| pseudocódigo | 27-sep | 27-sep |
| fabricación vibe | 04-oct | 04-oct |
| variable | 04-oct | 04-oct |
| notas de Patrick Collison | 10-oct | 10-oct |
| texto de Satya Nadella | 10-oct | 10-oct |

**Bingbot llega el mismo día en 7 de 8 posts, y al siguiente en el otro.** El caso
decisivo son los dos del 10-oct: se publicaron por la tarde, seis días después de la
última ejecución de IndexNow (04-oct), y Bingbot los pidió en las horas siguientes. Bing
los descubre por su cuenta; por qué vía (sitemap, RSS o los *Crawler Hints* de
Cloudflare, que envían IndexNow solos si están activos) no lo he comprobado. Automatizar IndexNow
no acortaría nada medible, así que no lo hago. Sigo ejecutándolo cada semana porque es
gratis, pero ya no es una palanca.

Lo que sí varía es el **primer agente en vivo**: ChatGPT-User llegó al día siguiente a
servicio nativo de IA (21 peticiones en total), a fabricación vibe (8) y a forward deployed
engineer. A las tres definiciones de la serie (diagrama, pseudocódigo, variable) **no ha
llegado ninguno todavía**. No es contradictorio con que Bing cite sobre todo definiciones:
la cita en Bing no genera peticiones de agentes en vivo, que es lo que ya sabíamos del AI
Overview de Google. Son dos canales con públicos distintos.

---

## Issue #35: segunda semana completa en paralelo

| Día | KV | Borde | Borde / KV | Vivo KV | Vivo borde |
| --- | --- | --- | --- | --- | --- |
| 04-oct | 139 | 155 | 1,12 | 11 | 11 |
| 05-oct | 147 | 154 | 1,05 | 16 | 16 |
| 06-oct | 142 | 152 | 1,07 | 12 | 13 |
| 07-oct | 122 | 124 | 1,02 | 14 | 14 |
| 08-oct | 160 | 164 | 1,02 | 10 | 10 |
| 09-oct | 134 | 138 | 1,03 | 9 | 9 |
| 10-oct | 427 | 536 | 1,26 | 4 | 4 |
| **Total** | **1.271** | **1.423** | **1,12** | **76** | **77** |

- **Agentes en vivo: 76 frente a 77.** Ya no es exacto (un ChatGPT-User de más en el borde
  el 06-oct), pero en dos semanas son 159 frente a 160. Intercambiables.
- El 10-oct hubo una ráfaga de ClaudeBot y **KV se quedó en 288 frente a 409**: es la
  pérdida en ráfagas que ya se conocía, ahora medida (−30 %).
- **Segunda anomalía en sentido contrario:** ese mismo día KV cuenta 16
  Meta-ExternalAgent y el borde 1. Con la del 02-oct (GPTBot), van dos veces que KV cuenta
  más que el borde en un rastreador de entrenamiento. Sin explicar; no afecta a los
  agentes en vivo.

**Corrijo la recomendación de la semana pasada** («si se repite, se puede retirar
`recordHit`»). Las dos fuentes coinciden, pero el borde **solo retiene 8 días** y el
histórico depende de que este ciclo se ejecute cada semana sin fallar: un ciclo saltado
pierde días para siempre. KV guarda 28 días y no cuesta nada en Workers Paid. **Hoy KV es
el colchón del borde, así que no se borra.** La simplificación del issue solo tiene
sentido si la recogida del borde pasa a ejecutarse a diario en un sitio que no dependa de
este ordenador.

---

## Métricas semanales

**Agentes en vivo (borde)**, serie diaria con el desglose nuevo:

| | 04-oct | 05 | 06 | 07 | 08 | 09 | 10 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Familia | 11 | 16 | 13 | 14 | 10 | 9 | 4 |
| Home | 10 | 9 | 11 | 9 | 5 | 1 | 4 |
| **Contenido** | **1** | **7** | **2** | **5** | **5** | **8** | **0** |

El 10-oct es el valor más bajo de la familia en los 21 días. Un día suelto en una serie
con φ > 3 no es nada; lo apunto. Ventana de 28 días en KV: 5.653 peticiones, 244 de
agentes en vivo (ChatGPT-User 218, Claude-User 26).

**Markdown en agentes en vivo:** 0 de 297 en los 21 días del borde (IC 95 % superior
≈ 1,2 %). Sigue acumulando hacia ~500.

**Indexación:** n = 25, `errorCount` = 0, 22 indexadas, **88,0 %** (IC 70,0-95,8 %). Es
la segunda ejecución seguida en el 88 %; las dos juntas (44 de 50) dan 88 % con IC
76-94 %, que queda por encima del 74,6 % establecido. **No lo doy por cambio**: dos
muestras de 25 caen en tramos distintos del sitemap (arranques 475 y 500) y el muestreo
rotativo no es aleatorio por tramo. Si la próxima vuelta sigue en esta zona, toca
recalcular la tasa acumulada con todo. Cobertura: **420 de 712** URLs, 10 ejecuciones.

**Panel de URLs no rastreadas** (23 URLs): 9 indexadas, 7 «no reconoce», 4 descubiertas,
3 rastreadas sin indexar. Seis cambiaron de estado entre «no reconoce» y «Descubierta» en
los dos sentidos, como se describió el 04-oct; ninguna pasó a indexada esta semana. Las
«no reconoce» siguen siendo exactamente las que devuelven 0 referentes y 0 sitemaps.

**Bing:** 53 clics y 5.229 impresiones en la ventana del panel (67 días). Las consultas
con clic siguen siendo de input/output y de algoritmo. Sitemap leído el 09-oct, 710 URLs.

**Audit:** build limpio, 859 páginas HTML. Mismos avisos heredados (273 imágenes rotas en
174 posts antiguos, 2 shortcodes de vídeo, 13 enlaces al dominio viejo).

---

## Publicado esta semana

**Artículo: [Qué es un bucle en programación](https://crearsoftware.com/blog/que-es-un-bucle-en-programacion/)**
— definición, iteración, el bucle como tercera estructura de control (Böhm-Jacopini), las
cuatro partes (inicialización, condición, cuerpo, actualización), los tres tipos con
pseudocódigo (MIENTRAS, PARA, REPETIR) y una tabla de cuál usar, el mismo bucle en Python
y JavaScript, la trampa de `REPETIR … HASTA QUE` frente a `do … while` (lógica contraria),
la media con centinela, bucles anidados y su coste, `break` y `continue`, seis errores
frecuentes y bucle frente a recursividad. Seis preguntas frecuentes con FAQPage.

Quinta pieza de la serie algoritmo → diagrama de flujo → pseudocódigo → variable. Los
cuatro anteriores usaban «bucle» sin definirlo. Enlazado desde el pseudocódigo (fila de
«Repetición») y desde la variable (el ejemplo de la media).

**Infraestructura:** verificación de bots y separación home/contenido en el contador de
borde (arriba).

---

## Correcciones

- **El pico de agentes en vivo del 21-23 de septiembre** era sobre todo la home, no
  contenido (informe del 04-oct).
- **La métrica del encargo estaba inflada ×3** por las peticiones a la home: la señal de
  contenido es de ~4,5 al día.
- **Issue #35:** no se borra el contador de KV mientras el borde dependa de una ejecución
  semanal (corrige la recomendación del 04-oct).
- **IndexNow** no acelera el primer rastreo de Bingbot en este sitio; deja de
  considerarse palanca.

---

## Estado de las comprobaciones bloqueantes

| # | Comprobación | Estado |
| --- | --- | --- |
| 1 | Token de GSC | ✅ vivo el 11-oct |
| 2 | Rastreadores de IA | ✅ 200 en `/robots.txt` con ChatGPT-User |
| 3 | Cuota de KV | ✅ sin riesgo (5.653 peticiones en 28 días) |
| 4 | Despliegue en producción | ✅ healthcheck 6/6 antes de empezar; despliegue de hoy verificado contra el HTML real |

---

## Abierto

1. **Por qué ChatGPT-User pide la home 5-20 veces al día.** Lo siguiente que se puede
   mirar sin coste: si las IPs (`clientIP` sí está disponible) son pocas y fijas
   —apuntaría a una tarea programada de alguien— o muchas y rotatorias.
2. **«Rastreada: actualmente sin indexar»** sigue sin explicación.
3. **Tasa de indexación:** dos ejecuciones seguidas en el 88 %; vigilar si la siguiente
   vuelta lo confirma antes de tocar el 74,6 %.
4. **Markdown en agentes en vivo:** 0 de 297; seguir hasta ~500.
5. **Pendiente de Alfonso:** exportar los CSV de «AI Performance» de Bing a
   `data/bing-ai-performance/`. **La última exportación es del 19-ago; si no se hace este
   mes, septiembre se pierde.** Y rellenar el LinkedIn del autor si quiere que entre en
   `sameAs`.
