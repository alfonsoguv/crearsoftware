---
title: "Conceptos Contables"
slug: "conceptos-contables"
date: "2008-02-14"
oldUrl: "/2008/02/14/conceptos-contables/"
description: "Conceptos contables básicos: cuenta de pérdidas y ganancias, impuesto de sociedades, retenciones y provisiones explicados de forma sencilla."
category: "tecnologia-empresarial"
tags: ["contabilidad", "impuesto de sociedades", "pérdidas y ganancias", "provisiones", "finanzas"]
author: "Alfonso Gutiérrez"
commentCount: 0
wordCount: 682
readingTime: 4
image: "/wp-content/uploads/2008/02/byg.jpg"
---

![Esquema de balance y cuenta de pérdidas y ganancias](/wp-content/uploads/2008/02/byg.jpg)

## ¿Qué es la cuenta de PYG?

La cuenta de **Pérdidas y ganancias** (129) se obtiene al traspasar a ella todas las cuentas de Gastos e Ingresos.

Si tiene **saldo deudor** (**pérdida**):

- En el **asiento de cierre** se anotará en el Haber con las cuentas de Activo.
- En el **asiento de apertura** del año siguiente se anotará en el Debe con las cuentas de Activo.

Si tiene **saldo acreedor** (**beneficio**):

- En el **asiento de cierre** irá en el Debe con las cuentas de Pasivo y Neto.
- En el **asiento de apertura** del año siguiente irá en el Haber con las cuentas de Pasivo y Neto.

## ¿Cómo se contabiliza el Impuesto de sociedades?

**1)** Pago de los ingresos a cuenta del Impuesto de Sociedades durante el ejercicio:

```
Hacienda Pública retenciones y pagos a cuenta (cuenta de Activo)
        a       Bancos
```

**2)** Devengo del impuesto: en ese momento se contabiliza el GASTO con abono a la cuenta de "H.P. retenciones y pagos a cuenta".

### 2a) El impuesto devengado es menor que los pagos a cuenta

```
Impuesto sobre beneficios
Hacienda Pública deudora (ACTIVO)
        a    Hacienda Pública retenciones y pagos a cuenta
```

En "Hacienda Pública deudora" se reconoce el dinero que nos debe Hacienda, ya que le hemos pagado de más a lo largo del ejercicio.

### 2b) El impuesto devengado es mayor que los pagos a cuenta

```
Impuesto sobre beneficios
      a       Hacienda Pública retenciones y pagos a cuenta
      a       Hacienda Pública acreedora (PASIVO)
```

En "Hacienda Pública acreedora" se reconoce la deuda que tenemos con Hacienda por la diferencia entre el impuesto que debemos pagar en total y lo que ya hemos pagado.

### 2c) No hemos tenido beneficios

Hacienda debería devolvernos todo lo que hemos pagado anticipadamente por ese concepto (en la práctica, nos lo compensará con beneficios de los cinco años siguientes, pero mejor no entrar en la maraña de la legislación fiscal...):

```
Hacienda Pública deudora
        a    Hacienda Pública retenciones y pagos a cuenta
```

## Ingresos y gastos (mercaderías)

- Las **ventas de mercaderías** son ingresos (de hecho, es el ingreso más importante en una empresa comercial) y nacen por el Haber.
- Las **devoluciones de ventas** y los **rappels sobre ventas** nacen por el Debe y son un menor ingreso (es decir, en la práctica funcionan como "gastos" para las empresas, ya que es dinero que dejan de ingresar).
- Las **compras de mercaderías** son gastos y nacen por el Debe.
- Las **devoluciones de compras** y los **rappels sobre compras** nacen por el Haber y son un menor gasto (es decir, en la práctica funcionan como "ingresos" para las empresas, ya que es dinero que dejan de gastar).

## Retenciones

**1)** Si **es la empresa quien practica las retenciones**, debe contabilizarlas en "**Hacienda Pública acreedor por conceptos fiscales**" e ingresarlas en Hacienda.

```
  ... a    Bancos
      a    H.P. acreedor por conc. fiscales (cuenta de pasivo)
```

**2)** Si **le practican las retenciones a la empresa** al pagarle determinados rendimientos, la empresa debe contabilizarlas en "**Hacienda Pública, retenciones y pagos a cuenta**" para después deducirlo de la cuota a pagar del impuesto correspondiente.

```
Bancos
H.P. retenc. y pagos a c/ (cuenta de activo)  a ...
```

Las cuentas que van en los puntos suspensivos serían gastos o ingresos que dependerían del rendimiento del que se trate (intereses, dividendos...).

## Provisiones

**1)** Las que utilizan las cuentas del tipo **'Provisión...aplicada'**: a final de año se da de baja toda la provisión dotada el año anterior y se dota, si procede, una nueva. Es el caso de la 'Provisión por depreciación de existencias' y de la 'Provisión para insolvencias de tráfico'.

**2)** Las que utilizan las cuentas del tipo **'Exceso de provisión...'**: en ellas no se da de baja cada año toda la provisión, sino que se adapta la cuantía provisionada al valor de mercado del elemento patrimonial correspondiente. Es el caso de la 'Provisión por depreciación de valores negociables', la 'Provisión por depreciación del inmovilizado' y de la 'Provisión para insolvencias de créditos'.

> *Extraído de cursos de la UOC*
