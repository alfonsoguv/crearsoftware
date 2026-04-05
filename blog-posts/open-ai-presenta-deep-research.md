---
title: "Open AI presenta deep research"
slug: "open-ai-presenta-deep-research"
date: "2025-02-25"
oldUrl: "/2025/02/25/open-ai-presenta-deep-research/"
description: "OpenAI lanza Deep Research en ChatGPT: un agente de IA que investiga la web y genera informes completos en minutos. Capacidades, benchmarks y limitaciones."
category: "inteligencia-artificial"
tags: ["inteligencia artificial", "openai", "automatización", "innovación"]
readingTime: 8
author: "Alfonso Gutiérrez"
commentCount: 0
wordCount: 1419
image: ""
---

[Traducción por IA del artículo original](https://openai.com/index/introducing-deep-research/)

Hoy lanzamos deep research en ChatGPT, una nueva capacidad agencial que realiza investigaciones en múltiples etapas en internet para tareas complejas. Consigue en cuestión de minutos lo que a un humano le tomaría muchas horas.

Deep research es el próximo agente de OpenAI que puede trabajar por ti de forma independiente: le das una consulta y ChatGPT buscará, analizará y sintetizará cientos de fuentes en línea para crear un informe integral al nivel de un analista de investigación. Impulsado por una versión del próximo modelo OpenAI o3, optimizada para la navegación web y el análisis de datos, utiliza el razonamiento para buscar, interpretar y analizar enormes cantidades de textos, imágenes y PDFs en internet, adaptándose según la información que encuentra.

La capacidad de sintetizar conocimiento es un requisito previo para crear nuevo conocimiento. Por ello, deep research marca un paso significativo hacia nuestro objetivo más amplio de desarrollar AGI, el cual siempre hemos imaginado como capaz de producir investigaciones científicas novedosas.

## Por qué creamos Deep Research

Deep research está diseñado para personas que realizan trabajos intensivos de conocimiento en áreas como finanzas, ciencia, políticas e ingeniería, y que necesitan investigaciones exhaustivas, precisas y confiables. También puede ser muy útil para compradores exigentes que buscan recomendaciones hiperpersonalizadas para adquisiciones que normalmente requieren una investigación cuidadosa, como automóviles, electrodomésticos y muebles. Cada resultado está completamente documentado, con citas claras y un resumen del razonamiento, lo que facilita la referencia y verificación de la información. Es especialmente efectivo en la búsqueda de información de nicho y no intuitiva, que normalmente requeriría explorar numerosos sitios web. Deep research libera un tiempo valioso al permitirte delegar y agilizar investigaciones web complejas y que consumen mucho tiempo con una sola consulta.

Deep research descubre, razona y consolida de forma independiente conocimientos de toda la web. Para lograrlo, se entrenó en tareas del mundo real que requieren el uso de navegador y herramientas Python, utilizando los mismos métodos de aprendizaje por refuerzo que respaldan a OpenAI o1, nuestro primer modelo de razonamiento. Si bien o1 demuestra capacidades impresionantes en codificación, matemáticas y otros dominios técnicos, muchos desafíos reales demandan un contexto amplio y la recopilación de información de diversas fuentes en línea. Deep research se apoya en estas capacidades de razonamiento para cerrar esa brecha, permitiéndole abordar los tipos de problemas que las personas enfrentan en el trabajo y en la vida cotidiana.

## Cómo usar Deep Research

En ChatGPT, selecciona “deep research” en el compositor de mensajes e ingresa tu consulta. Indica a ChatGPT lo que necesitas—ya sea un análisis competitivo de plataformas de streaming o un informe personalizado sobre la mejor bicicleta para desplazarte al trabajo. Puedes adjuntar archivos o hojas de cálculo para añadir contexto a tu pregunta. Una vez que comience a ejecutarse, aparecerá una barra lateral con un resumen de los pasos realizados y las fuentes utilizadas.

Deep research puede tardar entre 5 y 30 minutos en completar su trabajo, tomándose el tiempo necesario para profundizar en la web. Mientras tanto, puedes ausentarte o dedicarte a otras tareas—recibirás una notificación una vez que la investigación esté finalizada. El resultado final llega como un informe dentro del chat; en las próximas semanas, también agregaremos imágenes incrustadas, visualizaciones de datos y otros resultados analíticos en estos informes para brindar mayor claridad y contexto.

En comparación con deep research, GPT‑4o es ideal para conversaciones multimodales en tiempo real. Para consultas multifacéticas y específicas de un dominio en las que la profundidad y el detalle son críticos, la capacidad de deep research para realizar una exploración exhaustiva y citar cada afirmación marca la diferencia entre un resumen rápido y una respuesta bien documentada y verificada, que puede usarse como un producto de trabajo.

## Cómo funciona

Deep research se entrenó utilizando aprendizaje por refuerzo de extremo a extremo en tareas complejas de navegación y razonamiento en una variedad de dominios. A través de ese entrenamiento, aprendió a planificar y ejecutar una trayectoria de múltiples pasos para encontrar los datos que necesita, retrocediendo y reaccionando ante información en tiempo real cuando es necesario. El modelo también es capaz de navegar por archivos subidos por el usuario, generar y refinar gráficos usando la herramienta Python, incrustar tanto gráficos generados como imágenes de sitios web en sus respuestas, y citar oraciones o pasajes específicos de sus fuentes. Como resultado de este entrenamiento, alcanza nuevos niveles en varias evaluaciones públicas centradas en problemas del mundo real.

## El Último Examen de la Humanidad

En *El Último Examen de la Humanidad* (se abre en una ventana nueva), una evaluación recientemente publicada que pone a prueba la inteligencia artificial en una amplia gama de temas con preguntas a nivel experto, el modelo que impulsa deep research obtuvo una nueva marca alta con un 26.6% de precisión. Esta prueba consiste en más de 3,000 preguntas de opción múltiple y respuestas cortas abarcando más de 100 materias, desde lingüística hasta ingeniería aeroespacial, pasando por clásicos y ecología. En comparación con OpenAI o1, las mayores mejoras se observaron en química, humanidades y ciencias sociales, y matemáticas. El modelo que impulsa deep research mostró un enfoque similar al humano al buscar de manera efectiva información especializada cuando fue necesario.

Model

Accuracy (%)

GPT-4o

3.3

Grok-2

3.8

Claude 3.5 Sonnet

4.3

Gemini Thinking

6.2

OpenAI o1

9.1

DeepSeek-R1\*

9.4

OpenAI o3-mini (medium)\*

10.5

OpenAI o3-mini (high)\*

13.0

OpenAI deep research\*\*

26.6

\* Model is not multi-modal, evaluated on text-only subset.

\*\*with browsing + python tools

## GAIA

En GAIA⁠(se abre en una ventana nueva)¹, un benchmark público que evalúa la IA en preguntas del mundo real, el modelo que impulsa deep research alcanza un nuevo estado del arte (SOTA), encabezando la tabla de clasificación externa⁠(se abre en una ventana nueva). Al abarcar preguntas en tres niveles de dificultad, la realización exitosa de estas tareas requiere habilidades que incluyen razonamiento, fluidez multimodal, navegación en la web y dominio en el uso de herramientas.

**GAIA**

Nivel 1

Nivel 2

Nivel 3

Promedio

SOTA anterior⁠(se abre en una ventana nueva)

67.92

67.44

42.31

Deep Research (pass@1)

74.29

69.06

47.6

Deep Research (cons@64)

78.66

73.21

58.03

## Limitaciones

Deep research desbloquea nuevas capacidades significativas, pero aún es temprano y tiene limitaciones. A veces puede alucinar hechos en sus respuestas o hacer inferencias incorrectas, aunque a una tasa notablemente menor que los modelos actuales de ChatGPT, según evaluaciones internas. Puede tener dificultades para distinguir información autorizada de rumores, y actualmente muestra debilidades en la calibración de la confianza, fallando a menudo en transmitir la incertidumbre de manera precisa. En el lanzamiento, puede haber pequeños errores de formato en los informes y citas, y las tareas pueden demorar más en iniciarse. Esperamos que todos estos problemas mejoren rápidamente con un mayor uso y el paso del tiempo.

## Acceso

Deep research en ChatGPT es actualmente muy intensivo en computación. Cuanto más tiempo tarde en investigar una consulta, más recursos de cómputo de inferencia se requieren. Hoy comenzamos con una versión optimizada para usuarios Pro, con hasta 100 consultas por mes. Los usuarios de Plus y Team tendrán acceso a continuación, seguidos por Enterprise. Todavía estamos trabajando para brindar acceso a los usuarios del Reino Unido, Suiza y el Área Económica Europea.

Todos los usuarios de pago pronto obtendrán límites de tasa significativamente más altos cuando lancemos una versión más rápida y rentable de deep research, impulsada por un modelo más pequeño que aún ofrece resultados de alta calidad.

En las próximas semanas y meses, trabajaremos en la infraestructura técnica, monitoreando de cerca el lanzamiento actual y realizando pruebas aún más rigurosas. Esto se alinea con nuestro principio de despliegue iterativo. Si todas las verificaciones de seguridad continúan cumpliendo nuestros estándares de lanzamiento, anticipamos liberar deep research para los usuarios de Plus en aproximadamente un mes.

## Qué sigue

Deep research está disponible hoy en la web de ChatGPT, y se implementará en las aplicaciones móviles y de escritorio durante el mes. Actualmente, deep research puede acceder a la web abierta y a cualquier archivo subido. En el futuro, podrás conectar con fuentes de datos más especializadas—ampliando su acceso a recursos basados en suscripción o internos—para hacer que sus resultados sean aún más robustos y personalizados.

Mirando hacia el futuro, imaginamos experiencias agenciales que se integren en ChatGPT para investigaciones y ejecuciones asincrónicas en el mundo real. La combinación de deep research, que puede realizar investigaciones en línea de forma asincrónica, y Operator, que puede tomar acciones en el mundo real, permitirá a ChatGPT llevar a cabo tareas cada vez más sofisticadas para ti.
