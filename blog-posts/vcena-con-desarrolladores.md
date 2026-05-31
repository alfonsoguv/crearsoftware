---
title: "vCena con desarrolladores"
slug: "vcena-con-desarrolladores"
date: "2008-08-26"
oldUrl: "/2008/08/26/vcena-con-desarrolladores/"
description: "Resumen de la vcena con desarrolladores: preguntas sobre V7, cosas a mejorar e ideas recogidas de la comunidad Velneo."
category: "desarrollo-software"
tags: ["velneo","cloud computing","viajes"]
author: "Alfonso Gutiérrez"
commentCount: 17
wordCount: 1128
readingTime: 6
image: "/wp-content/uploads/2008/08/img_0078.jpg"
---

![vCena con desarrolladores](/wp-content/uploads/2008/08/img_0078.jpg)

Me levanto con jet lag, aquí en San Francisco son las 6:00 de la mañana. Con más tiempo iré escribiendo sobre mi viaje. Desde la semana pasada tengo pendiente escribir sobre lo ocurrido en la [vcena,](http://forum.velneo.com/es/viewtopic.php?t=19642) pero con el viaje hasta ahora no tuve mucho tiempo.

La [vcena](http://forum.velneo.com/es/viewtopic.php?t=19642) fue una oportunidad fantástica para poner cara a gente que sólo conocía por el foro y de encontrarme con gente que hacía años que no veía. La velada fue fantástica: recibí mucho feedback, aprendí y escuché.

Todo lo que me fueron preguntando y proponiendo se escribió en una libretita, así ahora espero que no se me olvide nada a la hora de compartirlo con el resto de la comunidad.

Voy a ordenar lo sucedido en tres apartados:

1. Preguntas.
2. Cosas a Mejorar.
3. Ideas.

## Preguntas

### 1. Vale, bien, ¿y V7 pa cuándo?

Una pregunta esperada. En el [blog de betatester](http://vconnect.velneo.com/web/p.pro?p=76) se puede encontrar un artículo donde se da información detallada sobre fechas e hitos, que aconsejo a todo el mundo leer. No obstante, y como resumen general, nos podemos quedar con la fecha **Febrero 2009**.

### 2. ¿Vais a hacer algo más con la V6 o pasará al limbo?

Sabemos que las versiones 6x se utilizarán por muchos años. Al día de hoy aún hay mucha gente que sigue utilizando las versiones Zeus, con lo cual imaginemos las 6x. Nuestra idea es dejar un equipo de trabajo de 6x para hacer pequeñas correcciones y soporte. Se seguirán vendiendo vserver y dando soporte mientras la comunidad demande esos servicios.

### 3. ¿Se mejorará el soporte multi-procesador en V7?

Sí.

### 4. ¿Se mejorará la integración con el escritorio activo?

Sí. Ahora mismo los nuevos servicios web de validación de usuarios de la Web V7 se están desarrollando bajo [LDAP](http://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol); estamos en la fase de análisis y para nosotros la integración con LDAP es algo prioritario estratégicamente.

### 5. ¿Habrá integración con Word, Excel? ¿Y OpenOffice?

En la Beta de octubre aparece el ODBC, por lo tanto recomiendo ver las posibilidades que nos ofrecerá de integración con estos paquetes ofimáticos.

### 6. Con vistas a V7, ¿se va a incrementar la formación?

[Velneo Empresa](/2008/06/18/%c2%bfcomo-es-el-crecimiento-de-velneo/) (nombre final de la sociedad) será una empresa nueva dentro del grupo que se encargará, entre otras cosas, de proporcionar formación presencial de V7. El problema será de capacidad: la idea de Velneo Empresa será dar un servicio de calidad. Se hará un curso mensual a partir de Enero de 2009 con capacidad para 12 personas máximo. Esto quiere decir que, como mucho, en el primer año se impartirán clases a 120 alumnos, cuando hoy día sabemos que la demanda será mucho más alta.

Nuestra preocupación es que la gente salga bien formada y, para ello, no queremos meter a 30 alumnos por curso ni nada parecido.

Por tanto, para acceder a estos nuevos servicios empezaremos por N4 y después N3. De esta manera regularemos el exceso de demanda.

### 7. ¿Cuál es la visión de Velneo Empresa?

Ya había escrito anteriormente sobre [¿Cómo es el crecimiento de Velneo?.](/2008/06/18/%c2%bfcomo-es-el-crecimiento-de-velneo/)

No obstante, y como resumen general, en el 2009 Velneo Empresa se centrará en estos 3 servicios:

- Formación presencial. (6.x & V7).
- Organización de encuentro anual de desarrolladores.
- Consultoría.

### 8. ¿Dónde estarán las cajas en V7? ¿Habrá vserver en local?

Una de nuestras ventajas competitivas con otros [proveedores PAAS](/2008/08/14/definicion-de-paas/) es que no sólo los vserver estarán en la nube, sino que además podrán estar en local como los actuales vserver 6x.

Cuando se adquiera un vserver se tendrán varias opciones:

- ¿Local o PaaS?
- ¿Edición o Ejecución?

Se está elaborando toda la información de productos y servicios 2009, que tenemos planeado que vea la luz en Octubre.

## Cosas a Mejorar

### 1. El blog de betatester debería ser como el foro

Ahora mismo estamos en fase de desarrollo del proyecto de la Web de V7; entre otras cosas, la nueva web contará con nuevas zonas de blog, foro y todo ello soportado por LDAP. La primera Beta privada de este proyecto saldrá en Octubre y le daremos acceso a los principales foreros y betatester para que la evaluéis.

El proyecto final saldrá al público en Febrero de 2009.

### 2. Activaciones

Se habló mucho de las activaciones. Lo que propongo es abrir un post específico para poder evaluar entre todos las medidas a tomar de cara a la salida de V7. Deberemos conseguir mejorar entre todos los sistemas de cara a V7.

### 3. Formas de pago

Se solicitó la posibilidad de poder pagar por otras pasarelas. Como en el anterior punto, y visto la insistencia por parte de componentes de la comunidad, analizaremos todas las posibilidades a nuestro alcance de cara al año que viene.

### 4. Los talleres deberían ser más avanzados

Sabemos de la dificultad de que un taller le valga a todos por igual, ante la diversidad de perfiles. De cara a los cursos trataremos de mejorar esto, agrupando en la medida de lo posible los diferentes perfiles. Además, se está barajando que existan cursos básicos y avanzados.

### 5. Quiero un generador de informes de verdad + servidor web propio, no Apache

Velneo no puede hacer el mejor producto en todos los campos, por eso debemos centrarnos en lo que somos diferenciales y acogernos a los estándares para las funcionalidades que no podamos abarcar.

Existen dos estándares mundiales en Web e Informes:

- Informes → [Crystal Reports](http://www.businessobjects.com/product/catalog/crystalreports/)
- Servidor Web → [Apache](http://www.apache.org/)

Creemos que lo mejor será que nos comuniquemos bien con estos estándares y nos centremos en potenciar otros aspectos de la herramienta. No obstante, desarrollaremos un generador de informes sencillo, como el actual, para cubrir las necesidades básicas; cuando se quieran realizar informes complejos, recomendamos que se usen otro tipo de herramientas.

> De todas formas, en octubre saldrá la encuesta a toda la comunidad, en la que se volverá a votar los servicios que queráis que mejoremos. Tras la encuesta y sus resultados, pondremos en marcha los planes de mejora del 2009.

## Ideas

En esta sección voy a poner todas las ideas o propuestas que me dieron los desarrolladores para V7. Esta sección estará en la nueva Web de V7: todo el mundo que tenga una idea la podrá dar de alta y el resto de la comunidad la podrá votar. Aquí van las primeras que daré de alta en la nueva zona de ideas de V7:

- API de tablas que permita recorrer tablas y campos mediante variables.
- Tracer de objetos para localizar modificaciones en orden inverso.
- Edición colaborativa a nivel de objetos.
- Debugger, Tracer.
- Conexión encriptada contra cliente.

Bueno, vcompañeros, si veis que falta algo o os quedáis con alguna duda, comentadlo. Este fue el resumen que me quedó. Gracias por vuestras aportaciones.
