# Trafico real en el borde (Cloudflare)

Generado: 2026-08-01T23:55:54.541Z
Ventana: 2026-07-25 -> 2026-07-31 (7 dias)
Peticiones totales: 68408

Fuente exacta: Cloudflare ve todas las peticiones al borde, no solo las que
llegan desde Google. Complementa a gsc-seo-report (solo Google) y a
geo-agents-report (aproximado y sin historico).

## Rastreadores por familia

| Familia | Peticiones | Por que importa |
| --- | ---: | --- |
| Búsqueda generativa | 4147 | Indexan para que el modelo te cite al responder |
| Buscador clásico | 1719 | SEO tradicional, referencia de comparacion |
| Entrenamiento | 685 | Alimentan el conocimiento base del modelo |
| Agentes en vivo | 51 | Visitan porque alguien pregunta ahora: generan la cita |

## Rastreadores por agente

| Agente | Familia | Peticiones | Errores |
| --- | --- | ---: | ---: |
| Claude-SearchBot | Búsqueda generativa | 3292 | 18 |
| Googlebot | Buscador clásico | 1212 | 635 |
| OAI-SearchBot | Búsqueda generativa | 833 | 2 |
| Applebot | Entrenamiento | 540 | 112 |
| Bingbot | Buscador clásico | 507 | 75 |
| ClaudeBot | Entrenamiento | 82 | 10 |
| ChatGPT-User | Agentes en vivo | 48 | 2 |
| Meta-ExternalAgent | Entrenamiento | 34 | 0 |
| PerplexityBot | Búsqueda generativa | 22 | 15 |
| Bytespider | Entrenamiento | 13 | 0 |
| CCBot | Entrenamiento | 11 | 11 |
| GPTBot | Entrenamiento | 5 | 4 |
| Claude-User | Agentes en vivo | 3 | 0 |

## Evolucion diaria de agentes de IA

| Fecha | Peticiones de IA |
| --- | ---: |
| 2026-07-25 | 3200 |
| 2026-07-26 | 938 |
| 2026-07-27 | 92 |
| 2026-07-28 | 146 |
| 2026-07-29 | 165 |
| 2026-07-30 | 182 |
| 2026-07-31 | 160 |

## Codigos de respuesta

| Codigo | Peticiones | % |
| --- | ---: | ---: |
| 200 | 22211 | 32.5% |
| 404 | 17492 | 25.6% |
| 301 | 16266 | 23.8% |
| 504 | 5771 | 8.4% |
| 403 | 4747 | 6.9% |
| 204 | 557 | 0.8% |
| 405 | 514 | 0.8% |
| 308 | 477 | 0.7% |
| 304 | 361 | 0.5% |
| 206 | 7 | 0.0% |

## Errores 5xx: quien los recibe

Solo importan si los sufre un buscador o un agente. Si el user-agent es un
escaner, es ruido.

| User-agent | Peticiones | Es buscador/agente |
| --- | ---: | --- |
| nginx-ssl early hints | 5718 | no |
| bastion early hints | 53 | no |
