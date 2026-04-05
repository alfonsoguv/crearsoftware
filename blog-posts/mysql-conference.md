---
title: "MYSQL conference."
slug: "mysql-conference"
date: "2007-10-17"
oldUrl: "/2007/10/17/mysql-conference/"
description: "Crónica de la MySQL Conference: ponencias sobre bases de datos, open source y la comunidad de desarrolladores. Experiencias y aprendizajes del evento."
category: "desarrollo-software"
tags: ["open source", "desarrollo de software", "conferencias"]
readingTime: 6
author: "Alfonso Gutiérrez"
commentCount: 6
wordCount: 1068
image: ""
---

Día de madrugón, a las 5 de la mañana en pie, mi avión Shannon-Londres salía a las 6:30. El precio de los low-cost es increíble me hago un impecable vuelo por solo 20€ con [Ryanair](http://www.ryanair.com/site/ES/) que de verdad funciona de una manera impresionante. Mis felicidades, es la compañía más puntual del mundo, más rentable y la que menos índice de perdida de maletas tiene, eso se nota en su funcionamiento. Llego al aeropuerto de Londres y me toca coger un tren, 45 minutos para llegar al centro de Londres, de ahí el metro de Londres para llegar al lugar donde se celebra [la conferencia de MYSQL.](http://www.mysql.com/news-and-events/press-release/release_2007_38.html) Mis compis Jesús y Nico me han enviado unas precisas instrucciones por móvil para llegar al lugar de la conferencia, tengo ganas de verlos hace un mes que no veo físicamente a ningún compañero y ya lo echo de menos. (toy cansado de tanto [skype](http://www.skype.com)). Después de dar vueltas por la calle de la conferencia no encuentro ningún lugar que se asemeje a algo para “dar conferencias”. Al final cansado y mojado (estaba lloviendo), llamo a Jesús, de repente aparece Jesús del callejón en el que no había visto nada, le saludo y vamos rápido para adentro ya que estaba lloviendo bastante. Lo primero, esperaba mucho más, hombre que es la conferencia anual de MYSQL en Londres, al final un lugar bastante cutre desde mi punto de vista, y unas 120 personas dentro. Mi sorpresa es total, no esperaba menos de 500. De momento lo mejor ver a mis amigos Jesús y Nico a los que echaba de menos. La primera conferencia presenta diferentes productos sobre todo de monitorización de servers y las máquinas en las que están alojados, interesante, pero son de pago y no open source. Cobran un mantenimiento anual por servidor que no baja de 500€ anuales por server la más barata. Al final como es normal MYSQL busca sacar dinero a la gran base instalada que tiene en todo el mundo, ¿pero donde están?, supongo que al final MYSQL se está usando sobre todo para servicios no críticos porque sino no entiendo la poca afluencia de público. Hace dos años en la vconference éramos más de 300 en directo y un montón de gente por Internet.... yo creo que hoy día no bajaríamos de 500.... la verdad que me anima pensar que no somos tan pequeños. La gran diferencia con MYSQL es que está en 26 países, y claro que si en 26 países tiene una media de 100 asistentes, ahí radica la diferencia con nuestros números. Nosotros no llevamos ni dos años con nuestra internacionalización y ellos pasan de 10 años. Llevan desde 1995 en el mundo anglosajón, nosotros llevamos 1 mes en Limerick. La segunda y tercera conferencia es sobre optimización de rendimiento de la base de datos, en algunas partes de las conferencia parece una clase de SQL y como optimizar las consultas, joder yo estaba traduciendo a mi lenguaje , cargar lista, recorrer,..... que complicado y antiguo me suena eso de SQL. Lo prometí y escribiré un artículo sobre que el SQL está muerto, no se puede seguir viviendo hoy día de un modelo de hace 30 años. Tras las clases me reafirmo el modelo real de Velneo es la leche, y por la preguntas, la complicación para controlar y optimizar una BBDD es alta y depende del tipo de consultas SQL que hagas. Llevo 2 horas de charlas con trucos para optimizar búsquedas, lo siento, siento ser tan radical y poco objetivo, pero ahora mismo están ha años luz de la practicidad de Velneo. Se que los productos no son muy comparables pero la interacción con BBDD es la interacción y yo siempre pienso que lo que quiero es ver una aplicación instalada y funcionando, pensé que en este apartado MYSQL o el famoso (LAMP) habían mejorado en la practicidad para diseñar, programar y poner en marcha una aplicación, me quedo tranquilo. Siguiente presentación, bueno aquí nos han dado, tengo que reconocer que en toda la parte de clusterización, redirección de tablas a diferentes discos, discos por tabla, o partición de tablas en diferentes ficheros nos superan. La versatilidad con que maneja los ficheros MYSQL es superior a la de Velneo. Ahí tenemos mucho que aprender y desarrollar todavía. Lo que es obvio que para grandes volúmenes de información la BBDD debe permitir hacer todo este tipo de cosas, “oído cocina”. Soluciones de Alta disponibilidad de MYSQL: ***-MYSQL with DRBD*** Distribuye los datos en diferentes servidores, tiene un servidor primario y el resto es esclavo, mediante el software linux heratbeat, si el servidor primario falla, hearbeat avisa y un esclavo se pone de primario. El servidor primario es el que replica a los esclavos. ***-MYSQL cluster*** El sistema de cluster son dos máquinas que comparten los datos, si una falla la otra es la que sirve los datos que están almacenados en un lugar común. ***-MYSQL shared storage.*** Puedes tener varios servidores apuntando a un único lugar de almacenamiento, algo que hoy día se puede hacer desde Velneo. Después de la comida se han presentado dos parthers japersoft es un software de BI open source. Talend que son tienen un sistema de integración de plataformas. Lo peor:

1.  220 euros de entrada
2.  Pocas charlas de MYSQL, y muchas de software de asociados.
3.  Solo 120 asistentes.

Lo mejor:

1.  La soluciones de almacenamiento de datos.
2.  La arquitectura de los ficheros que soportan la BBDD
3.  Concepto Maestro --> Esclavo.
4.  Soluciones de Alta escalabilidad y alta disponibilidad

Datos interesantes de la conferencia:

1.  2011 el 80% del software comercial incluirá open source.
2.  El 80% de las empresas solo usan el 35% de las funcionalidad de las BBDD (dato muy interesante, Forrester).
3.  Las BBDD crecen de media un 50% anual.
4.  11 Millones de instalaciones de MYSQL
5.  50.000 descargas/día de MYSQL.
6.  MYSQL se utiliza sobre todo en soluciones WEB.
7.  MYSQL tiene más versiones de pago y más caras de lo que la gente pueda suponer (MYSQL enterprise, MYSQL DRBD,Innodb, ...)
8.  Para hacer Webs MYSQL es una buena solución pero para hacer una aplicación para la PYME desde mi punto de vista como Velneo no hay nada, esa es la lectura que saco de nuestro intenso día en Londres.
9.  El proyecto [www.linux-ha.com](http://www.linux-ha.com) que es un proyecto open source para monitorizar servicios, servidores, puertos,....

Se acabó, viaje en metro para el aeropuerto y avión a Oporto...vuelvo a la tierra por unos días.
