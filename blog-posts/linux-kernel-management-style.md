---
title: "El manual de gestión del kernel de Linux, leído veinte años después"
slug: "linux-kernel-management-style"
date: "2007-05-28"
dateModified: "2026-08-03"
oldUrl: "/2007/05/28/linux-kernel-management-style/"
description: "Qué enseña hoy el documento de estilo de gestión del kernel de Linux: decisiones reversibles, admitir errores en público y por qué su consejo más citado es el más malinterpretado."
category: "desarrollo-software"
tags: ["linux", "liderazgo", "software libre", "gestión de equipos", "desarrollo de software"]
readingTime: 6
author: "Alfonso Gutiérrez"
commentCount: 2
wordCount: 1140
image: "/wp-content/uploads/2007/05/torvalds.jpg"
---

![Linus Torvalds](/wp-content/uploads/2007/05/torvalds.jpg)

> **Nota de la edición (agosto de 2026).** Esta entrada de 2007 reproducía una traducción del documento del kernel. Se ha sustituido por un comentario propio. El documento original se mantiene en la documentación oficial: [Linux kernel management style](https://www.kernel.org/doc/html/latest/process/management-style.html).

Dentro de la documentación del kernel de Linux, entre ficheros sobre estilo de código y procedimientos de envío de parches, hay un documento titulado **«Linux kernel management style»**. Es un texto breve, deliberadamente sarcástico, atribuido a Linus Torvalds, que describe cómo se dirige técnicamente el proyecto de software libre más grande del mundo.

Empieza avisando de que el estilo de gestión es difícil de cuantificar y que el documento «puede o no tener algo que ver con la realidad». Ese aviso es parte del método: **el texto se protege del uso que más le iban a dar, que es citarlo como autoridad**.

Casi veinte años después de que llegara a este blog, y con el kernel convertido en infraestructura de casi todo, merece la pena leerlo por lo que dice sobre organizar trabajo técnico — no por la anécdota.

## Su idea central: convertir decisiones grandes en pequeñas

El documento arranca demoliendo la imagen del gestor que toma decisiones difíciles. Su tesis es la contraria: **el trabajo consiste en evitar tener que tomarlas**, y la forma de conseguirlo es hacer que cualquier decisión pueda deshacerse.

Dicho de otro modo: lo que hace grande a una decisión no es su importancia, es su irreversibilidad. Si puedes volver atrás, la decisión es pequeña aunque el asunto sea enorme.

Eso, escrito en un documento de proceso a principios de los 2000, es notable. Es el mismo principio que hoy sostiene buena parte de la práctica moderna de ingeniería, con otro vocabulario:

| El documento del kernel | Su equivalente actual |
|---|---|
| Hacer las decisiones reversibles | Despliegues con vuelta atrás, banderas de funcionalidad |
| Evitar las decisiones grandes | Cambios pequeños y frecuentes |
| Quien conoce el detalle decide | Autonomía del equipo que mantiene el código |

Y contiene su propio corolario incómodo: si la gente a la que diriges **no** conoce los detalles mejor que tú, el problema no es la decisión — es la composición del equipo.

## Su parte más valiosa: cómo se admite un error

Hay un pasaje sobre asignar culpa que es, a mi juicio, lo mejor del texto. El argumento tiene dos partes y casi siempre se cita solo la primera.

La primera: **te vas a equivocar**, y el problema no es equivocarse sino intentar disimularlo. La segunda, la que se olvida: la forma de arreglarlo es reconocerlo **rápido y en público**, antes de que otro tenga que señalarlo.

Lo importante no es la humildad, que es un efecto secundario. Es que **admitir el error en voz alta es lo que permite corregirlo barato**. Un error reconocido en el momento cuesta una reversión; el mismo error defendido durante tres semanas cuesta un rediseño y la credibilidad de quien lo defendió.

En un proyecto donde miles de personas envían parches a un árbol común, esa economía es la que sostiene todo lo demás.

## Su parte peor envejecida, y conviene decirlo

El documento también recomienda un estilo de trato áspero, y lo hace en un tono que en su momento resultaba gracioso.

Esa parte no ha envejecido bien, y **quien mejor lo ha dicho es el propio Torvalds**, que en septiembre de 2018 se apartó temporalmente del proyecto reconociendo en público que sus ataques por correo habían sido impropios. En ese mismo momento el kernel sustituyó su antiguo código de conducta por uno mucho más detallado. Es decir: la comunidad que produjo el documento revisó esa parte por su cuenta.

Merece la pena separarlo con claridad, porque el texto se cita con frecuencia como coartada:

- **Lo que aguanta:** decisiones reversibles, admitir errores rápido, autoridad basada en conocer el detalle.
- **Lo que no:** que la agresividad sea un método. Nunca lo fue. Era un rasgo personal que el proyecto toleró mientras el coste no fue visible.

Confundir una cosa con la otra es el error de lectura más común con este documento. La dureza no era lo que hacía funcionar al kernel; funcionaba **a pesar** de ella, sostenido por un proceso de revisión brutalmente bueno.

## Qué me sigue pareciendo cierto

Tres cosas, después de bastantes años dirigiendo equipos de software:

**1. La autoridad técnica no se delega hacia arriba.** Si el equipo te trae una decisión técnica para que la resuelvas tú, algo va mal: o no tienen contexto suficiente, o no tienen permiso para decidir. Ninguna de las dos se arregla decidiendo por ellos.

**2. La reversibilidad es una decisión de diseño.** No es una propiedad que aparezca sola. Se construye: en cómo se despliega, en cómo se guardan los datos, en si hay vuelta atrás probada. Se paga antes de necesitarla.

**3. La credibilidad se gasta defendiendo errores, no cometiéndolos.** Es lo más difícil de aplicar, porque el incentivo inmediato siempre apunta al lado contrario.

Si te interesa este terreno, en el blog hay más sobre [el oficio de crear software](/categoria/desarrollo-software/).

## Preguntas frecuentes

### ¿Qué es el «Linux kernel management style»?

Es un documento breve incluido en la documentación oficial del kernel de Linux, atribuido a Linus Torvalds, que describe con tono satírico cómo se ejerce el liderazgo técnico en el proyecto. Trata sobre decisiones, trato con las personas, asignación de culpa y errores a evitar.

### ¿Cuál es su idea principal?

Que el trabajo de quien dirige no es tomar decisiones difíciles, sino evitar que existan. La forma de conseguirlo es hacer que toda decisión sea reversible: lo que convierte una decisión en grande no es su importancia, sino la imposibilidad de deshacerla.

### ¿Sigue siendo válido su consejo sobre el trato a las personas?

No, y el propio Torvalds lo reconoció públicamente en septiembre de 2018, cuando se apartó temporalmente del proyecto admitiendo que sus ataques por correo habían sido impropios. En ese mismo momento el kernel adoptó un código de conducta mucho más detallado que el anterior. La parte de la dureza como método es la que peor ha envejecido.

### ¿Qué relación tiene con las prácticas actuales de ingeniería?

Es la misma idea con otro vocabulario. «Hacer las decisiones reversibles» es lo que hoy son los despliegues con vuelta atrás y las banderas de funcionalidad; «evitar decisiones grandes» es entregar cambios pequeños y frecuentes; y «decide quien conoce el detalle» es la autonomía del equipo que mantiene el código.

### ¿Por qué dice que hay que admitir los errores en público?

Porque es lo que permite corregirlos barato. Un error reconocido en el momento cuesta una reversión; el mismo error defendido durante semanas cuesta un rediseño y la credibilidad de quien lo defendió. En un proyecto con miles de colaboradores sobre un mismo árbol de código, esa diferencia sostiene todo el proceso.
