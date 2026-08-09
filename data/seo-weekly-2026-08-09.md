# Informe semanal SEO/GEO — 2026-08-09

## Bloqueos

- **Token de GSC caducado.** `npm run seo:gsc:indexation` falla con `invalid_grant`.
  Sigue pendiente publicar la app OAuth de Google Cloud: mientras esté en *Testing*,
  el token muere cada 7 días. **Consecuencia esta semana: no se ha podido avanzar la
  cobertura del muestreo rotativo de indexación.** El cursor sigue donde estaba.
- Rastreadores de IA: **no bloqueados**. ChatGPT-User, Claude-User y PerplexityBot
  reciben 200.
- Despliegue: verificado en producción, no solo en Actions (ver más abajo).

## Corrección: el crecimiento de «agentes en vivo» no existe

Los informes anteriores anotaron como línea base 12 peticiones de agentes en vivo el
02-ago y 30 el 03-ago. Hoy el total de la ventana de 28 días son 67. **Esa progresión
no mide crecimiento: mide que la ventana se está llenando.**

El contador arrancó el 2026-08-01, así que la «ventana de 28 días» solo contiene 9
días de datos. Hasta el 2026-08-29 los totales acumulados subirán solos aunque el
tráfico caiga. Comparar totales de ventana entre semanas es, hasta esa fecha, un
artefacto. **Hay que mirar la serie diaria.**

Y la serie diaria dice lo contrario:

| Día | Total agentes | Agentes en vivo |
| --- | --- | --- |
| 2026-08-01 | 77 | 9 |
| 2026-08-02 | 518 | 18 |
| 2026-08-03 | 345 | 14 |
| 2026-08-04 | 486 | 7 |
| 2026-08-05 | 1027 | 9 |
| 2026-08-06 | 216 | 1 |
| 2026-08-07 | 280 | 5 |
| 2026-08-08 | 241 | 2 |
| 2026-08-09 | 90 | 2 (día en curso) |

Del 1 al 5 de agosto: 11,4 agentes en vivo al día. Del 6 al 8: 2,7 al día. Sobre los
8 días completos la tasa media es 8,1/día, así que en los días 6-8 cabría esperar
~24 peticiones y se observaron 8. Bajo un modelo de Poisson con tasa constante eso
es improbable (p ≈ 2·10⁻⁴): **es una caída real, no ruido**.

Antes de leerla como una señal de negocio, hay que descontar el siguiente punto.

## La comprobación semanal contamina la métrica que mide

El chequeo «los rastreadores de IA no están bloqueados» se hace con
`curl -A "ChatGPT-User" https://crearsoftware.com/`. Esa petición **entra en el
contador**: la home es una página contada y el user-agent es el que se declara.

Hoy, antes de nada, se lanzaron tres comprobaciones de ese tipo. El informe del
09-ago registra exactamente ChatGPT-User: 1 y Claude-User: 1. Es decir: **casi todo
el dato de agentes en vivo del día es la propia comprobación.**

Con una familia que mueve entre 1 y 18 peticiones diarias, inyectar 2 o 3 hits por
ejecución no es despreciable, y además coincide en el tiempo con los días de trabajo
sobre el sitio — que es justo cuando parecía haber más actividad. Parte del pico del
2 al 5 de agosto puede tener este origen.

**Arreglo aplicado:** el chequeo debe hacerse contra `/robots.txt`, que responde 200
igual con user-agent de agente y **no entra en el contador** (`isPageRequest` solo
admite HTML, `llms.txt` y `.md`). Verificado hoy con ChatGPT-User, Claude-User,
PerplexityBot y GPTBot: los cuatro reciben 200.

```bash
curl -s -o /dev/null -w "%{http_code}" -A "ChatGPT-User" https://crearsoftware.com/robots.txt
```

El caveat queda escrito en `scripts/geo-agents-report.mjs`, de modo que aparece en
todos los informes futuros. **Conviene actualizar el comando en la definición de la
tarea semanal** (`~/.claude/scheduled-tasks/crear-softaware/SKILL.md`, punto 2 de los
avisos): eso solo lo puede hacer Alfonso.

Con eso, la caída de los días 6-8 sigue siendo real, pero su magnitud está inflada
por comparación con unos días 1-5 contaminados. La próxima medición limpia empieza
hoy.

## Hallazgo: los agentes piden las URLs de ejemplo de los bloques de código

El artículo del 02-ago sobre gemelos Markdown incluía un snippet con un `href` de
relleno apuntando a `https://crearsoftware.com/blog/mi-articulo.md`. Esa URL nunca
existió y no está enlazada desde ningún sitio: aparece solo como texto escapado
dentro de `<pre><code>` (verificado en el HTML publicado).

**Recibió 9 peticiones de agentes entre el 2 y el 8 de agosto.** El artículo que la
contiene lleva 15 desde que se publicó. Dos de cada tres lecturas del artículo
generaron una petición a la URL inventada.

Límites del dato, explícitos:

- Son 9 peticiones: demuestra que ocurre, no con qué frecuencia.
- No se puede atribuir a un agente concreto: `/api/bots` agrega las rutas sin
  desglosarlas por user-agent.
- La serie está congelada. El commit d8e7eb4 (08-ago) dejó de contar respuestas 404,
  por una razón ajena y correcta: contar rutas inexistentes dejaba la creación de
  claves KV en manos de cualquiera que se declarase GPTBot.

La causalidad sí es inequívoca: esa cadena no existe en ningún otro sitio.

**Acciones:** el ejemplo pasa a `example.com` (RFC 2606). Se comprobaron además todas
las URLs de crearsoftware.com citadas en `blog-posts/` y `guides/`: no queda ninguna
otra que responda distinto de 200.

## Infraestructura: medición del formato servido (.md vs HTML)

Es el punto abierto nº 3 del encargo, y hasta ahora no se podía responder: el top de
rutas está truncado a 25 entradas (613 de 3280 hits) y deja fuera toda la cola.

El middleware pasa a registrar el formato servido —`md`, `llms`, `html`— **dentro de
la entrada de KV que ya escribía**. No añade ni una clave ni una escritura: es un
campo más en el mismo `put`. Como la clave ya lleva el user-agent, el desglose por
agente y por familia sale gratis. `/api/bots` lo expone en `formats` y el informe lo
tabula por familia con el porcentaje de Markdown.

Los hits anteriores al cambio no traen el campo y se reportan como **«sin medir»**,
no como HTML: imputarlos al denominador falsearía el experimento a la baja.

Primer dato útil: dentro de una semana, con la ventana ya poblada.

## Bing Webmaster Tools

4 días con datos (04 al 07 de agosto): 151 impresiones, **0 clics**. El histórico
arranca el 03-ago, así que no hay comparación posible todavía.

Lo relevante no es el volumen sino la forma de las consultas: casi todas son
preguntas en lenguaje natural, del estilo *«formato md, para que sirve en la ia?»*
(posición 4, 8 impresiones) o *«¿qué tienen en común la escritura, la imprenta, las
calculadoras, los buscadores de internet y la ia?»*. Es el patrón de consulta que
alimenta las respuestas generativas, no el de búsqueda clásica. Con 0 clics sobre
151 impresiones, la lectura provisional —y hay que subrayar *provisional*, son 4
días— es que las impresiones se están resolviendo sin visita.

Sigue pendiente que Alfonso mire **«AI Performance»** a mano en bing.com/webmasters:
está en beta, no tiene endpoint en la API y es donde vive el *citation share*.

## Salud del build

`npm run audit`: sin regresiones. 0 assets heredados faltantes, 0 páginas noindex en
el sitemap, 404 en su sitio. Los hallazgos de siempre (enlaces al dominio antiguo
`alfonsogu.com`, imágenes rotas de WordPress, un shortcode de VideoPress) siguen ahí
y siguen siendo deuda heredada conocida, no regresión.

Build: 827 artículos, 695 URLs en sitemap, 42 con FAQPage.

## Publicado

- **Artículo:** [Los rastreadores de IA piden las URLs de ejemplo de tus bloques de
  código](https://crearsoftware.com/blog/rastreadores-ia-urls-ejemplo-bloques-codigo/)
  — 200 verificado en producción, gemelo `.md` también 200, presente en el sitemap.
- **Infraestructura:** medición del formato servido por agente, sin coste de cuota KV.
- **Corrección de contenido:** URL de ejemplo a `example.com`.
- IndexNow enviado tras el despliegue: HTTP 200.

## Pendiente de Alfonso

1. **Publicar la app OAuth de Google Cloud.** Es lo que bloquea toda la medición de
   indexación semana tras semana.
2. **Actualizar el chequeo de rastreadores** en la definición de la tarea para que
   apunte a `/robots.txt` y deje de contaminar la métrica principal.
3. **Mirar «AI Performance»** en bing.com/webmasters.
4. **Issue #35 (cuota KV).** Sigue abierto y esta semana no ha avanzado: migrar el
   contador a Analytics Engine requiere añadir el binding en el panel de Cloudflare
   —`wrangler.toml` ni siquiera tiene el de KV, está comentado—, y eso no se puede
   hacer desde aquí. El cambio de esta semana no empeora el consumo, pero tampoco lo
   reduce.
5. **Borrar el token de Cloudflare** expuesto en una conversación anterior.

## Nota sobre ficheros del repo

Al empezar la semana ya había modificaciones sin commitear que **no** se han incluido
en el commit, por si quieres revisarlas o publicarlas tú:

- `data/cf-traffic-2026-08-01.json|md`, `data/cf-traffic-latest.json|md`
- `guides/guia-agentes-ia-empresas.md`
- `data/bing-report-2026-08-05.json|md` (sin seguimiento)

## Cadencia

Segunda semana de agosto: **no se han mirado clics ni impresiones de Google**, por
diseño. A 15,3 clics/semana no hay potencia estadística para detectar nada en siete
días. La próxima revisión de rendimiento toca la primera semana de septiembre.

Sigue viva la predicción falsable sobre las guías pilar: enlazadas desde la home
desde el 02-ago, deben superar **150 impresiones** en la ventana de 28 días que
cierre a finales de septiembre. Si se quedan por debajo de 60, el enlazado interno
no era el cuello de botella.
