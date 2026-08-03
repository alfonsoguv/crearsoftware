---
title: "El invierno de la IA que no llegó: seis predicciones de enero de 2025, revisadas"
slug: "los-agentes-estan-llegando-por-que-el-invierno-de-la-ia-no-sera-tan-frio"
date: "2025-01-01"
dateModified: "2026-08-03"
oldUrl: "/2025/01/01/los-agentes-estan-llegando-por-que-el-invierno-de-la-ia-no-sera-tan-frio/"
description: "A comienzos de 2025 se daba por hecho un invierno de la IA. Revisamos seis predicciones de aquel momento con lo que sabemos en 2026: cuáles acertaron y cuál falló del todo."
category: "inteligencia-artificial"
tags: ["inteligencia artificial", "agentes", "startups", "productividad", "prospectiva"]
readingTime: 6
author: "Alfonso Gutiérrez"
commentCount: 0
wordCount: 1283
image: ""
---

> **Nota de la edición (agosto de 2026).** Esta entrada se publicó en enero de 2025 como traducción de un artículo de Christoph Janz. Se ha sustituido por un análisis propio que revisa aquellas tesis con año y medio de perspectiva. El original está enlazado abajo.

A finales de 2024 se instaló una idea en el sector: los grandes modelos habían dejado de mejorar al ritmo de antes, el preentrenamiento se topaba con rendimientos decrecientes, y lo siguiente sería un **invierno de la IA** como el de los años ochenta. Contra esa idea escribió Christoph Janz, socio de Point Nine, [The Agents Are Coming. Winter Is Not.](https://medium.com/point-nine-news/the-agents-are-coming-winter-is-not-6232601fa0fd), en enero de 2025.

Aquel texto hacía seis apuestas comprobables. Año y medio después se pueden puntuar, que es bastante más interesante que resumirlas. **Cinco han envejecido bien; una falló, y falló en la dirección contraria a la que él esperaba.**

## 1. «Los rendimientos decrecientes del preentrenamiento no son el fin de la escala»

**Acertó.** La tesis era que si escalar el preentrenamiento daba menos, quedaba otra palanca: gastar más cómputo en el momento de responder, dejando que el modelo razone más tiempo sobre problemas difíciles.

Es exactamente lo que pasó. La medida más limpia es [Humanity's Last Exam](https://agi.safe.ai/), un examen construido para ser demasiado difícil. En febrero de 2025 el mejor resultado público era del **26,6%**; en agosto de 2026 la cabeza de esa tabla ronda el **53%**. Los modelos que la lideran son precisamente los que ajustan cuánto razonan según la dificultad.

## 2. «No habrá otro invierno de la IA»

**Acertó, aunque era la apuesta fácil.** Un invierno de la IA no es que baje el entusiasmo: es que se corta la financiación durante años. Nada de eso ocurrió. Si acaso el problema del sector en 2026 es el contrario — la discusión ya no es si hay dinero, sino si la infraestructura energética aguanta el ritmo al que se está construyendo.

## 3. «Algunas de las startups más destacadas no sobrevivirán»

**Acertó en el fondo, con un matiz sobre el mecanismo.** Su razonamiento era el clásico: valoraciones muy por encima de los ingresos, poca defensa frente a copias, y modelos generalistas que se comen las funcionalidades de las herramientas construidas encima.

El mecanismo dominante ha sido el tercero. La forma habitual de morir no ha sido quedarse sin dinero, sino **quedarse sin problema**: la siguiente versión del modelo base incorpora de serie lo que una empresa entera vendía como producto. Es una muerte más rápida y más silenciosa que la de la financiación.

## 4. «Las startups resolverán el problema de la última milla»

**Acertó, y es la predicción más útil de las seis.** Su argumento: los modelos son buenos en general y malos en tu caso concreto, y ese hueco —integraciones, datos propios, casos límite, responsabilidad cuando falla— es donde queda valor que capturar.

Lo hemos comprobado por nuestra cuenta al desmenuzar qué hace falta para [montar un agente de voz que atienda llamadas](/blog/montar-agente-de-voz-ia-que-atienda-llamadas/): de las cinco piezas necesarias, **solo una es inteligencia artificial**. Las otras cuatro son numeración telefónica, acceso a los datos, integración con los sistemas existentes y una salida hacia una persona cuando la conversación se tuerce. Esa proporción —una parte de modelo por cuatro de integración— es la última milla descrita con números.

## 5. «Los "empleados virtuales" podrían ser una moda pasajera»

**Acertó, y es la predicción más contraintuitiva.** En enero de 2025 el marco dominante era vender agentes como si fueran personal: «contrata a un SDR de IA», con precio por «empleado» y hasta foto de perfil.

Janz sospechaba que la metáfora se caería, y se ha caído. No porque los agentes no funcionen, sino porque la metáfora **traslada al comprador una expectativa que el producto no cumple**: un empleado aprende del contexto, pregunta cuando duda y responde de sus errores. Un agente hace lo que se le ha definido. Cuando el marco promete lo primero y entrega lo segundo, la decepción llega en la primera renovación.

## 6. «Con agentes repensaremos la interacción persona-ordenador»

**Es la que falló, y falló por el lado que no se esperaba.** La apuesta era que los agentes reescribirían la interfaz de usuario: menos pantallas, más conversación, el software adaptándose a la intención.

Lo que ha pasado en 2026 es distinto y más profundo: **el cambio no ha sido en la interfaz de las aplicaciones, sino en la del acceso al conocimiento**. La conversación no ha sustituido a los formularios; ha sustituido al buscador.

Y ahí tenemos datos propios. Desde que este sitio dejó de bloquear a los rastreadores de IA, el contador del servidor registra dos poblaciones muy distintas:

| Familia | Qué hace | Peticiones |
|---|---|---|
| Búsqueda generativa | Construye el índice que consulta el modelo | 374 |
| Buscador clásico | SEO de toda la vida | 53 |
| Entrenamiento | Alimenta el conocimiento base | 23 |
| **Agentes en vivo** | Visita porque alguien pregunta **ahora** | **12** |

Esa última fila no existía hace dos años. Son visitas que no vienen de una persona navegando, sino de un agente que está redactando una respuesta en ese instante. La interacción persona-ordenador sí se ha repensado — pero en la capa de descubrimiento, no en la de aplicación.

## Qué queda de todo esto

El patrón que emerge no es «acertó cinco de seis». Es más específico:

- **Las predicciones sobre capacidad técnica acertaron.** Se apoyaban en tendencias medibles.
- **Las predicciones sobre modelos de negocio acertaron.** Se apoyaban en incentivos, que cambian despacio.
- **La predicción sobre cómo cambiaría el uso falló.** Se apoyaba en imaginar la interfaz del futuro, que es donde todo el mundo se equivoca.

Es la misma asimetría que se ve en casi toda la prospectiva tecnológica: **se acierta el qué y se falla el dónde**. La capacidad llegó; el sitio donde iba a cambiar las cosas no era el que se señalaba.

## Preguntas frecuentes

### ¿Hubo un invierno de la IA en 2025 o 2026?

No. Un invierno de la IA implica una retirada prolongada de financiación e interés, y no ocurrió ninguna de las dos cosas. El cuello de botella del sector se desplazó hacia la infraestructura de cómputo y energía, no hacia la falta de inversión.

### ¿Se estancaron los modelos de lenguaje?

No. El preentrenamiento dio rendimientos decrecientes, pero apareció otra palanca: dedicar más cómputo al razonamiento en el momento de responder. En pruebas difíciles como Humanity's Last Exam el resultado pasó del 26,6% en febrero de 2025 a en torno al 53% en agosto de 2026.

### ¿Qué es el problema de la última milla en IA?

Es la distancia entre un modelo que funciona en general y un sistema que resuelve un caso concreto. Cubrirla exige integraciones, acceso a datos propios, gestión de casos límite y una vía de escalado a una persona. En un agente de voz, cuatro de las cinco piezas necesarias corresponden a esa última milla.

### ¿Por qué fracasó la idea de los «empleados virtuales de IA»?

Porque la metáfora prometía algo que el producto no da. Un empleado aprende del contexto, pregunta cuando duda y responde de sus errores; un agente ejecuta lo que se le ha definido. Vender lo segundo con el lenguaje de lo primero genera una expectativa que se rompe en la primera renovación del contrato.

### ¿Han cambiado los agentes de IA la forma de usar el software?

Menos de lo previsto en las aplicaciones y mucho más en el acceso al conocimiento. La conversación no ha sustituido a los formularios, pero sí está sustituyendo al buscador: los servidores empiezan a recibir visitas de agentes que consultan una página mientras redactan una respuesta para alguien.
