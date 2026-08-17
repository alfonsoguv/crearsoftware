---
title: "Identidad digital y web social: qué prometió el login federado y qué quedó"
slug: "identidad-digital-web-social-login-federado"
date: "2026-08-17"
dateModified: "2026-08-17"
description: "En enero de 2008 Yahoo llevó a OpenID sus 248 millones de usuarios, y un mes después el estándar sumó a Google, IBM, Microsoft y VeriSign a su consejo. Aun así hoy entramos en la web con dos botones propietarios. Qué falló y qué se aprende."
category: "innovacion-digital"
tags: ["identidad digital", "OpenID", "web social", "redes sociales", "historia de la web"]
readingTime: 5
author: "Alfonso Gutiérrez"
wordCount: 862
image: ""
---

**Entre 2007 y 2009 este blog fue anotando, casi en directo, el momento en que la identidad federada abierta parecía inevitable: OpenID tenía unos 120 millones de cuentas cuando, en enero de 2008, Yahoo anunció que sumaba las de sus 248 millones de usuarios registrados, y un mes después el consejo incorporó a Google, IBM, Microsoft y VeriSign. Hoy nadie tiene una URL de identidad: tenemos un botón de Google y otro de Apple. Esto es lo que revelan aquellas notas sobre por qué el estándar ganó el argumento técnico y perdió el reparto.**

## Lo que se veía desde dentro en 2008

El 17 de enero de 2008 Yahoo anunció que soportaría OpenID 2.0 para sus **248 millones** de usuarios registrados, con la beta pública abierta el 30 de enero. El estándar rondaba entonces los **120 millones** de cuentas, así que una sola integración corporativa aportaba más base instalada que todo lo acumulado hasta ese momento. La nota que se escribió aquí dos días después ([Yahoo y Open ID](/2008/01/19/yahoo-y-open-id/)) daba la cifra resultante en 250 millones; la fuente de la época la sitúa bastante más arriba.

Tres semanas después, el 7 de febrero, la OpenID Foundation anunció que **Google, IBM, Microsoft, VeriSign y Yahoo se incorporaban a su consejo** ([¿Qué es OpenID?](/2008/02/09/%C2%BFque-es-openid/)). Sobre el papel era el escenario perfecto: un estándar abierto, especificación pública, y las cinco compañías que controlaban las cuentas de la época sentadas en el mismo órgano de gobierno.

El tono de aquellas entradas era de entusiasmo sin reservas. Vale la pena señalarlo, porque el error de análisis está justo ahí.

## Los dos números que ya contaban la historia

Las mismas cifras que se celebraban contenían el problema.

**Primero: la asimetría entre emitir y aceptar.** Yahoo aportó cientos de millones de identidades *emisoras*. Lo que no aportó —ni Google, ni Microsoft— fue aceptar identidades ajenas en sus propios servicios. En un sistema federado eso no es un detalle: si los grandes emiten pero no consumen, no hay federación, hay un directorio de proveedores con un protocolo común encima. El usuario nunca tuvo que elegir un proveedor de identidad; ya tenía uno, y su proveedor no le dejaba usarlo donde de verdad importaba.

**Segundo: la concentración.** Que la mayoría de la base llegara con una sola integración corporativa era la señal de que aquello no estaba creciendo desde abajo. No eran millones de personas adoptando una URL de identidad propia: era un botón que aparecía en una pantalla de login ajena.

## Qué se cumplió y qué no

Se cumplió lo técnico. Hoy el login delegado es la norma y casi nadie crea contraseñas nuevas si puede evitarlo. La idea central de OpenID —autenticarte ante un tercero de confianza y que el sitio se fíe de esa afirmación— ganó de forma total. El mecanismo que hoy se usa por debajo es heredero directo de aquel trabajo.

No se cumplió lo político. La promesa era que el identificador fuese **tuyo**: una URL que controlas, portable, cambiable de proveedor. Lo que quedó es un identificador que pertenece a la plataforma que te autentica, con la portabilidad que ella decida. Si te cierran la cuenta, pierdes el acceso a todo lo que colgaba de ella. Es exactamente la dependencia que OpenID decía resolver.

## El resto del contexto de aquellos años

Las otras notas del periodo encajan en el mismo cuadro sin proponérselo.

En julio de 2007 la Web 2.0 era todavía material de curso reglado: la [UOC ofrecía asignaturas](/2007/07/15/cursos-en-la-uoc/) sobre expresión social en la red y sobre mundos virtuales —Second Life en pie de igualdad con los blogs, lo que da la medida de lo abierta que estaba la cuestión de dónde iba a ocurrir la vida social en línea—. En mayo de 2007 los [datos sobre blogs](/2007/05/17/datos-sobre-los-blogs/) que se comentaban aquí eran proyecciones de gasto publicitario en blogs estadounidenses hasta 2010: el blog se daba por ganador. En noviembre de 2008, la nota sobre [Facebook](/2008/11/23/facebook-or-facetoface/) constata que el uso de redes sociales «no para de subir» también en España. Y en septiembre de 2009 la pregunta ya era [qué sería la Web 3.0](/2009/09/21/%C2%BFque-es-la-web-3-0/), antes de que estuviera claro qué había pasado con la 2.0.

Visto junto: el debate se movió de *protocolos* a *plataformas* en unos dos años. Los blogs, los estándares abiertos y los identificadores propios perdieron atención al mismo tiempo, y no por inferioridad técnica.

## Lo que se aprende

**Un estándar abierto no gana por tener a los grandes en el consejo.** Puede perder precisamente por eso: los mismos actores tienen incentivo para implementar la mitad que les conviene —ser proveedor— y no la que les cuesta —ser consumidor—. Un consejo con cinco gigantes es una señal ambigua, no una victoria.

**Conviene mirar de dónde viene el crecimiento.** Duplicar con creces la base instalada por una sola integración describe la adopción de una empresa, no la de un ecosistema. La misma lectura sirve hoy para cualquier métrica de adopción de un estándar nuevo.

**La capa que se estandariza no siempre es la que da poder.** Se estandarizó el protocolo de autenticación. No se estandarizó ni la propiedad del identificador ni la obligación de aceptar los ajenos, y ahí es donde estaba el reparto real.

Estas notas se escribieron con entusiasmo y sin sospecha. Su valor hoy no es haber acertado, sino conservar con fecha las cifras que ya permitían dudar.
