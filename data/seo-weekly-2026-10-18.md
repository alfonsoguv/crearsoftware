# Informe semanal SEO/GEO — 18 de octubre de 2026

Ejecución programada. Tercera semana de mes: no toca leer clics (última lectura el 04-oct,
hace dos semanas). La medición se lanzó también ayer a mano (`seo-weekly-2026-10-17.md`);
aquí solo se añade lo nuevo.

---

## El hallazgo: «Rastreada: actualmente sin indexar» no es un veredicto, es una espera

El punto abierto 1 del encargo llevaba dos meses sin explicación: ~85 % de la no indexación
es «Rastreada: actualmente sin indexar» y ninguna característica de la página lo explicaba
(longitud, antigüedad, `¿` en el slug, enlaces internos, solapamiento de slugs). Esta semana
cierro la última hipótesis de página y encuentro que la variable que importa es otra: **el
tiempo desde el último rastreo.**

### 1. Duplicación en el texto completo: descartada

Era la hipótesis que el encargo dejaba abierta («el slug es un proxy pobre del texto»).
Sobre los gemelos `.md` de las 708 páginas del sitemap y las 294 URLs con estado conocido
desde el 17-ago:

| | n | Parecido máximo con otra página (TF-IDF, mediana) | Texto repetido literal (frases de 5 palabras, mediana) |
| --- | --- | --- | --- |
| Indexadas | 222 | 0,168 | 2,6 % |
| Rastreadas sin indexar | 53 | 0,160 | 3,1 % |

- Por cuartiles de parecido, la tasa de indexación es 78 / 80 / 78 / **87 %**: si algo, las
  más parecidas a otra página se indexan *más* (χ² p = 0,50; Mann-Whitney p = 0,09 en el
  sentido contrario al de la hipótesis).
- **Ninguna página de la muestra repite más del 20 % de su texto** de otra; el máximo es un
  17 %. No hay casi-duplicados en el sitio.

### 2. Lo que sí separa a los dos grupos: la fecha del último rastreo

| | Último rastreo antes de la inspección (mediana) | Más de 120 días |
| --- | --- | --- |
| Indexadas (226) | **16 días** | 0 |
| Rastreadas sin indexar (53) | **130 días** | 29 |

Ninguna indexada de la muestra tenía un rastreo de antes del 15-may. 17 de las 53 sin
indexar tenían el último rastreo **antes de la migración** (≈ 5-abr): su veredicto se dio
sobre el HTML de WordPress.

Eso solo no prueba nada (Google pasa más a menudo por lo que tiene indexado, así que el
retraso puede ser consecuencia y no causa). La prueba es volver a mirar.

### 3. Reinspección hoy de las 53: todas las que Google ha vuelto a rastrear están indexadas

| Qué les ha pasado desde que salieron en la muestra | URLs | Estado hoy |
| --- | --- | --- |
| Google las ha vuelto a rastrear | **13** | **13 indexadas** (IC 95 % 77-100 %) |
| No ha vuelto, rastreo de hace menos de 180 días | 20 | siguen «Rastreada: actualmente sin indexar» |
| No ha vuelto, rastreo de hace más de 180 días | 20 | «Descubierta» o «no reconoce», **sin fecha de rastreo** |

Con el panel nuevo (abajo), que amplía la cohorte a las 70 URLs que han salido alguna vez
como «Rastreada» desde abril: **22 rastreadas de nuevo, 21 indexadas.**

De las 13, 4 eran del grupo de antes de la migración y 9 ya se habían rastreado sobre el
sitio estático actual y aun así seguían fuera. En 5 de esas 9 la fuente del post no tiene
ni un commit entre las dos visitas (`la-preventa`, `vista-y-explorer`,
`crear-software-para-empresas`, `¿como-es-el-crecimiento-de-velneo`,
`¿-por-que-los-lideres-tienen-que-tener-blog`): **mismo texto, otra visita, otro
veredicto.** Las otras 4 sí cambiaron entre medias (la auditoría de fidelidad del 31-may y
la reescritura del 03-ago).

**El flujo inverso es pequeño.** De 60 indexadas elegidas al azar en la muestra, 58 siguen
indexadas; de las 39 que Google ha vuelto a rastrear, 38 siguen dentro. En el control de 40
del panel: 39 de 40. Una de las dos que salen (`los-mejores-del-2007`) cayó **sin** que
Google la volviera a rastrear.

**Qué significa:** el estado no describe la página, describe la última vez que Google la
miró. Por eso fallaban todas las hipótesis sobre la página. La pregunta deja de ser «por
qué Google rechaza estas páginas» y pasa a ser **«por qué tarda meses en volver»**.

**Caveat, y es importante:** Google elige qué vuelve a rastrear. Las 13 pueden ser
justamente las que ya pensaba indexar, y las otras 20 las que no. Con estos datos no se
distingue. Para eso está el experimento de abajo.

**Impacto en la tasa:** recalculada con las lecturas de hoy (73 no indexadas releídas, 14
indexadas ya; 92 indexadas releídas, 90 siguen), la muestra acumulada pasaría del 76,7 % al
**~79,5 %**. Está dentro del IC de siempre (71,7-81,0 %, n = 313): **no declaro un cambio**,
pero los flujos son asimétricos (≈ 19 % de entrada frente a ≈ 2 % de salida en dos meses).

### 4. A los 180 días, la API olvida el rastreo

Las 20 que perdieron el estado «Rastreada» no han vuelto a «Descubierta» por azar. Sobre
las 45 URLs del panel con un rastreo conocido y sin rastreo nuevo:

| | URLs | Días desde el último rastreo |
| --- | --- | --- |
| Perdieron el rastreo (ahora «Descubierta» o «no reconoce», sin fecha) | 21 | **181,0 – 257,2** |
| Lo conservan (siguen «Rastreada») | 24 | **65,0 – 179,8** |

Corte limpio en 180 días, sin una sola excepción. Releídas dos veces más con minutos de
diferencia, las 20 siguen sin fecha de rastreo (solo alternan entre «Descubierta» y «no
reconoce», el ruido ya conocido). No he encontrado que Google documente este plazo: es
medido, no citado.

**Corrige el informe del 04-oct:** «“No reconoce” y “Descubierta” son URLs que Google
conoce por enlaces y no ha rastreado nunca». No siempre: una parte se rastreó hace más de
seis meses y la API ha olvidado ese rastreo. Lo de que no hay que pedir indexación de esas
URLs *por estar en ese estado* sigue valiendo.

**Predicción falsable para el 25-oct:** las dos URLs del grupo de control rastreadas el
21-abr (`viaje-sin-vuelta`, `software-empresarial-soporte-y-mantenimiento`) pasan a
«Descubierta» o «no reconoce» sin fecha de rastreo, salvo que Google las rastree antes.
Las de mayo siguen como están hasta el 3-nov. Si las del 21-abr siguen como «Rastreada» el
25-oct, el plazo de 180 días era una coincidencia.

---

## Infraestructura: panel de estados con control y experimento

`scripts/gsc-state-panel.mjs` (`npm run seo:gsc:panel`, encadenado a `seo:gsc:indexation`)
**sustituye** a `gsc-unknown-panel.mjs`, que solo seguía las «no reconoce». Su historia
pasa entera a `data/gsc-state-panel.json`.

- **Tres cohortes fijas, 141 URLs:** `sin-rastrear` (31), `rastreada-sin-indexar` (70) y un
  `control` de 40 indexadas al azar con semilla fija, que mide el flujo inverso. Se
  alimentan solas de los informes de la muestra y solo admiten URLs del sitemap vivo.
- Cada URL entra con su última observación de la muestra, así que la primera lectura ya
  dice si ha cambiado. Cada ejecución lista **qué URLs se han vuelto a rastrear** y con qué
  resultado, y el flujo acumulado por cohorte.
- **Experimentos:** un bloque `experiments` en el JSON registra grupos con y sin
  intervención, y cada ejecución imprime cómo va cada uno.
- Coste: 141 llamadas a la semana de un cupo de 2000 al día.

### Experimento registrado: ¿basta con pedir que vuelva?

Las 20 URLs que hoy siguen «Rastreada: actualmente sin indexar» sin re-rastreo, repartidas
al azar (semilla 20261018):

**Tratamiento — Alfonso pide «Solicitar indexación» en Search Console** (Inspección de URLs
→ pegar la URL → *Solicitar indexación*; unos 5 minutos):

1. https://crearsoftware.com/2007/05/25/la-sgae-y-su-canon/
2. https://crearsoftware.com/2008/02/14/conceptos-contables/
3. https://crearsoftware.com/2008/09/02/la-mejores-presentaciones-del-mundo/
4. https://crearsoftware.com/2008/10/02/%C2%BFpor-que-velneo-no-apoya-en-proyectos-finales/
5. https://crearsoftware.com/2009/01/07/%C2%BFcomo-gestionar-tu-dinero/
6. https://crearsoftware.com/2009/03/17/%C2%BFque-es-surchur/
7. https://crearsoftware.com/2009/03/18/10-predicciones-para-el-2009-idc-saas-paas/
8. https://crearsoftware.com/2010/05/17/%C2%BFcuales-son-las-previsiones-economicas-del-mundo/
9. https://crearsoftware.com/2011/08/30/bienvenido-a-la-realidad/
10. https://crearsoftware.com/2013/11/20/desarrollo-de-aplicaciones-empresariales/

**Control — no se toca:** `171`, `teletrabajo`, `qt-anade-la-licencia-lgpl`,
`¿como-licencio-mi-software`, `¿que-papel-juega-la-cultura-en-la-organizacion`,
`viaje-sin-vuelta`, `el-software-la-persistencia-y-la-venta`,
`software-empresarial-soporte-y-mantenimiento`, `modelos-o3-de-openai…`,
`reflexiones-sobre-la-evolucion-de-openai-hacia-la-agi`.

**Predicción (registrada antes de intervenir):** si la causa es que Google no vuelve, antes
del **08-nov** el tratamiento llega a **7 o más indexadas de 10** y el control se queda en
**2 o menos**. Si el tratamiento se queda en **3 o menos**, re-rastrear no basta y las 21 de
22 eran las que Google ya pensaba indexar.

**Por qué merece la pena:** si se cumple, hay una palanca directa para las ~170 URLs con
contenido que siguen fuera del índice, a 10 al día. Y lo que no está en el índice de Google
no puede salir citado en un AI Overview, que es donde se cita la definición de
*input/output*.

---

## Agentes en vivo

Una sola jornada nueva desde ayer (17-oct): 6 peticiones, **2 a la home y 4 a contenido**.
Semana 11-17 oct en contenido: 7, 5, 8, 7, 5, 6, 4 → **42 en 7 días (6,0/día)**, frente a
4,5/día en las tres semanas anteriores. La home sigue bajando: 7, 12, 5, 6, **1, 3, 2**.
Descrito, sin test (φ > 3).

**Por qué ChatGPT-User pide la home (punto abierto del 11-oct):** en los 7 días que
retiene el borde, sus 35 peticiones verificadas a `/` llegan desde **32 IPs distintas** (28
prefijos /24), nunca más de 2 desde la misma, y repartidas por 21 de las 24 horas del día.
Una tarea programada de una persona saldría a la misma hora cada día; esto se parece más a
muchos usuarios distintos. **No es concluyente:** OpenAI sale a internet por un conjunto de
IPs que rota, así que la IP no identifica al usuario. Lo dejo aquí; no hay más que sacar de
estos datos.

**Markdown en agentes en vivo:** 0 de 375 en 28 días del borde (IC 95 % superior ≈ 0,8 %).
Faltan unas 125 para el umbral de ~500.

---

## Métricas semanales

**Indexación (muestra rotativa):** n = 25, `errorCount` = 0, 20 indexadas, **80,0 %** (IC
60,9-91,1 %). Acumulado desde el 17-ago, última observación de cada URL: **240 de 313 =
76,7 %** (IC 71,7-81,0 %). Cobertura: **440 de 716** URLs, 12 ejecuciones.

**Bing:** 62 clics y 6.452 impresiones en la ventana del panel (74 días). Sitemap leído el
15-oct, 715 URLs. La consulta «que es algoritmo» tuvo 105 impresiones en posición 4 el
16-oct; es un dato suelto.

**IndexNow:** 19 URLs modificadas desde el 11-oct, HTTP 200, después del despliegue
(incluye el artículo de hoy).

**IA generativa de Google:** sin exportación en `data/gsc-ai/`.

**Audit:** build limpio, 863 páginas HTML. Mismos avisos heredados de WordPress (273
imágenes enlazadas en 174 posts antiguos, 2 shortcodes de vídeo, 13 enlaces al dominio
viejo).

---

## Publicado hoy

**Artículo: [Qué es una estructura condicional en programación: simple, doble y múltiple](https://crearsoftware.com/blog/que-es-una-estructura-condicional/)**
— definición, la condición y sus operadores (comparación, Y/O/NO, leyes de De Morgan), los
tres tipos con pseudocódigo (SI, SI-SINO, SEGÚN y SI encadenados), el ejemplo de la nota y
la calificación con la escala del Real Decreto 1125/2003, el año bisiesto anidado y como
condición compuesta, la misma condicional en pseudocódigo, Python y JavaScript (con el
`match` de Python 3.10 y el `switch` que sigue de largo), seis errores frecuentes y la
evaluación en cortocircuito. Seis preguntas frecuentes con FAQPage.

Es la sexta pieza de la serie algoritmo → diagrama de flujo → pseudocódigo → variable →
bucle: la segunda de las tres estructuras de Böhm-Jacopini, que el bucle y el pseudocódigo
nombraban sin enlazar. Enlazado desde esas dos filas de «Selección» y desde las preguntas
frecuentes del algoritmo, que también enlaza ahora el bucle. Verificado en producción: HTML
200, FAQPage, gemelo `.md` 200, sitemap, `llms.txt` y glosario.

Despliegue `ff42003`: Actions en verde, healthcheck 6/6, contenido comprobado contra el HTML
real.

---

## Correcciones

- **Punto abierto 1 del encargo:** «Rastreada: actualmente sin indexar» deja de ser «sin
  explicación». No es una propiedad de la página sino del tiempo desde el último rastreo
  (con el caveat de selección de arriba).
- **Duplicación semántica:** descartada también sobre el texto completo, no solo sobre el
  slug.
- **Informe del 04-oct:** «no reconoce» y «Descubierta» no son siempre URLs nunca
  rastreadas; una parte son rastreos de hace más de 180 días que la API ha olvidado.

---

## Estado de las comprobaciones bloqueantes

| # | Comprobación | Estado |
| --- | --- | --- |
| 1 | Token de GSC | ✅ vivo |
| 2 | Rastreadores de IA | ✅ 200 en `/robots.txt` con ChatGPT-User |
| 3 | Cuota de KV | ✅ sin riesgo (5.804 peticiones en 28 días) |
| 4 | Despliegue en producción | ✅ healthcheck 6/6 antes y después; despliegue de hoy verificado contra el HTML real |

---

## Abierto

1. **Experimento de «Solicitar indexación»:** pendiente de que Alfonso lo lance. Se lee solo
   cada semana en la salida de `seo:gsc:indexation`; se evalúa el 08-nov.
2. **Plazo de 180 días:** se confirma o se cae el 25-oct (predicción arriba).
3. **Por qué Google tarda meses en volver** a las páginas sin indexar: es la pregunta nueva.
4. **Markdown en agentes en vivo:** 0 de 375; seguir hasta ~500.
5. **Pendiente de Alfonso:** exportar los CSV de «AI Performance» de Bing a
   `data/bing-ai-performance/` — **la última es del 19-ago; lo más antiguo de septiembre
   puede estar saliendo ya de la ventana del panel** — y el ZIP de «IA generativa» de Search
   Console a `data/gsc-ai/`. Rellenar el LinkedIn del autor si se quiere en `sameAs`. Borrar
   el token de Cloudflare expuesto.
