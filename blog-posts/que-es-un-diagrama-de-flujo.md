---
title: "Qué es un diagrama de flujo: símbolos, ejemplos y cómo se hace"
slug: "que-es-un-diagrama-de-flujo"
date: "2026-09-26"
dateModified: "2026-09-26"
description: "Un diagrama de flujo es la representación gráfica de un algoritmo o un proceso mediante símbolos normalizados unidos por flechas que marcan el orden de ejecución. Qué significa cada símbolo, un ejemplo resuelto paso a paso, las reglas que no se pueden saltar y los errores más frecuentes."
category: "desarrollo-software"
tags: ["diagrama de flujo", "algoritmo", "programación", "conceptos básicos", "definiciones", "desarrollo de software"]
readingTime: 9
author: "Alfonso Gutiérrez"
wordCount: 1700
image: ""
---

**Un diagrama de flujo es la representación gráfica de un algoritmo o de un proceso: una secuencia de símbolos normalizados, unidos por flechas, que muestra el orden exacto en que se ejecutan los pasos y qué ocurre en cada bifurcación.** Sirve para lo mismo que sirve escribir un algoritmo con palabras, pero con una ventaja: de un vistazo se ve por dónde pasa el control y dónde puede quedarse atascado.

Este blog lleva desde 2007 definiendo conceptos elementales de informática. El diagrama de flujo es la pieza que está justo entre dos que ya hemos explicado: el [algoritmo](/blog/que-es-un-algoritmo-definicion/) —la secuencia de pasos— y [el input y el output](/2007/06/23/ejemplos-de-input-output-y-actividades/) —lo que entra y lo que sale—. El diagrama es cómo se dibuja lo primero sin perder de vista lo segundo.

## Definición

> **Diagrama de flujo (o *flowchart*)**: representación gráfica de la sucesión de operaciones de un algoritmo o un proceso, en la que cada tipo de paso se dibuja con un símbolo distinto y las flechas indican el orden de ejecución y las decisiones que alteran ese orden.

Dos cosas lo definen, y las dos importan:

1. **Los símbolos tienen significado.** No se elige la forma por estética: un rombo es una decisión y un rectángulo es una acción. Quien lee el diagrama sabe qué esperar antes de leer el texto de dentro.
2. **Las flechas son el orden.** Un diagrama de flujo no es un mapa de conceptos ni un esquema: es una secuencia. Si no se puede recorrer con el dedo desde el principio hasta el final, no es un diagrama de flujo.

## Los símbolos

Los símbolos están normalizados desde 1970 por la norma **ISO 5807** (revisada en 1985), heredera del estándar que la ANSI estableció en los años sesenta. Estos son los que se usan en el 95 % de los casos:

| Símbolo | Nombre | Qué representa |
| --- | --- | --- |
| Óvalo | Inicio / Fin | Dónde empieza y dónde termina. Todo diagrama tiene exactamente un inicio |
| Rectángulo | Proceso | Una acción: calcular, asignar, transformar |
| Rombo | Decisión | Una pregunta con salidas excluyentes, normalmente sí/no |
| Romboide | Entrada / Salida | Datos que entran (input) o que salen (output) |
| Círculo pequeño | Conector | Une dos partes del diagrama, típicamente entre páginas |
| Flecha | Flujo | El orden de ejecución |

Hay más —el cilindro para una base de datos, el rectángulo con doble banda lateral para un subproceso, el documento para un informe impreso—, pero con los seis de arriba se dibuja casi cualquier cosa. Si un diagrama necesita quince símbolos distintos, el problema no es el diagrama: es que el proceso está sin decidir.

## Un ejemplo resuelto

El clásico: determinar si un número es par o impar, imprimir el resultado y terminar.

```
        ┌──────────┐
        │  INICIO  │        (óvalo)
        └────┬─────┘
             │
      ╱──────┴──────╲
     ╱  Leer número  ╲      (romboide: entrada)
     ╲       N       ╱
      ╲──────┬──────╱
             │
        ┌────┴─────┐
        │ R = resto│        (rectángulo: proceso)
        │  de N/2  │
        └────┬─────┘
             │
          ╱──┴──╲
         ╱       ╲
        ╱ ¿R = 0? ╲         (rombo: decisión)
        ╲         ╱
         ╲──┬──┬─╱
       Sí   │  │   No
    ┌───────┘  └───────┐
    │                  │
╱───┴────╲        ╱────┴───╲
│ "Es par"│        │"Es impar"│   (romboides: salida)
╲───┬────╱        ╲────┬───╱
    │                  │
    └────────┬─────────┘
             │
        ┌────┴─────┐
        │   FIN    │
        └──────────┘
```

Fíjese en tres detalles que son los que separan un diagrama correcto de uno que parece correcto:

- **El rombo tiene dos salidas etiquetadas.** «Sí» y «No» están escritos. Un rombo con salidas sin etiquetar obliga a adivinar, y lo que se adivina se adivina mal.
- **Las dos ramas vuelven a juntarse** antes del fin. No hay dos símbolos de FIN: hay uno.
- **La entrada y la salida usan romboide, no rectángulo.** Leer un dato no es lo mismo que transformarlo, y el símbolo lo dice.

## Las reglas que no se pueden saltar

Son pocas y llevan cincuenta años sin cambiar:

1. **Un único inicio.** Varios puntos de entrada significan que hay varios algoritmos mezclados; sepárelos.
2. **Todo camino termina.** Cualquier recorrido posible debe llegar a un fin. Un camino que no termina es, en el programa, un bucle infinito.
3. **El flujo va de arriba abajo y de izquierda a derecha.** Se puede romper, pero cada vez que se rompe hay que dibujar la flecha muy explícita, porque el lector asume la dirección por defecto.
4. **De un rombo salen exactamente las ramas que se contemplan, y son excluyentes.** Si dos condiciones pueden cumplirse a la vez, el rombo está mal planteado.
5. **Un símbolo, una acción.** «Calcular el total y enviar el correo» son dos rectángulos, no uno. Cuando se juntan, el diagrama esconde justo el punto donde suele fallar el proceso.
6. **Las flechas no se cruzan si se puede evitar.** Un cruce es casi siempre la señal de que el orden de los pasos se puede reordenar mejor.

## Los cuatro errores más frecuentes

Los he visto en documentación de empresa tantas veces que merece la pena enumerarlos:

- **El rombo que no es una pregunta.** Un rombo con el texto «validación» no es una decisión: es una acción. La decisión es «¿los datos son válidos?».
- **La rama que se pierde.** Un rombo con salida «No» que no va a ninguna parte. En el papel parece un descuido; en el programa es el caso que nadie controló.
- **El diagrama que documenta lo que se quería hacer**, no lo que el proceso hace de verdad. Ocurre siempre que se dibuja en una sala de reuniones sin hablar con quien ejecuta el proceso a diario.
- **El diagrama de dos metros.** Si no cabe en una pantalla, nadie lo lee. La solución es un subproceso: un símbolo que representa un bloque entero y se dibuja aparte.

## ¿Para qué sirve hoy?

Hay dos usos que siguen vivos, y son distintos.

**Como herramienta de análisis, antes de programar.** Aquí su valor no es documentar, es obligar a decidir. Al dibujar un rombo hay que responder qué pasa por la rama del «No», y esa pregunta es la que destapa los casos que nadie había pensado. Cuando un cliente describe un proceso de negocio, casi siempre lo describe con pasos ambiguos, porque las personas que lo ejecutan rellenan los huecos con criterio propio; convertirlo en un diagrama obliga a preguntar qué ocurre en cada caso que nadie había escrito. Esa conversación es la mitad del trabajo de análisis.

**Como documentación de un proceso, para gente que no programa.** Un diagrama de flujo es el único formato técnico que un departamento de administración, de logística o de calidad lee sin traducción. Por eso sigue siendo obligatorio en los sistemas de gestión de la calidad y en las auditorías: no porque sea elegante, sino porque cualquiera puede señalar con el dedo el punto en el que las cosas se tuercen.

Lo que ha desaparecido es el tercer uso, el que se enseñaba en los años ochenta: dibujar el programa entero antes de escribirlo, línea por línea. Para eso el código actual ya es lo bastante legible, y el pseudocódigo va más rápido.

## Diagrama de flujo, algoritmo y pseudocódigo

Son tres formas de expresar lo mismo, y se confunden a menudo:

| | Qué es | Cuándo conviene |
| --- | --- | --- |
| **Algoritmo** | La secuencia de pasos en sí, independientemente de cómo se escriba | Es el concepto; las otras dos son maneras de representarlo |
| **Diagrama de flujo** | Su representación gráfica con símbolos normalizados | Cuando hay bifurcaciones y hay que enseñárselo a alguien que no programa |
| **Pseudocódigo** | Su representación escrita, en lenguaje natural estructurado | Cuando el algoritmo es largo o va a convertirse en código enseguida |

La regla práctica: si el proceso cabe en una lista numerada sin condiciones, escríbalo como lista. Si tiene tres o más decisiones encadenadas, dibújelo.

## Preguntas frecuentes

### ¿Qué diferencia hay entre un diagrama de flujo y un algoritmo?

El algoritmo es la secuencia de pasos; el diagrama de flujo es una de las formas de representarla, en este caso gráficamente y con símbolos normalizados. El mismo algoritmo se puede expresar como diagrama de flujo, como pseudocódigo o como código en un lenguaje de programación.

### ¿Qué significa cada símbolo de un diagrama de flujo?

El óvalo marca el inicio y el fin, el rectángulo es una acción o proceso, el rombo es una decisión con salidas excluyentes, el romboide es una entrada o una salida de datos, el círculo pequeño es un conector entre partes del diagrama y la flecha indica el orden de ejecución. Están normalizados en la ISO 5807.

### ¿Cuántos símbolos de inicio y fin puede tener un diagrama de flujo?

Un solo inicio, siempre. Fines puede haber varios si el algoritmo termina por caminos distintos, aunque se considera mejor práctica unificar las ramas y dejar uno único: así se ve de un vistazo que todos los caminos terminan.

### ¿Se siguen usando los diagramas de flujo?

Sí, en dos casos: para analizar un proceso antes de programarlo —porque dibujar un rombo obliga a decidir qué pasa en cada rama— y para documentar procesos ante personas que no programan, que es la razón de que sigan siendo habituales en sistemas de calidad y auditorías. Lo que ya no se hace es dibujar el programa entero antes de escribirlo.
