# Estado SEO/GEO — 17 de octubre de 2026 (ejecución manual)

Ciclo de medición lanzado a mano por Alfonso, un día antes de la ejecución programada. No se
publica artículo: lo hará la ejecución del domingo 18. No toca leer clics (última lectura el
04-oct).

## Comprobaciones bloqueantes

| # | Comprobación | Estado |
| --- | --- | --- |
| 1 | Token de GSC | ✅ vivo |
| 2 | Rastreadores de IA | ✅ 200 en `/robots.txt` con ChatGPT-User |
| 3 | Cuota de KV | ✅ sin riesgo (5.788 peticiones en 28 días) |
| 4 | Despliegue en producción | ✅ healthcheck 6/6; los cuatro últimos despliegues de Actions en verde |

## Agentes en vivo: sube el contenido y baja la home

Desglose del contador de borde (la columna `contenido` es la métrica del encargo desde el
11-oct):

| | 04-oct | 05 | 06 | 07 | 08 | 09 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home | 10 | 9 | 11 | 9 | 5 | 1 | 4 | 7 | 12 | 5 | 6 | 1 | 3 |
| **Contenido** | 1 | 7 | 2 | 5 | 5 | 8 | 0 | **7** | **5** | **8** | **7** | **5** | **6** |

- **Contenido, 11-16 oct: 38 peticiones en 6 días (6,3/día)**, frente a 4,5/día en los 21 días
  anteriores. Es la primera semana sin ningún día por debajo de 5.
- **Home: 34 en 6 días (5,7/día)**, frente a 9,6/día antes. Los dos últimos días, 1 y 3.
- Seis días con φ > 3 no bastan para declarar un cambio; lo describo y no lo testeo.
- Peticiones de agentes en vivo sin verificar por Cloudflare: 6 en 6 días, de una o dos al
  día; ninguna ráfaga.

**Qué páginas leen (11-16 oct):** fabricación vibe 8, notas de Patrick Collison 5, servicio
nativo de IA 5, guía de desarrollo de software moderno 3, agente de voz que atienda llamadas 3.
Las definiciones de la serie (algoritmo, diagrama, pseudocódigo, variable, bucle) suman **1**.

**Se confirma lo que apuntaba el 11-oct:** los posts sobre IA de actualidad reciben un agente en
vivo al día siguiente de publicarse (Collison, Nadella y Karpathy, los tres al día siguiente);
las definiciones no lo reciben, aunque Bing las cita y rastrea igual de rápido. El bucle,
publicado el 11-oct, lleva Bingbot, OAI-SearchBot, PerplexityBot, ClaudeBot y Googlebot, y cero
agentes en vivo. **Son dos canales con públicos distintos**: la cita de Bing y de los AI Overview
va a las definiciones (estudiantes); la visita de ChatGPT-User, a la IA de actualidad. Escribir
solo hacia uno de los dos deja el otro sin alimentar.

## Indexación: el 74,6 % se sostiene con más muestra

Juntando todas las ejecuciones del muestreo sistemático desde el 17-ago (última observación de
cada URL): **226 indexadas de 298 URLs distintas = 75,8 %** (IC 95 % 70,7-80,4 %), con 0
errores en todas las ejecuciones. Coincide con el 74,6 % del 17-ago.

- Las ejecuciones desde el 26-sep dan 81,1 % (99/122) y las de agosto 72,2 % (127/176). La
  diferencia no es significativa (p ≈ 0,08) y además está confundida con el tramo del sitemap
  que toca cada vuelta. **No hay base para decir que la indexación esté mejorando.**
- Ejecución de hoy: n=25, 20 indexadas (80,0 %, IC 60,9-91,1 %). Cobertura acumulada 429 de
  716 URLs, 11 ejecuciones.
- Panel de URLs no rastreadas (25): 9 indexadas, 7 descubiertas, 6 «no reconoce», 3 rastreadas
  sin indexar. Once cambiaron entre «no reconoce» y «Descubierta» en una semana, en los dos
  sentidos: sigue siendo ruido de la API. Ninguna pasó a indexada.

## Bing

62 clics y 6.250 impresiones en la ventana del panel (73 días). Sitemap leído, 716 URLs.
IndexNow enviado tras el último despliegue: 20 URLs, HTTP 200 (incluye Karpathy, Rieseberg e
«Inventarlo juntos»).

## IA generativa de Google

`npm run seo:gsc:ai` funciona y no encuentra exportación en `data/gsc-ai/`. Sin el CSV no hay
dato.

## Audit

Build limpio. Mismos avisos heredados de WordPress (273 imágenes rotas en 174 posts antiguos,
2 shortcodes de vídeo, 13 enlaces al dominio viejo).

## Pendiente de Alfonso

1. **Exportar «IA generativa» de Search Console** (3 meses, Web, «Cada día») y dejar el ZIP en
   `data/gsc-ai/`.
2. **Exportar «AI Performance» de Bing.** La última es del 19-ago: **lleva dos meses sin
   archivar y lo más antiguo de septiembre puede haber salido ya de la ventana del panel.**
3. Rellenar el LinkedIn del autor si se quiere en `sameAs`.
4. Borrar el token de Cloudflare que quedó expuesto en una conversación.
