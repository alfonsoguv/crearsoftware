---
title: "Una arquitectura de confianza para la superinteligencia: Satya Nadella, en español"
slug: "arquitectura-de-confianza-superinteligencia-satya-nadella"
date: "2026-10-10"
dateModified: "2026-10-10"
description: "Satya Nadella, consejero delegado de Microsoft, propone tratar los modelos de IA como un riesgo interno: controles fuera del modelo, observabilidad total, auditoría independiente y un freno de emergencia. Traducción al español."
category: "inteligencia-artificial"
tags: ["superinteligencia", "agentes de ia", "seguridad", "gobernanza de la ia", "satya nadella", "microsoft", "inteligencia artificial", "traducción"]
readingTime: 6
author: "Alfonso Gutiérrez"
wordCount: 1150
image: ""
---

> **Autoría y traducción.** El texto original es de **[Satya Nadella](https://x.com/satyanadella)**, presidente y consejero delegado de Microsoft, y se publicó en inglés. Las ideas son todas suyas. **Traducción al español: Alfonso Gutiérrez.** La nota final, sobre Visual MS Inteligencia, es nuestra y no forma parte del original.

Durante las últimas décadas, mientras los sistemas de software tradicionales se desplegaban por toda la economía, teníamos las herramientas y la capacidad para atribuir cada comportamiento a una ruta concreta del código.

Esa misma comprensión mecanicista se nos escapa en los sistemas de superinteligencia actuales, aunque los modelos de frontera que los impulsan ya son más capaces que los sistemas de software tradicionales. No podemos atribuir los comportamientos y las respuestas de un modelo a datos concretos de entrenamiento ni a configuraciones concretas de sus pesos. ¡Y aun así estamos desplegando estos complejos sistemas agénticos y modelos, con acceso a nuestros datos más sensibles y con capacidad para ejecutar en nuestro nombre acciones críticas!

Por eso es hora de dar un paso atrás y evaluar la arquitectura de confianza de esta nueva era. Sencillamente, no podemos externalizar la responsabilidad de lo que la inteligencia hace en nuestro nombre. Las garantías de un proveedor de modelos no nos eximen de esa responsabilidad.

No podemos tratar la superinteligencia como un conjunto de cajas negras anidadas y limitarnos a aceptar o rechazar sus recomendaciones, respuestas y acciones. Tenemos que construir sistemas contenidos cuyo comportamiento podamos observar, cuyos límites podamos poner a prueba y cuyas acciones podamos contener siempre.

Dicho de otro modo: tenemos que separar el suministro de inteligencia de la autoridad sobre ella.

Dejando a un lado el difícil problema del alineamiento, tenemos que empezar con un enfoque de ingeniería para la contención y la gobernanza. Tenemos que rodear los modelos no deterministas de un diseño de sistema sólido y determinista, de controles humanos y de procedimientos operativos fiables, y establecer estándares del sector allí donde los actuales no basten.

Tratar los modelos de frontera, tanto cerrados como de pesos abiertos, como un riesgo interno es una forma de construir un sistema así. No porque sean necesariamente maliciosos, sino porque cualquier actor lo bastante capaz y con acceso a sistemas importantes puede equivocarse o verse comprometido, y la arquitectura de contención y control tiene que contar con ello.

La buena noticia es que hemos aprendido mucho sobre cómo gestionar actores poderosos dentro de la empresa. ¡Esto no es nuevo! Hemos establecido buenas prácticas y las hemos ido afinando durante décadas: establecer la identidad, limitar los privilegios, registrar la actividad, crear límites de contención, etc.

Y ahora empezamos a aplicar esos mismos principios a la superinteligencia dentro de la empresa. Todo empieza por que la transparencia de la cadena de razonamiento (CoT) del modelo sea innegociable. El «neuralés» no puede servir de justificación para que el razonamiento del modelo sea opaco. Pero la transparencia del CoT, por sí sola, no basta ni es fiable, ¡porque todavía no sabemos cómo conseguir que las propias salidas del modelo sean siempre fieles o transparentes!

Se pueden, y se deben, usar modelos para ponerse a prueba y verificarse unos a otros de forma adversarial. Sin embargo, así se puede acabar con un modelo opaco dentro de una capa de orquestación opaca, vigilado por otro modelo opaco. En esencia, cajas negras anidadas.

Por eso los controles que rigen a qué puede acceder un modelo y qué acciones puede ejecutar tienen que estar fuera del modelo. Esto se apoya en un principio de seguridad de la información que se remonta a los años setenta: un programa no debe poder saltarse ni manipular los mecanismos que hacen cumplir sus permisos.

Hoy eso significa separar el modelo del arnés que orquesta su trabajo, y también del espacio de acciones que define lo que puede hacer. Significa además externalizar los controles y las salvaguardas.

Por tanto, deberíamos diseñar estos sistemas en torno a principios de observabilidad:

- **Diversidad de modelos.** Ningún modelo debería convertirse en la única dependencia de un resultado importante ni ser el encargado de verificar su propio trabajo.

- **Observarlo todo.** Toda acción relevante de un modelo debe dejar una evidencia a prueba de manipulaciones y legible por una persona. ¡Si no se puede observar, no se puede confiar en ello! Tenemos que poder reproducir cómo se llegó a un resultado sin depender de que el modelo lo certifique.

- **Verificabilidad.** Tenemos que poner a prueba continuamente el sistema entero, incluidos los fallos, los ataques, los casos límite, los cambios del sistema, etc., y no solo las tareas que salen bien.

- **Controles independientes.** Las organizaciones deben poder decidir de forma independiente a qué puede acceder un modelo y qué acciones puede ejecutar.

- **Auditabilidad independiente.** La validación debe ser independiente de la inteligencia que se valida. Ningún modelo debería controlar a la vez el comportamiento de un sistema y la evidencia necesaria para determinar si ese comportamiento se ajusta a la intención original.

- **Contención.** Tenemos que dar por hecho que un modelo está comprometido y contenerlo desde el principio. Piénsese en ello como un freno de emergencia: una persona autorizada debe poder pausar o apagar un modelo siempre, incluso a mitad de una tarea. Los modelos más avanzados exigirán tecnologías de contención más avanzadas, sobre las que tendremos que acordar estándares.

- **Comunicación de incidentes.** Cuando estos sistemas fallen o se vean comprometidos, hará falta comunicarlo a tiempo a los afectados y contar con mecanismos para compartir qué salió mal, qué controles fallaron y cómo evitar que vuelva a ocurrir, y compartir lo aprendido con todo el sector. Esto debería incluir los detalles de implementación que cambian el comportamiento de los agentes en tiempo de ejecución.

El sistema de superinteligencia más digno de confianza no será el del modelo en el que más confiemos. Será el que nos permita confiar lo menos posible en el modelo.

---

## Nota del traductor: los controles, fuera del agente

Lo que Nadella describe para la superinteligencia es lo que cualquier empresa debería exigir hoy a un agente de IA que trabaje con sus datos: que no se verifique a sí mismo, que todo lo que haga deje rastro legible, que sus permisos los fije la organización y no el modelo, y que una persona pueda pararlo en cualquier momento.

Con ese criterio diseñamos los agentes de **[Visual MS Inteligencia](https://visualms.com/inteligencia)** para departamentos como [administración](https://visualms.com/inteligencia/areas/#admin) o soporte: el agente propone y ejecuta dentro de unos límites, y el equipo ve y controla lo que hace. Si quieres ver cómo encajarían en tu empresa, [ahí lo contamos](https://visualms.com/inteligencia).

---

*Texto original de [Satya Nadella](https://x.com/satyanadella), publicado en inglés. Traducción al español de Alfonso Gutiérrez, publicada con atribución completa; si el autor prefiere que se retire, se retirará.*
