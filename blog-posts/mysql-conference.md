---
title: "MySQL Conference"
slug: "mysql-conference"
date: "2007-10-17"
oldUrl: "/2007/10/17/mysql-conference/"
description: "Crónica de la conferencia anual de MySQL en Londres: alta disponibilidad, clustering, datos del mercado open source y comparativa con Velneo."
category: "desarrollo-software"
tags: ["open source", "desarrollo de software", "conferencias"]
readingTime: 6
author: "Alfonso Gutiérrez"
commentCount: 6
wordCount: 1068
image: "/wp-content/uploads/2007/10/piedra.jpg"
---

![Piedra](/wp-content/uploads/2007/10/piedra.jpg)

Día de madrugón: a las 5 de la mañana en pie, porque mi avión Shannon-Londres salía a las 6:30. El precio de los *low-cost* es increíble; me hago un vuelo impecable por solo 20 € con [Ryanair](http://www.ryanair.com/site/ES/), que de verdad funciona de una manera impresionante. Mis felicidades: es la compañía más puntual del mundo, la más rentable y la que menos índice de pérdida de maletas tiene, y eso se nota en su funcionamiento.

Llego al aeropuerto de Londres y me toca coger un tren: 45 minutos para llegar al centro de Londres y, de ahí, el metro para llegar al lugar donde se celebra [la conferencia de MySQL](http://www.mysql.com/news-and-events/press-release/release_2007_38.html).

Mis compis Jesús y Nico me han enviado unas precisas instrucciones por móvil para llegar al sitio. Tengo ganas de verlos: hace un mes que no veo físicamente a ningún compañero y ya lo echo de menos (estoy cansado de tanto [Skype](http://www.skype.com)).

Después de dar vueltas por la calle de la conferencia, no encuentro ningún lugar que se asemeje a algo para "dar conferencias". Al final, cansado y mojado (estaba lloviendo), llamo a Jesús; de repente aparece desde el callejón en el que no había visto nada. Le saludo y entramos rápido, ya que llovía bastante.

## Primeras impresiones

Lo primero: esperaba mucho más. Hombre, es la conferencia anual de MySQL en Londres y, al final, resulta ser un lugar bastante cutre desde mi punto de vista, con unas 120 personas dentro. Mi sorpresa es total: no esperaba menos de 500.

De momento, lo mejor es ver a mis amigos Jesús y Nico, a los que echaba de menos.

La primera ponencia presenta diferentes productos, sobre todo de monitorización de servidores y de las máquinas en las que están alojados. Interesante, pero son de pago y no open source: cobran un mantenimiento anual por servidor que no baja de 500 € al año por máquina, en la versión más barata.

Al final, como es normal, MySQL busca sacar dinero de la gran base instalada que tiene en todo el mundo. ¿Pero dónde están? Supongo que MySQL se está usando sobre todo para servicios no críticos, porque si no, no entiendo la poca afluencia de público.

Hace dos años, en la vconference éramos más de 300 en directo y un montón de gente por Internet... Yo creo que hoy día no bajaríamos de 500, y la verdad es que me anima pensar que no somos tan pequeños. La gran diferencia con MySQL es que está en 26 países: si en 26 países tiene una media de 100 asistentes, ahí radica la diferencia con nuestros números. Nosotros no llevamos ni dos años con nuestra internacionalización y ellos pasan de 10 años: llevan desde 1995 en el mundo anglosajón, mientras que nosotros llevamos 1 mes en Limerick.

## SQL, optimización y el modelo de Velneo

La segunda y tercera ponencia tratan sobre optimización del rendimiento de la base de datos. En algunas partes parece una clase de SQL y de cómo optimizar las consultas. Joder, yo estaba traduciendo a mi lenguaje —cargar lista, recorrer...—; qué complicado y antiguo me suena eso del SQL. Lo prometí y escribiré un artículo sobre que **el SQL está muerto**: no se puede seguir viviendo hoy día de un modelo de hace 30 años.

Tras las clases me reafirmo: el modelo real de Velneo es la leche. Por las preguntas que se hacían, la complicación para controlar y optimizar una BBDD es alta y depende del tipo de consultas SQL que hagas. Llevo 2 horas de charlas con trucos para optimizar búsquedas y, lo siento, siento ser tan radical y poco objetivo, pero ahora mismo están a años luz de la practicidad de Velneo. Sé que los productos no son muy comparables, pero la interacción con la BBDD es la interacción, y yo siempre pienso que lo que quiero es ver una aplicación instalada y funcionando. Pensé que en este apartado MySQL —o el famoso LAMP— habían mejorado en la practicidad para diseñar, programar y poner en marcha una aplicación; me quedo tranquilo.

## Donde MySQL nos supera

Siguiente presentación. Bueno, aquí nos han dado: tengo que reconocer que en toda la parte de clusterización, redirección de tablas a diferentes discos, discos por tabla o partición de tablas en diferentes ficheros, nos superan. La versatilidad con que maneja los ficheros MySQL es superior a la de Velneo. Ahí tenemos mucho que aprender y desarrollar todavía. Es obvio que, para grandes volúmenes de información, la BBDD debe permitir hacer todo este tipo de cosas. "Oído cocina".

### Soluciones de alta disponibilidad de MySQL

> ***-MySQL with DRBD***

Distribuye los datos en diferentes servidores: tiene un servidor primario y el resto son esclavos. Mediante el software de Linux *heartbeat*, si el servidor primario falla, *heartbeat* avisa y un esclavo se pone de primario. El servidor primario es el que replica a los esclavos.

> ***-MySQL cluster***

El sistema de clúster son dos máquinas que comparten los datos: si una falla, la otra es la que sirve los datos, que están almacenados en un lugar común.

> ***-MySQL shared storage***

Puedes tener varios servidores apuntando a un único lugar de almacenamiento, algo que hoy día se puede hacer desde Velneo.

Después de la comida se han presentado dos *partners*:

- **Jaspersoft**: un software de BI open source.
- **Talend**: tienen un sistema de integración de plataformas.

## Balance del día

**Lo peor:**

1. 220 euros de entrada.
2. Pocas charlas de MySQL y muchas de software de asociados.
3. Solo 120 asistentes.

**Lo mejor:**

1. Las soluciones de almacenamiento de datos.
2. La arquitectura de los ficheros que soportan la BBDD.
3. El concepto Maestro --> Esclavo.
4. Las soluciones de alta escalabilidad y alta disponibilidad.

**Datos interesantes de la conferencia:**

1. En 2011, el 80 % del software comercial incluirá open source.
2. El 80 % de las empresas solo usan el 35 % de la funcionalidad de las BBDD (dato muy interesante, de Forrester).
3. Las BBDD crecen de media un 50 % anual.
4. 11 millones de instalaciones de MySQL.
5. 50.000 descargas/día de MySQL.
6. MySQL se utiliza sobre todo en soluciones web.
7. MySQL tiene más versiones de pago y más caras de lo que la gente pueda suponer (MySQL Enterprise, MySQL DRBD, InnoDB...).
8. Para hacer webs, MySQL es una buena solución; pero para hacer una aplicación para la PYME, desde mi punto de vista, como Velneo no hay nada. Esa es la lectura que saco de nuestro intenso día en Londres.
9. El proyecto [www.linux-ha.com](http://www.linux-ha.com), que es un proyecto open source para monitorizar servicios, servidores, puertos...

Se acabó: viaje en metro hasta el aeropuerto y avión a Oporto... Vuelvo a la tierra por unos días.
