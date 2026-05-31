---
title: "Cambio del IVA de 2010. El software"
slug: "cambio-del-iva-de-2010-el-software"
date: "2010-03-31"
oldUrl: "/2010/03/31/cambio-del-iva-de-2010-el-software/"
description: "El cambio del IVA del 1 de julio de 2010 obliga a revisar el software de facturación: aspectos técnicos clave para que tu aplicación funcione bien."
category: "desarrollo-software"
tags: ["iva", "software", "facturación", "legislación", "empresas de software"]
author: "Alfonso Gutiérrez"
commentCount: 6
wordCount: 323
readingTime: 2
image: "/wp-content/uploads/2010/03/cambio-de-iva.png"
---

[![Cambio de IVA en 2010: del 7% al 8% y del 16% al 18%, con aplicación el 1-7-2010](/wp-content/uploads/2010/03/cambio-de-iva.png)](/wp-content/uploads/2010/03/cambio-de-iva.png)

Ya queda menos: si no cambia lo que está previsto, la modificación del IVA se hará efectiva el próximo 01/07/2010. ¿Riesgo? ¿Marrón? ¿Oportunidad?

Las empresas de software se tienen que preparar: el teléfono de soporte no parará y la nueva versión de su software debe funcionar bien. El gran beneficiado, el cliente que pague mantenimiento; el gran perjudicado, el cliente que no se encuentre en mantenimiento y se vea obligado a pagar una actualización y servicios.

## ¿Tu software está preparado?

En principio, el cambio de IVA se realiza a partir de una determinada fecha y, de ahí en adelante, se pasa a operar con los nuevos valores. Como el IVA es un impuesto en el que ni se gana ni se pierde, al finalizar el periodo en el que se incluye una determinada factura, la regularización con la Agencia Tributaria me devuelve lo pagado de más o le devuelvo lo cobrado.

## Aspectos técnicos a controlar

- Controlar, en las devoluciones de venta, que se realicen con el nuevo % de IVA.
- Si a un documento con fecha actual le pongo una fecha anterior al cambio de valores, y viceversa, si a un documento anterior al cambio de valores de IVA le pongo una fecha actual, posterior al cambio: ¿cómo guarda los valores tu software?
- Facturación de albaranes atrasados. ¿Qué sucede cuando facturamos un albarán de ayer, que tenía los anteriores valores de IVA, hoy que se aplican los nuevos valores de IVA?
- Los informes: ¿cómo están configurados?
- Sobre los asientos que ya tienen creados los registros de IVA, que están calculados con un porcentaje: si tras cambiarlo en la aplicación vuelves a entrar en ese asiento, se volverá a calcular el cálculo del IVA, indicando que el cálculo no cuadra.

**¿Has pensado en todo esto?** Cientos de pequeños detalles nos darán dolores de cabeza cuando llegue el momento. Debes notificar y poner sobre aviso a tus clientes de mantenimiento y a los que no lo están.
