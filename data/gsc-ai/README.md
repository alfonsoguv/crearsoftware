# Search Console — «Funciones de IA generativa», archivo manual

**Por qué existe esta carpeta:** Search Console tiene desde el 3-jun-2026 (para todos los
sitios desde el 31-ago-2026, aún en beta) el informe **Rendimiento → IA generativa**, con las
impresiones del sitio en **AI Overviews y el modo IA**. Es el único dato de Google sobre la
presencia del sitio en sus respuestas de IA. Pero **la API no lo expone** (verificado el
11-oct-2026: `type` = generativeAi / aiOverview / aiMode da «Invalid value» y
`searchAppearance` devuelve 0 filas), así que hay que exportarlo a mano y archivarlo aquí.
Sin archivar, el panel solo enseña la ventana que permita.

## Cómo exportar (una vez al mes)

1. search.google.com/search-console → propiedad **crearsoftware.com** → Rendimiento →
   **IA generativa**.
2. Fecha: **3 meses**. Tipo de búsqueda: **Web**. Agrupación del gráfico: **Cada día**
   (con «Cada semana» el script tiene que suponer en qué día empieza la semana).
3. **EXPORTAR → Descargar CSV.** Baja un ZIP con una tabla por pestaña.
4. Deja el ZIP (o los CSV sueltos) en esta carpeta. macOS no deja que un agente lea
   `~/Downloads`, así que hay que moverlo aquí a mano.
5. `npm run seo:gsc:ai`. El script descomprime o mueve los ficheros a `<fecha>/`, y escribe
   `data/gsc-ai-report-<fecha>.md` y `data/gsc-ai-report-latest.md`.

## Qué saca el script

- La serie de impresiones en IA junto a las impresiones **Web** de los mismos días (estas
  sí salen de la API), y el **% de la Web que Google enseña dentro de una respuesta de IA**.
- Por página: impresiones en IA, impresiones y clics Web, y peticiones de agentes en vivo a
  esa página (contador de borde).
- Las citas de Bing de la misma ventana, si `data/bing-ai-performance/` tiene datos que se
  solapen.

## Lo que el informe no da

Clics, CTR, posición y consultas. Una impresión es que un enlace al sitio aparezca en un AI
Overview o en el modo IA. Esas impresiones **ya están contadas dentro de «Web»**: el % es una
parte de la Web, no algo que se le suma.

## Otros sitios

El script vale para cualquier propiedad que vea la credencial. Para deepdna:

```
npm run seo:gsc:ai -- --dir=../deepdna/data/gsc-ai --site=https://deepdna.ai/
```

## Formato

El formato del CSV no está documentado. El script reconoce cada tabla por la cabecera de la
primera columna, en español o en inglés (Fecha/Date, Páginas/Pages, País/Country,
Dispositivo/Device, Filtro/Filter), y lee la columna de impresiones. «~» y «-» cuentan como
0, que es como los exporta Google. Si una tabla no se reconoce, el informe la lista en vez de
ignorarla. **La primera exportación real hay que revisarla a mano**, porque el script solo se
ha probado con ficheros sintéticos.
