---
title: "Qué es un token en inteligencia artificial: definición, ejemplos y por qué limita lo que puedes pedir"
slug: "que-es-un-token-en-ia-definicion"
date: "2026-08-23"
dateModified: "2026-08-23"
description: "Un token es la unidad mínima en la que un modelo de lenguaje parte el texto para procesarlo: ni una letra ni una palabra, un trozo intermedio. Definición, ejemplos, qué es la ventana de contexto y por qué el español consume más tokens que el inglés."
category: "inteligencia-artificial"
tags: ["inteligencia artificial", "token", "ventana de contexto", "modelos de lenguaje", "definiciones"]
readingTime: 7
author: "Alfonso Gutiérrez"
wordCount: 1450
image: ""
---

**Un token es la unidad mínima en la que un modelo de lenguaje parte el texto para poder procesarlo. No es una letra y no es una palabra: es un trozo intermedio, normalmente una palabra corta entera o un fragmento de una palabra larga. Todo lo que un modelo lee y todo lo que escribe se mide en tokens, y de ahí salen tres cosas que se notan a diario: cuánto texto le cabe, cuánto tarda y cuánto cuesta.**

Este blog lleva desde 2007 explicando conceptos básicos de informática, y el artículo más leído sigue siendo el que define [qué son el input y el output](/2007/06/23/ejemplos-de-input-output-y-actividades/). El token es el equivalente de esa época para los modelos de lenguaje: un concepto elemental, que aparece en cualquier factura de API y en cualquier mensaje de error, y que casi nadie se para a definir antes de usarlo.

## Definición

> **Token**: unidad mínima de texto que un modelo de lenguaje procesa. El texto de entrada se descompone en una secuencia de tokens antes de llegar al modelo, y el texto de salida se genera token a token.

La descomposición la hace un componente llamado **tokenizador**, que es una tabla fija de fragmentos frecuentes construida a partir de un corpus grande. No entiende de gramática: solo busca la forma más compacta de representar el texto con los fragmentos que tiene en su tabla.

Por eso el reparto no coincide con el que haría una persona:

| Texto | Cómo tiende a partirse |
| --- | --- |
| `casa` | un solo token: es una palabra frecuente y está entera en la tabla |
| `desproporcionadamente` | varios tokens: la palabra es larga y poco frecuente, se arma con trozos |
| `2026` | puede partirse en dos, porque los números no siempre están enteros en la tabla |
| `crearsoftware.com` | varios: el punto y el dominio se separan del nombre |
| ` casa` (con espacio delante) | a menudo distinto de `casa` sin espacio: el espacio suele ir pegado al token |

Ese último detalle sorprende a mucha gente y explica bastantes comportamientos raros: para el modelo, `casa` a principio de frase y `casa` en medio de una frase pueden ser dos tokens diferentes.

OpenAI publica como regla de aproximación que, **en inglés, un token equivale de media a unos cuatro caracteres**, es decir, alrededor de tres cuartos de palabra ([documentación de OpenAI](https://platform.openai.com/tokenizer)). Es una media orientativa, no una regla: sirve para estimar un presupuesto, no para contar.

## Por qué el español gasta más tokens que el inglés

Los tokenizadores de los modelos más usados se construyeron sobre corpus con una mayoría abrumadora de texto en inglés. Consecuencia directa: las palabras inglesas frecuentes están enteras en la tabla y las españolas, muchas veces, no. Un mismo contenido traducido consume más tokens en español que en inglés.

Esto no es una curiosidad lingüística, tiene tres efectos prácticos:

- **Cuesta más.** Las APIs facturan por token, así que el mismo texto sale más caro en español.
- **Cabe menos.** Un documento en español ocupa más de la ventana de contexto que su traducción al inglés.
- **Los idiomas con alfabeto no latino salen aún peor parados.** El japonés, el árabe o el hindi pueden llegar a consumir varios tokens por carácter.

No hay mucho que hacer al respecto salvo tenerlo en cuenta al presupuestar. Conviene desconfiar de cualquier cálculo de costes hecho con las cifras de un ejemplo en inglés.

## Qué es la ventana de contexto

La **ventana de contexto** es el número máximo de tokens que un modelo puede tener presentes a la vez. Es el otro concepto que hay que entender junto al token, porque es el que impone el límite real.

Dentro de esa ventana entra **todo**: las instrucciones del sistema, el historial de la conversación, los documentos que le hayas pegado, las respuestas anteriores y la respuesta que está generando ahora. No es solo lo que acabas de escribir.

De ahí salen dos comportamientos que la gente suele atribuir a que «el modelo se ha vuelto tonto»:

1. **La conversación larga que empieza a olvidar el principio.** No es que el modelo pierda interés: es que el principio ya no cabe. Muchas interfaces descartan los mensajes más antiguos en silencio cuando la conversación desborda la ventana.
2. **La respuesta que se corta a mitad de frase.** El texto generado también consume ventana. Si la entrada ya ocupa casi todo, no queda sitio para la salida.

La solución a ambos es la misma y es aburrida: **empezar una conversación nueva** con solo el material que importa, en vez de arrastrar cien mensajes de contexto irrelevante.

## Entrada y salida no valen lo mismo

En casi todas las APIs comerciales, los tokens de entrada y los de salida se facturan a precios distintos, y los de salida son bastante más caros. La razón es técnica: leer la entrada se hace de una vez y en paralelo, mientras que la salida se genera token a token, cada uno dependiendo de todos los anteriores.

Eso cambia dónde conviene optimizar. La intuición manda recortar el prompt, pero si la respuesta es larga, el ahorro está en pedir salidas más breves y estructuradas, no en apretar la entrada. Es exactamente la misma lógica de input y output de toda la vida: identificar cuál de los dos lados domina el coste antes de tocar nada.

## Errores frecuentes al hablar de tokens

- **«Un token es una palabra.»** No. Es una aproximación útil para estimar, pero falsa como definición, y falla justo donde importa: nombres propios, tecnicismos, código, números y URLs.
- **«La ventana de contexto es lo que puedo escribir.»** No: es lo que cabe en total, incluida la respuesta y todo el historial.
- **«Más ventana de contexto es siempre mejor.»** Que quepa no significa que se use bien. Llenar la ventana de material irrelevante suele empeorar la respuesta, además de encarecerla.
- **«Los tokens son los mismos en todos los modelos.»** No: cada familia de modelos tiene su tokenizador. El mismo texto da recuentos distintos según el modelo, así que un presupuesto calculado para uno no se traslada a otro.

## Cómo contarlos de verdad

Si necesitas una cifra exacta —para presupuestar una integración, por ejemplo—, la estimación por caracteres no sirve. Hay dos vías fiables:

- **El tokenizador del propio proveedor**, que suele publicarse como herramienta web o como librería. Es la única forma de contar tal y como contará el modelo.
- **La respuesta de la propia API**, que devuelve el recuento real de tokens de entrada y salida en cada llamada. Para medir consumo en producción, esta es la fuente buena: es lo que se factura.

Cualquier otra cosa es una estimación, y conviene decirlo cuando se presenta un número.

## Preguntas frecuentes

### ¿Qué es un token en inteligencia artificial?

Es la unidad mínima de texto que un modelo de lenguaje procesa: un fragmento intermedio entre la letra y la palabra. El texto de entrada se descompone en tokens antes de llegar al modelo, y la respuesta se genera token a token.

### ¿Cuántas palabras es un token?

No hay equivalencia fija. OpenAI publica como aproximación que en inglés un token son unos cuatro caracteres, alrededor de tres cuartos de palabra. En español la proporción es peor, porque los tokenizadores más usados se construyeron sobre corpus mayoritariamente en inglés.

### ¿Qué diferencia hay entre token y palabra?

La palabra es una unidad del idioma; el token es una unidad del tokenizador, una tabla de fragmentos frecuentes construida estadísticamente. Una palabra corta y común suele ser un token entero; una larga o rara se arma con varios.

### ¿Qué es la ventana de contexto?

El número máximo de tokens que un modelo puede tener presentes a la vez. Incluye las instrucciones, el historial completo de la conversación, los documentos aportados y la respuesta que se está generando, no solo el último mensaje.

### ¿Por qué el modelo olvida lo que le dije al principio de la conversación?

Porque la conversación ha superado la ventana de contexto y los mensajes más antiguos se han descartado para hacer sitio. No es un fallo de comprensión: ese texto ya no está delante del modelo. Empezar una conversación nueva con solo el material relevante lo resuelve.

### ¿Por qué el mismo texto cuesta más en español que en inglés?

Porque consume más tokens. Los tokenizadores más extendidos se entrenaron sobre corpus con predominio de inglés, así que las palabras inglesas frecuentes están enteras en la tabla y las españolas se arman con más fragmentos.

### ¿Los tokens de entrada y de salida cuestan lo mismo?

No. En las APIs comerciales los de salida suelen ser bastante más caros, porque se generan uno a uno de forma secuencial mientras que la entrada se procesa de una vez. Si la respuesta es larga, el ahorro está en acortar la salida, no la entrada.

### ¿Cómo cuento los tokens exactos de un texto?

Con el tokenizador del proveedor del modelo, o leyendo el recuento que la propia API devuelve en cada llamada. Estimar por número de caracteres vale para presupuestar a grandes rasgos, pero no para una cifra que se vaya a presentar como exacta.
