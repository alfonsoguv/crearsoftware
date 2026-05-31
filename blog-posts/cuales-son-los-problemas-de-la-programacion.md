---
title: "¿Cuáles son los problemas de la programación?"
slug: "¿cuales-son-los-problemas-de-la-programacion"
date: "2007-09-17"
oldUrl: "/2007/09/17/%c2%bfcuales-son-los-problemas-de-la-programacion/"
description: "Los 10 problemas abiertos de la programación práctica: desarrollo colaborativo, interfaces web, modelo relacional y productividad del programador."
category: "desarrollo-software"
tags: ["problemas de programación", "desarrollo colaborativo", "modelo relacional", "productividad", "velneo"]
author: "Alfonso Gutiérrez"
commentCount: 14
wordCount: 1014
readingTime: 6
image: "/wp-content/uploads/2007/09/645631533.jpg"
---

![Problemas de la programación](/wp-content/uploads/2007/09/645631533.jpg)

Llevo varios días con este fabuloso [post en mi](http://www.versioncero.com/articulo/563/10-problemas-abiertos-en-informatica-practica) escritorio. Quería escribir sobre él, porque me parece que nos viene como anillo al dedo. Se tratan los que considera Sergio Montero los 10 problemas de la informática práctica, sobre todo referente al desarrollo de software. Voy a copiar literalmente lo que expone nuestro amigo y comentaré debajo mis opiniones.

## Problema 1: Programación colaborativa distribuida

*El Nobel de la informática práctica se lo llevará quien invente una metodología sólida para desarrollar código igual que funcionan las redes P2P, dividiendo el trabajo en tareas de no más de 1 hora que puedan ser ejecutadas redundantemente por varios programadores geográficamente dispersos. Por ahora disponemos de herramienta de recogida de requisitos, diseño UML, control de versiones, testeo, bug trackers, etc. Pero los mejores programas (y casi los únicos que funcionan bien) siguen siendo desarrollados por un grupo muy reducido y cohesionado de programadores. No existe un genuino "divide y vencerás" aplicado a la producción de código. A más programadores implicados, menor productividad por programador y menor predictibilidad del resultado final del proyecto.*

CLARO, absolutamente de acuerdo, hace falta una plataforma con BBDD, que integre todo, que además te permita montar una "red de servidores", de donde se puedan heredar y modificar un conjunto de "cajas" de datos y de "cajas" de objetos. Algo rápido, transparente y que integre todo en una sola plataforma. Un plataforma que te permita conectarte a un "servidor" y heredar de ahí toda la programación. Que también te permita que varios programadores puedan modificar diferentes partes a la vez en remoto desde sus casas, para poder tener un desarrollo realmente en "comunidad".

Me harto de decir que hasta que una de estas herramientas aparezca en el mercado el Software Libre no triunfará de verdad. El modelo de software libre está bien como concepto pero falta sistemas para que realmente se puedan desarrollar con eficacia software en "comunidad". Pues la verdad no caigo en quién puede estar tratando de hacer una historia parecida porque desde mi punto de vista revolucionará la industria. ¿Se os ocurre a vosotros?

## Problema 2: Productividad en el desarrollo de interfaces web

*El uso de HTML y JavaScript supuso un retroceso de 10 años en el estado del arte de las herramientas de desarrollo. Cuando ya teníamos VisualBASIC 4.0 con el cual te picabas una aplicación operativa en 3 días, volvimos a usar diseño con lenguaje marcas que sólo funcionaba bien si lo editabas a pelo con UltraEdit, por no hablar de que el JavaScript ni siquiera tiene un debugger decente. Ahora los frameworks AJAX prometen el oro y el moro. O tienes la opción de casarte con Microsoft .NET. Mi amigo Javier Gallardo incluso dice que a ellos les va bien con Adobe Flex pero con cualquiera de estas cosas te la juegas a quedarte pillado a medio plazo.*

Vuelve a dar en el clavo, el HTML, XML, no se diseñaron como lenguajes rápidos para interactuar con el usuario, sus fines no eran eso. Estos lenguajes se han implantado de una manera bestial en la industria. Al igual que piensa Sergio en su post, creo que en esto la industria de desarrollo de software va para atrás. Pienso que es una locura hacer un software de contabilidad con HTML, XHTML, AJAX, PHP,... debemos usar lenguajes más rápidos para el desarrollador y más funcionales para el usuario.

De nuevo los que consigan realizar una plataforma para realizar aplicaciones en tres días pero que la plataforma pueda correr por Internet con la misma versatilidad y velocidad que los actuales lenguajes Web. Pero que la plataforma no necesite de Terminal Server ni emuladores, que sea igual que desarrollar en local, y que supere en velocidad a la carga de una WEB. De nuevo el que cumpla este requisito romperá el mercado.

## Problema 3: La temporalidad en el modelo relacional

*¿Por qué nadie ha implementado aún un modelo relacional extendido que incluya manejo de la temporalidad? Para poder expresar con naturalidad cosas como que un empleado perteneció a un departamento dado entre tal y cual fecha, por ejemplo. Los históricos y los solapamientos de fechas hay que manejarlos a mano en la base de datos. Lo cual resulta muy engorroso.*

Parece que nuestro amigo Sergio Montoro Ten, me lee el pensamiento, llevo tiempo preparando un artículo basado en algo que leí en [Slashdot](http://slashdot.org/), que habla de la muerte del modelo relacional, llevamos más de 25 años basando todo el desarrollo de software en el Modelo Relacional, nadie inventa un nuevo modelo, con nuevos punteros que solucione los problemas que tiene el desarrollador. Bueno lo único innovador que he visto es lo de un tal [Velneo](http://www.velneo.es), pero aún se puede dar una vuelta más, que realmente revolucionaría si a ese modelo se le suma, herencia, instancias y distribución del código. No obstante escribiré otro post solo sobre estos aspectos.

## Problema 4: La multimoneda

*¿Por qué no existe un tipo de moneda que funcione bien en las bases de datos? Me refiero a uno que te permita sumar 3 euros con 5 dólares y te dé el resultado correcto en función de un tipo de cambio dado externamente.*

Ok. Pero y los campos fórmula en memoria a nivel de tabla, ¿serán una solución? Pues [Velneo](http://www.velneo.es) también los tiene.

## Problema 5: Integridad referencial en los borrados

*¿Cómo borrar algo de una base de datos sin infringir las reglas de integridad referencial? En realidad, la solución es simple, nunca borrar nada, sino en cambio dar bajas lógicas. Pero entonces ¿porqué no tenemos un procedimiento predefinido para las bajas lógicas?*

Sin palabras... ¿los históricos? [El resto del artículo está muy chulo](http://www.versioncero.com/articulo/563/10-problemas-abiertos-en-informatica-practica) y sigue exponiendo problemas que están solucionados en la actual versión de [Velneo.](http://www.velneo.es)

Espero que podamos ir uniendo puntos de ¿cuál es el futuro de la programación? Perdón por la ironía pero no me he podido contener. Gracias Sergio Montero por tu exposición sobre los problemas de la programación actual, espero que en poco tiempo alguien pueda dar solución a todos ellos de una manera ágil, rápida, y pensando en el desarrollador y el usuario. Life is Soft.
