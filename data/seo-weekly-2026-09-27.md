# Informe semanal SEO/GEO — 27 de septiembre de 2026

Ejecución programada. La anterior fue ayer (26-sep, manual), así que este ciclo no repite
su análisis: se centra en lo que ayer quedó sin resolver —los seis días perdidos del
contador de agentes— y en el siguiente artículo de la serie de conceptos básicos.

---

## El hallazgo: los seis días perdidos se pueden recuperar del borde, y los dos contadores coinciden

Ayer se dieron por **irrecuperables** los seis días (20-sep 20:33 → 26-sep 13:05) en que
`/api/bots` estuvo caído por el binding de KV borrado. **Era falso.** Cloudflare guarda
8 días de peticiones en su API GraphQL (`httpRequestsAdaptiveGroups`), con user-agent,
ruta y código de respuesta. Hoy, 27-sep, la ventana cubre desde el 20-sep: justo a tiempo.
Un día más y se habría perdido el 20.

**Nuevo script: `scripts/geo-agents-edge.mjs`** (y `npm run geo:agents:edge`). Aplica
exactamente los criterios del middleware —mismo orden de patrones de user-agent, solo
200/304, solo páginas HTML, `.md` y `llms.txt`— y **acumula** en
`data/geo-agents-edge-history.json` (versionado), porque la API solo retiene 8 días.
Queda encadenado a `npm run geo:agents`, así que corre cada semana sin cambiar el ciclo.

Es el primer paso real del **issue #35**, que pedía correr los dos contadores en paralelo
2-3 semanas antes de retirar el de KV.

### Calibración (las dos únicas ventanas solapadas)

| Ventana | KV | Borde | ChatGPT-User KV / borde | Claude-User KV / borde |
| --- | --- | --- | --- | --- |
| 26-sep 13:05 → 23:59 | 75 | 84 | 8 / 8 | 1 / 1 |
| 27-sep 00:00 → 09:40 | 55 | 59 | 8 / 8 | — |

- **Los agentes en vivo coinciden exactamente.** Es la familia del encargo, así que la
  serie de KV y la del borde son empalmables sin corrección.
- **En el total, el borde cuenta un 7-12 % más.** Viene de Amazonbot, Bingbot, GPTBot y
  Googlebot, que son los que llegan en ráfaga: encaja con el caveat conocido de KV (en
  ráfaga concurrente varias peticiones leen el mismo contador y se pierde alguna).
- Dos ventanas son poca muestra para cerrar el #35. La siguiente semana dará siete días
  completos solapados.

**Trampa encontrada al calibrar:** `userAgent_like` en el GraphQL **distingue
mayúsculas**. Meta se anuncia como `meta-externalagent` y en la primera pasada salía con
0 frente a 3 en KV. Corregido (el prefiltro va en los dos casos) y verificado: 3 = 3.

### Lo que dicen los días recuperados

Agentes en vivo por día (ChatGPT-User + Claude-User + Perplexity-User):

| 20-sep | 21 | 22 | 23 | 24 | 25 | 26 |
| --- | --- | --- | --- | --- | --- | --- |
| 9 | **27** | **29** | **31** | 17 | 11 | 13 |

Referencia: 9,0/día de media del 30-ago al 20-sep (KV, n = 22 días, φ = 1,40).

**Del 21 al 23 hubo un pico de ~3× que ayer no se podía ver**, y bajó solo en tres días.
Sin testear (la serie es sobredispersa), solo describo:

- **Casi todo es la home**: 20 peticiones a `/` cada uno de los tres días; sin la home,
  el resto va de 5 a 11/día, como siempre.
- **No parece artificial.** He mirado las 20 peticiones del 22-sep una a una: user-agent
  oficial de ChatGPT-User, repartidas a lo largo de las 24 horas, desde 19 IPs distintas
  de nueve países. No es un monitor ni un curl mío (esos van a `/robots.txt`).
- Coincide con la publicación de *servicio nativo de IA* (20-sep) y *forward deployed
  engineer* (22-sep), que aparecen en la cola de rutas pedidas por agentes en vivo. No
  hay forma de saber qué preguntaban los usuarios de ChatGPT, así que **no le atribuyo
  causa**.

Lo que sí sale del borde y no del KV: **cientos de peticiones al día con user-agent de
agente IA que no son páginas** (387-1.626/día), por ejemplo «Claude-User» pidiendo
`/sendgrid.env` o «Perplexity-User» pidiendo `/backend/.env`. Son escáneres de
vulnerabilidades con el user-agent falsificado. El filtro de 200/304 + páginas del
middleware los deja fuera, y hace bien: **sin ese filtro, la familia «agentes en vivo»
estaría inflada con ataques.** Conviene no relajarlo nunca.

---

## Resto de métricas semanales

**Contador de agentes (KV), ventana de 28 días:** 3.927 peticiones; agentes en vivo 203
(ChatGPT-User 182, Claude-User 21). Markdown en agentes en vivo: **0 de 203**. El acumulado
hacia el umbral de ~500 no suma ventanas solapadas, así que lo cuento con el borde a partir
de ahora (0 `.md` de ChatGPT-User/Claude-User en los 7 días recuperados, 137 peticiones).

**Indexación:** n = 25, **`errorCount` = 0**, tasa **76,0 %** (IC 56,6-88,5 %). Cobertura
acumulada **387 de 708** URLs, 8 ejecuciones. Sin cambio respecto al 74,6 % establecido.
Otra URL en «Google no reconoce esta URL»:
`/2007/04/10/la-importancia-de-rrhh-en-la-empresa-tecnologica/` — se suma a la de ayer
(`/2007/07/12/el-poder-de-la-comunicacion/`) como candidata a pedir indexación a mano.

**Bing:** 36 clics, 3.304 impresiones (ventana del panel). Las consultas vuelven a ser
preguntas de módulo formativo sobre input/output y algoritmo, incluida una literal sobre
el modelo *input-proceso-output*. Mismo patrón que ayer; nada nuevo que añadir.

**Audit:** build limpio, 854 páginas HTML. Siguen los avisos heredados de WordPress
(273 imágenes rotas en 174 posts antiguos, 2 shortcodes de vídeo); no son de esta semana.

---

## Publicado esta semana

**Artículo: [Qué es el pseudocódigo](https://crearsoftware.com/blog/que-es-el-pseudocodigo/)**
— definición, las tres estructuras de control (con el teorema de Böhm-Jacopini, 1966),
dos ejemplos resueltos (el mismo par/impar del diagrama de flujo, y el mayor de una lista
con el caso vacío), siete reglas, cuatro errores y la tabla pseudocódigo / diagrama /
código.

Cierra la serie algoritmo → diagrama de flujo → pseudocódigo. No había nada sobre
pseudocódigo en 838 posts, el post de diagrama de flujo ya lo mencionaba sin enlace, y es
el tipo de definición formativa por la que este sitio se cita. Enlazado desde el post de
algoritmo (cuerpo y FAQ) y desde la tabla comparativa del de diagrama de flujo.

**Infraestructura: contador de agentes desde el borde** (arriba). Recupera los seis días
perdidos, queda como segunda fuente independiente que no depende de un binding, y arranca
la comparación que pedía el #35.

---

## Estado de las comprobaciones bloqueantes

| # | Comprobación | Estado |
| --- | --- | --- |
| 1 | Token de GSC | ✅ vivo. Se cierra el **30-sep**: el martes es el día que importa |
| 2 | Rastreadores de IA | ✅ 200 en `/robots.txt` con ChatGPT-User |
| 3 | Cuota de KV | ✅ sin riesgo |
| 4 | Despliegue en producción | ✅ healthcheck 6/6 antes de empezar; despliegue de hoy verificado contra el HTML real |

---

## Abierto

1. **Issue #35:** con siete días solapados la semana que viene se puede decidir. Si los
   agentes en vivo siguen coincidiendo exactos, el contador de KV sobra para la métrica del
   encargo; el borde además da la ruta sin techo y no se rompe con un despliegue.
2. **«Rastreada: actualmente sin indexar»** sigue sin explicación. Dos URLs en «Google no
   reconoce esta URL» para pedir indexación a mano (arriba).
3. **Reconfirmar el cero de Markdown en agentes en vivo** al llegar a ~500 — ahora medible
   con el borde, sin el techo de rutas del KV.
4. **Pendiente de Alfonso:** exportar los dos CSV de «AI Performance» de Bing a
   `data/bing-ai-performance/`. La última exportación es de agosto y la ventana del panel
   es limitada: si pasa de octubre, se pierde septiembre.
