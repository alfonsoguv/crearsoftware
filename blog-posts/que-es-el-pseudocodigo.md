---
title: "Qué es el pseudocódigo: definición, reglas y ejemplos resueltos"
slug: "que-es-el-pseudocodigo"
date: "2026-09-27"
dateModified: "2026-09-27"
description: "El pseudocódigo es la descripción de un algoritmo en lenguaje natural estructurado: se lee como texto, pero se organiza como un programa. Definición, las tres estructuras de control, dos ejemplos resueltos, las reglas para escribirlo bien y en qué se diferencia de un diagrama de flujo y del código."
category: "desarrollo-software"
tags: ["pseudocódigo", "algoritmo", "programación", "conceptos básicos", "definiciones", "desarrollo de software"]
readingTime: 9
author: "Alfonso Gutiérrez"
wordCount: 1700
image: ""
---

**El pseudocódigo es la descripción de un algoritmo escrita en lenguaje natural, pero con la estructura de un programa: pasos numerados o sangrados, decisiones con SI y SINO, repeticiones con MIENTRAS o PARA. No lo ejecuta ninguna máquina. Sirve para que una persona piense y comunique la lógica de un programa antes de escribirlo en un lenguaje concreto.**

Es la tercera pieza de una serie. El [algoritmo](/blog/que-es-un-algoritmo-definicion/) es la secuencia de pasos; el [diagrama de flujo](/blog/que-es-un-diagrama-de-flujo/) es cómo se dibuja; el pseudocódigo es cómo se escribe. Los tres parten de lo mismo, que este blog explicó en 2007: [el input y el output](/2007/06/23/ejemplos-de-input-output-y-actividades/), lo que entra y lo que sale.

## Definición

> **Pseudocódigo**: descripción informal y de alto nivel de un algoritmo que usa las estructuras de control de un lenguaje de programación —secuencia, condición y repetición— expresadas en lenguaje natural, sin sujetarse a la sintaxis de ningún lenguaje real.

La palabra lo dice: *pseudo* es «falso». Parece código, se organiza como código, pero no lo es. Dos consecuencias:

1. **No tiene una sintaxis oficial.** No existe una norma de pseudocódigo como sí la hay para los símbolos del diagrama de flujo (la ISO 5807). Cada libro, cada profesor y cada empresa usa sus propias palabras clave. Lo que es común a todos son las estructuras, no las palabras.
2. **Lo lee una persona, no un compilador.** Por eso se puede escribir «ordenar la lista de menor a mayor» como un solo paso, aunque en código eso sean veinte líneas. El nivel de detalle lo decide quien lo escribe, según a quién va dirigido.

## Las tres estructuras de control

Cualquier algoritmo, por complejo que sea, se puede escribir combinando solo tres estructuras. Es el resultado que en 1966 demostraron Corrado Böhm y Giuseppe Jacopini, y es la base de la programación estructurada. El pseudocódigo existe para expresar esas tres cosas con claridad:

| Estructura | Qué hace | Palabras habituales en español |
| --- | --- | --- |
| **Secuencia** | Un paso detrás de otro, en orden | (ninguna: una línea por paso) |
| **Selección** | Elige un camino según una condición | SI … ENTONCES … SINO … FINSI · SEGÚN … HACER |
| **Repetición** | Repite un bloque mientras se cumpla algo | MIENTRAS … HACER · PARA … HASTA · REPETIR … HASTA QUE |

A esas se añaden dos operaciones que no son estructuras, pero aparecen en todo pseudocódigo porque son el input y el output del algoritmo: **LEER** (entra un dato) y **ESCRIBIR** (sale un resultado). Y la **asignación**, que guarda un valor en una variable y se escribe con una flecha (`total ← 0`) o con un signo igual.

## Ejemplo 1: par o impar

Es el mismo problema que resolvimos con un [diagrama de flujo](/blog/que-es-un-diagrama-de-flujo/): leer un número, decir si es par o impar y terminar.

```
INICIO
    LEER N
    R ← resto de dividir N entre 2
    SI R = 0 ENTONCES
        ESCRIBIR "Es par"
    SINO
        ESCRIBIR "Es impar"
    FINSI
FIN
```

Compárelo con el diagrama: cada romboide se ha convertido en un LEER o un ESCRIBIR, el rectángulo en una asignación y el rombo en un SI. **Es exactamente el mismo algoritmo**; ha cambiado la forma de representarlo. Y ocupa ocho líneas donde el dibujo ocupaba media página.

## Ejemplo 2: el mayor de una lista

Aquí aparece una repetición, que es donde el pseudocódigo empieza a ganar claramente al dibujo.

```
INICIO
    LEER lista de números L
    SI L está vacía ENTONCES
        ESCRIBIR "No hay números"
    SINO
        mayor ← primer elemento de L
        PARA CADA número X de L HACER
            SI X > mayor ENTONCES
                mayor ← X
            FINSI
        FINPARA
        ESCRIBIR mayor
    FINSI
FIN
```

Tres detalles que separan un pseudocódigo útil de uno que solo lo parece:

- **Contempla el caso vacío.** Una lista sin elementos no tiene mayor. Si no se escribe esa rama, el programa que salga de aquí fallará justo con ese caso, que es el que nadie prueba.
- **`mayor` empieza con un valor de la propia lista**, no con cero. Si empezara en cero, una lista de números negativos devolvería 0, que ni siquiera está en la lista.
- **Cada bloque se cierra** (FINSI, FINPARA) y **se sangra**. Sin eso, en cuanto hay un SI dentro de un PARA ya no se sabe qué línea pertenece a qué.

## Las reglas para escribirlo bien

Como no hay norma, la calidad depende de la disciplina de quien lo escribe. Estas son las reglas que funcionan:

1. **Una instrucción por línea.** Igual que en el diagrama, «calcular el total y enviar el correo» son dos pasos.
2. **Sangría para marcar lo que está dentro de qué.** Es lo que hace legible el pseudocódigo; sin ella es una lista de frases.
3. **Palabras clave en mayúsculas y siempre las mismas.** Si se empieza con MIENTRAS, no se cambia a «repetir mientras» a mitad del texto.
4. **Toda estructura que se abre, se cierra.** SI con FINSI, MIENTRAS con FINMIENTRAS.
5. **Nombres de variables que digan lo que guardan.** `mayor` y `total`, no `x1` y `aux`.
6. **Nada de sintaxis de un lenguaje concreto.** Si aparece un punto y coma o un `print()`, ya no es pseudocódigo: es código a medias, y quien no conoce ese lenguaje deja de entenderlo.
7. **El nivel de detalle que necesite el lector.** Para explicar la idea a un cliente, «ordenar la lista» basta. Para que la programe un junior, hay que desglosarlo.

## Los errores más frecuentes

- **La rama SINO que falta.** Un SI sin SINO es correcto cuando de verdad no hay nada que hacer en el otro caso. El problema es cuando sí lo había y nadie lo pensó. Es el mismo error que el rombo con una salida que no va a ninguna parte.
- **El bucle que no termina.** Un MIENTRAS cuya condición nunca deja de cumplirse. En el pseudocódigo pasa desapercibido; en el programa se queda colgado. Hay que comprobar que algo dentro del bucle acerca la condición a su fin.
- **Pseudocódigo que es código disfrazado.** Escribir `for (i = 0; i < n; i++)` no ayuda a nadie: quien sabe programar prefiere el código de verdad y quien no sabe no lo entiende.
- **Pasos que no son pasos.** «Calcular el precio óptimo» no es una instrucción: es el problema entero. Si un paso no se puede ejecutar sin pensar, hay que desglosarlo.

## Pseudocódigo, diagrama de flujo y código

Son tres representaciones del mismo algoritmo. Se confunden a menudo porque se enseñan juntas:

| | Qué es | Lo lee | Cuándo conviene |
| --- | --- | --- | --- |
| **Pseudocódigo** | El algoritmo escrito en lenguaje natural estructurado | Personas | Algoritmos largos, con bucles, que van a convertirse en código pronto |
| **Diagrama de flujo** | El algoritmo dibujado con símbolos normalizados | Personas, incluso sin formación técnica | Procesos con varias decisiones que hay que enseñar a quien no programa |
| **Código** | El algoritmo en un lenguaje de programación real | Una máquina (y personas) | Cuando tiene que ejecutarse |

La regla práctica: **dibuje cuando lo importante son las bifurcaciones y escriba cuando lo importante son las repeticiones.** Un diagrama de flujo con un bucle dentro de otro bucle se vuelve ilegible; el mismo algoritmo en pseudocódigo cabe en diez líneas sangradas.

## ¿Para qué sirve hoy?

Se sigue enseñando en todos los cursos de introducción a la programación, y con razón: separa el problema de pensar la lógica del problema de recordar la sintaxis. Quien aprende a programar directamente en un lenguaje suele pelearse con los dos a la vez y no sabe cuál de los dos le está fallando. En el ámbito docente de habla hispana es habitual PSeInt, un intérprete que ejecuta pseudocódigo en español precisamente para eso.

Fuera del aula tiene dos usos vivos:

**Para diseñar antes de programar.** Escribir el pseudocódigo de una función complicada obliga a resolver los casos límite —la lista vacía, el número negativo, el dato que falta— antes de que el código los esconda entre detalles de sintaxis.

**Para explicar un algoritmo sin depender de un lenguaje.** Los libros y los artículos académicos de algoritmos lo usan por eso: una descripción en pseudocódigo se puede implementar en cualquier lenguaje, y seguirá siendo válida cuando el lenguaje de moda sea otro.

Hay un uso nuevo que merece mención: pedirle a un asistente de IA que escriba un programa funciona mucho mejor si se le da el algoritmo en pseudocódigo que si se le describe el problema en prosa. La razón es la misma de siempre: el pseudocódigo ya ha tomado las decisiones que la prosa deja abiertas.

## Preguntas frecuentes

### ¿Qué es el pseudocódigo en programación?

Es una forma de escribir un algoritmo en lenguaje natural pero con la estructura de un programa: pasos en orden, decisiones con SI y SINO y repeticiones con MIENTRAS o PARA. No lo ejecuta ningún ordenador; sirve para pensar y comunicar la lógica antes de programarla en un lenguaje concreto.

### ¿Cuál es la diferencia entre pseudocódigo y algoritmo?

El algoritmo es la secuencia de pasos en sí; el pseudocódigo es una de las formas de escribirla. El mismo algoritmo se puede expresar como pseudocódigo, como diagrama de flujo o como código en un lenguaje de programación.

### ¿Cuál es la diferencia entre pseudocódigo y diagrama de flujo?

Los dos representan un algoritmo. El diagrama de flujo lo dibuja con símbolos normalizados y es más claro cuando hay muchas decisiones o el lector no programa; el pseudocódigo lo escribe en texto estructurado y es más compacto cuando hay bucles o el algoritmo es largo.

### ¿Tiene el pseudocódigo una sintaxis oficial?

No. A diferencia de los símbolos del diagrama de flujo, que están normalizados en la ISO 5807, el pseudocódigo no tiene norma. Lo común a todas las variantes son las tres estructuras de control —secuencia, selección y repetición— y la regla de usar siempre las mismas palabras clave dentro de un mismo texto.

### ¿Cuáles son las palabras clave del pseudocódigo en español?

Las más habituales son INICIO y FIN, LEER y ESCRIBIR para la entrada y la salida, SI … ENTONCES … SINO … FINSI para las decisiones, y MIENTRAS … FINMIENTRAS, PARA … FINPARA y REPETIR … HASTA QUE para las repeticiones. La asignación se suele escribir con una flecha: `total ← 0`.
