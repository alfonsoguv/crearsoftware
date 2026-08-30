---
title: "Qué es un algoritmo: definición, ejemplos y en qué se diferencia de un programa"
slug: "que-es-un-algoritmo-definicion"
date: "2026-08-30"
dateModified: "2026-08-30"
description: "Un algoritmo es una secuencia finita de pasos no ambiguos que, partiendo de unas entradas, produce un resultado. Definición, ejemplos cotidianos, las cinco propiedades que debe cumplir y la diferencia entre algoritmo, programa y software."
category: "desarrollo-software"
tags: ["algoritmo", "programación", "conceptos básicos", "definiciones", "desarrollo de software"]
readingTime: 8
author: "Alfonso Gutiérrez"
wordCount: 1500
image: ""
---

**Un algoritmo es una secuencia finita de pasos no ambiguos que, partiendo de unas entradas, produce un resultado y termina. Eso es todo. No hace falta un ordenador: una receta de cocina y las instrucciones para montar un mueble son algoritmos. Lo que convierte a un algoritmo en software es escribirlo en un lenguaje que una máquina pueda ejecutar.**

Este blog lleva desde 2007 definiendo conceptos elementales de informática, y el artículo que más gente sigue leyendo es el que explica [qué son el input y el output](/2007/06/23/ejemplos-de-input-output-y-actividades/). El algoritmo es la pieza que va justo en medio de esos dos: lo que ocurre entre la entrada y la salida.

## Definición

> **Algoritmo**: secuencia finita y ordenada de instrucciones no ambiguas que, aplicadas a un conjunto de datos de entrada, producen una salida y terminan en un número finito de pasos.

La palabra viene del matemático persa **al-Juarismi**, que en el siglo IX escribió los tratados que introdujeron en Europa el cálculo con cifras indoarábigas. La latinización de su nombre —*Algoritmi*— acabó nombrando al procedimiento mecánico de calcular. Es un concepto anterior a la informática en unos mil años.

## Las cinco propiedades que debe cumplir

Un procedimiento no es un algoritmo solo por ser una lista de pasos. Tiene que cumplir cinco condiciones, y cada una de ellas se rompe a diario en el trabajo real:

| Propiedad | Qué exige | Ejemplo de incumplimiento |
| --- | --- | --- |
| **Finitud** | Termina tras un número finito de pasos | Un bucle que nunca cierra: el programa se queda colgado |
| **Precisión** | Cada paso está definido sin ambigüedad | «Añade sal al gusto»: dos personas obtienen resultados distintos |
| **Entrada** | Tiene cero o más datos de partida bien definidos | Un paso que asume un dato que nadie ha dicho de dónde sale |
| **Salida** | Produce al menos un resultado | Un proceso que se ejecuta y no deja rastro de nada |
| **Efectividad** | Cada paso es lo bastante básico como para ejecutarse | «Calcula el precio óptimo»: eso no es un paso, es el problema entero |

La propiedad que más problemas causa en un equipo de desarrollo es la **precisión**. Cuando un cliente describe un proceso de negocio, casi siempre lo describe con pasos ambiguos, porque las personas que lo ejecutan rellenan los huecos con criterio propio. Convertir eso en un algoritmo obliga a preguntar qué pasa en cada caso que nadie había escrito. Esa conversación es la mitad del trabajo de análisis, y es la razón de que un proceso «que ya está claro» tarde semanas en programarse.

## Un ejemplo del que todo el mundo sabe

Buscar una palabra en un diccionario de papel. Nadie empieza por la primera página: se abre por la mitad, se mira si la palabra buscada va antes o después, y se repite sobre la mitad que corresponda. Eso es una **búsqueda binaria**, y escrita como algoritmo queda así:

```
ENTRADA: una lista ordenada y un valor a buscar
1. Marca como zona de búsqueda la lista entera.
2. Si la zona de búsqueda está vacía, responde "no está" y termina.
3. Mira el elemento central de la zona de búsqueda.
4. Si es el valor buscado, responde su posición y termina.
5. Si el valor buscado es menor, la nueva zona es la mitad izquierda.
   Si es mayor, la nueva zona es la mitad derecha.
6. Vuelve al paso 2.
SALIDA: la posición del valor, o "no está"
```

Cumple las cinco propiedades: termina siempre (cada vuelta reduce la zona a la mitad, así que en algún momento queda vacía), ningún paso admite interpretación, tiene entrada, tiene salida y cada instrucción es ejecutable.

Fíjate en una cosa importante: ahí no hay ningún lenguaje de programación. Ese texto es el algoritmo. Escribirlo en Python, en Java o en Velneo es una traducción posterior, y el algoritmo sigue siendo el mismo en las tres.

## Algoritmo, programa y software no son lo mismo

Se usan como sinónimos y no lo son. La diferencia importa cuando hay que decidir dónde está un fallo:

| Concepto | Qué es | En qué existe |
| --- | --- | --- |
| **Algoritmo** | La lógica: qué pasos, en qué orden | En un papel, una pizarra o una cabeza |
| **Programa** | Ese algoritmo escrito en un lenguaje concreto | En un fichero de código fuente |
| **Software** | El conjunto de programas, datos y documentación que se entrega | En un sistema en funcionamiento |

De aquí sale una distinción práctica que ahorra horas de depuración: hay **errores de algoritmo** y **errores de programa**. Si el resultado es incorrecto pero el código hace exactamente lo que dice, el fallo está en la lógica y no se arregla mirando líneas de código: hay que rehacer el razonamiento. Si la lógica es correcta y el resultado no sale, el fallo está en la traducción. Preguntarse cuál de los dos es antes de abrir el editor cambia por completo la estrategia de búsqueda.

Lo mismo pasa con el rendimiento. Si un proceso tarda demasiado porque el algoritmo revisa todos los elementos uno a uno cuando podía descartar la mitad en cada paso, ninguna optimización del código lo va a salvar: el problema es de diseño, no de implementación.

## Qué pasa con la inteligencia artificial

Es la pregunta inevitable, y la respuesta tiene dos capas.

Un modelo de lenguaje **se ejecuta** mediante algoritmos perfectamente convencionales: partir el texto en [tokens](/blog/que-es-un-token-en-ia-definicion/), multiplicar matrices, elegir el siguiente token. Todo eso es determinista y cumple las cinco propiedades.

Lo que no es un algoritmo escrito por nadie es **el comportamiento** que emerge de esos parámetros. En el software clásico, una persona escribe las reglas y la máquina las aplica; en el aprendizaje automático, una persona escribe el procedimiento de entrenamiento y las reglas resultantes salen de los datos. Nadie puede abrir el modelo y leer el paso 4.

Esa es la diferencia práctica que más cuesta digerir a quien viene del software de gestión: un algoritmo clásico se audita leyéndolo, y un modelo entrenado solo se audita probándolo. Por eso un sistema con IA necesita un plan de pruebas que un sistema tradicional no necesitaba, y por eso conviene mantener en lógica convencional todo aquello que deba ser explicable ante un cliente o un regulador.

## Cómo escribir un algoritmo antes de programarlo

Cuatro pasos que funcionan igual en 2007 y hoy:

1. **Escribe la entrada y la salida antes que nada.** Qué datos tienes y qué resultado quieres. Si no sabes definir la salida con precisión, todavía no tienes un problema resuelto: tienes una intención.
2. **Redáctalo en castellano, en pasos numerados.** Sin sintaxis, sin variables. Si un paso no cabe en una frase, es que esconde otro algoritmo dentro y hay que abrirlo.
3. **Ejecútalo a mano con un caso pequeño.** Papel y lápiz. La mayoría de los errores de lógica aparecen aquí, cuando corregirlos cuesta un minuto en lugar de una tarde.
4. **Busca los casos extremos**: la lista vacía, el valor repetido, el dato que falta, el número negativo. Un algoritmo que solo funciona con el caso normal no está terminado, y esos son exactamente los casos que producen las incidencias de producción.

Solo después de eso conviene abrir el editor. Si el proceso completo te interesa, lo desarrollé en [cómo crear un programa en 5 pasos](/2012/04/04/como-crear-programas/).

## Preguntas frecuentes

### ¿Qué es un algoritmo?

Una secuencia finita y ordenada de instrucciones no ambiguas que, a partir de unos datos de entrada, producen una salida y terminan en un número finito de pasos. No requiere un ordenador: una receta de cocina cumple la definición.

### ¿Cuál es la diferencia entre un algoritmo y un programa?

El algoritmo es la lógica —qué pasos y en qué orden— y existe con independencia del lenguaje. El programa es ese mismo algoritmo escrito en un lenguaje de programación concreto. Un algoritmo puede dar lugar a muchos programas distintos.

### ¿Qué propiedades debe cumplir un algoritmo?

Cinco: finitud (termina), precisión (cada paso es no ambiguo), entrada (datos de partida definidos), salida (produce al menos un resultado) y efectividad (cada paso es lo bastante elemental como para poder ejecutarse).

### ¿De dónde viene la palabra algoritmo?

De la latinización del nombre del matemático persa al-Juarismi, autor en el siglo IX de los tratados que introdujeron en Europa el cálculo con cifras indoarábigas. El término es unos mil años anterior a la informática.

### ¿Un algoritmo tiene que estar escrito en código?

No. Puede escribirse en lenguaje natural, en pseudocódigo o dibujarse como diagrama de flujo. Escribirlo en código es un paso posterior y opcional: sirve para que lo ejecute una máquina, no para que sea un algoritmo.

### ¿La inteligencia artificial funciona con algoritmos?

Sí en su ejecución: tokenizar el texto, multiplicar matrices y elegir el siguiente token son algoritmos convencionales. Pero las reglas que producen el comportamiento del modelo no las escribió nadie, salieron del entrenamiento sobre datos. Por eso un modelo se audita probándolo y un algoritmo clásico se audita leyéndolo.

### ¿Qué es un ejemplo de algoritmo de la vida cotidiana?

Buscar una palabra en un diccionario de papel abriéndolo por la mitad y descartando la mitad que no corresponde, hasta dar con ella. Es una búsqueda binaria y cumple las cinco propiedades.
