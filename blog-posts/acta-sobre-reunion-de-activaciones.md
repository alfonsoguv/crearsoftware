---
title: "Acta sobre reunión de activaciones"
slug: "acta-sobre-reunion-de-activaciones"
date: "2008-03-27"
oldUrl: "/2008/03/27/acta-sobre-reunion-de-activaciones/"
description: "Acta de la reunión sobre el sistema de activación de Velneo vServer: soluciones para la reactivación online de licencias."
category: "desarrollo-software"
tags: ["velneo", "licencias", "activación", "soporte técnico", "software empresarial"]
author: "Alfonso Gutiérrez"
commentCount: 8
wordCount: 474
readingTime: 3
image: "/wp-content/uploads/2008/03/sufer.jpg"
---

![Sufer](/wp-content/uploads/2008/03/sufer.jpg)

> Revisa por favor el acta de dicha reunión, y escribe en la solución cualquier comentario al respecto. Si estás de acuerdo, simplemente soluciona la actividad. Gracias.

**Reunidos:** alfonsogu, jgonzalez, jarboleya y smarquez, tratando de detectar problemas y aportar posibles soluciones para el actual sistema de activación de vServer.

Tras haber recopilado las diferentes posibles soluciones aportadas por parte del equipo Velneo, así como por miembros de la Comunidad, se valoran una a una todas ellas.

## Soluciones evaluadas

En relación con la propuesta de Pablo sobre la posibilidad de disponer de un servidor de backup "gemelo" del servidor real, dicho servicio ya se está dando actualmente, y nuestros suscriptores están optando por esta opción paulatinamente, en aquellos casos en los que supone un problema para ellos.

Puesto que este servicio se está dando ya actualmente y parece no ser la solución a todos los casos, puesto que siguen llegando incidencias de este tipo, tratamos de aportar una nueva solución que aporte total libertad al cliente para realizar la reactivación, así como independencia en cuestión de horarios, y permita de este modo reactivar en fin de semana o festivos sin tener que realizar la solicitud vía Velneo Directo. Necesitamos una solución que sea efectiva para la inmensa mayoría de nuestros clientes.

Se descarta la vuelta al antiguo sistema de llaves hardware, puesto que actualmente sí estamos recibiendo incidencias en Atención al Cliente de problemas con dichas llaves, tales como averías y malos funcionamientos.

## Propuesta aprobada: reactivación online

Jgonzalez propone permitir la reactivación online de los Velneo vServer a través de Velneo Directo. Sería una opción más dentro de la ficha de cada Velneo vServer que permita realizar la reactivación de dicho servidor sin necesidad de contactar con Velneo. Se utilizaría como base para ello el sistema desarrollado por Jose para la reactivación vía web, que actualmente se está utilizando a nivel interno para este mismo fin. Se valora la propuesta como viable.

## Control y avisos automáticos

Cuando cada una de estas reactivaciones se realice, Atención al Cliente recibirá un aviso incluyendo el cliente, el número de licencia, qué número de reactivaciones ha realizado ya y el motivo que el cliente ha descrito.

Además, cuando el cliente haya realizado varias reactivaciones, automáticamente recibirá un aviso de que el número de reactivaciones es elevado y en la próxima reactivación se realizará el cambio de su licencia por otra de autentificación online (con conexión permanente a internet) para evitarle el trastorno que este tipo de incidencias le está causando, informándole además de que para cualquier duda al respecto consulte con Atención al Cliente.

Dado que la propuesta se considera viable técnicamente, y buena solución para la mayoría de problemas de este tipo, optamos por ésta como la óptima por el momento.

Pondremos el acta de la reunión en el blog y veremos las opiniones de la comunidad, y después veremos las posibilidades, viabilidad técnica, plazos y recursos.
