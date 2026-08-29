# Informe semanal SEO/GEO — 2026-08-23

## Search Console: bloqueado por la mañana, resuelto el mismo día

> **RESUELTO el 23-ago-2026.** Se deja escrito el diagnóstico porque la causa no era la
> que el ciclo llevaba dos meses asumiendo.

`npm run seo:gsc:indexation` falló con **403 PERMISSION_DENIED** en las 25 URLs.
**No era el `invalid_grant` de julio: el token OAuth funcionaba perfectamente.** El
`refresh_token` canjeaba sin problema y el `access_token` traía el scope
`https://www.googleapis.com/auth/webmasters`. Lo que había cambiado era el permiso sobre
la propiedad. `GET /webmasters/v3/sites` devolvía:

| Propiedad | Nivel de permiso |
| --- | --- |
| `sc-domain:crearsoftware.com` | **siteUnverifiedUser** |
| `http://www.alfonsogu.com/` | **siteUnverifiedUser** |
| `https://deepdna.ai/` | siteOwner |

El 17 de agosto esa misma cuenta había inspeccionado 200 URLs sin un solo error. Entre el
17 y el 23 perdió la verificación de propiedad sobre crearsoftware.com.

Descartado en el momento, y conviene que quede escrito para no repetirlo:

- **No era el DNS.** El registro seguía publicado y resolvía:
  `google-site-verification=XyBajVEdRSYj6GAeRUisS3L3-TRaMBWqmvaIQ_Yrkic`.
- **No era el token ni la app OAuth.** El canje funcionaba y el scope era el correcto.
- **No era una caída de la API.** La misma credencial seguía siendo `siteOwner` de
  deepdna.ai, así que la llamada era válida; lo rechazado era esta propiedad concreta.
- **No era Bing**, que respondía «Propiedad verificada: sí».

**Cómo se resolvió.** Alfonso reverificó la propiedad el mismo día desde Search Console,
por el flujo automático de DNS con Cloudflare —el botón «Iniciar verificación», que
autoriza a Google a crear el registro él mismo. Confirmado contra la API: la propiedad
pasó a **`siteOwner`**.

**La lección de método:** un 403 y un `invalid_grant` se parecen desde el script —ambos
dejan el ciclo sin datos de Google— y tienen causas y arreglos distintos. Regenerar el
token, que era el ritual aprendido en julio, aquí no habría arreglado nada. Antes de tocar
credenciales conviene mirar `/webmasters/v3/sites`, que dice en una línea si el problema
es de identidad o de permiso.

### Comprobaciones bloqueantes restantes

- **Rastreadores de IA: no bloqueados.** ChatGPT-User, Claude-User y PerplexityBot
  reciben 200 en `/robots.txt`. Comprobado contra `/robots.txt` y no contra la home, así
  que **esta semana no se ha contaminado la familia «agentes en vivo»** (el encargo ya
  lleva el comando corregido; las dos semanas anteriores inyectaron 3 hits cada una).
- **Cuota de KV:** sin revisar, como indica el encargo. El volumen de esta semana (máximo
  diario de 471 peticiones) está tres órdenes de magnitud por debajo del cupo de Workers
  Paid.
- **Despliegue:** verificado descargando el HTML real de producción, no por el estado de
  Actions.

## Corrección de instrumentación: el cursor de indexación se estaba quemando en falso

Al fallar las 25 inspecciones, el script **avanzó igualmente el cursor**: `start` 400→425,
`runs` 4→5 y `coveredCount` 349→**364**. Es decir, marcó 15 URLs nuevas como «cubiertas»
sin haber obtenido un solo veredicto sobre ellas.

El daño es doble y no era visible: cada ejecución rota **quema un tramo del sitemap en
silencio** —esas URLs no volverán a tocar hasta dar la vuelta entera— y **estrecha el
intervalo de confianza sin datos detrás**, que es justo el error de método contra el que
avisa el encargo. El informe llegó a publicar «Tasa de indexación estimada del sitio:
0.0%» sobre n=0.

Corregido en `scripts/gsc-indexation-audit.mjs`:

- Solo cuenta como cubierta la URL de la que Google devolvió un veredicto.
- Si la ejecución entera falla, el cursor **no avanza** y `runs` no se incrementa.
- Avisa por `stderr` en vez de terminar con un «Generated files» tranquilizador.

Verificado reejecutando mientras el 403 seguía vivo: falló igual y el cursor quedó intacto
en `start: 400`, `runs: 4`, `coveredCount: 349`. Revertido a mano el avance en falso de la
primera ejecución.

Esto no tiene relación con el sesgo de `%C2%BF` documentado el 17-ago, que era un fallo
parcial. Es el caso del fallo total, que no estaba contemplado.

## Indexación: 76,0% sobre n=25, y una trampa de red que casi se cuela

Con la propiedad ya reverificada, el muestreo rotativo volvió a correr. La **primera**
ejecución dio esto:

- 25 inspeccionadas, 7 indexadas, 3 no indexadas, **15 errores**
- «Tasa de indexación estimada del sitio: **70,0%** (IC 95%: 39,7% – 89,2%, n=10)»

Ese 70% no vale nada, y el encargo ya avisa de por qué: **mirar `errorCount` antes que
`indexedRatePercent`**. Con 15 errores el denominador se queda en 10 y el intervalo mide
50 puntos de ancho. Los errores tampoco eran los de siempre: 14 de 15 eran `fetch failed`
—fallo de red local, no respuesta de la API— y **no seguían el sesgo del `%C2%BF`** (2 de 6
con el carácter frente a 13 de 19 sin él), así que era ruido de conexión y no el problema
de codificación conocido.

Repetido el mismo tramo con `--offset=401`:

| | Indexadas | No indexadas | Errores | Tasa | IC 95% |
| --- | --- | --- | --- | --- | --- |
| 1ª ejecución | 7 | 3 | **15** | 70,0% | 39,7 – 89,2% (n=10) |
| 2ª ejecución | **19** | **6** | **0** | **76,0%** | 56,6 – 88,5% (n=25) |

**76,0% con cero errores**, en línea exacta con el 74,6% acumulado del histórico. No hay
hallazgo nuevo aquí, que es justo lo que se esperaba: la tasa lleva estable todo el año.
Cobertura acumulada: **359 de 702 URLs distintas**.

Los estados de las 6 no indexadas: **5 «Rastreada: actualmente sin indexar»** y 1
«Descubierta: actualmente sin indexar». Sigue mandando la misma causa dominante y sin
explicación, con las cinco declarando `INDEXING_ALLOWED`. Ninguna en «Google no reconoce
esta URL» esta vez, así que no hay candidatas nuevas para el experimento de indexación
manual del punto abierto nº 1.

**Lo que esto añade al método:** una ejecución con muchos errores no solo pierde muestra,
es que **publica una tasa plausible sobre un denominador roto**. 70% y 76% se parecen
bastante, y sin mirar el `errorCount` nadie habría notado que el primero salía de 10
observaciones. Repetir el tramo cuesta un minuto y es lo correcto siempre que `errorCount`
pase de unos pocos.

## Agentes de IA: serie plana, sin nada que declarar

6633 peticiones en la ventana de 28 días. La ventana **todavía no está llena** (el
contador arrancó el 01-ago), así que el total no es comparable entre semanas. La serie
diaria de la familia que importa:

| Semana | Agentes en vivo | Media/día |
| --- | --- | --- |
| 2-8 ago | 56 | 8,0 |
| 9-15 ago | 61 | 8,7 |
| 16-22 ago | 63 | 9,0 |

Tres semanas indistinguibles. Sobre los 22 días completos: media 8,59/día, varianza 22,63,
**índice de dispersión φ = 2,63**. Sigue muy lejos de Poisson, en línea con lo documentado
el 16-ago (φ = 3,45), así que **ningún test que asuma Poisson vale aquí**. No hace falta
testear nada: la serie está plana y no hay hipótesis que contrastar.

Reparto por familia: entrenamiento 3328, búsqueda generativa 2105, buscador clásico 1011,
agentes en vivo 189.

### Punto abierto nº 3: el cero de Markdown sigue en pie, con más muestra

El encargo pedía reconfirmar el cero de agentes en vivo pidiendo `.md` cuando la muestra
llegara a ~500 medidas. Progreso:

| Corte | Peticiones medidas de agentes en vivo | En Markdown | IC 95% de Wilson |
| --- | --- | --- | --- |
| 16-ago-2026 | 64 | 0 | [0% – 5,7%] |
| **23-ago-2026** | **121** | **0** | **[0% – 2,3%]** |

Casi el doble de muestra y el cero aguanta. El techo del intervalo baja de 5,7% a 2,3%,
así que se puede descartar con más confianza cualquier tasa apreciable. Aún no distingue
«nunca» de «muy raramente»: para eso siguen faltando ~380 peticiones, unas 6 semanas al
ritmo actual. Los de entrenamiento, mientras tanto, siguen en 22,6%.

## Bing: la demanda confirma para qué se cita este sitio

637 impresiones y 4 clics en 18 días. **No comento los clics**: a este volumen son ruido.
Lo que sí informa es la composición de las consultas, y refuerza el hallazgo del 19-ago
sin depender de él:

- `input y output` (12 impresiones), `que es input y output` (7), `input output` (4+4),
  `input y output significado` (5), `y los inputs como se llaman?` (4)
- `que es mcp` (20 impresiones, posición 9)
- `formato md, para que sirve en la ia?` (8, posición 4)
- `en la analogía histórica que se presenta en el módulo, ¿qué tienen en común la
  escritura, la imprenta, las calculadoras, los buscadores de internet y la ia?` (6 y 4,
  en dos días distintos)

Esa última es literalmente el enunciado de un ejercicio pegado en el buscador, y **repite
en dos semanas separadas**. La demanda de e-learning documentada el 19-ago no era un
artefacto de un día.

El sitemap `https://crearsoftware.com/sitemap.xml` figura en estado Success con 701 URLs y
último rastreo el 20-ago. El sitemap antiguo de `www.` sigue registrado con 696; no
estorba, pero conviene retirarlo algún día.

## Publicado: la definición de «token»

**https://crearsoftware.com/blog/que-es-un-token-en-ia-definicion/**

Es una apuesta deliberada por lo que el dato dice, no por lo que apetecería escribir. La
medición del 19-ago dejó claro que este sitio se cita por **definiciones claras de
conceptos técnicos básicos** —el 69% de las citas de Bing son sobre un post de 2007 que
define input y output— y no por ensayos de gestión. El artículo aplica esa forma a un
concepto que hoy tiene demanda y no estaba cubierto en el sitio: qué es un token, qué es
la ventana de contexto, por qué el español consume más tokens que el inglés y por qué
entrada y salida no cuestan lo mismo.

Rigor de cifras: **el artículo no contiene ninguna cifra que no se pueda rastrear.** La
única aproximación numérica —«en inglés, un token equivale a unos cuatro caracteres»— se
atribuye explícitamente a la documentación de OpenAI y se etiqueta como media orientativa.
Se evitaron deliberadamente los tamaños de ventana de contexto de modelos concretos:
cambian cada pocos meses y no hay forma de verificarlos desde aquí.

Además se enlazó el artículo **desde el post de input/output de 2007**, que es la página
más leída por agentes del sitio después de la home (63 peticiones en 28 días). Es la vía
más rápida que existe aquí para que un agente descubra contenido nuevo: colgarlo de la
página que ya visitan.

### Predicción falsable

El post entra con enlace desde la página más rastreada del sitio y con IndexNow enviado el
mismo día. **Si el 21 de septiembre no ha recibido ninguna impresión en Bing, la hipótesis
de que este sitio se cita por definiciones no explica el tráfico nuevo, solo el histórico
—y habrá que buscar otra explicación al dominio de input/output, empezando por su
antigüedad (2007) y sus enlaces acumulados.**

## Infraestructura: el autor deja de ser una cadena de texto y pasa a ser una entidad

Era el punto abierto nº 6. El diagnóstico resultó ser peor de lo apuntado.

**Lo que había.** El JSON-LD emitía en cada artículo un autor así:

```json
"author": { "@type": "Person", "name": "Alfonso Gutiérrez" }
```

Y solo añadía `sameAs` si existía `links.linkedin`, que está vacío en
`authors/alfonso-gutierrez.json`. Resultado: **el `github` relleno no llegaba nunca al
marcado**, y las 5 guías declaraban el nombre a pelo, sin pasar siquiera por el fichero de
autor.

Para un parser eso no son 834 artículos de una persona: son 834 cadenas de texto iguales
sin ninguna relación declarada entre sí, más 5 cadenas distintas en las guías. La
autoridad de autor no se acumula, porque no hay a qué acumularla.

**Lo que hay ahora.** Un nodo `Person` con `@id` estable —
`https://crearsoftware.com/sobre/#alfonso-gutierrez` — repetido idéntico en artículos,
guías y `/sobre/`. El `@id` es lo que permite a un parser fusionar todas las apariciones
en una sola entidad. `sameAs` emite todos los perfiles externos declarados, no solo
LinkedIn. Y `/sobre/`, que es la URL donde vive el `@id`, lleva ahora la definición
completa como `mainEntity`: `jobTitle`, `description`, `image`, `url` y `knowsAbout` con
las cinco áreas de especialidad.

Verificado en el HTML real de producción, no solo en `dist/`.

**El límite, dicho claro: `sameAs` sin reciprocidad vale poco.** El perfil
`github.com/alfonsoguv` existe (200) pero está vacío: sin nombre público, sin bio y sin
enlace de vuelta. Un `sameAs` unilateral es el sitio afirmando algo sobre sí mismo, que es
exactamente lo que el marcado estructurado sirve para no tener que creerse a ciegas. La
infraestructura ya está puesta; lo que falta es que el perfil confirme.

## Las «1.929 páginas no indexadas» del panel: qué son de verdad

*(Añadido el 29-ago-2026, a raíz de que Alfonso mirara el panel de cobertura.)*

Search Console muestra **532 indexadas y 1.929 no indexadas**. Leído a bote pronto parece
un desastre. No lo es: **«no indexadas» no significa «páginas que deberían estar en Google
y no están»**, sino «URLs que Google conoce y no están en el índice», e incluye todas las
que deliberadamente no queremos indexar.

**El sitio real son 702 URLs y 532 están indexadas: el 75,8%.** Y aquí está lo que
convierte esto en una validación y no en una anécdota:

| | Muestreo (n=25, esta semana) | Censo de Google (panel) |
| --- | --- | --- |
| Indexadas | 76,0% → 533,5 URLs esperadas | **532** |
| No indexadas | 24,0% → 168,5 esperadas | **170** |

La estimación por muestra y el censo completo coinciden con un margen de una unidad y
media. **El muestreo rotativo está bien calibrado**, lo cual es tranquilizador porque es
la única herramienta que teníamos para vigilar esto entre semanas.

### De dónde salen las otras 1.759

1.759 de las 1.929 no indexadas **ni siquiera están en el sitemap**. La causa principal
resultó ser un fallo real y hasta ahora invisible:

**`https://www.crearsoftware.com/` respondía 200 en vez de redirigir.** El sitio entero
existía duplicado en `www` —847 páginas HTML— con su propio `/sitemap.xml` de 702 URLs, e
incluso registrado como sitemap en Bing. 847 × 2 = 1.694, muy cerca de esas 1.759.

Lo verificado, URL a URL contra producción:

- El canonical de `www` **sí apuntaba** a la versión sin `www`, así que no había daño de
  indexación: Google las clasifica como «página alternativa con etiqueta canónica
  adecuada». Estado sano.
- Las URLs heredadas de WordPress están resueltas: `/feed/`, `/tag/`, `/page/2/`,
  `/author/` y `/category/` devuelven **301** a destinos correctos.
- Las de tipo `/?p=123`, `?replytocom=` y `/?s=` devuelven 200 **con canonical a la home o
  al post**, así que también son duplicados sanos.
- `/wp-json/`, `/xmlrpc.php` y las URLs de adjunto devuelven 404.

La descomposición del resto es aritmética que cuadra, no un censo verificado. Lo
verificado son los canonicals, las redirecciones y la coincidencia 532 ≈ 533,5.

**Conclusión: de las 1.929, solo ~170 son contenido real fuera del índice**, y son
exactamente las que ya perseguimos en el punto abierto nº 1 —«Rastreada: actualmente sin
indexar»—, todavía sin explicación tras descartar longitud del texto, antigüedad, enlaces
internos, el `¿` del slug y la duplicación semántica.

**Corrección explícita a lo que se venía diciendo:** los informes anteriores hablaban de
«unas 177 URLs con contenido real fuera del índice» extrapolando desde la muestra. La cifra
era buena —el censo dice 170—, pero se presentaba como una estimación con incertidumbre.
Ya no lo es: es un recuento.

### Arreglo desplegado: 301 de `www` a no-`www`

El canonical evitaba el daño de indexación, pero **no el de rastreo**: un agente podía
gastar la mitad de sus peticiones leyendo el sitio duplicado, que es justo la métrica del
encargo. Implementado en `functions/_middleware.ts`, no como regla del panel de Cloudflare,
para que quede versionado y sea reversible con un `git revert`.

El 301 va **antes de `context.next()`**, así que la petición a `www` ni genera la página ni
suma un hit al contador de agentes. Los dominios `*.pages.dev` quedan excluidos a
propósito: redirigirlos a producción rompería la verificación de los despliegues de
preview.

Verificado en producción tras el despliegue:

| Comprobación | Resultado |
| --- | --- |
| `www` → no-`www`, home, post, `/sitemap.xml`, `.md` y con query string | 301 correcto, ruta y query preservadas |
| no-`www`: home, `/blog/`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/sobre/`, `/feed.xml`, gemelo `.md` | 200, intacto |
| ChatGPT-User, Claude-User, PerplexityBot, GPTBot en `/robots.txt` | 200, sin bloqueo |
| Redirecciones heredadas (`/feed/`, `/tag/`, `/category/`, `/page/2/`) | 301, siguen vivas |
| `/api/bots` | responde, contador intacto |

**Qué esperar.** El índice no debería moverse: esas URLs ya estaban fuera por canonical. Lo
que debería bajar es el rastreo duplicado. Es medible con el contador de agentes, pero la
señal es indirecta y φ ≈ 2,6 hace que el ruido semanal se coma casi cualquier efecto, así
que **no conviene declarar nada antes de un mes**.

## Para Alfonso — pendientes, por orden de impacto

1. ~~Reverificar la propiedad en Search Console.~~ **Hecho el mismo día.** La propiedad
   volvió a `siteOwner` y el muestreo de indexación, parado dos semanas, ya ha corrido.
2. **Añadir el enlace de vuelta en el perfil de GitHub** (campo «Website» →
   `https://crearsoftware.com`) y **rellenar `linkedin` en
   `authors/alfonso-gutierrez.json`**. Sin reciprocidad, el `sameAs` que se acaba de
   desplegar es una afirmación sin respaldo. Con ella, es una identidad verificable.
3. **Exportar «AI Performance» de bing.com/webmasters** cuando toque (cadencia mensual, el
   último es del 19-ago). Sigue sin endpoint y la ventana del panel es limitada: sin
   archivar el CSV el dato se pierde. Es la única fuente cuantitativa de citación.
4. **Quitar el sitemap de `www` en Bing Webmaster Tools.** Estaba registrado
   `https://www.crearsoftware.com/sitemap.xml` con 696 URLs. Desde el 301 devuelve una
   redirección, así que no hace daño, pero conviene borrarlo de la lista para que el
   informe de sitemaps deje de mezclar dos entradas del mismo sitio.
5. **Borrar el token de Cloudflare** que quedó expuesto en una conversación. Sigue
   pendiente desde hace semanas.

## Ficheros ya modificados que no entran en este commit

Estaban tocados en el working tree antes de empezar y se han dejado fuera, por si son
trabajo en curso:

- `data/cf-traffic-2026-08-01.{json,md}` y `data/cf-traffic-latest.{json,md}`
- `guides/guia-agentes-ia-empresas.md`
- `data/bing-report-2026-08-05.{json,md}` (sin seguimiento en git)
