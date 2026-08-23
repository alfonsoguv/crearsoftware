# Informe de rastreadores de IA (GEO)

Fecha de generacion: 2026-08-23T08:11:30.920Z
Origen: https://crearsoftware.com
Ventana: ultimos 28 dias
Peticiones de agentes contabilizadas: 6633

## Por familia

| Familia | Peticiones | Por que importa |
| --- | --- | --- |
| Búsqueda generativa | 2105 | Construyen el indice que el modelo consulta al responder |
| Buscador clásico | 1011 | SEO tradicional, referencia de comparacion |
| Entrenamiento | 3328 | Alimentan el conocimiento base del modelo |
| Agentes en vivo | 189 | Visitan porque un usuario esta preguntando ahora: generan la cita |

## Por agente

| Agente | Familia | Peticiones |
| --- | --- | --- |
| Bingbot | Búsqueda generativa | 1665 |
| GPTBot | Entrenamiento | 1351 |
| Amazonbot | Entrenamiento | 1177 |
| Googlebot | Buscador clásico | 1011 |
| CCBot | Entrenamiento | 667 |
| PerplexityBot | Búsqueda generativa | 416 |
| ChatGPT-User | Agentes en vivo | 167 |
| ClaudeBot | Entrenamiento | 122 |
| OAI-SearchBot | Búsqueda generativa | 22 |
| Claude-User | Agentes en vivo | 19 |
| Meta-ExternalAgent | Entrenamiento | 6 |
| Google-Extended | Entrenamiento | 3 |
| Perplexity-User | Agentes en vivo | 3 |
| Claude-SearchBot | Búsqueda generativa | 2 |
| cohere-ai | Entrenamiento | 1 |
| Applebot-Extended | Entrenamiento | 1 |

## Paginas mas leidas por agentes

| Pagina | Peticiones |
| --- | --- |
| / | 309 |
| /2025/02/13/novedades-de-alexa-la-ia-generativa-revoluciona-asistentes-de-voz/ | 179 |
| /blog/ | 174 |
| /2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/ | 64 |
| /2007/06/23/ejemplos-de-input-output-y-actividades/ | 63 |
| /guia/guia-agentes-ia-empresas/ | 34 |
| /2012/04/04/como-crear-programas/ | 25 |
| /blog/servir-markdown-agentes-ia-md-por-url/ | 24 |
| /blog/geo-optimizar-web-agentes-ia-llms-txt/ | 24 |
| /guia/guia-desarrollo-software-moderno/ | 20 |
| /2008/05/18/%C2%BFcual-es-la-historia-del-corte-ingles/ | 20 |
| /2009/03/22/la-venta-personal-en-internet-saas-paas/ | 19 |
| /2025/04/14/la-guia-definitiva-sobre-el-protocolo-de-contexto-del-modelo-mcp/ | 19 |
| /llms.txt | 19 |
| /2008/03/12/%C2%BFque-es-un-producto/ | 18 |
| /blog/montar-agente-de-voz-ia-que-atienda-llamadas/ | 18 |
| /guia/guia-herramientas-productividad-2026/ | 16 |
| /sobre/ | 16 |
| /wp-content/uploads/ | 16 |
| /guia/guia-ia-generativa-creacion-contenido/ | 15 |

## Formato servido (md vs HTML)

| Familia | Markdown | llms.txt | HTML | % Markdown | Sin medir |
| --- | --- | --- | --- | --- | --- |
| Búsqueda generativa | 14 | 1 | 378 | 3.6% | 1712 |
| Buscador clásico | 0 | 3 | 437 | 0.0% | 571 |
| Entrenamiento | 542 | 3 | 1852 | 22.6% | 931 |
| Agentes en vivo | 0 | 0 | 121 | 0.0% | 68 |

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
