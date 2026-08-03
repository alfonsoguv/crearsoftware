---
title: "Deep research, año y medio después: qué cambió de verdad la investigación automatizada"
slug: "open-ai-presenta-deep-research"
date: "2025-02-25"
dateModified: "2026-08-03"
oldUrl: "/2025/02/25/open-ai-presenta-deep-research/"
description: "OpenAI presentó deep research en febrero de 2025 con un 26,6% en Humanity's Last Exam. Qué ha pasado desde entonces, qué resuelve de verdad y dónde sigue fallando."
category: "inteligencia-artificial"
tags: ["inteligencia artificial", "openai", "agentes", "automatización", "innovación"]
readingTime: 6
author: "Alfonso Gutiérrez"
commentCount: 0
wordCount: 1181
image: "/wp-content/uploads/2025/02/freepik__the-style-is-candid-image-photography-with-natural__97974.png"
---

![Deep research, año y medio después](/wp-content/uploads/2025/02/freepik__the-style-is-candid-image-photography-with-natural__97974.png)

> **Nota de la edición (agosto de 2026).** Esta entrada se publicó en febrero de 2025 como traducción de la nota de lanzamiento de OpenAI. Se ha sustituido por un análisis propio con año y medio de uso a la espalda. La nota original está enlazada abajo.

El 2 de febrero de 2025, OpenAI presentó [deep research](https://openai.com/index/introducing-deep-research/): un modo de ChatGPT que, en lugar de responder de inmediato, navega la web durante minutos, lee decenas de fuentes y devuelve un informe con citas. Se abrió primero a los usuarios Pro y se amplió al resto de planes de pago a lo largo de febrero.

Fue el primer producto de consumo masivo en el que **el tiempo de respuesta era una característica, no un defecto**. Ese cambio de expectativa importa más, a largo plazo, que las cifras del lanzamiento.

## Las cifras del lanzamiento, y lo rápido que envejecieron

Los dos números que se citaron entonces:

| Prueba | Resultado (feb-2025) | Qué mide |
|---|---|---|
| [Humanity's Last Exam](https://agi.safe.ai/) | 26,6% | Preguntas de nivel experto, diseñadas para resistir |
| GAIA | 67,4% | Tareas que exigen usar herramientas y varios pasos |

El 26,6% era el mejor resultado público del momento y se presentó como un salto. Lo fue. Pero conviene ver qué ha pasado con esa misma prueba: **en agosto de 2026, la cabeza de la tabla ronda el 53%**. El listón se ha duplicado en dieciocho meses.

Eso deja una lección sobre cómo leer los anuncios de este sector: **la cifra de un lanzamiento no es una posición, es una fecha**. Sirve para saber cuándo estábamos, no para comparar productos seis meses después.

## Qué resolvió de verdad

Con perspectiva, el mérito de deep research no fue el modelo. Fue reconocer que **la investigación es un problema de proceso, no de conocimiento**.

Un modelo normal responde con lo que tiene en el contexto. Un agente de investigación hace otra cosa: descompone la pregunta, busca, lee, se da cuenta de que le falta algo, vuelve a buscar. Ese bucle —y no un salto de capacidad bruta— es lo que produce un informe utilizable.

Tres consecuencias prácticas que se han asentado:

**1. Cambió la unidad de trabajo.** Se pasó de «hazme un resumen» a «investiga esto y vuelve». Eso permite delegar tareas que antes no compensaba delegar porque explicarlas costaba más que hacerlas.

**2. Normalizó las citas.** El informe con fuentes enlazadas se convirtió en el formato esperado. Fue un buen precedente: hizo comprobable lo que antes no lo era.

**3. Puso valor en ser una fuente legible.** Si un agente lee decenas de páginas para redactar un informe, ser una de las que entiende y cita pasa a tener valor propio. Es el origen del [GEO](/blog/geo-optimizar-web-agentes-ia-llms-txt/), y no es una abstracción: en este blog el contador del servidor ya registra visitas de agentes que consultan páginas mientras alguien espera una respuesta.

## Dónde sigue fallando

Año y medio de uso deja un patrón bastante claro de fallos. No son problemas de redacción: son de método.

**Confunde consenso con verificación.** Si cinco páginas repiten el mismo dato porque todas copian de la misma fuente, el informe lo presenta como sólido. La repetición no es evidencia, pero en un corpus web se le parece mucho. Es el fallo más peligroso porque el resultado *suena* bien documentado.

**Ese fallo lo hemos sufrido en casa.** Al revisar el mercado de agentes de voz para otro artículo, las cifras de tamaño de mercado que devuelven las búsquedas proceden en su mayoría de blogs comerciales que se citan entre sí, sin una fuente primaria al final de la cadena. Un informe automatizado las habría agregado con toda naturalidad. Decidimos no publicar ninguna.

**No sabe cuándo la fuente está muerta.** Un dato de 2023 presentado sin contexto temporal parece vigente. En un sector donde una cifra de referencia se duplica en dieciocho meses, eso no es un matiz.

**No distingue interés.** Un informe de capital riesgo, una nota de prensa y un estudio independiente entran al mismo saco. Todos son «fuentes».

**El coste de verificar no bajó.** Y esta es la trampa de fondo: **generar el informe pasó a costar minutos y comprobarlo sigue costando horas**. Cuando la generación es barata y la verificación no, la tentación de no verificar crece. El riesgo no es que la herramienta se equivoque; es que deje de compensar comprobarlo.

## Cómo usarlo sin que te muerda

Lo que nos ha funcionado, dicho como reglas:

1. **Pide la cadena, no la conclusión.** Un informe de tres páginas con veinte enlaces es menos útil que cinco afirmaciones con la fuente primaria de cada una.
2. **Exige fecha a cada dato.** Sin fecha, un dato no es información.
3. **Comprueba a mano lo que vayas a publicar o a decidir.** El resto puede quedarse como orientación.
4. **Úsalo para mapear, no para concluir.** Es excelente descubriendo qué existe y qué se discute. Es mediocre decidiendo qué es verdad.

## El saldo

Deep research inauguró una categoría y la categoría se quedó. Hoy hay equivalentes en todos los asistentes grandes y la idea de «espera unos minutos y te traigo un informe» es normal.

Lo que no cambió es dónde está el trabajo difícil. Sigue estando en decidir qué fuente merece crédito — y esa parte no se ha automatizado, aunque el formato del informe con citas dé la impresión contraria.

## Preguntas frecuentes

### ¿Qué es deep research de OpenAI?

Es un modo de ChatGPT presentado el 2 de febrero de 2025 que, en vez de responder al instante, navega la web durante varios minutos, consulta múltiples fuentes y devuelve un informe estructurado con citas enlazadas.

### ¿Qué puntuación obtuvo en los benchmarks?

En su lanzamiento alcanzó un 26,6% en Humanity's Last Exam —el mejor resultado público de entonces— y un 67,4% en GAIA. En agosto de 2026, los primeros puestos de Humanity's Last Exam rondan el 53%, lo que da idea de lo rápido que envejecen estas cifras.

### ¿Es fiable un informe generado por un agente de investigación?

Es fiable como mapa y poco fiable como conclusión. El fallo característico es confundir consenso con verificación: si varias páginas repiten un dato porque copian de la misma fuente, el informe lo presenta como sólido. Conviene comprobar a mano cualquier dato que vaya a publicarse o a fundamentar una decisión.

### ¿Qué diferencia a un agente de investigación de un chatbot normal?

El bucle. Un chatbot responde con lo que tiene en el contexto; un agente de investigación descompone la pregunta, busca, lee, detecta lo que le falta y vuelve a buscar. Esa iteración, y no la capacidad bruta del modelo, es lo que produce un informe utilizable.

### ¿Cómo afecta esto a quien publica contenido en la web?

Le da valor a ser una fuente legible y citable. Si los agentes leen decenas de páginas para redactar un informe, aparecer entre las que se citan pasa a ser un objetivo propio, distinto del posicionamiento clásico en buscadores.
