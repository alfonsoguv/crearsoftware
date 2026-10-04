---
title: "Qué es una variable en programación: definición, tipos y ejemplos"
slug: "que-es-una-variable-en-programacion"
date: "2026-10-04"
dateModified: "2026-10-04"
description: "Una variable es un espacio de memoria con nombre que guarda un valor que puede cambiar mientras se ejecuta el programa. Definición, sus tres partes, la asignación, los tipos de datos, el contador y el acumulador, ejemplos resueltos y los errores más frecuentes."
category: "desarrollo-software"
tags: ["variable", "programación", "pseudocódigo", "algoritmo", "conceptos básicos", "definiciones", "desarrollo de software"]
readingTime: 10
author: "Alfonso Gutiérrez"
wordCount: 2080
image: ""
---

**Una variable es un espacio de la memoria del ordenador al que se le da un nombre para guardar un dato. Se llama variable porque su contenido puede cambiar mientras el programa se ejecuta: el nombre se queda, el valor no. Es la pieza con la que un algoritmo recuerda cosas entre un paso y el siguiente.**

Es la cuarta pieza de una serie. El [algoritmo](/blog/que-es-un-algoritmo-definicion/) es la secuencia de pasos; el [diagrama de flujo](/blog/que-es-un-diagrama-de-flujo/) es cómo se dibuja y el [pseudocódigo](/blog/que-es-el-pseudocodigo/) es cómo se escribe. En todos ellos aparecen variables sin presentarlas: la `N` que se lee, el `mayor` que se va actualizando. Este artículo las presenta. Y todo vuelve a lo mismo de siempre: [el input y el output](/2007/06/23/ejemplos-de-input-output-y-actividades/). El dato que entra hay que guardarlo en algún sitio, y el resultado que sale hay que haberlo ido construyendo en algún sitio. Ese sitio es una variable.

## Definición

> **Variable**: posición de memoria identificada por un nombre, que almacena un valor de un tipo determinado y cuyo contenido puede modificarse durante la ejecución del programa.

La imagen que se usa en todas las clases es la de una **caja con una etiqueta**. La etiqueta es el nombre; lo que hay dentro es el valor. Se puede mirar qué hay dentro tantas veces como se quiera, y se puede sacar lo que había y meter otra cosa. Lo que no se puede es tener dos cosas a la vez en la misma caja: **al guardar un valor nuevo, el anterior se pierde.**

## Las tres partes de una variable

| Parte | Qué es | Ejemplo |
| --- | --- | --- |
| **Nombre** (identificador) | La etiqueta con la que el programa se refiere a ella | `edad`, `total`, `precio_con_iva` |
| **Valor** | El dato que contiene en ese momento | `42`, `19.99`, `"María"` |
| **Tipo** | Qué clase de dato puede guardar y qué operaciones admite | entero, real, texto, lógico |

Por debajo hay una cuarta, que el programador casi nunca ve: la **dirección de memoria** donde está físicamente el dato. El nombre existe precisamente para no tener que manejar esa dirección.

## Declarar y asignar

Con una variable se hacen dos cosas:

1. **Declararla**: anunciar que existe, con su nombre y, en muchos lenguajes, su tipo. Es reservar la caja y ponerle la etiqueta.
2. **Asignarle un valor**: meter un dato en la caja. La primera asignación se llama **inicialización**.

En pseudocódigo la asignación se escribe con una flecha, que se lee de derecha a izquierda: «el valor 0 va a parar a `total`».

```
total ← 0
```

En la mayoría de los lenguajes se escribe con un signo igual (`total = 0`), y en algunos, como Pascal, con dos puntos e igual (`total := 0`). La flecha del pseudocódigo existe por una buena razón, y es la siguiente.

### El signo igual no significa «igual»

La línea que más desconcierta a quien empieza a programar es esta:

```
x ← x + 1
```

En matemáticas, `x = x + 1` es una ecuación sin solución: ningún número es igual a sí mismo más uno. En programación no es una ecuación, es una orden: **calcula lo que hay a la derecha con el valor actual de `x`, y guarda el resultado en `x`**. Si `x` valía 5, después vale 6. El lado derecho se evalúa primero, con el valor viejo; el izquierdo recibe el nuevo.

Por eso muchos lenguajes usan un símbolo distinto para comparar: `==` en C, Java, JavaScript o Python. `x = 5` guarda un 5; `x == 5` pregunta si `x` vale 5. Confundirlos es uno de los errores más antiguos y más repetidos de la programación.

## Tipos de datos

El tipo dice qué cabe en la caja. Los cuatro básicos aparecen en cualquier curso de introducción:

| Tipo | Qué guarda | Ejemplos | Palabra habitual en pseudocódigo |
| --- | --- | --- | --- |
| **Entero** | Números sin decimales | `0`, `-7`, `2026` | ENTERO |
| **Real** | Números con decimales | `3.14`, `-0.5`, `19.99` | REAL |
| **Carácter / texto** | Letras, palabras, frases | `'a'`, `"Hola"` | CARÁCTER, CADENA |
| **Lógico** (booleano) | Solo dos valores: verdadero o falso | `VERDADERO`, `FALSO` | LÓGICO |

El tipo importa porque decide qué operaciones tienen sentido. Sumar dos enteros da un entero. «Sumar» dos textos, en muchos lenguajes, los pega: `"12" + "3"` da `"123"`, no `15`. Ese resultado inesperado es el ejemplo clásico de un dato que entró como texto cuando debía entrar como número.

Los lenguajes se dividen aquí en dos familias. En los de **tipado estático**, como C o Java, el tipo se declara y no cambia: una variable entera solo guardará enteros. En los de **tipado dinámico**, como Python o JavaScript, el tipo lo lleva el valor y no la variable, y la misma variable puede guardar un número y después un texto. Lo segundo es más cómodo para empezar; lo primero detecta antes los errores.

## Variable y constante

Una **constante** es como una variable cuyo valor se fija una vez y no se puede cambiar: el tipo de IVA, el número de días de la semana, el valor de π. Se le da nombre por la misma razón que a una variable —que el programa se lea— y porque, si un día cambia el IVA, se cambia en un solo sitio y no en cada línea donde aparecía el número.

## Dos variables con nombre propio: contador y acumulador

Hay dos usos de las variables tan frecuentes que tienen nombre y se enseñan aparte.

**El contador** cuenta cuántas veces pasa algo. Empieza en cero y suma **una cantidad fija**, casi siempre 1:

```
contador ← contador + 1
```

**El acumulador** va sumando valores que **cambian en cada paso**. También empieza en cero (o en 1 si lo que acumula es un producto):

```
suma ← suma + nota
```

Juntos resuelven uno de los ejercicios más típicos: la media de una serie de notas.

```
INICIO
    contador ← 0
    suma ← 0
    LEER nota
    MIENTRAS nota ≥ 0 HACER
        suma ← suma + nota
        contador ← contador + 1
        LEER nota
    FINMIENTRAS
    SI contador > 0 ENTONCES
        ESCRIBIR "Media: ", suma / contador
    SINO
        ESCRIBIR "No se ha introducido ninguna nota"
    FINSI
FIN
```

El usuario termina escribiendo un número negativo. Dos detalles: **las dos variables se inicializan antes del bucle**, no dentro (dentro, se pondrían a cero en cada vuelta y la media saldría siempre la última nota); y **se comprueba que el contador no sea cero antes de dividir**, porque dividir entre cero no da un resultado: da un error.

## Ejemplo resuelto: intercambiar dos valores

Es el ejercicio que demuestra mejor que una variable solo guarda una cosa. Se tienen `a ← 3` y `b ← 8`, y se quiere que `a` valga 8 y `b` valga 3. La solución intuitiva no funciona:

```
a ← b      (a vale 8)
b ← a      (b vale 8: el 3 se perdió en la línea anterior)
```

Al asignar `b` a `a`, el 3 que había en `a` desapareció. Hace falta una **variable auxiliar** que lo guarde mientras tanto, igual que para intercambiar el contenido de dos vasos hace falta un tercero:

```
aux ← a    (aux vale 3)
a ← b      (a vale 8)
b ← aux    (b vale 3)
```

## Ámbito: dónde existe una variable

Una variable no existe en todo el programa necesariamente. Su **ámbito** es la parte del código desde la que se puede usar:

- **Variable local**: se declara dentro de una función o de un bloque y solo existe ahí. Al terminar la función, desaparece.
- **Variable global**: se declara fuera de todo y se puede usar desde cualquier parte del programa.

La regla práctica es usar locales siempre que se pueda. Una global la puede cambiar cualquier línea del programa, y cuando tiene un valor que no debería, encontrar qué línea fue es mucho más difícil.

## Cómo poner nombre a una variable

Las reglas formales cambian de un lenguaje a otro, pero casi todos coinciden en tres: el nombre **no puede empezar por un número**, **no puede llevar espacios** y **no puede ser una palabra reservada** del lenguaje (`if`, `while`, `for`). Muchos lenguajes, además, distinguen mayúsculas de minúsculas: `Total` y `total` serían dos variables distintas.

Las reglas de estilo importan más que las formales:

1. **Que diga lo que guarda.** `precio_final`, no `pf`; `numero_de_alumnos`, no `n2`.
2. **Una convención y siempre la misma**: `precio_final` (con guion bajo) o `precioFinal` (con mayúscula intermedia), pero no las dos en el mismo programa.
3. **Las letras sueltas solo para lo que se usa dos líneas**, como el índice de un bucle.

## Los errores más frecuentes

- **Usar una variable sin inicializarla.** Un acumulador que no se pone a cero empieza con lo que hubiera en esa memoria, o el lenguaje da un error. En los dos casos el resultado está mal.
- **Inicializar dentro del bucle lo que había que inicializar fuera.** El error del ejemplo de la media: el contador se reinicia en cada vuelta.
- **Perder un valor al sobrescribirlo**, como en el intercambio sin variable auxiliar.
- **Confundir asignar con comparar**: escribir `=` donde se quería `==`.
- **Mezclar tipos sin darse cuenta**: el `"12" + "3"` que da `"123"`.
- **Reutilizar una variable para dos cosas distintas** porque «total» ya estaba libre. Ahorra una línea y cuesta una tarde de depuración.

## La palabra «variable» fuera de la programación

La misma palabra se usa en otros campos con un significado emparentado pero distinto, y conviene no mezclarlos:

| Campo | Qué es una variable |
| --- | --- |
| **Programación** | Un espacio de memoria con nombre cuyo valor cambia mientras se ejecuta el programa |
| **Matemáticas** | Un símbolo que representa un valor desconocido o cualquier valor de un conjunto; en una ecuación, la `x` no «cambia»: es la incógnita |
| **Estadística e investigación** | Una característica que se mide y que toma valores distintos entre los casos observados (edad, ingresos, satisfacción) |
| **Control de gestión** | Un indicador que la dirección vigila para saber si la empresa va donde quiere. En este blog hay un artículo sobre [qué son las variables de control](/2009/09/16/%C2%BFque-son-las-variables-de-control/) en ese sentido |

## Preguntas frecuentes

### ¿Qué es una variable en programación?

Es un espacio de memoria con un nombre que guarda un dato cuyo valor puede cambiar mientras el programa se ejecuta. Tiene tres partes: el nombre con el que se usa, el valor que contiene en cada momento y el tipo de dato que puede guardar.

### ¿Cuál es la diferencia entre una variable y una constante?

Las dos son datos con nombre. El valor de una variable puede cambiar durante la ejecución; el de una constante se fija una vez y no se puede modificar, como el tipo de IVA o el valor de π.

### ¿Cuáles son los tipos de variables?

Por el dato que guardan, los cuatro básicos son entero, real (con decimales), carácter o texto, y lógico o booleano (verdadero o falso). Por dónde se pueden usar, se distinguen las variables locales, que solo existen dentro de la función o del bloque donde se declaran, y las globales, accesibles desde todo el programa.

### ¿Qué es un contador y qué es un acumulador?

Son dos usos habituales de una variable. El contador cuenta cuántas veces ocurre algo sumando una cantidad fija, normalmente 1 (`contador ← contador + 1`). El acumulador suma valores que cambian en cada paso (`suma ← suma + nota`). Los dos deben inicializarse antes del bucle en el que se usan.

### ¿Qué significa declarar e inicializar una variable?

Declarar es anunciar que la variable existe, con su nombre y, en muchos lenguajes, su tipo. Inicializar es asignarle su primer valor. Usar una variable declarada pero sin inicializar es uno de los errores más comunes de quien empieza a programar.

### ¿Por qué en programación se puede escribir x = x + 1?

Porque el signo igual no expresa una igualdad matemática, sino una asignación: se calcula el lado derecho con el valor actual de `x` y el resultado se guarda en `x`. Si valía 5, pasa a valer 6. Por eso el pseudocódigo usa una flecha (`x ← x + 1`) y muchos lenguajes usan `==` para comparar.
