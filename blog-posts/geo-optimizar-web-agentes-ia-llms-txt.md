---
title: "GEO: cómo optimizar tu web para agentes de IA (llms.txt, schema y robots.txt)"
slug: "geo-optimizar-web-agentes-ia-llms-txt"
date: "2026-07-31"
dateModified: "2026-07-31"
description: "Qué es el GEO y cómo preparar tu web para que ChatGPT, Claude, Perplexity y AI Overviews la encuentren y la citen: llms.txt, datos estructurados y robots.txt."
category: "inteligencia-artificial"
tags: ["GEO", "SEO", "inteligencia artificial", "agentes", "llms.txt", "mcp"]
readingTime: 11
author: "Alfonso Gutiérrez"
wordCount: 2100
image: ""
---

El **GEO (Generative Engine Optimization)** es el conjunto de técnicas para que un contenido sea **encontrado, entendido y citado** por motores generativos y agentes de IA: ChatGPT Search, Claude, Perplexity, Gemini y los AI Overviews de Google. No sustituye al SEO clásico: cambia el destinatario. Donde el SEO optimiza para que una persona haga clic en un resultado, el GEO optimiza para que un modelo **te use como fuente y te enlace** dentro de su respuesta.

La diferencia práctica es brutal. Un buscador tradicional te manda visitas si estás entre los diez primeros. Un motor generativo lee tres o cuatro fuentes, sintetiza y cita a una o dos. **El tráfico ya no se reparte por posición, se reparte por citabilidad.**

Este artículo explica qué hace falta para ser citable, con el detalle técnico concreto: `llms.txt`, datos estructurados, `robots.txt` y estructura de contenido.

## Qué es el GEO y en qué se diferencia del SEO

| | SEO clásico | GEO |
|---|---|---|
| **Destinatario** | Índice de un buscador + persona | Modelo de lenguaje que sintetiza |
| **Métrica de éxito** | Posición, CTR, clics | Menciones y citas en respuestas |
| **Unidad de valor** | La página completa | El **pasaje** concreto que responde |
| **Palanca principal** | Autoridad y enlaces | Claridad, estructura y verificabilidad |
| **Formato preferido** | HTML renderizado | Texto plano, listas, tablas, JSON-LD |

La consecuencia más importante: **el modelo no premia la página, premia el fragmento**. Si tu respuesta a "¿qué es X?" está en el párrafo doce, escondida detrás de una introducción de trescientas palabras, un modelo con presupuesto de contexto limitado no llegará a ella. Si está en las dos primeras líneas bajo un encabezado que coincide con la pregunta, la citará.

## Los cuatro pilares del GEO

### 1. Accesibilidad: que los crawlers de IA puedan entrar

Es el pilar más ignorado y el único que puede anular todo lo demás. Muchos sitios bloquean sin saberlo a los rastreadores de IA, bien por un `robots.txt` heredado, bien por un WAF agresivo, bien por servir el contenido solo tras ejecutar JavaScript.

Los agentes relevantes hoy se dividen en tres familias:

- **Rastreadores de entrenamiento**: `GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`, `Applebot-Extended`. Alimentan el conocimiento base del modelo.
- **Rastreadores de búsqueda**: `OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`, `Bingbot`. Construyen el índice que el modelo consulta en tiempo real.
- **Agentes en vivo**: `ChatGPT-User`, `Claude-User`, `Perplexity-User`. Visitan tu URL **en el momento** en que un usuario pregunta algo. Son la punta de lanza de la [nueva generación de agentes de IA para empresas](/guia/guia-agentes-ia-empresas/).

Bloquear a los de entrenamiento es una decisión editorial legítima. Bloquear a los de búsqueda y a los agentes en vivo es renunciar al tráfico: son exactamente los que generan la cita y el enlace.

Un `robots.txt` explícito para IA se ve así:

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://tudominio.com/sitemap.xml
```

Declararlos uno a uno es redundante frente a `User-agent: *`, pero elimina la ambigüedad y documenta tu política de forma auditable.

> Verifica siempre lo que ocurre de verdad: revisa los logs de tu servidor filtrando por esos user-agents. Si no aparece ninguno, no tienes un problema de contenido, tienes un problema de acceso.

### 2. Descubrimiento: `llms.txt`

`llms.txt` es una propuesta de estándar (llmstxt.org) que hace por los modelos lo que `sitemap.xml` hace por los buscadores: **un mapa del sitio legible en una sola petición**, en Markdown, sin navegación, sin menús, sin banners de cookies.

Un modelo que rastrea tu web gasta la mayor parte de su contexto en descartar plantilla. `llms.txt` le entrega directamente la estructura editorial.

El formato es deliberadamente simple:

```markdown
# Nombre del sitio

> Una frase que resume de qué va el sitio.

Contexto adicional en dos o tres líneas: quién escribe, desde cuándo,
qué tipo de contenido y cómo se puede citar.

## Guías principales

- [Título de la guía](https://tudominio.com/guia/): descripción breve.

## Artículos

- [Título del artículo](https://tudominio.com/articulo/): descripción breve.

## Opcional

- [Sobre el autor](https://tudominio.com/sobre/): trayectoria y contacto.
```

La convención añade un segundo fichero, **`llms-full.txt`**, con el texto íntegro del contenido. Aquí conviene ser selectivo: volcar quinientos artículos produce un fichero de varios megabytes que ningún agente va a procesar entero. Es más eficaz publicar el **corpus curado** —guías pilar y artículos de referencia— y dejar que `llms.txt` apunte al resto.

Dos detalles que marcan la diferencia:

- **Sírvelo como `text/plain; charset=utf-8`.** Si tu CDN lo devuelve como `application/octet-stream`, algunos agentes lo descartan.
- **Enlázalo desde `robots.txt`** como comentario y desde el pie de página. El descubrimiento de `llms.txt` todavía no está garantizado por convención.

Conviene decirlo con honestidad: `llms.txt` **no es un estándar adoptado oficialmente** por OpenAI, Anthropic ni Google, y hoy no hay evidencia pública robusta de que mejore por sí solo las citas. Es una apuesta de coste casi nulo —se genera en el build— con una ventaja secundaria inmediata: te obliga a tener un inventario limpio y descrito de tu contenido.

### 3. Comprensión: datos estructurados

El JSON-LD es el canal por el que le dices a un modelo qué es cada cosa sin que tenga que inferirlo del HTML. Los tipos que más rendimiento dan en GEO:

- **`Article` / `BlogPosting`**: autor, fecha de publicación y, sobre todo, **`dateModified`**. Los motores generativos penalizan con fuerza el contenido que no pueden fechar; una respuesta sobre tecnología sin fecha es una respuesta que el modelo prefiere no citar.
- **`FAQPage`**: pares pregunta/respuesta explícitos. Es el formato que un modelo puede extraer y reutilizar con menos riesgo de tergiversar, porque la respuesta ya viene delimitada. Si tu artículo tiene una sección de preguntas frecuentes en el texto pero no en el marcado, estás dejando la mitad del valor sobre la mesa.
- **`BreadcrumbList`**: le da al modelo la jerarquía temática, útil para entender que un artículo pertenece a un silo.
- **`Organization` / `Person` con `sameAs`**: conecta la entidad con perfiles verificables. Es la base de la señal de autoría, que pesa más en GEO que en SEO porque el modelo necesita justificar por qué te cita.

### 4. Extracción: escribir para que te puedan citar

Con el acceso resuelto, lo que decide si te citan es la forma del texto:

1. **Responde en las dos primeras frases bajo cada encabezado.** El patrón útil es *definición directa → matiz → desarrollo*. Nada de calentamiento.
2. **Convierte los encabezados en las preguntas reales.** `## Cuánto cuesta implantar un CRM en una PYME` funciona mejor que `## Costes`. El encabezado es la clave de emparejamiento entre la pregunta del usuario y tu pasaje.
3. **Usa tablas y listas para lo comparable.** Un modelo extrae una tabla con precisión casi perfecta; extrae un párrafo comparativo con errores.
4. **Da cifras, fechas y fuentes concretas.** Los pasajes con datos verificables se citan desproporcionadamente más que las afirmaciones genéricas, porque reducen el riesgo de alucinación del modelo.
5. **Cierra con una sección de preguntas frecuentes** que recoja las variantes literales de búsqueda. Es contenido útil para el lector y material de cita directa para el modelo.
6. **Declara la fecha de actualización de forma visible**, no solo en el marcado.

## Cómo medir el GEO (y por qué es difícil)

Aquí conviene bajar las expectativas: **hoy no existe un Search Console para motores generativos**. Lo que sí se puede medir:

- **Logs de servidor por user-agent.** La métrica más fiable y la que casi nadie mira. Cuenta visitas de `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `ChatGPT-User`. Si suben, te están leyendo.
- **Referrers.** ChatGPT, Perplexity y Copilot envían referrer identificable (`chat.openai.com`, `perplexity.ai`). Segmenta esas visitas en tu analítica: son pequeñas en volumen y suelen tener una intención altísima.
- **Auditoría manual de prompts.** Elige quince preguntas que tu contenido responde bien y compruébalas periódicamente en cada motor. Es artesanal, pero es la única medida directa de "¿me citan?".
- **Menciones sin enlace.** Un modelo puede nombrarte sin enlazarte. Cuenta como señal de marca aunque no genere clic.

Lo que **no** debes hacer es atribuir subidas de tráfico al GEO sin aislar la causa. Los volúmenes son pequeños y el ruido estadístico se come cualquier conclusión precipitada.

## Errores frecuentes

- **Bloquear a los agentes en vivo por miedo al scraping.** `ChatGPT-User` no entrena nada: visita tu página porque un usuario concreto está preguntando por tu tema justo ahora. Bloquearlo es cerrar la puerta al visitante.
- **Contenido que solo existe tras ejecutar JavaScript.** La mayoría de rastreadores de IA no ejecutan JS o lo hacen de forma limitada. Si tu texto se inyecta en cliente, para ellos tu página está vacía.
- **Publicar `llms.txt` y olvidarlo.** Un índice desactualizado es peor que no tenerlo: enseña URLs muertas.
- **Rellenar de palabras clave.** Los motores generativos son especialmente insensibles al *keyword stuffing* y especialmente sensibles a la coherencia semántica.
- **Quitar las fechas para que el contenido "no envejezca".** Es contraproducente: sin fecha, el modelo asume que no es fiable.

## Por dónde empezar esta semana

Si tuvieras que hacer solo cuatro cosas, en este orden:

1. Revisa los logs y confirma que los crawlers de IA entran. Arregla el acceso si no.
2. Añade `FAQPage` al marcado de los artículos que ya tienen preguntas frecuentes en el texto. Es la mejora de mayor retorno por esfuerzo.
3. Genera `llms.txt` en tu proceso de build, no a mano.
4. Reescribe la primera frase de cada sección de tus diez páginas más importantes para que responda directamente.

Nada de esto exige rehacer el sitio. Exige que el contenido que ya tienes sea legible por una máquina que solo va a leerlo una vez.

Y si lo que quieres es dar el paso siguiente —que un agente no solo lea tu web, sino que pueda **consultar tus datos y ejecutar acciones**—, ahí el terreno ya no es el GEO sino el [Protocolo de Contexto de Modelo (MCP)](/2025/04/14/la-guia-definitiva-sobre-el-protocolo-de-contexto-del-modelo-mcp/), que estandariza cómo un modelo se conecta a herramientas y fuentes externas.

## Preguntas frecuentes sobre GEO y llms.txt

### ¿Qué es el GEO en marketing digital?

GEO son las siglas de Generative Engine Optimization: la optimización de un sitio web para que los motores generativos y los agentes de IA (ChatGPT, Claude, Perplexity, Gemini, AI Overviews) encuentren su contenido, lo entiendan y lo citen como fuente en sus respuestas. Se diferencia del SEO en que el objetivo no es posicionar una página, sino conseguir que un modelo utilice tu contenido al construir la respuesta.

### ¿Qué es el fichero llms.txt y para qué sirve?

llms.txt es un fichero de texto en Markdown, situado en la raíz del dominio, que ofrece a los modelos de lenguaje un índice limpio del contenido del sitio: título, resumen y enlaces con descripción, sin menús ni plantilla. Sirve para que un agente descubra la estructura editorial completa en una sola petición, en lugar de rastrear cientos de páginas HTML llenas de elementos irrelevantes.

### ¿El llms.txt es un estándar oficial que usan ChatGPT o Google?

No. Es una propuesta de convención abierta (llmstxt.org) que ni OpenAI, ni Anthropic, ni Google han adoptado oficialmente, y no hay evidencia pública sólida de que por sí sola aumente las citas. Su interés está en el coste: se genera automáticamente en el build y, aunque los motores tarden en adoptarla, obliga a mantener un inventario descrito y actualizado del contenido.

### ¿El GEO sustituye al SEO tradicional?

No lo sustituye, lo complementa. Los motores generativos siguen apoyándose en índices de búsqueda para seleccionar las fuentes que citan, de modo que la autoridad, la indexación y la calidad técnica del SEO clásico siguen siendo requisitos previos. El GEO añade una capa sobre esa base: estructura extraíble, datos estructurados y acceso explícito para los rastreadores de IA.

### ¿Debo bloquear a GPTBot y ClaudeBot en mi robots.txt?

Depende de qué bots. Bloquear los rastreadores de entrenamiento (GPTBot, ClaudeBot, CCBot, Google-Extended) es una decisión editorial razonable si no quieres que tu contenido alimente modelos. Bloquear los rastreadores de búsqueda (OAI-SearchBot, PerplexityBot) y los agentes en vivo (ChatGPT-User, Claude-User) es contraproducente: son precisamente los que llevan a que te citen y te enlacen ante un usuario que está preguntando por tu tema.

### ¿Cómo sé si los agentes de IA están leyendo mi web?

La forma más fiable es revisar los logs del servidor filtrando por user-agent: busca GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot y ChatGPT-User, y observa su frecuencia de visita. Como complemento, segmenta en tu analítica las visitas con referrer de chat.openai.com o perplexity.ai, y audita manualmente un conjunto fijo de preguntas en cada motor para comprobar si apareces citado.

### ¿Qué datos estructurados son más importantes para el GEO?

Los cuatro con más impacto son BlogPosting o Article (con dateModified, que es determinante para que el modelo confíe en la vigencia del contenido), FAQPage (pares pregunta/respuesta que el modelo puede extraer sin tergiversar), BreadcrumbList (jerarquía temática) y Organization o Person con sameAs (señal de autoría verificable, que pesa más en GEO que en SEO clásico).
