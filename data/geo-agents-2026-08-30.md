# Informe de rastreadores de IA (GEO)

Fecha de generacion: 2026-08-30T10:23:24.460Z
Origen: https://crearsoftware.com
Ventana: ultimos 28 dias
Peticiones de agentes contabilizadas: 8525

## Por familia

| Familia | Peticiones | Por que importa |
| --- | --- | --- |
| Entrenamiento | 5307 | Alimentan el conocimiento base del modelo |
| Búsqueda generativa | 1844 | Construyen el indice que el modelo consulta al responder |
| Buscador clásico | 1155 | SEO tradicional, referencia de comparacion |
| Agentes en vivo | 219 | Visitan porque un usuario esta preguntando ahora: generan la cita |

## Por agente

| Agente | Familia | Peticiones |
| --- | --- | --- |
| GPTBot | Entrenamiento | 2087 |
| Bingbot | Búsqueda generativa | 1720 |
| Amazonbot | Entrenamiento | 1448 |
| Googlebot | Buscador clásico | 1155 |
| ClaudeBot | Entrenamiento | 1101 |
| CCBot | Entrenamiento | 664 |
| ChatGPT-User | Agentes en vivo | 201 |
| PerplexityBot | Búsqueda generativa | 93 |
| OAI-SearchBot | Búsqueda generativa | 29 |
| Claude-User | Agentes en vivo | 17 |
| Meta-ExternalAgent | Entrenamiento | 5 |
| Claude-SearchBot | Búsqueda generativa | 2 |
| Google-Extended | Entrenamiento | 1 |
| Perplexity-User | Agentes en vivo | 1 |
| cohere-ai | Entrenamiento | 1 |

## Paginas mas leidas por agentes

| Pagina | Peticiones |
| --- | --- |
| / | 348 |
| /blog/ | 181 |
| /2025/02/13/novedades-de-alexa-la-ia-generativa-revoluciona-asistentes-de-voz/ | 160 |
| /2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/ | 74 |
| /2007/06/23/ejemplos-de-input-output-y-actividades/ | 67 |
| /guia/guia-agentes-ia-empresas/ | 47 |
| /2012/04/04/como-crear-programas/ | 28 |
| /guia/guia-desarrollo-software-moderno/ | 26 |
| /2009/03/22/la-venta-personal-en-internet-saas-paas/ | 25 |
| /guia/guia-herramientas-productividad-2026/ | 23 |
| /blog/geo-optimizar-web-agentes-ia-llms-txt/ | 23 |
| /blog/servir-markdown-agentes-ia-md-por-url/ | 22 |
| /2008/03/12/%C2%BFque-es-un-producto/ | 20 |
| /2025/04/14/la-guia-definitiva-sobre-el-protocolo-de-contexto-del-modelo-mcp/ | 19 |
| /categoria/desarrollo-software/ | 18 |
| /sobre/ | 18 |
| /guia/guia-ia-generativa-creacion-contenido/ | 17 |
| /2015/05/18/historia-del-crm/ | 16 |
| /llms.txt | 16 |
| /wp-content/uploads/ | 16 |

## Formato servido (md vs HTML)

| Familia | Markdown | llms.txt | HTML | % Markdown | Sin medir |
| --- | --- | --- | --- | --- | --- |
| Entrenamiento | 1152 | 3 | 3268 | 26.0% | 884 |
| Búsqueda generativa | 31 | 1 | 522 | 5.6% | 1290 |
| Buscador clásico | 0 | 4 | 679 | 0.0% | 472 |
| Agentes en vivo | 0 | 0 | 178 | 0.0% | 41 |

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
