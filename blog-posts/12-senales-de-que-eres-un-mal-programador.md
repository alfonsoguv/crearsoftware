---
title: "12 señales de que eres un mal programador"
slug: "12-senales-de-que-eres-un-mal-programador"
date: "2007-11-28"
oldUrl: "/2007/11/29/12-senales-de-que-eres-un-mal-programador/"
description: "Las 12 señales que indican malas prácticas de programación: desde el fanatismo por un lenguaje hasta ignorar la gestión de errores."
category: "desarrollo-software"
tags: ["programación", "buenas prácticas", "desarrollo de software", "código", "errores"]
author: "Alfonso Gutiérrez"
commentCount: 7
wordCount: 920
readingTime: 5
image: ""
---

Traducido del mensaje original [en Digg](http://digg.com/programming/12_Signs_You_re_a_Crappy_Programmer_and_don_t_know_it "12 señales de que eres un mal programador").

## Fanatismo por un lenguaje y complejidad innecesaria

**1. Java es todo lo que necesitas.** No ves la necesidad de usar ningún otro lenguaje, ¿por qué no se puede hacer todo con Java? No te importa ver código en [***Velneo***](http://velneo.es), Python, o Ruby que logra en 10 líneas lo que llevaría varias hojas de código Java. Además, seguramente las nuevas características de la próxima versión del lenguaje lo arreglarán de todas formas. (Esto es aplicable a casi cualquier lenguaje, pero ocurre que entre la comunidad Java parece estar más extendida esta forma de pensar)

**2. El término "enterprisey"** (NT: se trata de un término sarcástico utilizado para designar productos complejos más allá de lo necesario) no te suena a broma. "Enterprise" no es sólo una palabra, es una filosofía, una forma de vida, un camino a la iluminación. Cualquier cosa que pueda ser escrita, desplegada o actualizada con un trabajo mínimo es descartada como un juguete que no "escalará" para futuros usos. Mientras tanto la mayor parte del trabajo real en tu oficina se hace enviando hojas de cálculo en Excel mientras esperan a que termines de construir tu nueva visión corporativa.

## Reglas rígidas y abuso de patrones

**3. Te opones férreamente a las funciones/métodos de más de 20 líneas de código.** (o 30 o 10 o cualquier otro número) Lo siento, algunas veces una función larga es justamente lo que necesitas. Normalmente las funciones cortas son más sencillas de entender, pero algunas veces se pueden expresar más fácilmente en una sola función más larga. El código no debería hacerse más complejo sólo para adecuarse a criterios arbitrarios.

**4. "OH DIOS MIO! PATRONES!"** Los desarrolladores que buscan constantemente la forma de aplicar patrones a cualquier problema de código con el que se encuentran están añadiendo una complejidad innecesaria. Lejos de ser algo que busques, deberías sentirte mal cada vez que tienes que utilizar un patrón de diseño, significa que estás escribiendo código que hace las cosas más complicadas y que puede ser de dudosa utilidad. Pero, ey, tu código tiene patrones, bien por ti.

## Optimización prematura y dogmas

**5. Los ciclos de CPU son un recurso precioso y tu estilo de programación y lenguaje reflejan esas creencias.** Hay montones de problemas en los que tienes que tener muy en cuenta el consumo de CPU (modelado/simulación, procesado de señales, kernels de sistemas operativos, etc), pero no es tu caso. Para la mayor parte de los desarrolladores de software sus principales problemas de rendimiento están relacionados con las bases de datos y la entrada/salida. El único efecto de optimizar tu código para mejorar el uso de CPU será disminuir en 2 milisegundos el tiempo necesario para la próxima consulta a la base de datos. Mientras tanto el desarrollo de la aplicación se hace más lento, no puedes hacer frente a los nuevos requerimientos y te encuentras con problemas serios de calidad. Pero al menos estás ahorrándote montones de ciclos de CPU... eventualmente.

**6. Piensas que ninguna función/método debería tener más de un return.** Esta la he oído alguna que otra vez, y normalmente la razón que me dan es que el código es más sencillo de analizar. ¿Según quién? Yo encuentro más fácil de leer un código más simple, y normalmente el tener más de un return simplifica el código.

## Actitud hacia los usuarios y la productividad

**7. Tus usuarios son estúpidos. Realmente estúpidos.** Simplemente no puedes creer lo estúpidos que son, olvidándose constantemente de hacer las cosas más sencillas del mundo y cometiendo errores tontos al usar tu aplicación. Nunca has considerado que quizás es tu aplicación la que es estúpida porque eres incapaz de escribir software decente.

**8. Te enorgulleces enormemente del gran volumen de código que escribes.** Ser productivo es bueno, desafortunadamente escribir montones de líneas de código no es lo mismo que ser productivo. Los usuarios nunca comentan "Guau, este programa puede ser difícil de usar y estar lleno de errores, pero al menos sé que hay un montón de código por debajo." En lugar de ser productivo, generar toneladas de mal código retrasa a los demás desarrolladores y en el futuro su mantenimiento constituirá una pesada carga.

## Malas prácticas técnicas

**9. Copiar y pegar es genial, te ayuda a escribir código desacoplado.** Defiendes tu uso del copy paste con extraños argumentos sobre desacoplar código y eliminar dependencias, mientras ignoras el aumento del tiempo de mantenimiento y los problemas de duplicación de errores. A esto se le llama "racionalizar tus acciones".

**10. Piensas que la gestión de errores consiste en capturar todas las excepciones, registrarlas, y continuar como si nada.** Eso no es gestionar errores, eso es ignorar errores y es el equivalente semántico al "on error next" de VB. Sólo porque hayas registrado el error en algún sitio no significa que lo estés tratando. Tratar errores es algo duro. Si no sabes qué hacer exactamente cuando te encuentras con un cierto error, simplemente deja que la excepción se propague y que un nivel más alto del código lo trate.

**11. Modelas todo tu código en UML antes de escribirlo.** El modelado entusiasta de UML se lleva a cabo normalmente por aquellos que no escriben demasiado código, sino que se consideran arquitectos de software. Las herramientas de modelado atraen más a aquellos que piensan que el código se puede escribir en una sala de conferencias manipulando pequeños gráficos. Los gráficos no son el diseño, y nunca serán el diseño, para eso está el código.

**12. Tu código borra datos importantes.** Escribiste un cierto código que se supone que debe sobrescribir los archivos de la aplicación con otros nuevos, pero se vuelve loco y borra todos los datos del usuario.
