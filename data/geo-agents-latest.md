# Informe de rastreadores de IA (GEO)

Fecha de generacion: 2026-08-09T10:49:00.057Z
Origen: https://crearsoftware.com
Ventana: ultimos 28 dias
Peticiones de agentes contabilizadas: 3295

## Por familia

| Familia | Peticiones | Por que importa |
| --- | --- | --- |
| Búsqueda generativa | 1724 | Construyen el indice que el modelo consulta al responder |
| Buscador clásico | 572 | SEO tradicional, referencia de comparacion |
| Entrenamiento | 931 | Alimentan el conocimiento base del modelo |
| Agentes en vivo | 68 | Visitan porque un usuario esta preguntando ahora: generan la cita |

## Por agente

| Agente | Familia | Peticiones |
| --- | --- | --- |
| Bingbot | Búsqueda generativa | 1328 |
| Amazonbot | Entrenamiento | 790 |
| Googlebot | Buscador clásico | 572 |
| PerplexityBot | Búsqueda generativa | 385 |
| GPTBot | Entrenamiento | 78 |
| ChatGPT-User | Agentes en vivo | 57 |
| ClaudeBot | Entrenamiento | 52 |
| OAI-SearchBot | Búsqueda generativa | 9 |
| Claude-User | Agentes en vivo | 8 |
| Google-Extended | Entrenamiento | 3 |
| Meta-ExternalAgent | Entrenamiento | 3 |
| Perplexity-User | Agentes en vivo | 3 |
| CCBot | Entrenamiento | 3 |
| Claude-SearchBot | Búsqueda generativa | 2 |
| cohere-ai | Entrenamiento | 1 |
| Applebot-Extended | Entrenamiento | 1 |

## Paginas mas leidas por agentes

| Pagina | Peticiones |
| --- | --- |
| /2025/02/13/novedades-de-alexa-la-ia-generativa-revoluciona-asistentes-de-voz/ | 138 |
| / | 125 |
| /blog/ | 110 |
| /2007/06/23/ejemplos-de-input-output-y-actividades/ | 29 |
| /2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/ | 22 |
| /wp-content/uploads/ | 16 |
| /2008/05/18/%C2%BFcual-es-la-historia-del-corte-ingles/ | 15 |
| /blog/servir-markdown-agentes-ia-md-por-url/ | 15 |
| /llms.txt | 13 |
| /2012/04/04/como-crear-programas/ | 12 |
| /blog/montar-agente-de-voz-ia-que-atienda-llamadas/ | 11 |
| /blog/geo-optimizar-web-agentes-ia-llms-txt/ | 11 |
| /2009/03/22/la-venta-personal-en-internet-saas-paas/ | 10 |
| /2025/03/10/agentes-de-voz-con-ia-analisis-completo-del-panorama-2025/ | 10 |
| /2025/01/05/impacto-de-la-inteligencia-artificial-en-los-roles-creativos-en-2025/ | 9 |
| /blog/mi-articulo.md | 9 |
| /guia/guia-herramientas-productividad-2026/ | 8 |
| /2025/04/14/la-guia-definitiva-sobre-el-protocolo-de-contexto-del-modelo-mcp/ | 8 |
| /sobre/ | 7 |
| /guia/guia-desarrollo-software-moderno/ | 7 |

## Formato servido (md vs HTML)

| Familia | Markdown | llms.txt | HTML | % Markdown | Sin medir |
| --- | --- | --- | --- | --- | --- |
| Búsqueda generativa | 1 | 0 | 11 | 8.3% | 1712 |
| Buscador clásico | 0 | 0 | 1 | 0.0% | 571 |
| Entrenamiento | 0 | 0 | 0 | -% | 931 |
| Agentes en vivo | 0 | 0 | 0 | -% | 68 |

`Sin medir` son peticiones contabilizadas antes de instrumentar el formato
(2026-08-09). No se imputan a HTML: se declaran aparte.

## Caveats

- El conteo es aproximado por diseno: durante una rafaga concurrente varias
  peticiones leen el mismo contador y el resultado se queda corto. Sirve para
  tendencia, no para auditoria exacta.
- Solo se cuentan peticiones de paginas (HTML, llms.txt), no de assets.
- El user-agent es declarado por el cliente y se puede falsificar.
- OJO: comprobar a mano que los agentes no estan bloqueados con
  `curl -A "ChatGPT-User" https://crearsoftware.com/` INYECTA un hit en la
  familia "agentes en vivo", que mueve entre 1 y 18 peticiones al dia. Usa
  `/robots.txt` para ese chequeo: responde igual y no entra en el contador.
- La ventana de 28 dias solo esta llena si el contador lleva 28 dias activo.
  Arranco el 2026-08-01: hasta el 2026-08-29 los totales acumulados suben
  solos y NO son comparables entre semanas. Compara la serie diaria.
