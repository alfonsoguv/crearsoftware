# Revisión SEO/GEO semanal — crearsoftware.com

**Fecha:** 2026-07-31
**Rama:** `seo/geo-llms-faq-2026-07-31` (commit `b2d4528`, sin push)
**Foco de la semana:** infraestructura GEO (que los agentes de IA encuentren y citen el blog) + artículo nuevo

---

## 1. Bloqueo crítico: no hay datos GSC frescos

`npm run seo:gsc` falla con:

```
Google OAuth token refresh failed: HTTP 400 invalid_grant
```

El `GSC_REFRESH_TOKEN` de `.dev.vars` ha caducado o ha sido revocado. **Consecuencia: el último snapshot disponible sigue siendo el del 1-jun**, lo que significa que seguimos sin poder medir el efecto de las optimizaciones de los PRs #9–#31 — exactamente la palanca nº 4 del informe de evolución del 3-jun, que sigue sin cumplirse dos meses después.

Esta reautorización **no se puede hacer en una sesión desatendida** (requiere el flujo OAuth interactivo). Es la acción manual más importante pendiente:

```bash
npm run seo:gsc:connect
```

Después:

```bash
npm run seo:gsc && npm run seo:gsc:indexation && npm run seo:gsc:analysis
```

Con dos meses de exposición acumulada desde el deploy de junio, el snapshot resultante será el primero capaz de medir de verdad si el programa SEO funciona.

---

## 2. Auditoría GEO: qué faltaba

Revisado el estado del sitio como lo vería un agente de IA. Diagnóstico previo a los cambios:

| Elemento | Estado previo | Impacto |
|---|---|---|
| `llms.txt` / `llms-full.txt` | **No existían** | Alto — sin índice legible, el agente rastrea HTML con plantilla |
| `robots.txt` para crawlers de IA | Genérico (`User-agent: *`) | Medio — permitía el paso, pero sin política explícita |
| `FAQPage` JSON-LD | **Ausente**, pese a 30 artículos con FAQ redactada | Alto — el formato más citable estaba sin marcar |
| `BlogPosting` + `dateModified` | Correcto | — |
| `BreadcrumbList` | Correcto | — |
| Contenido sin JS | Correcto (estático) | — |
| Sitemap + RSS | Correctos | — |

El hallazgo más rentable: **30 artículos ya tenían la sección "Preguntas frecuentes" escrita en el markdown desde los PRs de mayo, pero ninguno la emitía como datos estructurados.** El trabajo editorial estaba hecho y solo faltaba exponerlo.

---

## 3. Cambios aplicados

### 3.1 `FAQPage` JSON-LD autogenerado

`build-blog.js` extrae ahora la sección `## Preguntas frecuentes` (o `## FAQ`) del markdown, convierte cada `###` en un `Question` con su `acceptedAnswer` y lo añade al array JSON-LD de la página. Se aplica también a las guías. Requiere un mínimo de 2 pares y excluye páginas `noindex`.

- **31 artículos** emiten FAQPage tras el cambio (30 existentes + el nuevo).
- Auditadas las 31 páginas: 1 respuesta larga (>1200 caracteres, una lista aplanada en `jovenes-en-la-red-dominio-gratis`) — válida, solo poco concisa.
- Coste marginal por artículo nuevo: cero. Escribir la sección FAQ genera el marcado automáticamente.

### 3.2 `llms.txt` y `llms-full.txt`

Generados en el build:

- **`/llms.txt`** (172 KB, 684 documentos): índice en Markdown con guías pilar primero y después los artículos indexables agrupados por categoría, cada uno con su descripción. Incluye punteros a sitemap, RSS, corpus completo y política de citación.
- **`/llms-full.txt`** (270 KB, 36 documentos): texto íntegro del corpus curado — las 5 guías pilar más los artículos con FAQ verificada. Criterio deliberado: volcar los 684 documentos produciría varios MB que ningún agente procesaría.

### 3.3 `robots.txt` explícito para IA

`Allow` nominal para 17 agentes en tres familias (entrenamiento, búsqueda y agentes en vivo) y comentarios que apuntan a `llms.txt`. Funcionalmente redundante frente a `User-agent: *`, pero documenta la política de forma auditable y elimina ambigüedad para los rastreadores que buscan su nombre.

### 3.4 Descubrimiento y cabeceras

- Enlace a `/llms.txt` en el pie de las 6 plantillas.
- `_headers`: `Content-Type: text/plain; charset=utf-8` para todos los `.txt` (evita que el CDN los sirva como descarga).

### 3.5 Artículo nuevo

**[GEO: cómo optimizar tu web para agentes de IA (llms.txt, schema y robots.txt)](/blog/geo-optimizar-web-agentes-ia-llms-txt/)** — ~2.100 palabras, 7 preguntas frecuentes.

Razones de la elección del tema:

1. **Demanda emergente sin competencia en español.** "GEO", "llms.txt", "cómo aparecer en ChatGPT" tienen curva de búsqueda al alza y muy poco contenido en castellano con detalle técnico.
2. **Refuerza el silo IA**, que es la palanca 5 del informe de junio: el cluster MCP cayó de posición 7,3 a 13,4. El artículo enlaza a la guía MCP y a la guía de agentes, y la guía MCP enlaza de vuelta.
3. **Es el contenido con más probabilidad de ser citado por los propios agentes**, que es el objetivo declarado del encargo.
4. **Dogfooding**: describe exactamente lo que se ha implementado esta semana, con la honestidad de señalar que `llms.txt` no es un estándar adoptado y que la evidencia de su efecto todavía no existe.

Enlazado interno registrado en `data/internal-links.json` en ambas direcciones.

---

## 4. Verificación

```
824 artículos · 31 con FAQPage JSON-LD · 5 guías · 692 URLs en sitemap
llms.txt: 684 documentos · llms-full.txt: 36 documentos
```

- `npm run audit`: assets heredados faltantes **0**, noindex en sitemap **0**. Los hallazgos que reporta (enlaces a `alfonsogu.com`, imágenes markdown heredadas de WordPress) son **previos y ajenos a estos cambios**.
- JSON-LD del post nuevo validado: `['BlogPosting', 'BreadcrumbList', 'FAQPage']` con 7 preguntas.
- Canonical correcto: `https://crearsoftware.com/blog/geo-optimizar-web-agentes-ia-llms-txt/`.

---

## 5. Qué falta para poder evaluar y mejorar cada semana

El encargo pide revisarlo *todo* cada semana. Hoy no se puede, y estas son las carencias reales del sistema:

| # | Carencia | Por qué importa | Acción |
|---|---|---|---|
| 1 | **Token GSC caducado** | Sin él no hay ninguna medición. Bloquea todo el ciclo. | Manual: `npm run seo:gsc:connect` |
| 2 | **No hay analítica de logs por user-agent** | Es la **única** métrica fiable de GEO: saber si GPTBot, OAI-SearchBot, PerplexityBot y ChatGPT-User entran de verdad. Hoy volamos a ciegas sobre el objetivo principal del encargo. | Activar Cloudflare Logpush o un Worker que cuente user-agents de IA a un KV/D1, y un script `seo:agents` que lo reporte |
| 3 | **No hay auditoría de prompts** | No sabemos si nos citan. | Script con 15 preguntas fijas contra ChatGPT/Perplexity/Claude, ejecutado semanalmente y versionado en `data/` |
| 4 | **Snapshots GSC irregulares** (abr, may/jun, nada desde entonces) | Sin serie temporal regular no hay atribución posible. | Programar el snapshot dentro de este mismo cron semanal, en cuanto el token funcione |
| 5 | **`noindex-review.json` sin re-auditar desde el 30-mar** | 152 URLs (22%) en noindex reflejan estado de hace 4 meses. Ya se han encontrado varios falsos positivos con demanda real (PRs #25, #26, #27). | `npm run audit:noindex` y revisar los 32 dudosos |
| 6 | **Sin versión Markdown por URL** | Un agente que quiere una página concreta se traga el HTML entero. Servir `/ruta/index.md` es el siguiente escalón de GEO. | Emitir `.md` junto a cada `index.html` en el build |
| 7 | **Sin `Organization`/`Person` con `sameAs`** | Señal de autoría, que pesa más en GEO que en SEO. | Añadir `sameAs` con perfiles verificables al JSON-LD del autor |

---

## 6. Estado de las palancas del informe del 3-jun

| # | Palanca | Estado |
|---|---|---|
| 1 | Recuperar posición de input/output | **Sin verificar** — requiere datos GSC |
| 2 | Capturar striking distance de input/output | Trabajado en PRs #28/#29, sin medir |
| 3 | Reescribir snippets con CTR 0 | Trabajado en PRs previos, sin medir |
| 4 | **Medir con snapshots post-deploy** | **BLOQUEADO** — token GSC caducado. Máxima prioridad |
| 5 | Frenar deterioro del silo IA | **Avanzado esta semana** — artículo nuevo + enlazado bidireccional con la guía MCP |
| 6 | Forzar indexación bloque dic-2024 | Trabajado en PR #30/#31, sin medir |

---

## 7. Siguiente ejecución (lunes)

1. Si el token GSC está reautorizado: snapshot completo y **primer informe de efectividad real** con dos meses de exposición.
2. Instrumentar el conteo de crawlers de IA (carencia nº 2). Sin eso, el objetivo "que los agentes lo encuentren" no es medible.
3. Emitir `.md` por URL (carencia nº 6).
4. Artículo nuevo del silo IA, orientado a las consultas que un agente resuelve mal en español.
