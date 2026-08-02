# Informe de rastreadores de IA (GEO)

Fecha de generacion: 2026-08-02T09:25:22.867Z
Origen: https://crearsoftware.com
Ventana: ultimos 28 dias
Peticiones de agentes contabilizadas: 461

## Por familia

| Familia | Peticiones | Por que importa |
| --- | --- | --- |
| Búsqueda generativa | 374 | Construyen el indice que el modelo consulta al responder |
| Agentes en vivo | 12 | Visitan porque un usuario esta preguntando ahora: generan la cita |
| Entrenamiento | 23 | Alimentan el conocimiento base del modelo |
| Buscador clásico | 52 | SEO tradicional, referencia de comparacion |

## Por agente

| Agente | Familia | Peticiones |
| --- | --- | --- |
| PerplexityBot | Búsqueda generativa | 333 |
| Googlebot | Buscador clásico | 52 |
| Bingbot | Búsqueda generativa | 37 |
| ChatGPT-User | Agentes en vivo | 8 |
| Amazonbot | Entrenamiento | 7 |
| ClaudeBot | Entrenamiento | 7 |
| GPTBot | Entrenamiento | 5 |
| OAI-SearchBot | Búsqueda generativa | 4 |
| Claude-User | Agentes en vivo | 3 |
| Applebot-Extended | Entrenamiento | 1 |
| CCBot | Entrenamiento | 1 |
| Google-Extended | Entrenamiento | 1 |
| Meta-ExternalAgent | Entrenamiento | 1 |
| Perplexity-User | Agentes en vivo | 1 |

## Paginas mas leidas por agentes

| Pagina | Peticiones |
| --- | --- |
| / | 15 |
| /blog/ | 10 |
| /2025/02/13/novedades-de-alexa-la-ia-generativa-revoluciona-asistentes-de-voz/ | 10 |
| /2007/06/23/ejemplos-de-input-output-y-actividades/ | 7 |
| /blog/montar-agente-de-voz-ia-que-atienda-llamadas/ | 4 |
| /llms.txt | 4 |
| /2008/03/12/%C2%BFque-es-un-producto/ | 3 |
| /2008/05/18/%C2%BFcual-es-la-historia-del-corte-ingles/ | 3 |
| /2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/ | 3 |
| /page/39/ | 2 |
| /2025/04/14/la-guia-definitiva-sobre-el-protocolo-de-contexto-del-modelo-mcp/ | 2 |
| /blog/geo-optimizar-web-agentes-ia-llms-txt/ | 2 |
| /2010/05/24/desarrollo-aplicaciones-empresariales-moviles/ | 2 |
| /2009/06/23/8-errores-del-proceso-de-cambio/ | 2 |
| /2012/05/10/la-experiencia-de-usuario-en-software/ | 2 |
| /2013/01/29/5-webs-donde-cualquiera-puede-aprender-a-programar/ | 2 |
| /2010/12/27/%C2%BFnecesito-un-disenador-en-mi-empresa/ | 2 |
| /2025/02/24/guia-para-hacer-prompts-en-google-veo-2/ | 2 |
| /tag/testing/ | 1 |
| /AUDIT-TEST-MARKER-fake-bot-path/ | 1 |

## Caveats

- El conteo es aproximado por diseno: durante una rafaga concurrente varias
  peticiones leen el mismo contador y el resultado se queda corto. Sirve para
  tendencia, no para auditoria exacta.
- Solo se cuentan peticiones de paginas (HTML, llms.txt), no de assets.
- El user-agent es declarado por el cliente y se puede falsificar.
