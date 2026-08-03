---
title: "Agentes de voz con IA: qué queda del panorama que se dibujaba en 2025"
slug: "agentes-de-voz-con-ia-analisis-completo-del-panorama-2025"
date: "2025-03-10"
dateModified: "2026-08-03"
oldUrl: "/2025/03/10/agentes-de-voz-con-ia-analisis-completo-del-panorama-2025/"
description: "En 2025 el capital riesgo dibujó el mapa de los agentes de voz con IA. Revisión desde 2026: qué parte de aquella tesis aguanta, cuál era optimismo de inversor y qué decide hoy un proyecto."
category: "inteligencia-artificial"
tags: ["inteligencia artificial", "agentes de voz", "ia conversacional", "startups", "automatización"]
author: "Alfonso Gutiérrez"
commentCount: 0
wordCount: 1253
readingTime: 6
image: "/wp-content/uploads/2025/03/freepik__the-style-is-candid-image-photography-with-natural__78348.jpeg"
---

![Agentes de voz con IA: panorama 2025](/wp-content/uploads/2025/03/freepik__the-style-is-candid-image-photography-with-natural__78348.jpeg)

> **Nota de la edición (agosto de 2026).** Esta entrada se publicó en marzo de 2025 como traducción del informe de a16z. Se ha sustituido por un análisis propio que contrasta aquella tesis con lo que se ve hoy en proyectos reales. El informe original está enlazado abajo.

A principios de 2025, Olivia Moore publicó en a16z [AI Voice Agents: 2025 Update](https://a16z.com/ai-voice-agents-2025-update/), el mapa de mercado que fijó el vocabulario con el que el sector habló de los agentes de voz durante el año siguiente: la *cuña* de entrada, la latencia como umbral, el reparto por verticales.

Un informe de capital riesgo es una fuente útil y sesgada a la vez: **está bien informado y necesita que el mercado parezca grande**. Año y medio después conviene separar una cosa de la otra, porque las dos partes envejecen de forma muy distinta.

## Lo que aguanta: la latencia como umbral, no como métrica

La observación más sólida de aquel informe fue técnica: la latencia conversacional había bajado del punto en que una conversación deja de resultar incómoda.

Esto es más importante de lo que suena porque **la latencia no es una métrica gradual, es un umbral**. Por encima de cierto retardo, la persona interrumpe, se solapa y cuelga; por debajo, la conversación fluye y la diferencia entre 400 y 300 milisegundos ya no la nota nadie. Cruzar ese umbral fue lo que convirtió los agentes de voz de demostración en producto.

Ese sigue siendo el hecho fundacional del sector, y no ha cambiado.

## Lo que aguanta: la estrategia de la cuña

La segunda tesis sólida era de despliegue: ninguna empresa grande pasa de atención humana a atención automática de golpe. Se empieza por un tipo de llamada acotado —confirmar una cita, tomar un dato, filtrar fuera de horario— y se amplía si funciona.

Esto no solo aguanta: es la única forma que hemos visto funcionar. Y tiene una implicación que el informe no subrayaba lo suficiente: **si la cuña es estrecha, la parte de IA del proyecto es pequeña y la parte de integración es enorme**. Se cambia riesgo por trabajo de fontanería.

Lo desarrollamos con detalle en [cómo montar un agente de voz que atienda las llamadas de tu empresa](/blog/montar-agente-de-voz-ia-que-atienda-llamadas/): de las cinco piezas que hacen falta, solo una es el modelo. Y si buscas comparación de proveedores, está en [plataformas de agentes de voz con IA en Europa](/2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/).

## Lo que era optimismo de inversor

Aquí conviene ser claro, porque es la parte que más se repitió sin comprobar.

**El dato de adopción como prueba de mercado.** El informe destacaba que una proporción llamativa de la última promoción de Y Combinator construía con voz. Es un dato real y no significa lo que parece: mide **dónde va el dinero de las aceleradoras**, no dónde hay demanda resuelta. Una concentración así de fundadores en un tema es, históricamente, tan compatible con un mercado naciente como con una burbuja de oferta.

**El caso de las entrevistas automatizadas.** El informe citaba un despliegue en el que la mayoría de los candidatos filtrados por IA pasaban a la siguiente fase, frente a la mitad con filtro humano, y presentaba eso como duplicar el rendimiento. Es una lectura discutible: **si un filtro deja pasar a casi todo el mundo, puede que no esté filtrando**. Sin la tasa de contratación final, ese número no distingue entre un filtro mejor y un filtro más laxo. Es exactamente el tipo de métrica que conviene mirar dos veces antes de repetirla.

**El silencio sobre el coste de la última milla.** Los mapas de mercado dibujan categorías y logotipos; no dibujan los seis meses de integración con el sistema de gestión del cliente. Esa asimetría no es mala fe, es el género: un inversor mira la oportunidad, no la implantación.

## Lo que ha cambiado desde entonces

Tres cosas que en marzo de 2025 no estaban en el mapa y hoy deciden proyectos:

**1. El problema ya no es hablar, es saber.** La calidad de voz dejó de ser diferencial hace tiempo. Lo que separa un piloto de un despliegue es si el agente puede consultar el pedido, la cita o el expediente. Eso es acceso a datos y permisos, no procesamiento del lenguaje.

**2. La conversación es la interfaz, pero la responsabilidad sigue siendo humana.** La pregunta que hunde proyectos no es «¿entiende al cliente?», sino «¿qué pasa cuando se equivoca y quién responde?». Es una decisión de negocio y ningún proveedor la vende.

**3. La voz es un caso particular de un cambio mayor.** El desplazamiento de fondo no es que las máquinas hablen: es que **la consulta de información pasa por un intermediario que sintetiza**. En este blog lo medimos desde el otro lado —el del contenido— y se ve igual de claro: los agentes de IA ya visitan las páginas para responder a alguien en tiempo real. Lo contamos en [qué es el GEO](/blog/geo-optimizar-web-agentes-ia-llms-txt/).

## Cómo leer el próximo mapa de mercado

Los informes de este tipo seguirán saliendo cada año, y siguen mereciendo la lectura. Tres filtros que ayudan:

1. **Separa la observación técnica de la proyección comercial.** La primera suele ser excelente; la segunda es una tesis de inversión.
2. **Desconfía de las métricas de proceso sin resultado final.** «Más candidatos avanzan» no es «mejores contrataciones». «Más llamadas atendidas» no es «más problemas resueltos».
3. **Pregunta qué falta en el mapa.** Lo que no aparece en las cajas —integración, gobierno del dato, escalado a persona— suele ser la mayor parte del presupuesto.

## Preguntas frecuentes

### ¿Qué decía el informe de a16z sobre agentes de voz en 2025?

Sostenía que la voz se había convertido en una categoría propia gracias a la caída de la latencia conversacional, que las empresas entrarían por una «cuña» —un tipo de llamada acotado— y que había oportunidad por verticales, con la sanidad entre las más citadas.

### ¿Qué parte de aquella tesis se ha confirmado?

Las dos observaciones estructurales: la latencia como umbral que separa lo incómodo de lo natural, y la entrada por cuña como única forma realista de desplegar en una empresa grande. Ambas siguen describiendo bien lo que ocurre en proyectos reales.

### ¿Qué hay que mirar con escepticismo en un mapa de mercado de capital riesgo?

Las métricas de proceso sin resultado final y los datos de adopción entre fundadores. Que muchas startups construyan en una categoría mide dónde va el capital, no que haya demanda resuelta; y que un filtro automático deje pasar más candidatos no significa que filtre mejor.

### ¿Qué decide hoy si un proyecto de agente de voz funciona?

El acceso a los datos y la definición de qué ocurre cuando el agente se equivoca. La calidad de la voz y la comprensión del lenguaje dejaron de ser el cuello de botella; lo son la integración con los sistemas de la empresa y la vía de escalado a una persona.

### ¿Sigue siendo válido entrar por una cuña estrecha?

Sí, y conviene asumir su consecuencia: cuanto más estrecha es la cuña, menor es la parte de inteligencia artificial del proyecto y mayor la de integración. Se reduce el riesgo a cambio de más trabajo de conexión con los sistemas existentes.
