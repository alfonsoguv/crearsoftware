# Informe de rastreadores de IA (GEO)

Fecha de generacion: 2026-08-01T18:34:07.478Z
Origen: https://crearsoftware.com
Ventana: ultimos 28 dias
Peticiones de agentes contabilizadas: 29

## Por familia

| Familia | Peticiones | Por que importa |
| --- | --- | --- |
| Búsqueda generativa | 7 | Construyen el indice que el modelo consulta al responder |
| Agentes en vivo | 4 | Visitan porque un usuario esta preguntando ahora: generan la cita |
| Entrenamiento | 13 | Alimentan el conocimiento base del modelo |
| Buscador clásico | 5 | SEO tradicional, referencia de comparacion |

## Por agente

| Agente | Familia | Peticiones |
| --- | --- | --- |
| Bingbot | Búsqueda generativa | 5 |
| Googlebot | Buscador clásico | 5 |
| GPTBot | Entrenamiento | 4 |
| ClaudeBot | Entrenamiento | 3 |
| Amazonbot | Entrenamiento | 2 |
| Claude-User | Agentes en vivo | 2 |
| ChatGPT-User | Agentes en vivo | 1 |
| OAI-SearchBot | Búsqueda generativa | 1 |
| PerplexityBot | Búsqueda generativa | 1 |
| Applebot-Extended | Entrenamiento | 1 |
| CCBot | Entrenamiento | 1 |
| Google-Extended | Entrenamiento | 1 |
| Meta-ExternalAgent | Entrenamiento | 1 |
| Perplexity-User | Agentes en vivo | 1 |

## Paginas mas leidas por agentes

| Pagina | Peticiones |
| --- | --- |
| / | 8 |
| /2007/06/23/ejemplos-de-input-output-y-actividades/ | 7 |
| /llms.txt | 3 |
| /2025/02/13/novedades-de-alexa-la-ia-generativa-revoluciona-asistentes-de-voz/ | 2 |
| /2025/02/24/guia-para-hacer-prompts-en-google-veo-2/ | 2 |
| /2012/05/10/la-experiencia-de-usuario-en-software/ | 1 |
| /llms-full.txt | 1 |
| /2010/12/27/%C2%BFnecesito-un-disenador-en-mi-empresa/ | 1 |
| /2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/ | 1 |
| /2007/08/26/%C3%82%C2%BF-que-es-la-moda/ | 1 |
| /2025/04/14/la-guia-definitiva-sobre-el-protocolo-de-contexto-del-modelo-mcp/ | 1 |
| /2007/04/27/carta-de-bill-gates-en-favor-del-software-propietario/ | 1 |

## Caveats

- El conteo es aproximado por diseno: durante una rafaga concurrente varias
  peticiones leen el mismo contador y el resultado se queda corto. Sirve para
  tendencia, no para auditoria exacta.
- Solo se cuentan peticiones de paginas (HTML, llms.txt), no de assets.
- El user-agent es declarado por el cliente y se puede falsificar.
