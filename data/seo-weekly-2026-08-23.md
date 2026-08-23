# Informe semanal SEO/GEO — 2026-08-23

## ⚠️ BLOQUEO: Search Console ha degradado la cuenta a `siteUnverifiedUser`

`npm run seo:gsc:indexation` falla con **403 PERMISSION_DENIED** en las 25 URLs.
**No es el `invalid_grant` de julio: el token OAuth funciona perfectamente.** El
`refresh_token` canjea sin problema y el `access_token` que devuelve tiene el scope
`https://www.googleapis.com/auth/webmasters`. Lo que ha cambiado es el permiso sobre la
propiedad. `GET /webmasters/v3/sites` devuelve:

| Propiedad | Nivel de permiso |
| --- | --- |
| `sc-domain:crearsoftware.com` | **siteUnverifiedUser** |
| `http://www.alfonsogu.com/` | **siteUnverifiedUser** |
| `https://deepdna.ai/` | siteOwner |

El 17 de agosto esta misma cuenta inspeccionó 200 URLs sin un solo error. Entre el 17 y
el 23 de agosto ha perdido la verificación de propiedad sobre crearsoftware.com.

Lo que **no** es la causa, ya comprobado:

- **No es el DNS.** El registro sigue publicado y resuelve:
  `google-site-verification=XyBajVEdRSYj6GAeRUisS3L3-TRaMBWqmvaIQ_Yrkic`. Los NS son de
  Cloudflare y responden.
- **No es el token ni la app OAuth.** El canje funciona y el scope es el correcto.
- **No es una caída de la API.** La misma credencial es `siteOwner` de deepdna.ai, así
  que la llamada es válida; lo que se rechaza es esta propiedad concreta.
- **No es Bing.** `npm run seo:bing` responde con «Propiedad verificada: sí». El problema
  es específico de Google.

Cada cuenta de Google tiene su propio token de verificación, así que un TXT válido en el
DNS junto a una cuenta sin verificar apunta a que **el TXT publicado pertenece a otra
cuenta de Google distinta de la que autoriza el script**, o a que la verificación de esta
se revocó.

**Solo Alfonso puede resolverlo**, y son cinco minutos: entrar en
[Search Console](https://search.google.com/search-console) **con la misma cuenta que
autorizó `npm run seo:gsc:connect`**, abrir la propiedad `crearsoftware.com` y pulsar
«Verificar». Si dice que el token TXT no coincide, copiar el que muestre y añadirlo en
Cloudflare DNS junto al que ya hay: se pueden tener varios registros de verificación a la
vez, uno por cada cuenta propietaria.

Consecuencia mientras dure: **sin indexación, sin rendimiento y sin envío de sitemap por
API en Google.** Bing, el contador de agentes y el resto del ciclo funcionan.

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

Verificado reejecutando: falla igual con 403, y el cursor queda intacto en `start: 400`,
`runs: 4`, `coveredCount: 349`. Revertido a mano el avance en falso de la primera
ejecución.

Esto no tiene relación con el sesgo de `%C2%BF` documentado el 17-ago, que era un fallo
parcial. Es el caso del fallo total, que no estaba contemplado.

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

## Para Alfonso — pendientes, por orden de impacto

1. **Reverificar la propiedad en Search Console.** Es el bloqueo de la semana y sin ello
   no hay ninguna métrica de Google. Ver la primera sección: cinco minutos.
2. **Añadir el enlace de vuelta en el perfil de GitHub** (campo «Website» →
   `https://crearsoftware.com`) y **rellenar `linkedin` en
   `authors/alfonso-gutierrez.json`**. Sin reciprocidad, el `sameAs` que se acaba de
   desplegar es una afirmación sin respaldo. Con ella, es una identidad verificable.
3. **Exportar «AI Performance» de bing.com/webmasters** cuando toque (cadencia mensual, el
   último es del 19-ago). Sigue sin endpoint y la ventana del panel es limitada: sin
   archivar el CSV el dato se pierde. Es la única fuente cuantitativa de citación.
4. **Borrar el token de Cloudflare** que quedó expuesto en una conversación. Sigue
   pendiente desde hace semanas.

## Ficheros ya modificados que no entran en este commit

Estaban tocados en el working tree antes de empezar y se han dejado fuera, por si son
trabajo en curso:

- `data/cf-traffic-2026-08-01.{json,md}` y `data/cf-traffic-latest.{json,md}`
- `guides/guia-agentes-ia-empresas.md`
- `data/bing-report-2026-08-05.{json,md}` (sin seguimiento en git)
