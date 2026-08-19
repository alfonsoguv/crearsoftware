---
title: "Servir Markdown a los agentes de IA: la versión .md de cada página"
slug: "servir-markdown-agentes-ia-md-por-url"
date: "2026-08-02"
dateModified: "2026-08-09"
description: "Cómo publicar una versión Markdown de cada URL para que ChatGPT, Claude y Perplexity lean tu contenido sin plantilla: convenciones, implementación y cómo medir si sirve de algo."
category: "inteligencia-artificial"
tags: ["GEO", "inteligencia artificial", "agentes", "llms.txt", "markdown", "SEO"]
readingTime: 10
author: "Alfonso Gutiérrez"
wordCount: 2200
image: ""
---

**Servir Markdown a los agentes de IA consiste en publicar, junto a cada página HTML, un fichero de texto con el mismo contenido y sin plantilla, accesible añadiendo `.md` a la URL.** Es la pieza que falta entre `llms.txt` —un índice del sitio— y el trabajo real de un agente, que casi siempre es leer **una** página concreta.

La motivación es aburrida y práctica. Cuando ChatGPT o Perplexity abren una URL para responder a alguien, reciben el HTML entero: cabecera, menú, migas, tarjetas de artículos relacionados, pie, JSON-LD, scripts. El texto que importa puede ser el 15% de lo que se descarga. El modelo tiene que separarlo del resto antes de poder usarlo, y esa separación es donde se pierden matices: un titular de la barra lateral acaba pareciendo parte del argumento.

Este artículo explica las convenciones que existen, cómo generar los ficheros en un sitio estático, qué cabeceras hacen falta y —la parte que casi nadie cuenta— **cómo medir si los agentes los piden**, porque a día de hoy no hay evidencia pública de que servir Markdown aumente las citas.

Si vienes de más atrás, el punto de partida es [qué es el GEO y cómo optimizar una web para agentes de IA](/blog/geo-optimizar-web-agentes-ia-llms-txt/).

## ¿Qué es la versión .md de una página y para qué sirve?

Es el mismo artículo, en texto plano con marcado ligero, servido en una URL paralela a la original. Sirve para que un agente obtenga el contenido sin tener que descartar el andamiaje de la página.

| | Página HTML | Gemelo Markdown |
|---|---|---|
| **Destinatario** | Persona con navegador | Modelo que va a citar |
| **Peso típico** | 40-120 KB | 3-10 KB |
| **Ruido** | Menú, pie, relacionados, scripts | Ninguno |
| **Estructura** | Semántica dentro de plantilla | Encabezados y listas directos |
| **Metadatos** | `<meta>`, JSON-LD | Cabecera legible en el propio texto |

La ganancia no es que el modelo «entienda mejor» —los modelos actuales leen HTML sin problema—. La ganancia es de **coste y de foco**: menos tokens gastados en navegación y menos ocasiones de atribuir al artículo algo que estaba en la barra lateral.

## ¿Qué convención de URL hay que usar?

No hay una sola. Conviven tres, y por eso conviene publicar más de una.

La propuesta original es de **Jeremy Howard**, en la especificación de [llms.txt](https://llmstxt.org/) publicada el 3 de septiembre de 2024. Dice que las páginas útiles para un LLM deberían ofrecer una versión Markdown limpia **en la misma URL con `.md` añadido**, y que para URLs sin nombre de fichero se use `index.html.md`.

En la práctica se ven estas tres formas, todas respondiendo hoy con `Content-Type: text/markdown`:

| Forma | Ejemplo real |
|---|---|
| `ruta.md` | `docs.claude.com/en/docs/intro.md` |
| `ruta/index.md` | `developers.cloudflare.com/workers/index.md` |
| `ruta/index.html.md` | La forma que describe la especificación |

En este blog se publican las dos primeras para cada artículo. Son ficheros estáticos de unos pocos kilobytes: cubrir dos convenciones sale más barato que acertar cuál usará cada agente. La forma canónica que se anuncia es quitar la barra final y añadir `.md`:

```
https://crearsoftware.com/blog/geo-optimizar-web-agentes-ia-llms-txt/
https://crearsoftware.com/blog/geo-optimizar-web-agentes-ia-llms-txt.md
```

## ¿Cómo se anuncia para que un agente lo encuentre?

Adivinar la URL no debería ser necesario. Hay tres sitios donde declararlo, y conviene usar los tres porque distintos agentes miran en distintos lugares:

**1. En el `<head>` de cada página**, con el enlace alternativo estándar:

```html
<link rel="alternate" type="text/markdown"
      href="https://example.com/blog/mi-articulo.md"
      title="Versión Markdown para agentes de IA">
```

**2. En `llms.txt`**, explicando la regla una sola vez:

```
- Versión Markdown de cualquier página: quita la barra final y añade `.md`.
```

**3. En `robots.txt`**, como comentario. No es una directiva —`robots.txt` no tiene sintaxis para esto— pero es un fichero que todos los rastreadores descargan.

## ¿Cómo se generan en un sitio estático?

Si el contenido ya vive en Markdown, el gemelo es casi gratis: el generador escribe un fichero extra por artículo con una cabecera de contexto y el cuerpo sin tocar.

```javascript
function buildMarkdownTwin({ title, url, description, date, author, rawContent }) {
  const canonical = `${SITE_URL}${url}`;
  return `# ${title}

> ${description}

- URL canónica: ${canonical}
- Publicado: ${date}
- Autor: ${author}

---

${rawContent.trim()}

---

Citable indicando la fuente y enlazando a ${canonical}.
`;
}
```

Tres detalles que importan más de lo que parecen:

- **La URL canónica va dentro del texto.** Es la única forma de que el modelo sepa a dónde enlazar cuando cite un fragmento que llegó suelto a su contexto.
- **La fecha también.** Un agente que compara dos fuentes contradictorias usa la fecha para decidir cuál manda.
- **La licencia de cita, en una línea al final.** No tiene valor legal por sí sola, pero deja explícito qué esperas.

Si el contenido vive en una base de datos o en un CMS, la conversión HTML → Markdown en el momento de construir es un paso más, no un problema distinto.

## ¿Qué cabeceras hay que configurar?

Dos, y la segunda es la que evita un problema real.

```
/*.md
  Content-Type: text/markdown; charset=utf-8
  Cache-Control: public, max-age=3600
  X-Robots-Tag: noindex
```

El `Content-Type` correcto evita que el fichero se descargue en lugar de mostrarse. El `noindex` es la decisión de fondo: **el gemelo Markdown duplica el HTML**, y no quieres que compita con la página canónica en el índice de Google ni que se interprete como contenido duplicado.

La pregunta razonable es si ese `noindex` no espanta también a los agentes. No, porque las dos familias de rastreadores se comportan distinto:

- Los **indexadores** (Googlebot, GPTBot, ClaudeBot, PerplexityBot) construyen un índice y respetan directivas de indexación.
- Los **agentes en vivo** (ChatGPT-User, Claude-User, Perplexity-User) visitan porque hay una persona esperando una respuesta ahora mismo. Recuperan la URL como haría un navegador.

Y son justamente los segundos los que producen la cita con enlace. El `noindex` es, por tanto, barato.

## ¿Cómo se mide si esto sirve para algo?

Aquí toca ser honesto: **no hay evidencia pública de que servir Markdown aumente las citas en respuestas generativas.** Es una hipótesis razonable —menos ruido, menos coste de lectura—, no un resultado demostrado. Cualquiera que te venda una cifra de mejora se la está inventando.

Lo que sí se puede medir es si los agentes piden los ficheros. Y eso hay que instrumentarlo aparte, porque **las analíticas de cliente no ven nada**: Google Analytics, Plausible o Cloudflare Web Analytics funcionan con JavaScript en el navegador, y un rastreador no ejecuta JavaScript. Para un panel de analítica convencional, un agente de IA sencillamente no existe.

La única forma de contarlos es en el servidor, mirando el `User-Agent`. En Cloudflare Pages, con una función de middleware y un almacén clave-valor:

```javascript
const AGENTES = [
  ["ChatGPT-User", /ChatGPT-User/i],   // agente en vivo
  ["Claude-User", /Claude-User/i],     // agente en vivo
  ["PerplexityBot", /PerplexityBot/i], // indexador
  ["GPTBot", /GPTBot/i],               // entrenamiento
];

export const onRequest = async (context) => {
  const response = await context.next();
  const ua = context.request.headers.get("User-Agent") || "";
  const agente = AGENTES.find(([, patron]) => patron.test(ua))?.[0];
  if (agente) {
    // Agregado por bot y hora para acotar las escrituras.
    context.waitUntil(contar(context.env.CS_KV, agente, new URL(context.request.url).pathname));
  }
  return response;
};
```

El conteo debe ir en `waitUntil` para que nunca bloquee la respuesta, y agregado por hora para no disparar las escrituras. Es deliberadamente aproximado: durante una ráfaga concurrente varias peticiones leen el mismo contador y el total se queda corto. Sirve para ver tendencia, no para auditar petición a petición.

Conviene separar tres familias al contar, porque significan cosas distintas:

| Familia | Ejemplos | Qué indica |
|---|---|---|
| **Entrenamiento** | GPTBot, ClaudeBot, CCBot | El contenido entra en un corpus futuro |
| **Búsqueda generativa** | PerplexityBot, OAI-SearchBot | Estás en el índice que el modelo consulta |
| **Agentes en vivo** | ChatGPT-User, Claude-User, Perplexity-User | Alguien está preguntando **ahora** |

La tercera fila es la única que se traduce en una cita con enlace a corto plazo.

## ¿Qué hay que comprobar antes de nada?

Que tu proveedor no esté bloqueando a los agentes. Es más común de lo que parece, y en este blog fue exactamente lo que pasó: hasta el 1 de agosto de 2026, la protección contra bots de Cloudflare devolvía **403 a todos los rastreadores de IA**. Toda la instrumentación GEO del sitio estaba midiendo un canal cerrado.

Los números tras desbloquearlo, contados en el servidor desde el 1 de agosto de 2026 y consultados el día 2 a las 09:44 UTC, dan una idea de qué esperar:

| Agente | Peticiones |
|---|---|
| PerplexityBot | 333 |
| Googlebot | 53 |
| Bingbot | 38 |
| ChatGPT-User | 8 |
| Amazonbot / ClaudeBot | 7 cada uno |
| GPTBot | 5 |
| OAI-SearchBot | 4 |
| Claude-User | 3 |
| Perplexity-User | 1 |

Dos lecturas. La primera: **el rastreo llega en cuanto se abre la puerta**, y llega desigual —PerplexityBot solo hizo una petición el primer día y 332 al siguiente, un barrido completo del archivo en cuanto detectó que el sitio respondía—. La segunda, más sobria: los agentes en vivo, que son los que generan la cita, suman **12 peticiones**. Ese es el punto de partida real, y es pequeño.

La forma de comprobar tu propio caso es directa:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -A "ChatGPT-User" https://tu-dominio.com/
```

Un 403 o un 503 ahí invalida cualquier otra optimización que hagas.

## Qué esperar, con los pies en el suelo

Servir Markdown es barato, es reversible y no tiene contraindicaciones conocidas. También es, hoy, una apuesta sin resultados publicados. La secuencia sensata es: primero comprobar que no bloqueas; después instrumentar el conteo; después publicar los ficheros; y **solo entonces** mirar si la proporción de agentes que piden `.md` frente a HTML crece con las semanas.

Si dentro de tres meses ningún agente ha pedido un solo `.md`, la conclusión será que la convención no ha cuajado, y habrá costado unos kilobytes por artículo averiguarlo. Eso es un experimento barato, que es distinto de una buena práctica establecida. Conviene no confundirlos.

## Preguntas frecuentes

### ¿Qué es servir Markdown a los agentes de IA?

Es publicar, junto a cada página HTML, un fichero de texto con el mismo contenido sin plantilla ni navegación, accesible normalmente añadiendo `.md` a la URL original. El objetivo es que un modelo que va a citar la página obtenga solo el texto.

### ¿Qué URL debe tener la versión Markdown?

La especificación de llms.txt propone añadir `.md` a la URL original, y `index.html.md` cuando la URL no termina en un nombre de fichero. En la práctica conviven `ruta.md` y `ruta/index.md`. Publicar las dos primeras cuesta unos pocos kilobytes por artículo.

### ¿El Markdown duplicado perjudica al SEO?

No si se sirve con la cabecera `X-Robots-Tag: noindex`. Así el fichero queda fuera del índice de los buscadores y no compite con la página canónica, mientras que los agentes que leen en vivo —ChatGPT-User, Claude-User, Perplexity-User— siguen pudiendo recuperarlo.

### ¿Sirve llms.txt en lugar de esto?

No: resuelven cosas distintas. `llms.txt` es un índice del sitio y `llms-full.txt` es el corpus completo en un solo fichero, a menudo de varios megabytes. Un agente que ha llegado a una URL concreta no va a descargar el corpus entero para leer un artículo. El gemelo `.md` cubre justo ese caso.

### ¿Cómo sé si los agentes de IA leen mi web?

Contándolos en el servidor por `User-Agent`. Las analíticas de cliente —Google Analytics, Plausible, Cloudflare Web Analytics— no los ven, porque dependen de JavaScript y ningún rastreador lo ejecuta. En Cloudflare Pages basta una función de middleware que agregue los conteos en un almacén clave-valor.

### ¿Aumentan las citas en ChatGPT o Perplexity al servir Markdown?

No hay evidencia pública de que lo hagan. Es una hipótesis plausible por reducción de ruido y de coste de lectura, pero no un resultado medido. Lo que sí se puede verificar en el propio servidor es si los agentes piden los ficheros y en qué proporción frente al HTML.

### ¿Qué pasa si mi CDN bloquea a los rastreadores de IA?

Que nada de lo anterior sirve. Las protecciones contra bots de Cloudflare, Akamai o Fastly pueden devolver 403 a GPTBot, ClaudeBot o PerplexityBot con la configuración por defecto. Comprobarlo con `curl` y un `User-Agent` de agente es el primer paso, antes de cualquier otra optimización.
