---
title: "Velneo vs Oracle vs SQL"
slug: "velneo-vs-oracle-vs-sql"
date: "2007-10-23"
oldUrl: "/2007/10/23/velneo-vs-oracle-vs-sql/"
description: "Una universidad valida con un benchmark independiente que Velneo, como base de datos, es más rápida que Oracle y SQL Server de Microsoft."
category: "desarrollo-software"
tags: ["velneo","microsoft","irlanda","formación"]
author: "Alfonso Gutiérrez"
commentCount: 7
wordCount: 433
readingTime: 3
image: "/wp-content/uploads/2007/10/photo_grainy_airplane_81450_l.jpg"
---

![Avión](/wp-content/uploads/2007/10/photo_grainy_airplane_81450_l.jpg)

Llevo una semana sin postear. Para mí ha sido una semana intensa: viajes, reuniones, ver a mucha gente en España y todo ello aderezado con un resfriado que me pillé en Londres.

De vuelta en Limerick, no puedo dejar de comentar algo que sabía hace años: **que Velneo, como base de datos, es más rápida que Oracle y SQL Server de Microsoft**. La verdad es que si programas con la herramienta te das cuenta enseguida; no hay mucha duda.

## La búsqueda de una validación externa

Cuando empezamos con el proyecto, lo primero que teníamos que hacer era lograr que alguien externo realizara un benchmark y le pusiera un sello que lo validara. Trabajamos buscando por universidades de todo el mundo y al final conseguimos que la [Universidad de Vigo](http://www.uvigo.es/indice/index.gl.htm) se pusiera con el tema. Ahora estoy trabajando con la Universidad de Limerick para que también realice otro benchmark.

El proyecto duró casi un año y, durante ese tiempo, el contacto con ellos fue mínimo, ya que querían hacer la comparativa por sus medios, sin contar con ninguna ayuda de ninguna de las tres bases de datos (Velneo, Oracle y SQL Server). Tengo que decir que alguna vez estuve un pelín acojonado, porque pensaba que a lo mejor no hacían bien las consultas o no construían bien las bases de datos. Pero cuando nos enviaron los resultados me quedé muy satisfecho: se había hecho justicia.

> [Informe de prestaciones de diversos sistemas gestores de bases de datos (SGBD)](http://aisa.ei.uvigo.es/BENCH/)

## El veredicto: rendimiento y sencillez

En el seno de la [Universidad de Vigo](http://www.uvigo.es/indice/index.gl.htm) quedaron impresionados, pero no solo por el rendimiento, sino porque con menos esfuerzo consiguieron poner en marcha las bases de datos de Velneo. Eso está claro: en sencillez no nos gana nadie.

Hemos esperado a que pasara el verano para preparar bien el lanzamiento de esta noticia, tan importante para nosotros. Ya no somos ni nosotros, ni nuestra querida comunidad, los que decimos que Velneo es rápido: ahora un organismo oficial ha realizado una comparativa con otros sistemas de SGBD. Creo que todos, dentro de esta gran comunidad, debemos estar muy orgullosos.

Además, lo bueno es que el informe ha servido también para depurar áreas dentro de la futura V7 y mejorar aún más esos sorprendentes resultados. Juan siempre tiene frases maravillosas, y la última vez que hablé con él de este tema me dijo:

> **"Ahora, en V7, estamos luchando contra nosotros mismos, contra V6."**

Y es cierto: los chicos de desarrollo no están picados con mejorar Oracle o SQL Server, sino con mejorar el rendimiento de V6. La vida es utópica y está llena de sorpresas.

***V6 va rápido, pero V7 volará... (componentes del equipo de desarrollo tras unas sidras de más). —Opinión no vinculante.***
