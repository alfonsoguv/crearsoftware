# Informe semanal SEO/GEO — 24 de octubre de 2026

Ejecución programada. Cuarta semana de mes: no toca leer clics (última lectura el 04-oct,
hace tres semanas; la excepción de las cuatro semanas salta el 01-nov, que además es
primera semana de mes).

---

## El hallazgo: el plazo de 180 días se cumple fuera de muestra

El 18-oct se registró una predicción falsable: las dos URLs del grupo de control
rastreadas el 21-abr (`viaje-sin-vuelta` y `software-empresarial-soporte-y-mantenimiento`)
pasarían a «Descubierta» o «no reconoce», **sin fecha de rastreo**, al cruzar los 180 días
sin que Google volviera. Lectura de hoy, un día antes de la fecha prevista:

| URL | Días desde el último rastreo | Estado hoy |
| --- | --- | --- |
| `viaje-sin-vuelta` | 185,8 | Google no reconoce esta URL |
| `software-empresarial-soporte-y-mantenimiento` | 185,8 | Descubierta |

**Se cumple.** Y no son las únicas: esta semana han cruzado el umbral cinco URLs del panel
que el 18-oct aún conservaban la fecha (rastreos del 21 al 25-abr), y las cinco la han
perdido:

| URL | Días | Estado anterior → hoy |
| --- | --- | --- |
| `obama` | 181,7 | Rastreada → no reconoce |
| `la-mejores-presentaciones-del-mundo` | 182,9 | Rastreada → Descubierta |
| `software-empresarial-soporte-y-mantenimiento` | 185,8 | Rastreada → Descubierta |
| `¿cuales-son-las-previsiones-economicas-del-mundo` | 185,8 | Rastreada → no reconoce |
| `viaje-sin-vuelta` | 185,8 | Rastreada → no reconoce |

Sobre las 110 URLs del panel con un rastreo conocido y sin rastreo nuevo: **las 25 que
han perdido la fecha están entre 181,7 y 263,2 días; las 85 que la conservan, entre 7,8 y
170,2.** Ninguna excepción, ahora con cinco casos que no se usaron para fijar el corte. El borde
encaja también por el otro lado: `google-telefonica-rim-y-velneo`, rastreada el 20-abr, ya
había perdido la fecha el 18-oct (181 días), mientras las del 21-abr (180 días) la
conservaban.

Lo que sigue sin saberse es si el corte es exactamente 180 días o algo entre 170 y 182:
el hueco entre la mayor que conserva (170,2) y la menor que pierde (181,7) es de 11 días.
**Siguiente predicción:** `171` y `el-85-del-software-empresarial…` (170,2 días hoy) y
`conceptos-contables` (168,8) pierden la fecha de rastreo entre el 03-nov y el 05-nov si
Google no vuelve antes. Si alguna la conserva el 07-nov sin re-rastreo, el plazo no es fijo.

**Por qué importa:** confirma que «Descubierta» y «no reconoce» mezclan dos poblaciones
—URLs nunca rastreadas y URLs rastreadas hace más de seis meses— y que la API no permite
distinguirlas salvo que el panel haya visto la fecha antes. El panel las sigue por URL,
así que no se pierde.

### El experimento de «Solicitar indexación» no parece haber arrancado

| | URLs | Indexadas | Re-rastreadas desde el 18-oct |
| --- | --- | --- | --- |
| Tratamiento | 10 | 0 | **0** |
| Control | 10 | 0 | 0 |

Dos de las diez del tratamiento (`la-mejores-presentaciones-del-mundo` y
`¿cuales-son-las-previsiones-economicas…`) acaban de perder la fecha de rastreo por
antigüedad. Si se hubiera pedido la indexación, Google suele pasar en días; que ninguna
se haya rastreado en seis días sugiere que **la solicitud no se ha hecho**. No lo afirmo:
también puede que Google haya ignorado las solicitudes. **Alfonso: si no lo has lanzado,
la lista de diez URLs está en el informe del 18-oct;** el plazo de evaluación (08-nov) se
puede mover si empieza más tarde.

### Flujo inverso

Control: **39 de 40** siguen indexadas (la que no, `los-mejores-del-2007`, es la misma del
18-oct). Fuera del control, `¿tienes-miedo-a-perder` ha pasado de indexada a «Rastreada:
actualmente sin indexar» **sin un rastreo nuevo**. Es el segundo caso de salida sin visita;
dos casos no son patrón.

---

## Agentes en vivo: semana floja

Familia «agentes en vivo» (ChatGPT-User, Claude-User, Perplexity-User), serie diaria:

| | 18 | 19 | 20 | 21 | 22 | 23 oct |
| --- | --- | --- | --- | --- | --- | --- |
| Total vivo | 5 | 10 | 9 | 7 | 3 | 3 |
| Contenido (sin la home) | 2 | 3 | 6 | 5 | 1 | 2 |

Contenido: **19 en 6 días (3,2/día)**, frente a 6,0/día la semana 11-17 oct y 4,5/día en las
tres anteriores. El 22 y el 23 son los dos días con menos peticiones en vivo de toda la serie
de 34 días. El total de agentes (106 y 183 esos días) es normal, así que **no es el contador
roto**. Descrito, sin test: con φ > 3 una semana baja no se distingue de una racha, y la
semana anterior fue la más alta. Si la semana que viene sigue por debajo de 3/día en
contenido, ya serían dos semanas y merecería mirar si cambió algo en ChatGPT.

Perplexity-User sigue en **0** en los 34 días.

---

## Métricas semanales

**Indexación (muestra rotativa):** n = 25, `errorCount` = 0, 17 indexadas, **68,0 %** (IC
48,4-82,8 %). Es la más baja desde el 02-ago, pero su IC contiene el acumulado. Acumulado
desde el 17-ago, última observación de cada URL: **247 de 325 = 76,0 %** (IC 71,1-80,3 %).
Sin cambio. Cobertura: **447 de 717** URLs, 13 ejecuciones. De las 8 no indexadas de hoy, 7
son «no reconoce» o «Descubierta»: es el efecto de los 180 días de arriba, no una caída.

**Bing:** 70 clics y 7.328 impresiones en la ventana del panel (79 días). Sitemap leído el
22-oct, 717 URLs. «que es algoritmo» sigue siendo la consulta con más impresiones (105 en
posición 4 la semana del 16-oct).

**IndexNow:** enviado después del despliegue, HTTP 200 (incluye el artículo de hoy y las
seis piezas de la serie, que cambian de HTML).

**IA generativa de Google:** sin exportación en `data/gsc-ai/`.

**Audit:** build limpio, 864 páginas HTML. Mismos avisos heredados de WordPress.

---

## Publicado hoy

**Artículo: [Qué es una función en programación: parámetros, argumentos y valor de retorno](https://crearsoftware.com/blog/que-es-una-funcion-en-programacion/)**
— definición (con el origen en las subrutinas de Wheeler para el EDSAC, 1952), para qué
sirve (DRY), partes de una función con un ejemplo de IVA al 21 % (art. 90 de la Ley
37/1992), parámetro frente a argumento, función frente a procedimiento, ámbito local,
funciones puras, paso por valor y por referencia (y lo que hacen Python y JavaScript), el
año bisiesto convertido en función, tabla en tres lenguajes, recursividad con el factorial,
seis errores frecuentes y la conexión con el *function calling* de los modelos de IA. Seis
preguntas frecuentes con FAQPage. Enlazado desde la variable (ámbito local) y el bucle
(recursividad).

## Infraestructura: series declaradas para agentes

Las seis definiciones anteriores solo se enlazaban entre sí en la prosa de la
introducción. Un agente en vivo que llega a una de ellas —el que genera la cita— no sabía
que había más ni en qué orden van. Ahora `build-blog.js` admite `series` y `seriesOrder`
en el frontmatter, y una serie se declara en cuatro sitios:

- **HTML:** índice numerado al final de cada pieza, con la actual marcada
  (`aria-current="page"`) y enlace a la siguiente.
- **JSON-LD:** `isPartOf` → `CreativeWorkSeries` con `@id` común, y `position`.
- **Gemelo `.md`:** el mismo índice con URLs absolutas, para los rastreadores de corpus.
- **`llms.txt`:** sección propia «Serie: Fundamentos de programación», en orden, justo
  después del glosario.

Serie «Fundamentos de programación»: algoritmo → diagrama de flujo → pseudocódigo →
variable → bucle → condicional → función (7). Añadir una pieza nueva es poner dos líneas en
su frontmatter.

Despliegue `dec428d`: Actions en verde, healthcheck 6/6, y verificado contra producción:
artículo y gemelo `.md` 200, índice de serie en el HTML del algoritmo, sección en
`llms.txt`.

---

## Correcciones

- **Ninguna esta semana.** La predicción de los 180 días, que podía tumbar el hallazgo
  del 18-oct, se ha cumplido.

---

## Estado de las comprobaciones bloqueantes

| # | Comprobación | Estado |
| --- | --- | --- |
| 1 | Token de GSC | ✅ vivo (refresh OK, scope `webmasters.readonly`) |
| 2 | Rastreadores de IA | ✅ 200 en `/robots.txt` con ChatGPT-User |
| 3 | Cuota de KV | ✅ sin riesgo (6.582 peticiones en 28 días) |
| 4 | Despliegue en producción | ✅ healthcheck 6/6 antes y después; contenido verificado contra el HTML real |

---

## Abierto

1. **Experimento de «Solicitar indexación»:** no parece haber arrancado (0 re-rastreos en
   el tratamiento). Pendiente de Alfonso.
2. **Plazo de 180 días:** confirmado fuera de muestra; siguiente comprobación del borde
   entre el 03-nov y el 07-nov.
3. **Agentes en vivo:** semana baja (3,2/día en contenido). Vigilar si se repite.
4. **Markdown en agentes en vivo:** seguir hasta ~500 peticiones.
5. **Primera semana de noviembre (01-nov):** toca `seo:gsc` y `seo:gsc:analysis`, con el
   **total de octubre** frente a octubre de 2025 (es la comparación que decide el ×2,5 sin
   explicar del informe del 26-sep).
6. **Pendiente de Alfonso:** exportar los CSV de «AI Performance» de Bing a
   `data/bing-ai-performance/` — **la última es del 19-ago, hace más de dos meses: lo de
   agosto y septiembre puede haber salido ya de la ventana del panel** — y el ZIP de «IA
   generativa» de Search Console a `data/gsc-ai/` (no hay ninguna todavía). Borrar el token
   de Cloudflare expuesto.
