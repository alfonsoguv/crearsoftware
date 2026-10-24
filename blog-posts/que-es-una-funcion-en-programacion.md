---
title: "Qué es una función en programación: parámetros, argumentos y valor de retorno"
slug: "que-es-una-funcion-en-programacion"
date: "2026-10-24"
dateModified: "2026-10-24"
description: "Una función es un bloque de instrucciones con nombre que recibe datos de entrada (parámetros), hace un trabajo y devuelve un resultado. Definición, partes de una función, diferencia entre parámetro y argumento, función y procedimiento, ámbito de las variables, recursividad y errores frecuentes, con pseudocódigo, Python y JavaScript."
category: "desarrollo-software"
series: "fundamentos-de-programacion"
seriesOrder: 7
tags: ["función", "funciones", "programación", "pseudocódigo", "algoritmo", "parámetros", "recursividad", "conceptos básicos", "definiciones", "desarrollo de software"]
readingTime: 11
author: "Alfonso Gutiérrez"
wordCount: 2450
image: ""
---

**Una función es un bloque de instrucciones con nombre que recibe unos datos de entrada, hace un trabajo con ellos y devuelve un resultado. Se escribe una vez y se usa tantas veces como haga falta, llamándola por su nombre. Es la forma que tiene un programa de dividir un problema grande en piezas pequeñas, cada una con un nombre que dice lo que hace: `calcular_iva`, `es_bisiesto`, `media`.**

Es la séptima pieza de una serie. El [algoritmo](/blog/que-es-un-algoritmo-definicion/) es la secuencia de pasos; el [diagrama de flujo](/blog/que-es-un-diagrama-de-flujo/) es cómo se dibuja; el [pseudocódigo](/blog/que-es-el-pseudocodigo/) es cómo se escribe; la [variable](/blog/que-es-una-variable-en-programacion/) guarda lo que el algoritmo recuerda; el [bucle](/blog/que-es-un-bucle-en-programacion/) repite, y la [estructura condicional](/blog/que-es-una-estructura-condicional/) decide. La función es lo que permite **empaquetar** todo eso y darle un nombre. Y es, en pequeño, lo mismo de siempre: [el input y el output](/2007/06/23/ejemplos-de-input-output-y-actividades/). Una función es una caja con una entrada, un proceso y una salida.

## Definición

> **Función** (también *subrutina*, *subprograma* o *rutina*; en inglés, *function*): bloque de instrucciones con nombre propio que recibe cero o más valores de entrada, llamados parámetros, ejecuta una tarea y devuelve un valor como resultado. Se ejecuta cada vez que otra parte del programa la llama.

El parecido con las funciones de matemáticas es deliberado. En matemáticas, `f(x) = x²` toma un número y devuelve su cuadrado: `f(3)` vale 9. En programación es lo mismo, con dos diferencias: la entrada y la salida pueden ser cualquier tipo de dato —un texto, una lista, una fecha—, y por el camino la función puede hacer cosas que en matemáticas no existen, como escribir en pantalla o guardar un fichero.

La idea es casi tan antigua como los ordenadores. David Wheeler la puso en práctica en el EDSAC de la Universidad de Cambridge a principios de los años cincuenta, y la describió en 1952 en el artículo *The use of sub-routines in programmes*. El nombre de entonces, *subrutina*, sigue vivo.

## Para qué sirve una función

1. **Para no repetir código.** Si el cálculo del IVA aparece en diez sitios y cambia el tipo, hay que acordarse de cambiarlo en los diez. Con una función, se cambia en uno. Es el principio que Andrew Hunt y David Thomas bautizaron en *The Pragmatic Programmer* (1999) como DRY, *Don't Repeat Yourself*.
2. **Para dividir un problema grande.** «Calcular la nómina» es inabarcable; «calcular el bruto», «calcular la retención» y «calcular el neto» son tres problemas pequeños que se pueden resolver y probar por separado.
3. **Para que el código se lea.** `SI es_bisiesto(año)` se entiende sin leer la regla del calendario gregoriano. El nombre de la función documenta lo que hace.
4. **Para probar por partes.** Una función que recibe datos y devuelve un resultado se puede comprobar sola: si `es_bisiesto(1900)` devuelve falso y `es_bisiesto(2000)` verdadero, funciona.

## Las partes de una función

```
FUNCIÓN precio_con_iva(precio, tipo)
    total ← precio + precio * tipo / 100
    DEVOLVER total
FINFUNCIÓN
```

| Parte | En el ejemplo | Qué es |
| --- | --- | --- |
| **Nombre** | `precio_con_iva` | Cómo se la llama. Conviene que sea un verbo o diga lo que devuelve |
| **Parámetros** | `precio`, `tipo` | Las variables que reciben los datos de entrada |
| **Cuerpo** | las líneas de dentro | Las instrucciones que hace |
| **Valor de retorno** | `DEVOLVER total` | El resultado que entrega a quien la llamó |

A la primera línea —nombre y parámetros— se le llama **cabecera** o **firma**: es lo único que necesita saber quien la usa. El cuerpo es asunto de quien la escribe.

Y para usarla, se la **llama** (o *invoca*) por su nombre con los valores entre paréntesis:

```
INICIO
    LEER importe
    ESCRIBIR "Con IVA: ", precio_con_iva(importe, 21)
FIN
```

En España el tipo general del IVA es el 21 % (artículo 90 de la Ley 37/1992), así que una factura de 100 € sale por 121 €. Al llamar a la función, el programa salta a su cuerpo, ejecuta las instrucciones con `precio = 100` y `tipo = 21`, y vuelve al punto de la llamada con el valor 121 en la mano.

## Parámetro y argumento no son lo mismo

Es la confusión de vocabulario más habitual, y la diferencia es sencilla:

- **Parámetro** es la variable que aparece en la definición: `precio` y `tipo`. Es un hueco con nombre.
- **Argumento** es el valor concreto que se pasa en cada llamada: `importe` y `21`. Es lo que rellena el hueco.

Cada vez que se llama a la función, los argumentos se copian en los parámetros por orden: el primero en el primero, el segundo en el segundo. Muchos lenguajes permiten además **parámetros con valor por defecto**, que se pueden omitir en la llamada:

```python
def precio_con_iva(precio, tipo=21):
    return precio + precio * tipo / 100

precio_con_iva(100)      # 121.0, usa el tipo general
precio_con_iva(100, 10)  # 110.0, tipo reducido
```

## Función y procedimiento

En la programación clásica se distingue entre dos tipos de subprograma, y lenguajes como Pascal usan una palabra distinta para cada uno:

| | Función | Procedimiento |
| --- | --- | --- |
| ¿Devuelve un valor? | Sí, siempre | No |
| Se usa… | dentro de una expresión: `x ← media(a, b)` | como una instrucción suelta: `imprimir_factura(f)` |
| Ejemplo | `es_bisiesto(año)`, `precio_con_iva(p, t)` | `mostrar_menu()`, `guardar(cliente)` |

La mayoría de los lenguajes actuales ya no distinguen: todo se llama función, y la que no devuelve nada es simplemente una función sin valor de retorno. En C se declara de tipo `void`; en Python, una función sin `return` devuelve `None`, y en JavaScript, `undefined`. En PSeInt, el intérprete de pseudocódigo habitual en clase, se escriben con `Funcion` o con `SubProceso`, que son sinónimos.

## Las variables de dentro no se ven desde fuera

Las variables que se crean dentro de una función —y sus parámetros— son **locales**: existen mientras la función se ejecuta y desaparecen al terminar. Fuera de la función no se pueden usar, y si fuera hay otra variable con el mismo nombre, son dos variables distintas que no se tocan.

```python
total = 0

def precio_con_iva(precio, tipo=21):
    total = precio + precio * tipo / 100   # esta «total» es otra variable
    return total

precio_con_iva(100)
print(total)   # 0: la de fuera no ha cambiado
```

A la zona del programa donde una variable existe se le llama **ámbito** (en inglés, *scope*), como se explica en el artículo de la [variable](/blog/que-es-una-variable-en-programacion/). Es una ventaja, no una limitación: quien llama a la función no necesita saber qué nombres usa por dentro, y la función no puede estropear por accidente las variables del resto del programa.

Una función que **solo** calcula a partir de sus parámetros y devuelve un resultado, sin leer ni modificar nada de fuera, se llama **función pura**. Con los mismos argumentos devuelve siempre lo mismo, lo que la hace la más fácil de probar y de entender. `precio_con_iva` es pura; una función que además escribe en un fichero o cambia una variable global tiene **efectos secundarios**.

## Qué pasa con lo que se le pasa

Cuando una función recibe un dato y lo modifica, ¿cambia también el original? Depende del lenguaje y del tipo de dato, y es una fuente clásica de errores.

- **Paso por valor:** la función recibe una copia. Lo que haga con ella no afecta al original. Es lo que ocurre con los números y los textos en casi todos los lenguajes.
- **Paso por referencia:** la función recibe el original. Si lo cambia, el cambio se ve fuera. En PSeInt se pide escribiendo `Por Referencia` junto al parámetro; en C++, con `&`.

Python y JavaScript hacen algo intermedio: la función recibe una referencia al mismo objeto. Asignar al parámetro un valor nuevo no afecta al original, pero **modificar** el objeto —añadir un elemento a una lista, por ejemplo— sí se ve desde fuera, porque los dos nombres apuntan a la misma lista. La documentación de Python lo resume diciendo que los argumentos se pasan «por asignación».

## Ejemplo resuelto: el año bisiesto como función

En el artículo de la [estructura condicional](/blog/que-es-una-estructura-condicional/) la regla del año bisiesto quedaba en una condición compuesta. Convertida en función, se puede usar en cualquier parte del programa sin volver a escribirla:

```
FUNCIÓN es_bisiesto(año)
    DEVOLVER (año MOD 4 = 0 Y año MOD 100 ≠ 0) O (año MOD 400 = 0)
FINFUNCIÓN

FUNCIÓN dias_del_año(año)
    SI es_bisiesto(año) ENTONCES
        DEVOLVER 366
    SINO
        DEVOLVER 365
    FINSI
FINFUNCIÓN
```

Dos detalles. Una función puede **llamar a otra**: `dias_del_año` usa `es_bisiesto` sin saber cómo está hecha. Y `DEVOLVER` **termina la función en ese momento**: en `dias_del_año`, si el año es bisiesto, la línea del 365 no llega a ejecutarse.

La misma pareja en Python y en JavaScript:

```python
def es_bisiesto(año):
    return (año % 4 == 0 and año % 100 != 0) or año % 400 == 0

def dias_del_año(año):
    return 366 if es_bisiesto(año) else 365
```

```javascript
function esBisiesto(año) {
  return (año % 4 === 0 && año % 100 !== 0) || año % 400 === 0;
}

const diasDelAño = (año) => (esBisiesto(año) ? 366 : 365);
```

La segunda función de JavaScript está escrita como **función flecha** (`=>`), una forma abreviada que el lenguaje admite desde 2015.

## La misma función en tres lenguajes

| | Pseudocódigo | Python | JavaScript |
| --- | --- | --- | --- |
| Definir | `FUNCIÓN nombre(a, b) … FINFUNCIÓN` | `def nombre(a, b):` | `function nombre(a, b) { … }` |
| Devolver | `DEVOLVER valor` | `return valor` | `return valor;` |
| Llamar | `nombre(1, 2)` | `nombre(1, 2)` | `nombre(1, 2)` |
| Valor por defecto | (según el intérprete) | `def f(a, b=0):` | `function f(a, b = 0) { … }` |
| Sin `return` devuelve | — | `None` | `undefined` |
| Forma corta | — | `lambda a, b: a + b` | `(a, b) => a + b` |

## Una función que se llama a sí misma

Una función puede llamarse a sí misma. Se llama **recursividad**, y el ejemplo de todos los apuntes es el factorial: el factorial de 5 (5!) es 5 × 4 × 3 × 2 × 1 = 120, y por definición 0! = 1.

```
FUNCIÓN factorial(n)
    SI n = 0 ENTONCES
        DEVOLVER 1
    SINO
        DEVOLVER n * factorial(n - 1)
    FINSI
FINFUNCIÓN
```

Toda función recursiva necesita dos cosas: un **caso base**, que se resuelve sin volver a llamarse (`n = 0`), y un **paso recursivo** que se acerque a él (`n - 1`). Sin caso base, la función se llama sin fin hasta agotar la memoria reservada para las llamadas; Python, por ejemplo, corta por defecto a las 1.000 llamadas anidadas. Cualquier recursión se puede escribir también con un [bucle](/blog/que-es-un-bucle-en-programacion/), y para contar o recorrer una lista el bucle suele ser lo natural. La recursión se reserva para los problemas con forma de árbol, como recorrer carpetas dentro de carpetas.

## Los errores más frecuentes

1. **Confundir escribir con devolver.** `ESCRIBIR total` muestra el número en pantalla, pero no lo entrega a quien llamó a la función. Si la función solo escribe, `x ← precio_con_iva(100, 21)` deja `x` vacía (`None` en Python, `undefined` en JavaScript).
2. **Olvidar el `return` en una rama.** Si una condicional devuelve un valor en el SI y se olvida en el SINO, la función devuelve un valor en unos casos y nada en otros.
3. **Esperar que la función cambie una variable de fuera.** Asignar a un parámetro o a una variable local con el mismo nombre que una global no cambia la de fuera. Si se quiere un resultado, se devuelve.
4. **Pasar los argumentos en otro orden.** `precio_con_iva(21, 100)` no da error: calcula el 100 % de IVA sobre 21 €. Por eso conviene que los nombres de los parámetros sean claros, y en Python se pueden pasar por nombre: `precio_con_iva(precio=100, tipo=21)`.
5. **Usar una lista como valor por defecto en Python.** En `def f(x, lista=[])`, la lista se crea una sola vez, al definir la función, y se comparte entre todas las llamadas: lo que se añada en una sigue ahí en la siguiente. Se escribe `lista=None` y se crea dentro.
6. **Funciones que hacen demasiado.** Si el nombre necesita una «y» —`leer_y_validar_y_guardar`— son tres funciones. Una función que hace una sola cosa es más fácil de nombrar, de probar y de reutilizar.

## Funciones e inteligencia artificial

Hay un uso reciente que conviene conocer. Cuando un modelo de lenguaje consulta una base de datos o lanza una búsqueda, lo hace a través de **herramientas** que se le describen exactamente como funciones: un nombre, unos parámetros con su tipo y lo que devuelven. Los proveedores lo llaman *function calling*, y protocolos como [MCP](/2025/04/14/la-guia-definitiva-sobre-el-protocolo-de-contexto-del-modelo-mcp/) estandarizan esa descripción. La firma de una función, que en clase parece un detalle formal, es lo que el modelo lee para decidir qué llamar y con qué argumentos. Un nombre claro y unos parámetros bien explicados sirven igual a un compañero que a una IA.

## Preguntas frecuentes

### ¿Qué es una función en programación?

Es un bloque de instrucciones con nombre que recibe unos datos de entrada (parámetros), hace una tarea con ellos y devuelve un resultado. Se define una vez y se ejecuta cada vez que otra parte del programa la llama por su nombre, lo que evita repetir código y permite dividir un problema grande en partes pequeñas.

### ¿Cuáles son las partes de una función?

El nombre, con el que se la llama; los parámetros, que reciben los datos de entrada; el cuerpo, con las instrucciones que ejecuta, y el valor de retorno, que es el resultado que entrega a quien la llamó. Al nombre con sus parámetros se le llama cabecera o firma de la función.

### ¿Qué diferencia hay entre parámetro y argumento?

El parámetro es la variable que aparece en la definición de la función, como `precio` en `precio_con_iva(precio, tipo)`. El argumento es el valor concreto que se le pasa en cada llamada, como `100` en `precio_con_iva(100, 21)`. En cada llamada, los argumentos se copian en los parámetros.

### ¿Qué diferencia hay entre una función y un procedimiento?

Una función devuelve un valor y se usa dentro de una expresión, como `x ← media(a, b)`. Un procedimiento ejecuta una tarea sin devolver nada y se usa como una instrucción suelta, como `imprimir_factura(f)`. Pascal los distingue con palabras distintas; Python, JavaScript y C llaman función a ambos.

### ¿Qué es una función recursiva?

Es una función que se llama a sí misma para resolver una versión más pequeña del mismo problema. Necesita un caso base, que se resuelve sin volver a llamarse, y un paso recursivo que se acerque a él. El ejemplo clásico es el factorial: factorial(n) = n × factorial(n − 1), con factorial(0) = 1.

### ¿Qué es el valor de retorno de una función?

Es el resultado que la función entrega a quien la llamó, indicado con DEVOLVER en pseudocódigo o `return` en Python y JavaScript. Al ejecutarse, la función termina en ese momento. Si una función no tiene `return`, en Python devuelve `None` y en JavaScript `undefined`.
