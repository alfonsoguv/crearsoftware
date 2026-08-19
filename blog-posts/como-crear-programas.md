---
title: "Cómo crear un programa o software en 5 pasos"
slug: "como-crear-programas"
date: "2012-04-04"
dateModified: "2026-05-31"
oldUrl: "/2012/04/04/como-crear-programas/"
description: "Cómo crear un programa o software paso a paso: analiza al usuario, diseña el flujo de datos, monta el proyecto, prueba los cimientos y diseña el interfaz."
category: "desarrollo-software"
tags: ["crear programas", "hacer software", "desarrollo de software", "mvp", "diseño", "velneo", "programación"]
author: "Alfonso Gutiérrez"
commentCount: 20
wordCount: 1130
readingTime: 6
image: "/wp-content/uploads/2012/04/esquemasg.png"
---

**Para crear un programa de software hay que seguir cinco pasos: (1) analizar al usuario final, (2) diseñar el flujo de información y las tablas, (3) montar el proyecto de datos, (4) probar la estructura antes que la interfaz y (5) diseñar el interfaz al final.** El error más común es empezar por la interfaz, cuando debería ser lo último.

Hace 15 años, cuando empecé en esto de crear software, lo primero que hacía era abrir el editor de Velneo y trataba de hacer el interface. Curiosamente, ahora es lo último. A lo largo de los años he aprendido que el orden importa más que la herramienta: estos pasos sirven tanto si programas en Velneo como en cualquier otro lenguaje o entorno.

> Localiza una necesidad real no resuelta o mal resuelta y créala o mejórala, siempre teniendo en el centro de todo el proceso de creación al usuario. (by Daniel Costas)

## 1. Analizar al usuario que utilizará mi software

Cada usuario es un mundo: sus necesidades, habilidades, capacidades y deseos son diferentes. Antes de empezar a diseñar tu software, piensa en el usuario final; el programa tiene que funcionar para él y no para ti. Los desarrolladores pensamos que los usuarios son iguales que nosotros y después nos extraña que nuestro software no acabe de funcionar. **No pienses en ti, piensa en tu usuario.**

## 2. Analizar el flujo de información

Piensa en cómo la información se convierte en tablas, cómo se relaciona, cómo los datos fluirán por tu aplicación y cómo se convertirán en información. Coge una pizarra y diseña las principales tablas, campos y enlaces entre ellas. **Pinta el flujo de información.**

## 3. Abre el [vDevelop de Velneo](https://velneo.es/) y crea tu Proyecto de datos

No tienes que pensar, **solo tienes que transcribir lo que ya tienes diseñado en la pizarra**. En esta parte no tienes que andar con inventos, simplemente crear las tablas-relaciones que has diseñado y pensado previamente. Un aspecto importante es que le pongas iconos, colores y tamaños adecuados a tus esquemas. **El esquema es la estructura básica de tu programa, son los cimientos de una casa**: trátalo con mimo, diseño y delicadeza.

[![esquemas](/wp-content/uploads/2012/04/esquemasg.png)](https://www.velneo.es)

## 4. Prueba tus tablas, índices y relaciones con [el vDataClient](https://www.velneo.es)

Normalmente, como programadores, nos gusta ponernos con el interface: botones, rejillas y formularios. Esta fase se trata de todo lo contrario: no abras los objetos, utiliza el [Velneo vDataClient](http://www.velneo.es) para probar bien todos los cimientos de tu aplicación, sin diseñar un solo formulario. Esta parte es básica: si tu aplicación funciona bien con el vDataClient, ya tienes mucho ganado, tu casa tiene unos buenos cimientos.

[![cómo hacer un programa](/wp-content/uploads/2012/04/como-hacer-un-programa.jpg)](http://www.velneo.es)

El vDataClient me permite probar toda la casa sin necesidad de levantar una sola pared; es un adelanto para el desarrollo de aplicaciones.

## 5. [Diseña el interfaz de la aplicación](/2011/02/10/como-disenar-el-interfaz-de-un-software/)

Ahora ya puedes ponerle la guinda a la aplicación. No olvides que [esta es la parte más importante](/2011/01/10/personas-datos-e-interface/) para las personas que usarán tu software. A los programadores nos gusta empezar por el interfaz, pero eso es como empezar una casa por el tejado. Dedícale tiempo al interfaz, pero solo cuando los pilares de tu aplicación sean estables.

[![programa para hacer programas](/wp-content/uploads/2012/04/programa-para-hacer-programas.png)](https://velneo.es)

## Cómo hacer un programa: analiza el problema y arranca con un MVP

Los cinco pasos anteriores describen *cómo* construir el software. Pero antes de pintar la primera tabla conviene tener claro *qué* programa vas a hacer. Aquí entran en juego el análisis del problema y el producto mínimo viable.

### Ten claro lo que quieres resolver

Piensa y analiza bien el problema que se quiere resolver. Para hacer un programa tienes que pasar un **80% analizando y un 20% desarrollando**.

### Delimita bien la funcionalidad

Dime en 60 segundos la funcionalidad principal de la aplicación: te tienes que centrar en eso. Se compite en funcionalidad, y lo más importante es que tu software, para empezar, sea estable, abstracto, sencillo y agradable.

Deberías tener 3 folios: uno con toda la funcionalidad, otro con lo deseable y el último con lo esencial. **Empieza con lo esencial.**

[![Captura de pantalla 2012-01-05 a las 11.25.39](/wp-content/uploads/2012/01/captura-de-pantalla-2012-01-05-a-las-11-25-39.png)](/wp-content/uploads/2012/01/captura-de-pantalla-2012-01-05-a-las-11-25-39.png)

### Producto mínimo viable

El [MVP (Minimal Viable Product)](http://www.startuplessonslearned.com/2009/08/minimum-viable-product-guide.html) es la versión de un producto nuevo que permite al equipo obtener el máximo feedback posible de los clientes con el mínimo esfuerzo. El MVP es la primera [iteración del producto](https://velneo.es/iteraciones-versiones-revisiones-ideas-incidencias-y-demas/).

[![Producto mínimo viable](/wp-content/uploads/2012/01/producto-minimo-viable.jpg)](/wp-content/uploads/2012/01/producto-minimo-viable.jpg)

### Simple y viable

La iteración inicial del producto tiene que estar simplificada al core de la aplicación; no obstante, tiene que ser un producto [maduro en cuanto a experiencia de usuario](http://vincentjordan.com/2012/01/why-is-your-minimal-viable-product-mvp-really-just-a-pos/) y a bugs. La experiencia de usuario es algo básico en estas iteraciones iniciales. No pongas opciones que no funcionen correctamente: mejor omítelas.

[![MVP software](/wp-content/uploads/2012/01/mpv-software.png)](/wp-content/uploads/2012/01/mpv-software.png)

## El programa para hacer programas: elige una tecnología práctica

No te compliques con cientos de tecnologías: elige una plataforma completa de programación que te solucione la parte tecnológica. Yo, por supuesto, recomiendo [Velneo](https://velneo.es).

[![Alternativa a Visual Basic](/wp-content/uploads/2012/12/alternativa-visualbasic.png)](https://velneo.es)

El otro día, alguien que empieza en el mundo de la programación me comentó: "me gusta [Velneo](http://velneo.es/?utm_source=blog&utm_medium=blog&utm_term=Programa+para+hacer+programas&utm_campaign=alfonsogu.com) porque es un [programa para hacer programas](http://velneo.es/?utm_source=blog&utm_medium=blog&utm_term=Programa+para+hacer+programas&utm_campaign=alfonsogu.com)". Hoy día se usan todo tipo de acrónimos extraños para referirnos al mundo de la programación; en nuestro mundo de desarrolladores nos sentimos cómodos con nuestra jerga.

En Google se realizan 1.000.000 de búsquedas mensuales con la cadena ***["Programa para hacer programas",](http://velneo.es/?utm_source=blog&utm_medium=blog&utm_term=Programa+para+hacer+programas&utm_campaign=alfonsogu.com)*** nunca había pensado en esta definición para [Velneo](http://velneo.es/?utm_source=blog&utm_medium=blog&utm_term=Programa+para+hacer+programas&utm_campaign=alfonsogu.com). A veces las cosas son más sencillas de lo que parecen.

## Preguntas frecuentes

### ¿Qué necesito para crear un programa?

Necesitas tres cosas antes que el código: entender bien al usuario y el problema que vas a resolver, un diseño claro de los datos (qué información manejas y cómo se relaciona) y una herramienta de desarrollo. La interfaz y el lenguaje concretos son lo de menos al principio.

### ¿Cómo hago un programa desde cero?

Empieza analizando el problema: dedica un 80% del tiempo a analizar y un 20% a desarrollar. Delimita la funcionalidad esencial (apóyate en tres folios: toda la funcionalidad, lo deseable y lo esencial, y arranca con lo esencial) y construye un producto mínimo viable (MVP) simple pero maduro en experiencia de usuario. A partir de ahí, sigue los cinco pasos: usuario, datos, proyecto, pruebas e interfaz.

### ¿Qué lenguaje o herramienta es mejor para empezar?

Depende del tipo de aplicación, pero el principio es el mismo en todas: prioriza los datos sobre la interfaz. No te compliques con cientos de tecnologías; elige una plataforma completa de programación que te solucione la parte tecnológica. Entornos como Velneo —un "programa para hacer programas"— permiten crear y probar la estructura de datos antes de diseñar una sola pantalla, lo que acelera mucho el desarrollo de aplicaciones de gestión.

### ¿Por qué no debo empezar por la interfaz?

Porque la interfaz es el "tejado" del programa: si los cimientos (tablas, relaciones, flujo de datos) no son sólidos, tendrás que rehacerla una y otra vez. Diseñar primero los datos y probarlos ahorra tiempo y errores.

### ¿Cuánto se tarda en crear un programa?

No hay una cifra fija: depende de la complejidad de los datos y de las funcionalidades. Lo que sí es constante es que invertir tiempo en el análisis y el diseño de datos al principio reduce drásticamente el tiempo total de desarrollo.
