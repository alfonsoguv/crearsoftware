---
title: "El formulario de 100.000 Euros"
slug: "el-formulario-de-100-000-euros"
date: "2013-04-27"
oldUrl: "/2013/04/27/el-formulario-de-100-000-euros/"
description: "Un ejemplo de cómo un simple formulario puede influir en ventas, experiencia de usuario y valor percibido del software."
category: "desarrollo-software"
tags: ["diseño","diseño de software","formularios","interfaz","software"]
readingTime: 3
author: "Alfonso Gutiérrez"
commentCount: 14
wordCount: 578
image: ""
---
**Lo que no tiene precio no se valora.**

.

 Como programadores trabajamos en solucionar problemas complejos pero no estamos educados para pensar en los [interfaces](/2011/01/10/personas-datos-e-interface/) que los van a solucionar. El diseño de software no se valora, se piensa que un formulario vale lo mismo que otro, puedes pasar horas con un proceso, una función, un algoritmo pero tiramos los campos en un formulario sin pensar en el usuario que los va a realizar.

.

## **1.-Estoy tirando mi tiempo.**

Llevo más de 40 horas trabajando en diseño del formulario de alta de un contacto de [Velneo vbase](http://velneo.es/velneo-open-app/vbase/) . En algunos momentos te llegas a sentir frustrado pensando que estas perdiendo el tiempo invirtiendo tal cantidad de esfuerzo para conseguir ciertos efectos o funcionalidad en el diseño.

.

## **2.-El modelo de base de datos no es el modelo de interfaz.**

Estamos acostumbrados a solucionar el problema en la base de datos y con ese mismo modelo implementar el interface, es como si nos hiciéramos un traje a medida y el resto de nuestra vida usáramos el mismo, cada contexto y situación es diferente, no nos vestimos igual en una boda, en un bautizo o en funeral, cada contexto tiene su interfaz. Hay que pensar en los diferentes [usuarios y escenarios](http://velneo.es/di-los-escenarios/).

.

## **3.-El formulario de 100.000 euros**

En el diseño parece que no hay forma de valorar el rendimiento económico. Con un sencillo [test de usuarios](http://velneo.es/di-test-con-usuarios/), puedes medir cuanto tarda el usuario en realizar una nueva tarea.

En este caso hicimos unas pruebas de usuarios para dos tareas simples:

Tarea

Completada

Tiempo

Tarea 1.

Intefaz actual

Usuario 1 > SI

Usuario 2 > SI

Usuario 3 > SI

Usuario 4 > SI

Usuario 5 > NO

Usuario 1 > 1.10

Usuario 2 > 3.02

Usuario 3 > 1.24

Usuario 4 > 1.00

Usuario 5 > 2.53

Tarea 2.

Interfaz actual

Usuario 1 > SI

Usuario 2 > NO

Usuario 3 > NO

Usuario 4 > SI

Usuario 5 > NO

Usuario 1 > 2.30

Usuario 2 > 5.10

Usuario 3 > 4.56

Usuario 4 > 2.26 Usuario 5 > 2.57

Tarea 1.

Interfaz prototipo

Usuario 1 > SI

Usuario 2 > SI

Usuario 3 > SI

Usuario 4 > SI

Usuario 5 > SI

Usuario 1 > 0.21

Usuario 2 > 0.31

Usuario 3 > 0.29

Usuario 4 > 0.25

Usuario 5 > 0.16

Tarea 2.

Interfaz prototipo

Usuario 1 > SI

Usuario 2 > SI \*

Usuario 3 > SI

Usuario 4 > NO

Usuario 5 > SI

Usuario 1 > 1.36

Usuario 2 > 1.54

Usuario 3 > 1.45

Usuario 4 > 1.10

Usuario 5 > 1.46

.

Se puede observar como el tiempo mínimo medio que estamos ahorrando en las dos tareas a cada usuario es de un minuto. Calculamos que [Velneo vbase](http://velneo.es/velneo-open-app/vbase/) está generando un mínimo anual de 300.000 contactos nuevos de usuarios al año, si aplicamos [el coste de 21€/hora de coste laboral en España](http://www.europapress.es/economia/laboral-00346/noticia-costes-laborales-hora-espana-situaron-2012-25-debajo-media-eurozona-20130410115025.html), estamos ahorrando **la friolera de 100.000 Euros/año** en costes laborales en el uso [Velneo vbase](http://velneo.es/velneo-open-app/vbase/) para la gestión de contactos.

.

## **4.-KISS (Keep it Simple Stupid)**

La tarea más complicada es solucionar problemas complejos de base de datos con un interfaz simple. [Velneo vbase](http://velneo.es/velneo-open-app/vbase/) soluciona todos los problemas de la base de datos de una manera completa y eficaz, ahora cuando hay que aplicarle un interfaz simple la cosa se complica. Aquí os dejo los mockup del interfaz actual y el nuevo prototipo. **Interfaz Actual:** [<!-- Imagen: interfaz actual1 -->](/wp-content/uploads/2013/04/interfaz-actual1.png)

**Interfaz Prototipo:**

[<!-- Imagen: nuevo1 -->](/wp-content/uploads/2013/04/nuevo1.png)

[<!-- Imagen: interfaz2 -->](/wp-content/uploads/2013/04/interfaz2.png)
