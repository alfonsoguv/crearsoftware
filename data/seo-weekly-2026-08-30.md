# Informe semanal SEO/GEO — 2026-08-30

## ⚠️ BLOQUEO: el refresh token de Search Console ha vuelto a caducar

`POST https://oauth2.googleapis.com/token` con las tres variables `GSC_*` de `.dev.vars`
devuelve **`invalid_grant` / «Token has been expired or revoked»**. Sin token no hay
`seo:gsc:indexation` esta semana: la rotación del muestreo queda parada donde estaba.

El encargo dice que, tras el paso de la app OAuth a producción, un `invalid_grant` «ya no
se arregla regenerando y hay que investigarlo». Investigado. **La regeneración sí es el
arreglo, pero por una razón distinta de la de julio**, y conviene entender cuál para no
repetir esto cada dos semanas.

La cronología encaja con la regla de los 7 días con una precisión que no parece casual:

| Fecha | Hecho | Días desde la emisión |
| --- | --- | --- |
| 17-ago 14:43 | `.dev.vars` escrito con el token actual (mtime del fichero) | 0 |
| 17-ago | La app OAuth pasa a «En producción» | 0 |
| 23-ago | El token canjea **sin problema** (informe de esa semana: «el token OAuth funcionaba perfectamente») | 6 |
| 30-ago | `invalid_grant` | 13 |

**Hipótesis: el token vigente se emitió mientras la app todavía estaba en estado
*Prueba*, y publicar la app no rejuvenece los tokens ya emitidos.** La caducidad de 7 días
va asociada al token, no al estado actual de la app: un token nacido en *Prueba* muere a
los 7 días aunque la app se publique después. Emitido el 17-ago, habría caducado el 24 —y
efectivamente funcionó el día 6 y está muerto el día 13.

Es una hipótesis, no un hecho comprobado, pero es **falsable y barata de comprobar**:

> **Predicción.** Si Alfonso ejecuta `npm run seo:gsc:connect` ahora, el token nuevo se
> emite ya bajo la app publicada y **debe seguir vivo el 6 y el 13 de septiembre**. Si
> vuelve a fallar el 6-sep (día 7), la hipótesis es falsa: significaría que la app **no**
> está realmente en «En producción», y entonces lo que hay que mirar es el *Publishing
> status* en Google Cloud Console, no el token.

Es decir: **esta vez sí, regenerar. La próxima vez, si falla, no.**

Descartado en el momento y sin necesidad de tocar nada más:

- **No es un 403 de permiso** como el del 23-ago. Aquel fallaba *después* de obtener un
  `access_token` válido; este falla en el canje mismo, así que ni siquiera se llega a
  consultar la propiedad. Son dos síntomas distintos y se distinguen en una sola llamada.
- **No son 6 meses sin uso**: la tarea corre cada semana y hay constancia de uso el 23-ago.

### El resto de comprobaciones bloqueantes: correctas

- **Rastreadores de IA no bloqueados.** `ChatGPT-User` y `Claude-User` reciben **200** en
  `/robots.txt`. Comprobado contra `/robots.txt` y no contra la home, así que la familia
  «agentes en vivo» no queda contaminada por el propio chequeo.
- **Cuota de KV:** no revisada, como indica el encargo. El máximo diario de esta ventana
  (737 peticiones de GPTBot el 30-ago) sigue tres órdenes de magnitud por debajo del cupo
  de Workers Paid, y el batching de agosto absorbe la ráfaga.
- **Despliegue:** verificado descargando el HTML de producción, no por el estado de Actions.

## Publicado esta semana

- **Artículo:** [Qué es un algoritmo: definición, ejemplos y en qué se diferencia de un
  programa](https://crearsoftware.com/blog/que-es-un-algoritmo-definicion/)
- **Infraestructura:** [Glosario](https://crearsoftware.com/glosario/) — 80 términos con
  `DefinedTermSet` / `DefinedTerm` en JSON-LD.

## La mejora de infraestructura: por qué un glosario y no otra cosa

El hallazgo del 19-ago fue que este sitio **se cita por definiciones de conceptos básicos**,
no por ensayos de gestión: el 69% de las citas listadas en Bing AI Performance eran del post
de *input/output*, de 2007. La conclusión que se sacó entonces fue «escribir hacia ahí», y se
escribió un artículo (el del token). Esta semana aparece la otra mitad del asunto, y es de
inventario, no de redacción:

**El blog ya tenía 80 artículos cuyo título es literalmente una definición** —«¿Qué es el
long tail?», «¿Qué son las variables de control?», «¿Qué es una interface?»— repartidos entre
700 URLs y **sin una sola página que los agrupara**. Un agente que quisiera saber qué define
este sitio tenía que tropezarse con cada uno por separado.

El glosario los reúne en una URL de alta densidad:

- `DefinedTermSet` con 80 `DefinedTerm`, cada uno con `@id` estable, `description` y
  `subjectOf` apuntando al artículo que lo desarrolla.
- Un ancla por concepto (`/glosario/#algoritmo`), citable a nivel de término y no de página.
- Gemelo Markdown (`/glosario.md`), entrada en el sitemap, sección propia y **primera** en
  `llms.txt`, y enlace desde la home.

**Se genera solo** a partir de los títulos y las `description` que ya existen: no hay ni una
definición escrita a mano, así que no hay nada que pueda quedar desincronizado ni ninguna
cifra que inventar. Añadir un artículo «¿Qué es X?» lo mete en el glosario sin tocar nada.

Un detalle que salió al hacerlo y que afecta a más sitios del build: `metaDescription`
descarta cualquier `description` de más de 170 caracteres —el límite útil de la SERP— y la
sustituye por un extracto cortado a 160 con puntos suspensivos. Para una etiqueta `<meta>`
es lo correcto; para una entrada de glosario, una definición partida a media frase es peor
que una definición larga. El glosario usa la `description` del frontmatter cuando existe:
**0 de las 80 definiciones salen truncadas.**

### Cómo saber si ha servido para algo

Predicción falsable, para no quedarse en «hemos desplegado una palanca»:

> El glosario debe aparecer entre las URLs citadas del panel de Bing AI Performance **antes
> del 30 de noviembre de 2026**. Si a esa fecha sigue con cero citas mientras los artículos
> individuales las siguen recibiendo, la hipótesis de que una página agregada ayuda a la
> citación es falsa para este sitio y hay que decirlo: la palanca sería el artículo suelto,
> no el índice.

## Agentes de IA: serie plana, nada que declarar

`npm run geo:agents`, 8.525 peticiones en 28 días. La familia que importa —agentes en vivo,
los que producen la cita— acumula **219 peticiones**.

Serie diaria (27 días completos, excluido el 30-ago que estaba en curso):

- Media **8,07/día**, varianza 17,53 → **φ = 2,17**. Sobredispersa, como siempre; ningún
  test de Poisson aplica.
- Últimos 7 días completos: **56**. Los 7 anteriores: **63**. Un −11% con esa dispersión es
  ruido y no se comenta más.

Lo único que ha cambiado de verdad en la ventana es una ráfaga de ClaudeBot (571 peticiones
el 26-ago) y otra de GPTBot (737 el 30-ago), ambas de la familia de **entrenamiento**. No
tocan la métrica del encargo.

### El cero de Markdown en agentes en vivo aguanta con el triple de muestra

El 16-ago se midió que los agentes que citan no piden el gemelo `.md`: **0 de 64**, IC 95%
[0 – 5,7%]. Con la instrumentación acumulada la muestra va ya por **178 peticiones HTML y 0
en Markdown**, lo que estrecha el intervalo a **[0 – 2,1%]**.

Sigue sin llegar a las ~500 que distinguirían «nunca» de «raramente», pero la conclusión de
agosto se refuerza en vez de erosionarse: **el gemelo `.md` es palanca de corpus, no de
citación**. Los de entrenamiento sí lo consumen (26,0% de las peticiones de esa familia).

| Familia | Markdown | HTML | % Markdown |
| --- | --- | --- | --- |
| Entrenamiento | 1152 | 3268 | 26,0% |
| Búsqueda generativa | 31 | 522 | 5,6% |
| Buscador clásico | 0 | 679 | 0,0% |
| **Agentes en vivo** | **0** | **178** | **0,0%** |

## Bing: la demanda que llega es demanda de definiciones

23 días con datos, 825 impresiones y 9 clics. Los clics no se comentan: son ruido a este
volumen. Lo que sí dice algo es **de qué van las consultas**.

En el top-20 de queries que devuelve la API (102 impresiones, no las 825 totales), **7
consultas suman 45 impresiones que son definiciones explícitas** —contienen «qué es», «qué
son», «definición» o «significado»—: el **44,1%** de las impresiones de esa lista.

**Caveat que hay que leer antes de usar el número:** es un top-20 ordenado por volumen, no
una muestra aleatoria de las 825 impresiones, así que el 44,1% describe la cabeza de la
distribución y **no se puede extrapolar al total**. Como corroboración cualitativa vale;
como estimación del sitio entero, no.

Aun así el patrón es difícil de ignorar, porque coincide con lo que ya dijo AI Performance
en agosto y con lo que se ve en las consultas concretas: `que es mcp` (20 impresiones),
`input y output` (12), `que es input y output` (7), `input y output significado` (5), y un
clic sobre `definicion aportacionpecunaria` —un término que, casualmente, ya estaba definido
en el blog y ahora tiene ancla propia en `/glosario/#aportaciones-pecuniarias`.

Sigue apareciendo la demanda de **e-learning** detectada el 19-ago: la consulta larga sobre
la analogía histórica de un módulo formativo vuelve a salir dos veces esta semana.

## Corrección al estado del encargo

El punto 6 de «palancas GEO no hechas» pide `sameAs` con perfiles verificables en el JSON-LD
del autor. **Ya está hecho:** `buildAuthorNode` emite todos los perfiles declarados desde el
23-ago-2026, y el `github` relleno llega al marcado. Lo que sigue pendiente de ese punto es
solo que Alfonso rellene `links.linkedin` en `authors/alfonso-gutierrez.json`, que está vacío.

## Estado del resto

- `npm run audit`: sin hallazgos nuevos. Los 273 markdown de imagen rotos, los 13 enlaces al
  dominio antiguo y el shortcode de VideoPress son deuda heredada de WordPress, estable
  desde marzo. 0 assets heredados faltantes, 0 páginas `noindex` en el sitemap.
- `npm run seo:gsc:indexation`: **no ejecutado**, bloqueado por el token. La cobertura
  acumulada sigue en 364 URLs.
- `npm run seo:gsc` y `seo:gsc:analysis`: no tocan esta semana (solo primera semana de mes).
  Los clics semanales no se comentan, por diseño.

## Pendiente de Alfonso

1. **`npm run seo:gsc:connect`** para regenerar el token. Requiere autorizar en el navegador.
   Es la única acción que desbloquea la indexación, y sirve además de test de la hipótesis de
   arriba.
2. **Rellenar `links.linkedin`** en `authors/alfonso-gutierrez.json`: el código ya lo emitiría.
3. **Exportar «AI Performance» de Bing a mano** (los dos CSV) a `data/bing-ai-performance/`.
   Cadencia mensual, y toca: la última medición es del 19-ago. Es la única fuente cuantitativa
   de citación del sitio y el panel no la conserva indefinidamente.
4. Borrar el token de Cloudflare que quedó expuesto en una conversación (sigue pendiente).

## Ficheros que ya estaban modificados al empezar (no incluidos en el commit)

`data/cf-traffic-2026-08-01.{json,md}`, `data/cf-traffic-latest.{json,md}`,
`guides/guia-agentes-ia-empresas.md` y los `data/bing-report-2026-08-05.*` sin seguimiento.
Si son buenos, hay que publicarlos aparte.
