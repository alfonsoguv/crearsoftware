# Revisión SEO/GEO semanal — crearsoftware.com

**Fecha:** 2026-08-02
**Ejecución:** investigación de la contracción de superficie indexada + reparación del muestreo de indexación + palanca GEO nueva (gemelos Markdown) + artículo
**Veredicto:** el hallazgo abierto nº1 queda **explicado, y era menos grave de lo que parecía**. A cambio aparece un dato peor: la tasa de indexación real del sitio es del 60%, no del 84%.

---

## 0. Corrección al informe del 01-ago

### 0.1 La contracción de superficie del −37% estaba medio explicada por decisiones propias

El informe anterior la presentaba como «la señal negativa más sólida sin explicar». Se ha desglosado URL a URL. Ventanas de 28 días, filas ancla excluidas:

| Ventana | URLs con ≥1 impresión |
|---|---|
| abr-2026 (03-abr → 30-abr) | 427 |
| may-2026 | 391 |
| jun-2026 | 335 |
| jul-2026 (03-jul → 30-jul) | 272 |

De abril a julio se pierden **197 URLs** y se ganan 42. Contabilidad de esas 197:

| Causa | URLs | % |
|---|---|---|
| Taxonomías retiradas del sitio (35 `/tag/`, 2 `/category/`, 1 `/page/`) | 38 | 19% |
| Posts marcados `noindex` deliberadamente | 32 | 16% |
| Ya no son páginas: adjuntos de WordPress (PDF, JPG), `/autor/`, y variantes de slug sin «¿» que hoy responden 301 | 17 | 9% |
| **Siguen publicadas e indexables** | **110** | **56%** |

**El 44% de la contracción es limpieza propia o renombrado, no castigo algorítmico.**

De las 110 que siguen en el sitemap se inspeccionaron 18 con la API de URL Inspection: 11 indexadas, 7 «Rastreada: actualmente sin indexar». Es decir **39% no indexadas (IC 95%: 20-61%)**, que extrapolado da **22-68 URLs** de pérdida real de índice. Punto estimado: ~43.

**Conclusión corregida:** la pérdida algorítmica real es de unas 43 URLs, un 10% de la superficie de abril, no el 37% del titular. Sigue siendo una pérdida y sigue sin ser estacional, pero no es la emergencia que sugería el informe anterior.

**Matiz sobre el control de 2025 que se usó como prueba:** abr-25 → jul-25 fue 510 → 514 (plano), frente a 427 → 272 en 2026. El contraste es real, pero compara un año sin migración contra uno con retirada de taxonomías y `noindex` masivo. Como prueba de «no es estacional» vale menos de lo que parecía.

### 0.2 Prueba de que la desindexación existe (y es fuerte donde ocurre)

Muestra sistemática de 25 URLs perdidas frente a 15 retenidas, todas inspeccionadas contra la API:

| | Indexadas | No indexadas |
|---|---|---|
| Perdidas (n=25) | 11 | 14 |
| Retenidas (n=15) | 15 | 0 |

Fisher bilateral **p = 3,3 × 10⁻⁴**. La diferencia no es ruido: entre las retenidas la indexación es del 100%.

### 0.3 Dos hipótesis probadas y **descartadas**

Se anotan porque ahorran trabajo futuro:

- **Longitud del texto.** Indexadas: mediana 434 palabras. No indexadas: 322. Diferencia pequeña, muestras de 14 y 10. **No discrimina.** «Son posts finos, alárgalos» no está respaldado por los datos.
- **Enlaces internos entrantes.** Un primer cálculo daba 27% de huérfanas entre las perdidas frente a 3% entre las retenidas — resultó ser un artefacto: contaba como «sin enlaces» las URLs que ya no existen en el sitio. Restringido a URLs que siguen en el sitemap: mediana 5 enlaces en las perdidas y 4 en las retenidas, y el 20% de las perdidas tiene ≤2 enlaces frente al 25% de las retenidas. **Va al revés. Descartada.**

---

## 1. Hallazgo nuevo: la indexación real del sitio es del 60%

`gsc-indexation-audit.mjs` inspeccionaba siempre **las 25 primeras URLs del sitemap**, así que su «21/25 = 84% indexadas» describía esas 25 URLs, no las 693.

**Reparado hoy.** El muestreo es ahora sistemático con arranque rotativo: paso k = N/limit sobre todo el sitemap, y el arranque avanza en cada ejecución (`data/gsc-indexation-cursor.json`). Cada informe suelto ya es representativo del conjunto, y la unión de informes sucesivos cubre el sitemap sin repetir. El informe publica además el intervalo de Wilson, porque con n=25 sobre 693 el margen ronda los ±16 puntos.

Primera medición representativa:

- **15 de 25 indexadas → 60,0% (IC 95%: 40,7% - 76,6%)**
- Extrapolado a 693 URLs: **282-531 indexadas**
- Causa dominante: «Rastreada: actualmente sin indexar», 8 de las 10 no indexadas

Es peor que el 84% que se venía asumiendo, y es un dato que ahora sí significa algo. La siguiente ejecución arranca en la posición 25 y ampliará la cobertura acumulada.

---

## 2. Tráfico: sin novedad, como estaba previsto

Ventana consolidada 03-jul → 30-jul: **67 clics, 24.092 impresiones, CTR 0,28%, posición 15,72**.

Frente a los 65 clics del informe anterior (02-jul → 29-jul). A ~15 clics/semana esto es exactamente el ruido que se dijo que era. **No se actúa sobre ello.**

Sigue en pie la predicción falsable: si la caída era de curso académico, la ventana **27-ago → 23-sep debe dar 90-98 clics**. Se comprueba el 26 de septiembre.

---

## 3. Palanca GEO nueva: gemelo Markdown de cada página

`llms.txt` indexa el sitio y `llms-full.txt` sirve el corpus curado en un fichero de varios MB. Faltaba el caso más frecuente: un agente que llega a **una** URL concreta y no va a descargar el corpus entero para leerla.

Implementado hoy: **686 gemelos Markdown**, dos rutas por página porque no hay convención única —`llmstxt.org` (Jeremy Howard, 03-sep-2024) describe «la URL con `.md` añadido» y la documentación de Cloudflare sirve `/ruta/index.md`—:

```
/blog/mi-articulo/           -> HTML
/blog/mi-articulo.md         -> Markdown (forma canónica anunciada)
/blog/mi-articulo/index.md   -> Markdown (misma copia)
```

Cada fichero lleva título, descripción, URL canónica, fechas, autor y la línea de licencia de cita. Se anuncia en tres sitios: `<link rel="alternate" type="text/markdown">` en cada página, cabecera de `llms.txt` y comentario en `robots.txt`.

Servidos con `Content-Type: text/markdown` y **`X-Robots-Tag: noindex`**: duplican el HTML y no deben competir con la página canónica. Los agentes en vivo (ChatGPT-User, Claude-User, Perplexity-User), que son los que generan la cita, no aplican esa cabecera.

El middleware cuenta ahora también las peticiones a `.md`, así que en 3-4 semanas habrá dato sobre si algún agente los usa. **No hay evidencia pública de que servir Markdown aumente las citas.** Es un experimento barato y reversible, y así está descrito en el artículo.

### Fallo de arquitectura encontrado de paso y corregido

Las **5 guías pilar y `/sobre/` tenían cero enlaces internos entrantes**: solo se llegaba a ellas desde el sitemap. Es el contenido mejor preparado del sitio para ser citado y estaba fuera del alcance de cualquier rastreador que empiece por la raíz. Añadida una sección «Guías» en la home. Ahora **ninguna URL del sitemap tiene 0 enlaces entrantes**.

---

## 4. Rastreadores de IA: primer dato tras el desbloqueo

Contador desde el 01-ago, consultado el 02-ago a las 09:44 UTC. Línea base del informe anterior: 29 peticiones en las primeras horas, 14 agentes.

**463 peticiones.** Por familia:

| Familia | Peticiones |
|---|---|
| Búsqueda generativa | 374 |
| Buscador clásico | 53 |
| Entrenamiento | 23 |
| **Agentes en vivo** | **12** |

PerplexityBot aporta 333 de las 374, y el reparto por día es revelador: **1 petición el 01-ago y 332 el 02-ago**. Es un barrido completo del archivo en cuanto detectó que el sitio dejaba de devolver 403.

Los agentes en vivo —la métrica que importa— suman 12: ChatGPT-User 8, Claude-User 3, Perplexity-User 1. **Es un punto de partida pequeño y es el número a vigilar.** Con estos volúmenes, cualquier lectura semana a semana será ruido; el dato útil llegará a las 3-4 semanas.

Las páginas más leídas por agentes incluyen `/llms.txt` (4 peticiones), lo que confirma que el índice se está usando.

---

## 5. Artículo de la semana

**[Servir Markdown a los agentes de IA: la versión .md de cada página](/blog/servir-markdown-agentes-ia-md-por-url/)** — ~2.200 palabras, 7 secciones, FAQ de 7 preguntas.

Documenta la palanca implementada hoy: convenciones de URL, generación en un sitio estático, cabeceras, y cómo instrumentar el conteo de agentes en servidor (las analíticas de cliente no ven un solo rastreador). Incluye la advertencia explícita de que no hay evidencia publicada de que esto aumente las citas, y los datos propios del contador como referencia real.

Verificado antes de publicar: la especificación de `llms.txt` y su autoría contra la fuente; que `docs.claude.com`, `developers.cloudflare.com` y `llmstxt.org` sirven hoy `.md` con `Content-Type: text/markdown` (comprobado con `curl`); y que las cifras del contador coinciden con `data/geo-agents-2026-08-02.md`. Los 7 enlaces internos resuelven. El sitio pasa a **35 artículos con `FAQPage`**.

---

## 6. Salud del build

`npm run audit`: 404 en raíz y en dist OK, **0 assets heredados faltantes** de 712 referenciados, **0 páginas `noindex` en el sitemap** de 146 detectadas. La deuda heredada sigue igual: 13 enlaces al dominio antiguo, 273 imágenes rotas en Markdown en 174 ficheros.

Corregido de paso: el auditor escaneaba los gemelos `.md` de `dist/`, que son copia de `blog-posts/`, y duplicaba cada hallazgo. Ahora los excluye.

---

## 7. Pendiente

| # | Tarea | Quién |
|---|---|---|
| 1 | Publicar la app OAuth de Google Cloud. En modo *Testing* el token caduca cada 7 días; hoy funcionó, pero es cuestión de tiempo | **Alfonso** |
| 2 | Borrar el token de Cloudflare expuesto en el chat | **Alfonso** |
| 3 | **Decidir qué hacer con los 6 posts sindicados** (informe del 01-ago §2). Sigue sin decisión: no se ha tocado ninguno | **Alfonso** |
| 4 | Auditoría manual de una SERP: ¿hay AI Overview en «input y output»? 10 minutos y cierra la hipótesis interanual | **Alfonso** |
| 5 | Atacar el «Rastreada: actualmente sin indexar»: es el 80% de la no indexación y ni la longitud ni los enlaces internos lo explican. Siguiente hipótesis a probar: duplicación semántica entre posts antiguos del mismo tema | Automatizable |
| 6 | Seguir rotando `seo:gsc:indexation` cada semana hasta cubrir el sitemap y estrechar el IC | Automatizable |
| 7 | Contrastar la predicción estacional el 26-sep (90-98 clics) | Automatizable |
| 8 | Medir a 3-4 semanas si algún agente pide los `.md` y la tendencia de «agentes en vivo» sobre la base de 12 | Automatizable |
| 9 | `sameAs` con perfiles verificables en el JSON-LD del autor; auditoría de prompts (¿nos citan?) | Automatizable |
