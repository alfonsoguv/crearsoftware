---
title: "Qué es una estructura condicional en programación: simple, doble y múltiple"
slug: "que-es-una-estructura-condicional"
date: "2026-10-18"
dateModified: "2026-10-18"
description: "Una estructura condicional es una estructura de control que ejecuta un bloque de instrucciones u otro según se cumpla o no una condición. Definición, cómo se escribe la condición, los tres tipos (simple, doble y múltiple) en pseudocódigo y en código, condiciones anidadas y compuestas, y los errores más frecuentes."
category: "desarrollo-software"
series: "fundamentos-de-programacion"
seriesOrder: 6
tags: ["estructura condicional", "condicional", "programación", "pseudocódigo", "algoritmo", "estructuras de control", "conceptos básicos", "definiciones", "desarrollo de software"]
readingTime: 11
author: "Alfonso Gutiérrez"
wordCount: 2350
image: ""
---

**Una estructura condicional es una estructura de control que hace que un programa ejecute un bloque de instrucciones u otro según se cumpla o no una condición. Es la forma que tiene un algoritmo de tomar decisiones: en lugar de seguir siempre el mismo camino, pregunta algo —¿la nota llega a 5?, ¿hay saldo?, ¿el usuario ha escrito la contraseña correcta?— y sigue por un lado o por otro según la respuesta.**

Es la sexta pieza de una serie. El [algoritmo](/blog/que-es-un-algoritmo-definicion/) es la secuencia de pasos; el [diagrama de flujo](/blog/que-es-un-diagrama-de-flujo/) es cómo se dibuja; el [pseudocódigo](/blog/que-es-el-pseudocodigo/) es cómo se escribe; la [variable](/blog/que-es-una-variable-en-programacion/) es donde se guarda lo que el algoritmo va recordando, y el [bucle](/blog/que-es-un-bucle-en-programacion/) es lo que hace que los pasos se repitan. Faltaba la pieza que decide. Y otra vez vuelve a lo de siempre, [el input y el output](/2007/06/23/ejemplos-de-input-output-y-actividades/): el mismo programa tiene que dar salidas distintas para entradas distintas, y la condicional es lo que lo hace posible.

## Definición

> **Estructura condicional** (también *estructura selectiva*, *de selección*, *de decisión* o, simplemente, *condicional*; en inglés, *conditional* o *if statement*): estructura de control que evalúa una condición y, según sea verdadera o falsa, ejecuta un bloque de instrucciones u otro.

En la programación estructurada es una de las **tres estructuras de control** con las que se puede escribir cualquier algoritmo, como demostraron Corrado Böhm y Giuseppe Jacopini en 1966:

| Estructura | Qué hace | Ejemplo |
| --- | --- | --- |
| **Secuencia** | Un paso detrás de otro | Leer un dato, calcular, escribir el resultado |
| **Selección** (condicional) | Elige un camino según una condición | SI la nota ≥ 5 ENTONCES «aprobado» SINO «suspenso» |
| **Repetición** ([bucle](/blog/que-es-un-bucle-en-programacion/)) | Vuelve a ejecutar un bloque | MIENTRAS queden alumnos, leer su nota |

La diferencia con el bucle es la que más se confunde al empezar: **una condicional se ejecuta como mucho una vez; un bucle puede ejecutarse cero, una o muchas veces.** Los dos llevan una condición, pero la condicional la evalúa para decidir por dónde seguir y el bucle la evalúa para decidir si vuelve atrás.

En un [diagrama de flujo](/blog/que-es-un-diagrama-de-flujo/), la condicional se dibuja con un **rombo**: dentro va la pregunta y de él salen dos flechas, una marcada «sí» y otra «no», que más abajo vuelven a juntarse.

## La condición: una pregunta que solo admite sí o no

La condición es una expresión que, al evaluarse, da **verdadero** o **falso** y nada más. A ese tipo de valor se le llama *booleano*, por George Boole, el matemático que formalizó el álgebra de la lógica en el siglo XIX. Las condiciones se construyen con dos tipos de operadores.

**Operadores de comparación**, que comparan dos valores:

| Operador | Significa | Pseudocódigo | Python y JavaScript |
| --- | --- | --- | --- |
| Igual | ¿son el mismo valor? | `=` | `==` (en JavaScript, mejor `===`) |
| Distinto | ¿son valores diferentes? | `≠` o `<>` | `!=` (en JavaScript, `!==`) |
| Mayor, menor | ¿uno es mayor (o menor) que el otro? | `>` `<` | `>` `<` |
| Mayor o igual, menor o igual | ¿es mayor (o menor) o igual? | `≥` `≤` | `>=` `<=` |

**Operadores lógicos**, que combinan varias condiciones en una:

| Operador | Es verdadero cuando… | Pseudocódigo | Python | JavaScript |
| --- | --- | --- | --- | --- |
| **Y** (conjunción) | se cumplen las dos | `Y` | `and` | `&&` |
| **O** (disyunción) | se cumple al menos una | `O` | `or` | `\|\|` |
| **NO** (negación) | no se cumple la condición | `NO` | `not` | `!` |

Una regla que evita muchos errores al negar condiciones compuestas son las **leyes de De Morgan**: negar un Y da un O de las negaciones, y negar un O da un Y. «No es verdad que la nota esté entre 0 y 10» se escribe `nota < 0 O nota > 10`, no `nota < 0 Y nota > 10` (que nunca puede cumplirse).

## Los tres tipos de estructura condicional

### Condicional simple (SI … ENTONCES)

Ejecuta un bloque **solo si** la condición se cumple. Si no se cumple, no hace nada y el programa sigue por la línea siguiente.

```
INICIO
    LEER saldo, importe
    SI importe > saldo ENTONCES
        ESCRIBIR "Aviso: la operación deja la cuenta en descubierto"
    FINSI
    saldo ← saldo - importe
    ESCRIBIR "Saldo: ", saldo
FIN
```

El aviso sale solo cuando hace falta; la resta y el saldo final se ejecutan siempre.

### Condicional doble (SI … ENTONCES … SINO)

Tiene **dos caminos** y siempre se ejecuta uno de los dos, nunca ambos ni ninguno.

```
INICIO
    LEER nota
    SI nota ≥ 5 ENTONCES
        ESCRIBIR "Aprobado"
    SINO
        ESCRIBIR "Suspenso"
    FINSI
FIN
```

### Condicional múltiple (SEGÚN, o SI encadenados)

Elige **entre más de dos caminos**. Hay dos formas de escribirla, y no sirven para lo mismo.

La primera es la instrucción **SEGÚN** (en inglés, *switch* o *case*), que compara una variable con una lista de valores concretos:

```
INICIO
    LEER dia
    SEGÚN dia HACER
        1, 2, 3, 4, 5: ESCRIBIR "Laborable"
        6, 7: ESCRIBIR "Fin de semana"
        DE OTRO MODO: ESCRIBIR "Número de día no válido"
    FINSEGÚN
FIN
```

Es la forma que usa PSeInt, el intérprete de pseudocódigo en español habitual en clase. **SEGÚN solo sirve para valores exactos**: no puede preguntar si una nota está entre 7 y 9. Para rangos se usan **condicionales encadenadas**, con un SI dentro del SINO del anterior (lo que muchos lenguajes escriben `else if`), como en el ejemplo resuelto de abajo.

La rama **DE OTRO MODO** (`default` en C y JavaScript, `case _` en Python) recoge todo lo que no coincide con ningún caso. Conviene ponerla siempre, aunque solo sea para avisar de un dato inesperado.

## Ejemplo resuelto: de la nota numérica a la calificación

En España, la escala universitaria la fija el Real Decreto 1125/2003: de 0 a 4,9 es *suspenso*; de 5 a 6,9, *aprobado*; de 7 a 8,9, *notable*, y de 9 a 10, *sobresaliente*. Convertir una nota en su calificación es el ejercicio clásico de condicional múltiple:

```
INICIO
    LEER nota
    SI nota < 0 O nota > 10 ENTONCES
        ESCRIBIR "Nota no válida"
    SINO SI nota ≥ 9 ENTONCES
        ESCRIBIR "Sobresaliente"
    SINO SI nota ≥ 7 ENTONCES
        ESCRIBIR "Notable"
    SINO SI nota ≥ 5 ENTONCES
        ESCRIBIR "Aprobado"
    SINO
        ESCRIBIR "Suspenso"
    FINSI
FIN
```

Tres decisiones de diseño que no son casuales:

- **Primero se descartan los datos imposibles.** Si no, una nota de 12 saldría «sobresaliente».
- **Las condiciones van de mayor a menor y el orden importa.** El programa se queda con la primera que se cumple y no mira las demás. Si se preguntara primero `nota ≥ 5`, un 9,5 entraría ahí y saldría «aprobado».
- **Cada rama pregunta solo por el límite inferior.** Escribir `nota ≥ 5 Y nota ≤ 6,9` parece más fiel a la tabla, pero deja un hueco: un 6,95 no cumpliría ninguna condición. Encadenando con SINO, cada rama ya sabe que las anteriores han sido falsas y no hace falta repetirlas.

## Anidar o combinar: el año bisiesto

Una condicional puede ir dentro de otra, igual que los bucles. El ejemplo de todos los apuntes es el año bisiesto, cuya regla en el calendario gregoriano es: **es bisiesto si es divisible entre 4, salvo que sea divisible entre 100, en cuyo caso solo lo es si también es divisible entre 400.** Por eso 2024 y 2000 fueron bisiestos, y 1900 no lo fue ni lo será 2100.

Escrita con condicionales anidadas:

```
SI año MOD 4 = 0 ENTONCES
    SI año MOD 100 = 0 ENTONCES
        SI año MOD 400 = 0 ENTONCES
            bisiesto ← VERDADERO
        SINO
            bisiesto ← FALSO
        FINSI
    SINO
        bisiesto ← VERDADERO
    FINSI
SINO
    bisiesto ← FALSO
FINSI
```

Y escrita con una sola condición compuesta:

```
bisiesto ← (año MOD 4 = 0 Y año MOD 100 ≠ 0) O (año MOD 400 = 0)
```

Hacen lo mismo. La versión anidada se sigue paso a paso con el dedo; la compuesta cabe en una línea y deja ver la regla entera. **Más de tres niveles de anidamiento suele ser señal de que la lógica se puede simplificar**, combinando condiciones o resolviendo primero los casos que terminan pronto.

## La misma condicional en tres lenguajes

| | Pseudocódigo | Python | JavaScript |
| --- | --- | --- | --- |
| Simple | `SI c ENTONCES … FINSI` | `if c:` | `if (c) { … }` |
| Doble | `SI c ENTONCES … SINO … FINSI` | `if c: … else:` | `if (c) { … } else { … }` |
| Encadenada | `SINO SI c2 ENTONCES` | `elif c2:` | `else if (c2) { … }` |
| Por valores | `SEGÚN v HACER` | `match v:` | `switch (v) { case …: }` |
| En una expresión | (no existe) | `"Apto" if nota >= 5 else "No apto"` | `nota >= 5 ? "Apto" : "No apto"` |

Detalles de esa tabla que conviene conocer:

- **Python no tuvo `match` hasta la versión 3.10**, de 2021. Antes, la condicional múltiple se escribía siempre con `elif`, y sigue siendo lo más habitual.
- **El `switch` de C y JavaScript sigue de largo.** Si un `case` no termina en `break`, el programa continúa ejecutando el siguiente `case` aunque no coincida. El `match` de Python no lo hace.
- **La última fila es el operador condicional** (u *operador ternario*): una condicional doble que, en lugar de ejecutar instrucciones, devuelve un valor. Es cómodo para asignaciones cortas; anidado, se vuelve ilegible.

## Los errores más frecuentes

1. **Asignar en lugar de comparar.** En C o JavaScript, `if (x = 5)` no pregunta si `x` vale 5: le asigna 5, y como 5 cuenta como verdadero, la condición se cumple siempre. La comparación es `==` (o `===` en JavaScript). Python da error de sintaxis en ese caso, precisamente para evitarlo.
2. **Ordenar mal las condiciones encadenadas.** La primera que se cumple gana. Una condición amplia antes que una estrecha (`≥ 5` antes que `≥ 9`) hace que la estrecha no se alcance nunca.
3. **Dejar huecos o solapes en los rangos.** `nota < 5` y `nota > 5` dejan fuera el 5 exacto. Encadenar con SINO y preguntar solo por un límite evita los dos problemas.
4. **Usar O donde iba Y, o al revés.** `nota > 0 O nota < 10` es verdadero para cualquier número: cualquier valor es mayor que 0 o menor que 10. Para comprobar que un valor está en un intervalo se usa Y.
5. **Comparar decimales con igualdad exacta.** Los ordenadores guardan la mayoría de los decimales de forma aproximada, y en Python o JavaScript `0.1 + 0.2 == 0.3` da **falso**. Con decimales se compara si la diferencia es menor que un margen pequeño, no si son iguales.
6. **Olvidar el caso que nadie esperaba.** Una condicional múltiple sin SINO final ni DE OTRO MODO no hace nada ante un dato raro, y el programa sigue como si todo fuera bien. Es mejor que avise.

## Evaluación en cortocircuito

Casi todos los lenguajes —C, Java, JavaScript o Python— evalúan las condiciones compuestas de izquierda a derecha y **dejan de evaluar en cuanto saben el resultado**: en un Y, si la primera parte es falsa, la segunda ni se mira; en un O, si la primera es verdadera, tampoco. Se llama *evaluación en cortocircuito* y tiene un uso práctico. En el ejemplo de la media del artículo del [bucle](/blog/que-es-un-bucle-en-programacion/):

```
SI cuantas > 0 Y suma / cuantas ≥ 5 ENTONCES
    ESCRIBIR "La media está aprobada"
FINSI
```

Si no se ha introducido ninguna nota, `cuantas > 0` es falso y la división no llega a hacerse. Con el orden contrario, el programa dividiría entre cero. El orden de las condiciones, otra vez, no es indiferente.

## Preguntas frecuentes

### ¿Qué es una estructura condicional en programación?

Es una estructura de control que evalúa una condición y, según sea verdadera o falsa, ejecuta un bloque de instrucciones u otro. Permite que un programa tome decisiones. Junto con la secuencia y la repetición, es una de las tres estructuras con las que se puede escribir cualquier algoritmo.

### ¿Cuáles son los tipos de estructuras condicionales?

Hay tres: la condicional simple (SI … ENTONCES), que ejecuta un bloque solo si se cumple la condición; la doble (SI … ENTONCES … SINO), que elige entre dos caminos y siempre ejecuta uno; y la múltiple, que elige entre más de dos caminos con la instrucción SEGÚN (switch) o con condicionales encadenadas (else if).

### ¿Qué diferencia hay entre una estructura condicional y un bucle?

La condicional evalúa la condición una vez para decidir qué camino sigue el programa, y su bloque se ejecuta como mucho una vez. El bucle evalúa la condición repetidamente para decidir si vuelve a ejecutar su bloque, que puede ejecutarse cero, una o muchas veces.

### ¿Qué es una condicional anidada?

Es una estructura condicional escrita dentro de otra, de modo que la segunda pregunta solo se hace si la primera ha tenido una respuesta determinada. El ejemplo clásico es el año bisiesto: solo tiene sentido preguntar si un año es divisible entre 100 cuando ya se sabe que lo es entre 4.

### ¿Cuándo usar switch y cuándo if?

El switch (SEGÚN) sirve para comparar una variable con una lista de valores exactos, como los días de la semana o las opciones de un menú. Para rangos (una nota entre 7 y 9) o para condiciones que mezclan varias variables, hay que usar if con else if encadenados.

### ¿Qué es una condición en programación?

Es una expresión que al evaluarse solo puede dar verdadero o falso, como `nota ≥ 5` o `edad > 17 Y tiene_permiso`. Se construye con operadores de comparación (igual, distinto, mayor, menor) y operadores lógicos (Y, O, NO).
