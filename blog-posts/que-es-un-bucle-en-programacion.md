---
title: "Qué es un bucle en programación: tipos (mientras, para, repetir) y ejemplos"
slug: "que-es-un-bucle-en-programacion"
date: "2026-10-11"
dateModified: "2026-10-11"
description: "Un bucle es una estructura de control que repite un bloque de instrucciones mientras se cumple una condición o un número fijo de veces. Definición, sus cuatro partes, los tres tipos (mientras, para y repetir), ejemplos en pseudocódigo y en código, bucles anidados y los errores más frecuentes."
category: "desarrollo-software"
tags: ["bucle", "programación", "pseudocódigo", "algoritmo", "estructuras de control", "conceptos básicos", "definiciones", "desarrollo de software"]
readingTime: 11
author: "Alfonso Gutiérrez"
wordCount: 2250
image: ""
---

**Un bucle es una estructura de control que repite un bloque de instrucciones mientras se cumple una condición o un número determinado de veces. Es lo que permite que un programa de diez líneas procese diez datos o diez millones sin cambiar de tamaño: en lugar de escribir el mismo paso muchas veces, se escribe una vez y se indica cuándo repetirlo y cuándo parar.**

Es la quinta pieza de una serie. El [algoritmo](/blog/que-es-un-algoritmo-definicion/) es la secuencia de pasos; el [diagrama de flujo](/blog/que-es-un-diagrama-de-flujo/) es cómo se dibuja; el [pseudocódigo](/blog/que-es-el-pseudocodigo/) es cómo se escribe, y la [variable](/blog/que-es-una-variable-en-programacion/) es donde el algoritmo guarda lo que va recordando. El bucle es la pieza que faltaba: la que hace que esos pasos se repitan. Y vuelve a lo de siempre, [el input y el output](/2007/06/23/ejemplos-de-input-output-y-actividades/): casi todo lo que entra en un programa llega en cantidad —una lista de notas, las líneas de una factura, los clientes de una base de datos— y un bucle es la forma de tratar cada elemento sin saber de antemano cuántos habrá.

## Definición

> **Bucle** (también *ciclo*, *lazo* o, en inglés, *loop*): estructura de control que ejecuta repetidamente un bloque de instrucciones, llamado *cuerpo*, mientras se cumple una condición o hasta completar un número de repeticiones.

Cada pasada por el cuerpo se llama **iteración**. Un bucle que da diez vueltas hace diez iteraciones; por eso a repetir también se le llama *iterar*.

En la teoría de la programación estructurada, el bucle es una de las **tres estructuras de control** con las que se puede escribir cualquier algoritmo, como demostraron Corrado Böhm y Giuseppe Jacopini en 1966:

| Estructura | Qué hace | Ejemplo |
| --- | --- | --- |
| **Secuencia** | Un paso detrás de otro | Leer un dato, calcular, escribir el resultado |
| **Selección** ([condicional](/blog/que-es-una-estructura-condicional/)) | Elige un camino según una condición | SI la nota ≥ 5 ENTONCES «aprobado» SINO «suspenso» |
| **Repetición** (bucle) | Vuelve a ejecutar un bloque | MIENTRAS queden alumnos, leer su nota |

La diferencia con la selección es la clave para no confundirlos: **un SI se ejecuta como mucho una vez; un bucle puede ejecutarse cero, una o muchas veces.** Los dos llevan una condición, pero el SI la evalúa para decidir por dónde seguir y el bucle la evalúa para decidir si vuelve atrás.

## Las cuatro partes de un bucle

Todo bucle bien escrito tiene cuatro piezas, aunque algunos lenguajes las junten en una sola línea:

| Parte | Qué hace | En el ejemplo de contar de 1 a 10 |
| --- | --- | --- |
| **Inicialización** | Da el valor de partida a la variable que controla el bucle | `i ← 1` |
| **Condición** | Se comprueba en cada vuelta: si se cumple, se repite; si no, se sale | `i ≤ 10` |
| **Cuerpo** | Las instrucciones que se repiten | `ESCRIBIR i` |
| **Actualización** | Cambia la variable de control para acercarse al final | `i ← i + 1` |

Si falta la inicialización, el bucle arranca con un valor imprevisible. Si falta la actualización, la condición nunca deja de cumplirse y el bucle no termina. Casi todos los errores con bucles son una de estas cuatro piezas mal puesta.

## Los tres tipos de bucle

### Bucle MIENTRAS (while)

Comprueba la condición **antes** de cada vuelta. Si no se cumple la primera vez, el cuerpo no se ejecuta nunca. Es el bucle general: sirve cuando no se sabe cuántas vueltas habrá.

```
INICIO
    i ← 1
    MIENTRAS i ≤ 10 HACER
        ESCRIBIR i
        i ← i + 1
    FINMIENTRAS
FIN
```

### Bucle PARA (for)

Repite un **número conocido de veces**. Lleva la inicialización, la condición y la actualización en la cabecera, así que es más difícil olvidarse de alguna. Es el que se usa para recorrer una lista o contar.

```
INICIO
    PARA i ← 1 HASTA 10 HACER
        ESCRIBIR i
    FINPARA
FIN
```

Hace exactamente lo mismo que el MIENTRAS anterior en tres líneas menos. **Todo bucle PARA se puede reescribir como un MIENTRAS**; lo contrario no siempre resulta natural, porque el MIENTRAS sirve también cuando el final depende de algo que no se conoce al empezar.

### Bucle REPETIR (do-while / repeat-until)

Comprueba la condición **después** de cada vuelta, así que el cuerpo se ejecuta **al menos una vez**. Es el adecuado para pedir un dato hasta que sea válido: hay que pedirlo una vez antes de poder comprobarlo.

```
INICIO
    REPETIR
        ESCRIBIR "Introduzca una nota entre 0 y 10"
        LEER nota
    HASTA QUE nota ≥ 0 Y nota ≤ 10
    ESCRIBIR "Nota registrada: ", nota
FIN
```

Aquí hay una trampa que confunde a casi todo el mundo al pasar del pseudocódigo al código. **REPETIR … HASTA QUE se repite mientras la condición es falsa y para cuando se cumple.** El `do … while` de C, Java o JavaScript hace lo contrario: se repite mientras la condición es verdadera. Al traducir de uno a otro hay que negar la condición: `HASTA QUE nota ≥ 0 Y nota ≤ 10` se convierte en `while (nota < 0 || nota > 10)`.

### Cuál usar

| Tipo | Comprueba la condición | Mínimo de vueltas | Úselo cuando… |
| --- | --- | --- | --- |
| **MIENTRAS** (while) | Antes de cada vuelta | 0 | No sabe cuántas vueltas habrá y puede no haber ninguna |
| **PARA** (for) | Antes de cada vuelta | 0 | Sabe cuántas vueltas habrá o recorre una lista |
| **REPETIR** (do-while) | Después de cada vuelta | 1 | El cuerpo tiene que ejecutarse una vez antes de poder decidir |

## El mismo bucle en tres lenguajes

Contar de 1 a 10, que es el ejemplo de todos los apuntes:

| Pseudocódigo | Python | JavaScript |
| --- | --- | --- |
| `PARA i ← 1 HASTA 10` | `for i in range(1, 11):` | `for (let i = 1; i <= 10; i++)` |
| `MIENTRAS i ≤ 10` | `while i <= 10:` | `while (i <= 10)` |
| `REPETIR … HASTA QUE i > 10` | (no existe; se usa `while True:` con `break`) | `do { … } while (i <= 10);` |

Dos detalles de esa tabla que aparecen en todos los exámenes. El `range(1, 11)` de Python **no incluye el 11**: el límite superior queda fuera, así que para llegar a 10 hay que escribir 11. Y Python **no tiene bucle do-while**: cuando hace falta que el cuerpo se ejecute al menos una vez, se escribe un `while True:` y se sale con `break` al cumplirse la condición.

## Ejemplo resuelto: la media de una lista de notas

Es el problema con el que se presentaron el contador y el acumulador en el artículo sobre la [variable](/blog/que-es-una-variable-en-programacion/), visto ahora desde el bucle:

```
INICIO
    suma ← 0
    cuantas ← 0
    LEER nota
    MIENTRAS nota ≥ 0 HACER
        suma ← suma + nota
        cuantas ← cuantas + 1
        LEER nota
    FINMIENTRAS
    SI cuantas > 0 ENTONCES
        ESCRIBIR "Media: ", suma / cuantas
    SINO
        ESCRIBIR "No se ha introducido ninguna nota"
    FINSI
FIN
```

El usuario termina escribiendo un número negativo, que hace de **centinela**: un valor que no es un dato válido y que solo sirve para avisar de que no hay más. Tres cosas que conviene mirar:

- **Se lee una nota antes del bucle y otra al final del cuerpo.** Así la condición se comprueba siempre con un dato recién leído, y el centinela nunca entra en la suma.
- **`suma` y `cuantas` se inicializan fuera del bucle.** Dentro, se pondrían a cero en cada vuelta.
- **Es un MIENTRAS y no un PARA** porque no se sabe cuántas notas habrá. Y es un MIENTRAS y no un REPETIR porque puede no haber ninguna: si la primera es negativa, el cuerpo no se ejecuta y el SI final lo dice en vez de dividir entre cero.

## Bucles anidados

Un bucle puede ir dentro de otro. Por cada vuelta del exterior, el interior da todas las suyas:

```
INICIO
    PARA fila ← 1 HASTA 10 HACER
        PARA columna ← 1 HASTA 10 HACER
            ESCRIBIR fila × columna
        FINPARA
    FINPARA
FIN
```

Escribe las tablas de multiplicar del 1 al 10. El cuerpo interior se ejecuta **10 × 10 = 100 veces**. Esa multiplicación es lo que hay que vigilar: dos bucles anidados sobre una lista de mil elementos son un millón de iteraciones, y tres son mil millones. Cuando un programa que iba bien con los datos de prueba se vuelve lento con los reales, lo primero que se busca es un bucle dentro de otro.

## Salir antes de tiempo: interrumpir y continuar

Casi todos los lenguajes tienen dos instrucciones para alterar un bucle desde dentro:

- **`break`** (interrumpir): sale del bucle en ese momento, aunque la condición siga cumpliéndose. Se usa, por ejemplo, para dejar de buscar en cuanto se encuentra lo que se buscaba.
- **`continue`** (continuar): salta el resto del cuerpo y pasa directamente a la siguiente vuelta. Se usa para ignorar un elemento sin salir del bucle.

Son útiles, pero un bucle con varios `break` repartidos por el cuerpo obliga a leerlo entero para saber cuándo termina. Si la condición de salida se puede escribir en la cabecera, es mejor escribirla ahí.

## Los errores más frecuentes

1. **El bucle infinito.** La condición nunca deja de cumplirse, normalmente porque se olvidó la actualización (`i ← i + 1`) o porque se actualiza en la dirección equivocada. El programa no da error: simplemente no termina. Es la propiedad de **finitud** del [algoritmo](/blog/que-es-un-algoritmo-definicion/) incumplida.
2. **El error de uno** (en inglés, *off-by-one*). El bucle da una vuelta de más o de menos: `<` donde iba `≤`, empezar en 0 en vez de en 1, o el límite excluido del `range` de Python. Es el error más frecuente con bucles y el más difícil de ver, porque el programa funciona casi siempre.
3. **Inicializar dentro lo que iba fuera.** Un acumulador que se pone a cero en cada vuelta devuelve solo el último valor.
4. **Modificar la variable de un PARA dentro del cuerpo.** El PARA ya la actualiza solo; tocarla a mano produce saltos imprevisibles o un bucle que no acaba.
5. **Cambiar la lista que se está recorriendo.** Borrar o añadir elementos mientras se itera sobre ellos hace que se salten elementos o que el recorrido no termine. Se recorre una copia, o se construye una lista nueva.
6. **Confundir REPETIR … HASTA QUE con do … while.** Uno para cuando la condición se cumple y el otro sigue mientras se cumple. Al traducir, la condición se niega.

## Bucle y recursividad

Hay otra forma de repetir: que una función se llame a sí misma, lo que se llama **recursividad**. Cualquier bucle se puede escribir como una función recursiva y viceversa, pero no son lo mismo en la práctica. El bucle repite reutilizando las mismas variables; la recursión crea una copia nueva de las variables en cada llamada, lo que consume memoria y tiene un límite. Para recorrer una lista o contar, el bucle es lo natural. La recursión brilla cuando el problema tiene forma de árbol: recorrer carpetas dentro de carpetas o un menú con submenús.

## Preguntas frecuentes

### ¿Qué es un bucle en programación?

Es una estructura de control que repite un bloque de instrucciones mientras se cumple una condición o un número determinado de veces. Cada repetición se llama iteración. Junto con la secuencia y la selección, es una de las tres estructuras con las que se puede escribir cualquier algoritmo.

### ¿Cuáles son los tipos de bucles?

Los tres tipos básicos son el bucle MIENTRAS (while), que comprueba la condición antes de cada vuelta y puede no ejecutarse nunca; el bucle PARA (for), que repite un número conocido de veces o recorre una lista; y el bucle REPETIR (do-while o repeat-until), que comprueba la condición después de cada vuelta y se ejecuta al menos una vez.

### ¿Cuál es la diferencia entre un bucle while y un bucle for?

El while repite mientras se cumple una condición y se usa cuando no se sabe cuántas vueltas habrá. El for agrupa en su cabecera la inicialización, la condición y la actualización, y se usa cuando el número de vueltas es conocido o se recorre una colección. Todo for se puede reescribir como un while.

### ¿Qué es un bucle infinito?

Es un bucle cuya condición de salida nunca llega a cumplirse, de modo que se repite sin fin y el programa no termina. Suele deberse a que se olvidó actualizar la variable de control o a que se actualiza en la dirección equivocada.

### ¿Qué es una iteración?

Es cada una de las ejecuciones del cuerpo de un bucle. Un bucle que se repite diez veces realiza diez iteraciones. Por extensión, iterar significa repetir un proceso o recorrer uno a uno los elementos de una colección.

### ¿Cuál es la diferencia entre REPETIR HASTA QUE y do while?

Los dos ejecutan el cuerpo al menos una vez y comprueban la condición al final, pero con la lógica contraria. REPETIR … HASTA QUE, el de pseudocódigo y Pascal, se detiene cuando la condición se cumple. El do … while de C, Java o JavaScript sigue repitiendo mientras la condición se cumple. Al traducir de uno a otro hay que negar la condición.
