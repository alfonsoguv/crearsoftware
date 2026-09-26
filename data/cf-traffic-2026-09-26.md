# Trafico real en el borde (Cloudflare)

Generado: 2026-09-26T13:52:51.639Z
Ventana: 2026-09-19 -> 2026-09-25 (7 dias)
Peticiones totales: 75630

Fuente exacta: Cloudflare ve todas las peticiones al borde, no solo las que
llegan desde Google. Complementa a gsc-seo-report (solo Google) y a
geo-agents-report (aproximado y sin historico).

## Rastreadores por familia

| Familia | Peticiones | Por que importa |
| --- | ---: | --- |
| Entrenamiento | 3400 | Alimentan el conocimiento base del modelo |
| Buscador clásico | 1201 | SEO tradicional, referencia de comparacion |
| Agentes en vivo | 916 | Visitan porque alguien pregunta ahora: generan la cita |
| Búsqueda generativa | 895 | Indexan para que el modelo te cite al responder |

## Rastreadores por agente

| Agente | Familia | Peticiones | Errores |
| --- | --- | ---: | ---: |
| Applebot | Entrenamiento | 1173 | 264 |
| Googlebot | Buscador clásico | 758 | 131 |
| Amazonbot | Entrenamiento | 487 | 91 |
| ChatGPT-User | Agentes en vivo | 447 | 286 |
| Bingbot | Buscador clásico | 443 | 29 |
| Meta-ExternalAgent | Entrenamiento | 441 | 212 |
| Claude-SearchBot | Búsqueda generativa | 331 | 218 |
| OAI-SearchBot | Búsqueda generativa | 305 | 67 |
| Bytespider | Entrenamiento | 299 | 174 |
| ClaudeBot | Entrenamiento | 293 | 59 |
| GPTBot | Entrenamiento | 270 | 198 |
| CCBot | Entrenamiento | 268 | 160 |
| PerplexityBot | Búsqueda generativa | 259 | 115 |
| Claude-User | Agentes en vivo | 212 | 175 |
| cohere-ai | Entrenamiento | 169 | 109 |
| MistralAI-User | Agentes en vivo | 144 | 113 |
| Perplexity-User | Agentes en vivo | 113 | 105 |

## Evolucion diaria de agentes de IA

| Fecha | Peticiones de IA |
| --- | ---: |
| 2026-09-19 | 280 |
| 2026-09-20 | 464 |
| 2026-09-21 | 733 |
| 2026-09-22 | 1818 |
| 2026-09-23 | 557 |
| 2026-09-24 | 677 |
| 2026-09-25 | 682 |

## Codigos de respuesta

| Codigo | Peticiones | % |
| --- | ---: | ---: |
| 200 | 27667 | 36.6% |
| 404 | 19781 | 26.2% |
| 301 | 15276 | 20.2% |
| 504 | 4953 | 6.5% |
| 403 | 2686 | 3.6% |
| 308 | 2303 | 3.0% |
| 405 | 1786 | 2.4% |
| 304 | 692 | 0.9% |
| 204 | 406 | 0.5% |
| 206 | 65 | 0.1% |

## Errores 5xx: quien los recibe

Solo importan si los sufre un buscador o un agente. Si el user-agent es un
escaner, es ruido.

| User-agent | Peticiones | Es buscador/agente |
| --- | ---: | --- |
| nginx-ssl early hints | 4880 | no |
| bastion early hints | 73 | no |
