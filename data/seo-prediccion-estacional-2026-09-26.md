# Contraste de predicciones falsables — 26 de septiembre de 2026

**Veredicto: la tesis estacional gana, con 265 clics en la ventana 27-ago → 23-sep (umbral: ≥ 90).**
Pero la predicción acertó el sentido y falló el tamaño por mucho: se esperaban 90-98 y salieron
casi el triple. La estacionalidad explica cuándo y dónde sube el tráfico; no explica cuánto.

**Guías pilar: la predicción se cumple, con 667 impresiones (umbral: > 150).** El salto es un
escalón limpio la semana siguiente al enlazado desde la home.

Las dos reglas de lectura se fijaron el 01-ago-2026 (`data/seo-weekly-2026-08-01.md`) y se aplican
aquí tal cual.

---

## Método

- `npm run seo:gsc` ejecutado hoy: el token funciona (sin `invalid_grant`). Informe regenerado en
  `data/gsc-seo-report-2026-09-26.md`, que ya cubre exactamente la ventana 27-ago → 23-sep.
- Total real: consulta a la API **sin dimensiones** (`scripts/lib/google-search-console.mjs`,
  propiedad `sc-domain:crearsoftware.com`). Contraste con la suma por página **excluyendo las
  filas ancla (`#`)**: da los mismos 265 clics. Las anclas solo inflan impresiones (56.233 con
  ellas, 45.323 sin ellas), no clics.
- Todas las ventanas son de 28 días completos (comprobado: 28 filas diarias en cada una).
- La línea base se reproduce: 02-jul → 29-jul de 2026 da **65 clics**, igual que el informe del
  01-ago.

## Predicción 1 — estacionalidad

| Ventana | Clics | Impresiones | CTR | Clics/semana |
| --- | ---: | ---: | ---: | --- |
| 02-jul → 29-jul 2025 | 175 | 30.495 | 0,57 % | 48 · 47 · 41 · 39 |
| 27-ago → 23-sep 2025 | 231 | 30.520 | 0,76 % | 56 · 65 · 44 · 66 |
| 02-jul → 29-jul 2026 (base) | 65 | 25.119 | 0,26 % | 17 · 13 · 12 · 23 |
| **27-ago → 23-sep 2026** | **265** | **45.091** | **0,59 %** | **58 · 72 · 60 · 75** |

- **Predicho:** 90-98 clics (×1,38-1,51 sobre la base). **Observado:** 265 (×4,08).
- Muy fuera de ruido: con λ = 98, la probabilidad de ver 265 o más es prácticamente nula.
  Las cuatro semanas, por separado, ya superan los 58 clics.
- **Por la regla fijada, la tesis estacional gana** y no hay que reorientar la estrategia a
  cuenta de la caída de tráfico. No es una zona ambigua: la cifra está 175 clics por encima
  del umbral.

### Lo que apoya que es curso académico

- **Geografía.** México pasa de 15 a **124 clics** (×8) y aporta el 47 % del total; es el país
  con el curso escolar arrancando a finales de agosto. España, en cambio, apenas se mueve
  (16 → 38).
- **Consultas.** Lo que sube son consultas de estudio: «inputs y outputs», «input y output»,
  «definición de producto», «variables de control». Las páginas ganadoras son las de 2007-2009
  (input/output 25 → 83, «¿qué es un producto?» 3 → 47, realismo/idealismo 2 → 20).
- **Calendario.** La serie semanal sube desde la última semana de julio (12 → 23 → 34 → 21 →
  27 → 37) y acelera justo en la semana del 27-ago (58). Es el mismo patrón que 2025, adelantado
  y más pronunciado.

### Lo que no cuadra: el tamaño

En 2025 la misma transición fue **×1,32**. En 2026 ha sido **×4,08**. La estacionalidad del año
anterior no da para un ×4.

Parte del exceso tiene una explicación concreta, y es un factor de confusión: el 02-ago se
arreglaron las **226 redirecciones de slugs con «¿»** (`%C2%BF`). Esas páginas son las que más
suben:

| Grupo de páginas | Jul-25 → Sep-25 | Jul-26 → Sep-26 |
| --- | ---: | ---: |
| Slugs con «¿» | 23 → 28 (×1,22) | 13 → **88 (×6,8)** |
| Página estrella input/output | 43 → 53 (×1,23) | 25 → 83 (×3,3) |
| Resto | 109 → 150 (×1,38) | 26 → 89 (×3,4) |

«¿Qué es un producto?» pasó de posición 108,8 (sep-25) y 29,3 (abr-26) a **10,9**. Eso no es
estacional.

**Quitando los slugs con «¿», el sitio pasa de 51 a 172 clics (×3,4), frente a ×1,34 en 2025.**
Queda un factor de ~2,5 que ni la estacionalidad ni el arreglo de los «¿» explican. Candidatos
sin probar: el 301 de `www` a no-`www` del 29-ago (consolidó 1.759 URLs duplicadas), una
actualización de Google, o un cambio en cuánto clic absorbe el AI Overview. **Hoy no hay datos
para elegir entre ellos, y no lo hago.**

### Corrección explícita: el «problema interanual» ya no está en esta ventana

| | 2025 | 2026 | Interanual |
| --- | ---: | ---: | ---: |
| Jul (02-jul → 29-jul) | 175 | 65 | **−63 %** |
| Sep (27-ago → 23-sep) | 231 | 265 | **+15 %** |
| Sep sin slugs con «¿» ni guías | 203 | 172 | −15 % |

La afirmación de agosto de que el sitio tenía un problema estructural del −73 % interanual
**no se sostiene con los datos de septiembre**: en total el sitio está por encima de 2025 y, sin
el efecto de los «¿», un 15 % por debajo, lejos del −63/−73 %.

Lo que sí persiste es el efecto por impresión del AI Overview en la página estrella: CTR del
1,02 % en sep-25 frente al **0,62 %** en sep-26, con mejor posición (6,2 → 5,7). Lo compensa con
2,6 veces más impresiones. La hipótesis del AI Overview explica el CTR; ya no explica el volumen.

**Cautela sobre impresiones y posición interanuales:** a mediados de septiembre de 2025 Google
dejó de servir 100 resultados por página y la posición media del sitio saltó de ~40 a ~16 en dos
semanas (se ve en la serie semanal de 2025). Las impresiones y la posición media de antes de esa
fecha no se comparan con las de ahora. Los clics sí.

### Qué implica para la estrategia

1. **Por la regla fijada: no hay que reorientar.** La caída de mayo-julio era de curso
   académico y el sitio se ha recuperado por encima de 2025. **Este test no justifica el giro a
   GEO** por colapso estructural del tráfico. Si el trabajo de GEO sigue, que sea por el valor de
   la citación medida (Bing, AI Overview), no por un hundimiento del clic que ya no aparece.
2. **Dejar de usar el −73 % interanual** como premisa en informes y artículos: es de abril.
3. **El sitio sigue siendo muy estacional y muy concentrado.** Tres páginas generan el 57 % de los
   clics y México casi la mitad. Diciembre-enero y junio-agosto volverán a hundir el tráfico: no
   leer esas caídas como señal.
4. **Queda sin explicar un ×2,5.** Para decidir entre las causas candidatas: comparar oct-nov de
   2026 con oct-nov de 2025. Si la ventaja sobre 2025 se mantiene durante todo el curso, hay una
   mejora estructural real (probablemente el `www` o el «¿»); si se desvanece, era un pico de
   arranque de curso más fuerte que el del año pasado.

## Predicción 2 — enlazado interno de las guías pilar

| Guía | Clics | Impresiones |
| --- | ---: | ---: |
| `/guia/guia-agentes-ia-empresas/` | 1 | 401 |
| `/guia/guia-herramientas-productividad-2026/` | 1 | 153 |
| `/guia/guia-desarrollo-software-moderno/` | 2 | 86 |
| `/guia/guia-ia-generativa-creacion-contenido/` | 1 | 16 |
| `/guia/guia-transformacion-digital-pymes/` | 0 | 11 |
| **Total 27-ago → 23-sep** | **5** | **667** |
| Base 02-jul → 29-jul (sin enlaces) | 1 | 31 |

- **Predicho:** > 150 impresiones. **Observado:** 667. **Se cumple.** El umbral de fracaso era
  < 60.
- **El escalón coincide con la fecha del cambio.** Impresiones semanales de las cinco guías:
  19 · 8 · 2 · 2 · 6 (hasta el 05-ago) → **109** · 131 · 157 · 168 · 149 · 164 · 186. El salto
  es la primera semana completa después del 02-ago.
- **No lo explica la subida general:** las impresiones del sitio crecieron ×1,8; las de las
  guías, ×21. Y las guías no tienen commits entre julio y hoy, así que el único cambio que les
  afecta es el enlace desde la home.
- **Conclusión: el enlazado interno sí era el cuello de botella para que Google las mostrara.**
- **Límites:** son impresiones, no tráfico (5 clics). El 60 % viene de una sola guía
  (agentes IA), y dos siguen casi invisibles (16 y 11). El enlace las ha hecho descubribles; no
  las ha hecho competitivas.

## Cifras de referencia

- Datos crudos del informe general: `data/gsc-seo-report-2026-09-26.json`.
- Consultas de este contraste hechas contra la API el 26-sep-2026 a las ~21:35 UTC. GSC puede
  revisar ligeramente las cifras de los últimos días de la ventana.
