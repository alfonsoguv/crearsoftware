---
title: "Quién pide de verdad tus ficheros .md: una semana midiendo qué formato consume la IA"
slug: "quien-pide-markdown-agentes-ia-medicion"
date: "2026-08-16"
dateModified: "2026-08-16"
description: "Medimos qué formato piden los rastreadores de IA en 1936 peticiones. Los crawlers de entrenamiento consumen Markdown hasta un 37% de las veces; los agentes que responden a un usuario en vivo lo pidieron cero veces."
category: "inteligencia-artificial"
tags: ["GEO", "inteligencia artificial", "agentes", "Markdown", "SEO"]
readingTime: 8
author: "Alfonso Gutiérrez"
wordCount: 1600
image: ""
---

**Servir una versión Markdown de cada página es una de las recomendaciones de moda en GEO. Aquí llevamos una semana midiendo quién la pide, y el resultado separa dos cosas que suelen mezclarse: los rastreadores de entrenamiento sí consumen Markdown —hasta un 37% de sus lecturas—, y los agentes que visitan la web porque un usuario está preguntando ahora mismo lo pidieron cero veces de 64.**

El consejo de publicar `/ruta.md` junto a cada `/ruta/` circula desde hace meses sin ningún dato público detrás. Es razonable —un modelo parsea mejor Markdown que HTML lleno de navegación— pero razonable no es lo mismo que comprobado. Este blog lo implementó el 2 de agosto de 2026 y lo instrumentó para responder a la pregunta con números propios.

## Cómo se mide

Los motores generativos no ejecutan JavaScript, así que ninguna analítica de cliente los ve. La única forma de contarlos es en el servidor, mirando el `User-Agent` declarado.

El middleware del sitio ya llevaba un contador por rastreador. Desde el 9 de agosto registra además **qué formato se sirvió** en cada petición: `md`, `llms` (los ficheros `llms.txt` y `llms-full.txt`) o `html`. Las peticiones anteriores a esa fecha no llevan el campo y se declaran aparte como «sin medir», en vez de imputarlas a HTML: contarlas como HTML falsearía el resultado justo en la dirección que interesa.

Los datos que siguen son las **1936 peticiones medidas** hasta el 16 de agosto de 2026.

## El resultado

| Agente | Peticiones medidas | En Markdown | % Markdown |
| --- | --- | --- | --- |
| GPTBot *(entrenamiento)* | 1266 | 470 | 37,1% |
| ClaudeBot *(entrenamiento)* | 32 | 12 | 37,5% |
| Amazonbot *(entrenamiento)* | 131 | 28 | 21,4% |
| Bingbot *(búsqueda)* | 207 | 3 | 1,4% |
| Googlebot *(búsqueda)* | 214 | 0 | 0% |
| PerplexityBot *(búsqueda)* | 21 | 0 | 0% |
| ChatGPT-User *(agente en vivo)* | 59 | 0 | 0% |
| Claude-User *(agente en vivo)* | 5 | 0 | 0% |
| OAI-SearchBot *(búsqueda)* | 1 | 0 | 0% |

La separación es limpia y cae exactamente sobre la frontera que importa:

- **Los tres rastreadores de entrenamiento piden Markdown de forma sistemática.** Son tres empresas distintas, con tres infraestructuras distintas, y las tres convergen en el mismo comportamiento. Que coincidan por azar es difícil de sostener.
- **Los rastreadores de búsqueda casi no lo piden.** Bingbot 3 de 207, Googlebot ninguna de 214.
- **Los agentes en vivo no lo pidieron nunca.** Cero de 64.

## Qué significa «cero de 64»

Aquí conviene ser honesto con el tamaño de la muestra. Cero de 64 no demuestra que nunca ocurra: el intervalo de confianza al 95% para esa proporción es **[0% – 5,7%]**. Es decir, los datos son compatibles con que hasta 1 de cada 18 peticiones de agentes en vivo fuera a Markdown, y aún no lo habríamos visto.

Lo que sí descartan es el escenario optimista. Si los agentes en vivo pidieran Markdown a la tasa a la que lo hace GPTBot (37%), en 64 peticiones habríamos visto unas 24. Ver cero es incompatible con esa hipótesis por un margen enorme. **El gemelo Markdown no está cambiando lo que lee el agente que genera la cita.**

Hay un segundo caveat que hay que poner encima de la mesa: de las 1266 peticiones medidas de GPTBot, 1248 llegaron el mismo día, el 12 de agosto, en un solo barrido. Si el dato dependiera solo de GPTBot, sería un evento, no un patrón. No es el caso: Amazonbot (131 peticiones repartidas en ocho días) y ClaudeBot son agentes independientes con el mismo comportamiento. Pero el 37,1% de GPTBot, tomado aisladamente, describe un barrido concreto y no debe leerse como una tasa estable.

## La lectura práctica

El gemelo Markdown no es una palanca de citación. Es una palanca de corpus.

Son dos cosas distintas y tienen horizontes distintos:

**Lo que consume el Markdown es el entrenamiento.** GPTBot, ClaudeBot y Amazonbot alimentan el conocimiento base del modelo. Lo que se llevan hoy influye en lo que el modelo sabe dentro de meses, cuando se entrene una versión nueva. Es una inversión a largo plazo, real pero lenta e imposible de atribuir.

**Lo que genera la cita es el HTML.** Cuando alguien pregunta algo a ChatGPT y el sistema decide ir a leer una página para responder, el que va es ChatGPT-User —y pide HTML. Siempre, en las 59 peticiones observadas. Lo mismo Claude-User.

De ahí sale la consecuencia accionable, y es casi la contraria a la que sugiere el discurso habitual de GEO: **si el objetivo es que te citen, el trabajo está en el HTML, no en el Markdown.** Encabezados que respondan a una pregunta, la respuesta en el primer párrafo de cada sección, datos con su fuente y su fecha, y nada de enterrar la sustancia bajo tres pantallas de navegación. Eso es lo que ve el agente que está respondiendo ahora mismo a un usuario.

El Markdown merece seguir ahí —cuesta muy poco y el canal de entrenamiento es real—, pero conviene saber para qué sirve y no esperar de él lo que no da.

## Por qué esto no se sabía

Porque casi nadie lo mide. Las recomendaciones de GEO se apoyan en un argumento de plausibilidad —«el Markdown es más limpio, luego el modelo lo preferirá»— que es correcto sobre el papel y falso en la práctica, por una razón mundana: **el agente en vivo pide la URL que encontró**, y la que encontró está en un índice de búsqueda o en el propio texto de la conversación, en forma canónica y en HTML. No sale a explorar formatos alternativos aunque los anuncies en el `<head>`.

Los rastreadores de entrenamiento sí exploran, porque su objetivo es distinto: quieren el texto lo más limpio posible para un corpus, no reproducir la página que vería una persona.

## Cómo replicarlo

Si sirves gemelos Markdown y quieres tu propio dato, la medición es barata. En un middleware de Cloudflare Pages, Workers o equivalente:

1. Identifica el rastreador por su `User-Agent` y clasifícalo en tres familias: entrenamiento, búsqueda y agente en vivo. **La distinción importa más que el total**: mezclarlas es lo que hace que el dato no diga nada.
2. Deriva el formato del *pathname* de la petición: termina en `.md`, es un `llms.txt`, o es HTML.
3. Guárdalo **dentro del registro que ya escribes**, como un campo más. No hace falta una entrada nueva por formato.
4. Marca como «sin medir» todo lo anterior a la instrumentación. No lo imputes al formato mayoritario.

Y una trampa que conviene evitar, porque aquí se cayó en ella: si compruebas a mano que los agentes no están bloqueados con `curl -A "ChatGPT-User" https://tudominio.com/`, **esa petición entra en tu propio contador**, en la familia de menor volumen y por tanto la más sensible. Haz esa comprobación contra `/robots.txt` u otra ruta que no cuentes.

## Lo que queda por saber

Estas son preguntas abiertas, no conclusiones:

- **¿Se mantiene el cero cuando la muestra crezca?** Con 64 peticiones no se distingue «nunca» de «raramente». Con 500 sí.
- **¿Cambia si el HTML es peor?** Puede que un agente recurra al Markdown solo cuando el HTML le resulta ilegible. No es comprobable sin degradar la página a propósito.
- **¿Sirve de algo el `<link rel="alternate">`?** Los datos sugieren que los agentes en vivo lo ignoran. Los de entrenamiento encuentran los `.md`, pero también están anunciados en `llms.txt` y en `robots.txt`, así que no se puede atribuir a un canal concreto.

Las cifras de este artículo salen del contador de rastreadores de este blog, ventana del 9 al 16 de agosto de 2026. Son pequeñas y se publican con sus intervalos precisamente por eso: en GEO circula mucha recomendación segura de sí misma y muy poco dato con fecha.
