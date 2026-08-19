# Bing AI Performance — archivo manual

**Por qué existe esta carpeta:** «AI Performance» de Bing Webmaster Tools está en beta y
**no tiene endpoint público**, así que `npm run seo:bing` no lo trae. Es la única fuente con
números sobre citación generativa a la que este sitio tiene acceso: Google no la expone
(`searchAppearance` devuelve 0 filas, verificado el 03-ago-2026) y el contador de agentes
tampoco la ve, porque tanto el AI Overview de Google como Copilot generan la respuesta desde
sus propios índices sin pedirle nada a nuestro servidor.

**La ventana del panel es limitada.** Si no se archiva el CSV, el dato se pierde. Por eso se
exporta a mano y se versiona aquí: es la única forma de construir serie histórica.

## Cómo actualizar

1. bing.com/webmasters → propiedad crearsoftware.com → **AI Performance**.
2. Exportar los dos CSV: *Overview stats* y *Search queries report*.
3. Guardarlos aquí como `overview-<fecha>.csv` y `queries-<fecha>.csv`.
4. macOS bloquea la lectura de `~/Downloads`, `~/Desktop` y `~/Documents` por TCC: hay que
   mover los ficheros al repo antes de que un agente pueda leerlos.

## Formato

- `overview-*.csv`: `Date, Citations, Cited Pages` — una fila por día.
- `queries-*.csv`: `Grounding Query, Intent, Topic, Citations, Citation Share` — solo las
  consultas principales, no el total. En la exportación del 19-ago las 4 listadas sumaban 88
  de 184 citas (48%).
