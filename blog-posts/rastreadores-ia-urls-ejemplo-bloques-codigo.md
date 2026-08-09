---
title: "Los rastreadores de IA piden las URLs de ejemplo de tus bloques de código"
slug: "rastreadores-ia-urls-ejemplo-bloques-codigo"
date: "2026-08-09"
dateModified: "2026-08-09"
description: "Una URL inventada dentro de un snippet de este blog recibió 9 peticiones de agentes de IA en seis días. Qué implica para los artículos técnicos y cómo escribir los ejemplos para que no ocurra."
category: "inteligencia-artificial"
tags: ["GEO", "inteligencia artificial", "agentes", "documentación técnica", "SEO"]
readingTime: 7
author: "Alfonso Gutiérrez"
wordCount: 1500
image: ""
---

**Los rastreadores de IA no distinguen siempre entre un enlace real y una URL escrita dentro de un bloque de código de ejemplo: algunos la extraen y la piden.** En este blog ocurrió de forma medible, y el efecto es que un artículo técnico puede generar tráfico de agentes hacia páginas que no existen.

El hallazgo es pequeño y sale de un accidente, no de un experimento diseñado. Lo cuento con las cifras exactas y con sus límites, porque es justo el tipo de detalle que no aparece en las guías de GEO y que cualquiera que escriba documentación técnica reproduce sin darse cuenta.

## Qué pasó

El 2 de agosto de 2026 se publicó aquí un artículo sobre [servir Markdown a los agentes de IA](/blog/servir-markdown-agentes-ia-md-por-url/). Dentro llevaba un ejemplo de cómo anunciar el fichero Markdown en el `<head>` de una página:

```html
<link rel="alternate" type="text/markdown"
      href="https://example.com/blog/mi-articulo.md"
      title="Versión Markdown para agentes de IA">
```

En la versión publicada ese `href` no apuntaba a `example.com`, sino al propio dominio: `https://crearsoftware.com/blog/mi-articulo.md`. Es una URL de relleno. No existe, nunca existió, y no está enlazada desde ningún sitio: solo aparece como texto dentro de un `<pre>`, escapado, sin ser un enlace navegable.

Este sitio cuenta las peticiones de rastreadores de IA en el servidor, por `User-Agent`, porque ninguna analítica de cliente los ve. Entre el 2 y el 8 de agosto de 2026, el contador registró **9 peticiones a `/blog/mi-articulo.md`**. El artículo real que contiene el ejemplo lleva 15 peticiones de agentes desde que se publicó, medido el 9 de agosto.

Es decir, con la reserva de que las dos ventanas se diferencian en un día: por cada tres lecturas del artículo hubo aproximadamente dos peticiones a la URL inventada que aparecía dentro de él.

## Por qué importa más de lo que parece

Que una URL falsa reciba un 404 no es grave en sí. Lo interesante es lo que revela sobre cómo se lee un artículo técnico:

**El contenido de los bloques de código se procesa como contenido, no como ilustración.** Un lector humano ve `mi-articulo.md` y entiende «aquí va el nombre de tu artículo». Un agente que extrae URLs de la página no tiene ese contexto tipográfico. La distinción entre ejemplo y referencia es una convención social, no una marca semántica: no hay ningún atributo HTML que diga «esta URL es ficticia».

**Se amplifica con el tema.** El artículo trataba precisamente de una convención de URLs. Cuanto más específico y accionable es un tutorial, más URLs de ejemplo contiene, y más probable es que alguna se resuelva literalmente.

**Y tiene una versión peor.** Aquí el daño se quedó en 404. Pero el mismo mecanismo aplicado a un ejemplo de `<link rel="alternate">`, de `canonical`, de `sitemap` o de `robots.txt` puede acabar declarando algo falso sobre tu sitio si alguien —o algún modelo— reproduce el snippet creyendo que es la configuración real de quien lo publica.

## Los límites de este dato

Conviene ser explícito con lo que **no** demuestra:

- **Son 9 peticiones.** Es una cifra pequeña. Sirve para afirmar que el fenómeno ocurre, no para estimar su frecuencia ni compararlo entre plataformas.
- **No sé qué agente lo hizo.** El contador agrega las rutas sin desglosarlas por `User-Agent`, así que no puedo decir si fue un rastreador de indexación o un agente en vivo respondiendo a alguien.
- **No sé si generó una cita.** Un 404 no deja rastro de qué respuesta se estaba construyendo.
- **La serie se corta.** El 8 de agosto de 2026 el contador dejó de registrar respuestas 404 —por una razón ajena a esto: contar rutas inexistentes dejaba la creación de claves en manos de cualquiera que se declarase GPTBot—. Así que el conteo lleva congelado en 9 desde entonces y no puedo seguir la evolución sin volver a instrumentarlo.

Lo que sí es inequívoco es la causalidad: esa cadena de texto no existe en ningún otro sitio del dominio ni de la web. Las peticiones solo pueden venir de haber leído el artículo.

## Cómo escribir los ejemplos para evitarlo

Las reglas son viejas y estaban pensadas para otra cosa. Ahora tienen un motivo nuevo.

**Usa los dominios reservados para documentación.** El RFC 2606 reserva `example.com`, `example.net` y `example.org` exactamente para esto, y el RFC 6761 los declara de uso especial. Existen desde 1999 y llevan décadas sirviendo para que nadie interprete un ejemplo como una dirección real. Ese es el arreglo que se aplicó aquí.

**No uses tu propio dominio como relleno.** Es tentador —queda coherente con el resto del artículo— y es justo lo que provoca el problema: la URL parece legítima porque el dominio lo es.

**Reserva el dominio propio para URLs que existan de verdad.** Si el ejemplo gana al ser real, que sea real: enlazar el artículo concreto en lugar de un `mi-articulo` genérico es mejor ejemplo y no genera 404.

**Si necesitas mostrar una ruta de tu sitio que aún no existe, dilo en el texto.** No basta con el contexto del snippet: el aviso tiene que estar en prosa, fuera del bloque de código, porque es la parte que un modelo lee como afirmación.

**Comprueba el resultado.** Extraer del contenido publicado todas las URLs de tu propio dominio y pedirlas es un bucle de tres líneas. En este sitio se hizo el 9 de agosto de 2026 sobre todos los artículos y guías: aparte del caso descrito, todas las demás respondían 200.

```bash
grep -rhoE 'https://tu-dominio\.com/[A-Za-z0-9._~%/-]+' contenido/ \
  | sed 's/[.,)"`]*$//' | sort -u \
  | while read -r u; do
      echo "$(curl -s -o /dev/null -w '%{http_code}' "$u") $u"
    done | grep -v '^200'
```

## Lo que esto no cambia

No es un argumento contra publicar ejemplos concretos. Los tutoriales con URLs reales y comandos ejecutables son mejores que los que hablan en abstracto, y ese sigue siendo el criterio.

Tampoco es un motivo para bloquear rastreadores. El fenómeno es un efecto secundario de que los agentes lean el sitio, que es exactamente lo que se busca al optimizar para [búsqueda generativa](/blog/geo-optimizar-web-agentes-ia-llms-txt/).

Es, simplemente, un detalle de higiene que ha cambiado de importancia. Cuando el único lector era una persona, una URL de relleno era inofensiva. Cuando parte de tus lectores extraen y resuelven direcciones automáticamente, escribir `example.com` deja de ser pedantería de RFC y pasa a ser correcto.

## Preguntas frecuentes

### ¿Los rastreadores de IA siguen las URLs que aparecen en bloques de código?

Al menos algunos, sí. En este blog una URL ficticia que solo aparecía como texto dentro de un `<pre>` —sin ser un enlace— recibió 9 peticiones de agentes entre el 2 y el 8 de agosto de 2026. No es posible generalizar la frecuencia a partir de un caso, pero el fenómeno ocurre.

### ¿Qué dominio hay que usar en los ejemplos de documentación?

`example.com`, `example.net` o `example.org`. Están reservados por el RFC 2606 precisamente para documentación y ejemplos, y el RFC 6761 los define como dominios de uso especial que nunca se resolverán a un servicio real.

### ¿Es malo para el SEO que un rastreador reciba un 404?

Un 404 aislado en una URL que nunca estuvo indexada no tiene efecto medible en SEO: los buscadores esperan encontrarlos. El problema aquí no es de ranking, sino de que un agente que va a citar tu contenido se lleve una página vacía en lugar de la información.

### ¿Cómo se detecta este problema en una web ya publicada?

Extrayendo del contenido todas las URLs del propio dominio y comprobando su código de respuesta. Un `grep` sobre los ficheros fuente más un `curl` por URL basta; lo importante es hacerlo sobre el texto publicado, incluidos los bloques de código, y no solo sobre los enlaces del HTML renderizado.

### ¿Cómo sé si los agentes de IA piden URLs inexistentes en mi sitio?

Registrando en el servidor las peticiones con `User-Agent` de agente y su código de respuesta. Las analíticas basadas en JavaScript no sirven: ningún rastreador lo ejecuta. Hay que contar en el servidor, y conviene decidir de antemano si se cuentan los 404, porque cualquiera puede crear entradas nuevas pidiendo rutas inventadas con un `User-Agent` falsificado.
