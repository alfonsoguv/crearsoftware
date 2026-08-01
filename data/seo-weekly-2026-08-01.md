# Revisión SEO/GEO semanal — crearsoftware.com

**Fecha:** 2026-08-01
**Ejecución:** ciclo completo (22 agentes, análisis multidimensión + barrido del archivo + artículo verificado)
**Veredicto:** MIXTO con dos correcciones importantes al informe anterior

---

## 0. Correcciones al informe del 31-jul

Dos conclusiones que di ayer eran erróneas. Las corrijo aquí, con la verificación hecha.

### 0.1 El «+23% de impresiones en las páginas trabajadas» era un artefacto

Desde junio de 2026, GSC devuelve los **enlaces de fragmento (`#seccion`) como URLs independientes** en la dimensión `page`. `scripts/gsc-seo-report.mjs` sumaba esas filas al total, duplicando las impresiones de la página que las contiene.

Medición directa contra la API (consulta sin dimensión, que es el total real):

| Ventana | Impresiones reales | Sumando filas de página | Filas ancla | Inflación |
|---|---|---|---|---|
| 01-may → 28-may | 25.111 | 25.682 | 0 | 2,3% |
| 27-jun → 24-jul | 25.425 | 29.828 | 40 (4.209 impr) | **17,3%** |

Las impresiones reales del sitio de mayo a julio suben **+1,3%**, no +16%. Y el «+23%» que atribuí a las páginas trabajadas queda explicado casi por completo por esas 4.209 impresiones fantasma.

**Qué sobrevive:** el veredicto de atribución. Se apoyaba en **clics**, y las filas ancla tienen 0 clics, así que no las alteran. Sigue siendo cierto que las páginas sin tocar cayeron más (−61%) que las tocadas (−44%), y por tanto que los cambios SEO no causaron la caída.

**Qué se retira:** la evidencia de apoyo «las páginas trabajadas capturan el crecimiento de impresiones». No hubo tal crecimiento.

**Corregido en el código:** `summarizeRows()` excluye ahora las filas con `#`.

### 0.2 La caída de mayo a julio es en buena parte estacional

No comprobé el mismo periodo del año anterior. Al hacerlo:

| Ventana (28 días) | 2025 | 2026 |
|---|---|---|
| Abril | 390 clics | 105 |
| Mayo | 430 | 141 |
| Junio | 439 | 79 |
| **Julio** | **175** | **65** |
| Caída jun → jul | **−60%** | −18% |

**Julio se hunde los dos años.** En 2025 el desplome fue incluso mayor. La contracción de mayo a julio de 2026, que ayer presenté como alarma, es en gran medida el ciclo de fin de curso: el sitio vive de consultas de estudio («qué es un pasivo», «input y output»).

**Lo que sí es grave, y ayer no vi:** la comparación interanual.

| | Abril 2025 | Abril 2026 | Variación |
|---|---|---|---|
| Clics | 390 | 105 | **−73%** |
| Impresiones | 37.016 | 26.314 | −29% |
| CTR | 1,054% | 0,399% | **−62%** |

El sitio ha perdido tres cuartas partes de su tráfico en un año, con el CTR reducido a menos de la mitad y las impresiones cayendo mucho menos. **Ese** es el problema estructural, y la hipótesis de la SERP (AI Overviews absorbiendo el clic informacional) sigue siendo la mejor explicación para él — pero para el eje interanual, no para el verano.

### 0.3 Otros defectos de instrumentación corregidos o detectados

- **Ventanas incompletas.** El script fijaba `endDate` en «ayer», pero GSC va 2-3 días por detrás: el 31-jul no tenía datos. Las ventanas «de 28 días» contenían 26 o 27. Los deltas entre snapshots consecutivos eran ruido de calendario. **Corregido:** `endDate = hoy − 3 días`.
- **La auditoría de indexación no mide el sitio.** `gsc-indexation-audit.mjs` inspecciona siempre las **mismas 25 primeras URLs del sitemap**. El «21/25 indexadas» describe esas 25, no las 693. **Pendiente:** rotar la muestra. No corregido hoy.

---

## 1. Estado real del tráfico

Ventana consolidada 02-jul → 29-jul: **65 clics, 24.006 impresiones, CTR 0,27%, posición 15,58**.

- **La caída se ha detenido.** Seis semanas planas: 15, 15, 21, 13, 9, 19 clics. Test de tasa constante χ²=5,96 (gl=5, p=0,31): compatible con nivel estable. Media 15,3 clics/semana. Dejar de reaccionar a los movimientos semanales.
- **Señal negativa robusta: la superficie indexada se contrae.** URLs con al menos una impresión, ventanas de 28 días: 432 (abr) → 389 (may) → 328 (jun) → **274 (jul)**, −37% monotónico con impresiones planas. No es estacional: en 2025 esa misma transición jun→jul **subió** (468 → 525). No es efecto del umbral de anonimización: URLs con ≥100 impresiones caen igual (43 → 33).
- **Concentración de riesgo.** 28 páginas generan el 100% de los clics de un sitio de 825 artículos, y `/2007/06/23/ejemplos-de-input-output-y-actividades/` aporta el 38% (era el 25% en jul-25). Cualquier cambio en esa URL es de alto riesgo y necesita plan de reversión.
- **La página estrella, interanual:** de 43 clics con 3.211 impresiones y CTR 1,34% (jul-25) a 25 clics con 9.351 impresiones y CTR 0,27% (jul-26), **con mejor posición** (8,07 → 6,60). Triple de exposición, un quinto de CTR. Es la evidencia más limpia de que el cambio está en la SERP, no en la página.

### Predicción falsable

En 2025 el suelo fue julio-agosto y la recuperación arrancó a finales de agosto (+51% sobre el mínimo). Si manda la estacionalidad, la ventana **27-ago → 23-sep de 2026 debería dar entre 90 y 98 clics**, partiendo de los 65 actuales.

- Si sale ≥90: la caída era de curso académico y no hay que reorientar nada.
- Si sigue en 60-70: la tesis estructural gana y el giro a GEO queda justificado.

**Comprobar el 26 de septiembre.** Es la forma de no seguir discutiendo hipótesis con datos insuficientes.

---

## 2. Barrido de contenido sindicado: 6 casos confirmados

Tras el descubrimiento de que la guía MCP era una traducción del publirreportaje de tl;dv, se barrieron **los 824 artículos** y se verificó cada sospechoso contra la web buscando el original.

**Confirmados como traducción de contenido ajeno publicada bajo la firma del blog:**

| Post | Original |
|---|---|
| `la-era-de-la-inteligencia` | «The Intelligence Age», **Sam Altman** (ia.samaltman.com, sep-2024) |
| `los-agentes-estan-llegando-por-que-el-invierno-de-la-ia-no-sera-tan-frio` | «The agents are coming», **Christoph Janz** (Point Nine) |
| `agentes-de-voz-con-ia-analisis-completo-del-panorama-2025` | «AI Voice Agents: 2025 Update», **Olivia Moore (a16z)** |
| `open-ai-presenta-deep-research` | Nota de lanzamiento de **OpenAI** |
| `linux-kernel-management-style` | «Linux kernel management style», **Linus Torvalds** |
| `tendencias-de-la-sintesis-de-voz-por-ia-para-2025` | Artículo de Medium (Ryoichi Sueno, oct-2024) |

**Descartados tras verificación** (el barrido los marcó, la comprobación los absolvió): `que-es-un-bot-sdr`, `transforma-tu-marketing-con-ia`, `como-los-bots-de-inteligencia-artificial...`, `como-la-ia-de-vo-revoluciona-el-marketing`. En ninguno se encontró original ajeno: búsquedas de frases literales largas, todas negativas.

**No se ha tocado ninguno.** Qué hacer con ellos —reescribir, poner `noindex`, añadir atribución visible y canonical al original, o retirar— es una decisión editorial y legal que corresponde al autor, no al proceso automático. Dos apuntes para decidir:

- Varios llevan **atribución escondida** en la última línea (el patrón de la guía MCP). Eso es distinto de no tenerla, pero no equivale a una atribución visible.
- Ninguno de los seis aporta tráfico relevante hoy, así que el coste SEO de retirarlos o marcarlos como `noindex` sería mínimo.

---

## 3. Artículo de la semana

**[Cómo montar un agente de voz con IA que atienda las llamadas de tu empresa](/blog/montar-agente-de-voz-ia-que-atienda-llamadas/)** — 2.550 palabras, 8 secciones, FAQ de 7 preguntas.

Elegido con datos: el clúster de voz suma **88 queries y 2.731 impresiones en 90 días con 1 solo clic**. La página existente (`plataformas-de-agentes-de-voz`) rankea en posición 3-8 para consultas conversacionales largas pero está en posición 45-55 para los términos de cabeza («agente de voz ia», «agentes voz telefonicos ia»), porque es un comparativo y la intención de esas búsquedas es de implantación. El artículo nuevo cubre esa intención sin canibalizar.

Pasó dos revisiones independientes (SEO/GEO y verificación factual) que detectaron **3 problemas bloqueantes**, corregidos y re-verificados contra fuentes primarias.

Verificado en el build: `FAQPage` con 7 pares, los 10 enlaces internos resuelven, canonical correcto. El sitio pasa a **34 artículos con datos estructurados de FAQ**.

---

## 4. Estado de la infraestructura GEO

- **Bloqueo de rastreadores resuelto hoy.** 12 user-agents de IA pasan de 403 a 200 (ver informe del 31-jul, sección -1).
- **Contador operativo.** `CS_KV` creado y enlazado; middleware, endpoint y `npm run geo:agents` probados de extremo a extremo. Línea base: **2 peticiones orgánicas** (Bingbot). Es lo esperable el mismo día de desbloquear; lo interesante será la tendencia a 3-4 semanas.
- **`noindex` re-auditado** por primera vez desde el 30-mar: 145 páginas, 1 candidato claro a desbloquear, 46 a revisar a mano (todas de 80-100 palabras). Sin botín relevante, pero el dato ya está al día.
- **Sitemap reenviado** a Search Console tras los cambios de contenido.

---

## 5. Pendiente

| # | Tarea | Quién |
|---|---|---|
| 1 | Publicar la app OAuth de Google (si no, el token caduca en 7 días) | **Alfonso** |
| 2 | Borrar el token de Cloudflare expuesto en el chat | **Alfonso** |
| 3 | Decidir qué hacer con los 6 posts sindicados | **Alfonso** |
| 4 | Investigar la contracción de superficie indexada (−37%) en GSC → Indexación de páginas | Automatizable |
| 5 | Auditoría manual de SERP: ¿hay AI Overview en «input y output»? 10 minutos, cierra la hipótesis | **Alfonso** |
| 6 | Rotar la muestra de `gsc-indexation-audit.mjs` para que mida el sitio y no 25 URLs fijas | Automatizable |
| 7 | Contrastar la predicción estacional el 26-sep | Automatizable |
