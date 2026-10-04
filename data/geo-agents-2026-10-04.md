# Informe de rastreadores de IA (GEO)

Fecha de generacion: 2026-10-04T18:24:51.921Z
Origen: https://crearsoftware.com
Ventana: ultimos 28 dias
Peticiones de agentes contabilizadas: 6088

## Por familia

| Familia | Peticiones | Por que importa |
| --- | --- | --- |
| Entrenamiento | 4233 | Alimentan el conocimiento base del modelo |
| Búsqueda generativa | 945 | Construyen el indice que el modelo consulta al responder |
| Agentes en vivo | 232 | Visitan porque un usuario esta preguntando ahora: generan la cita |
| Buscador clásico | 678 | SEO tradicional, referencia de comparacion |

## Por agente

| Agente | Familia | Peticiones |
| --- | --- | --- |
| GPTBot | Entrenamiento | 1316 |
| Amazonbot | Entrenamiento | 1259 |
| Meta-ExternalAgent | Entrenamiento | 1111 |
| Bingbot | Búsqueda generativa | 745 |
| Googlebot | Buscador clásico | 678 |
| ClaudeBot | Entrenamiento | 535 |
| ChatGPT-User | Agentes en vivo | 213 |
| PerplexityBot | Búsqueda generativa | 121 |
| OAI-SearchBot | Búsqueda generativa | 78 |
| Claude-User | Agentes en vivo | 19 |
| CCBot | Entrenamiento | 12 |
| Claude-SearchBot | Búsqueda generativa | 1 |

## Paginas mas leidas por agentes

| Pagina | Peticiones |
| --- | --- |
| / | 378 |
| /blog/ | 119 |
| /2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/ | 52 |
| /2007/06/23/ejemplos-de-input-output-y-actividades/ | 45 |
| /2008/03/12/%C2%BFque-es-un-producto/ | 43 |
| /guia/guia-agentes-ia-empresas/ | 31 |
| /blog/que-es-un-algoritmo-definicion/ | 28 |
| /2009/03/22/la-venta-personal-en-internet-saas-paas/ | 21 |
| /guia/guia-herramientas-productividad-2026/ | 16 |
| /2007/06/11/oss-en-universidad-de-limerick/ | 15 |
| /blog/que-es-un-diagrama-de-flujo/ | 14 |
| /2012/04/04/como-crear-programas/ | 14 |
| /2013/06/17/vender-software-por-internet/ | 14 |
| /2025/04/14/la-guia-definitiva-sobre-el-protocolo-de-contexto-del-modelo-mcp/ | 13 |
| /2025/02/13/novedades-de-alexa-la-ia-generativa-revoluciona-asistentes-de-voz/ | 12 |
| /2009/06/04/que-son-los-stakeholder/ | 12 |
| /2009/02/14/percepcion-y-cultura/ | 12 |
| /2025/01/08/ia-en-2025-las-10-tendencias-mas-destacadas/ | 12 |
| /2008/05/18/%C2%BFcual-es-la-historia-del-corte-ingles/ | 11 |
| /llms.txt | 11 |

## Formato servido (md vs HTML)

| Familia | Markdown | llms.txt | HTML | % Markdown | Sin medir |
| --- | --- | --- | --- | --- | --- |
| Entrenamiento | 1273 | 3 | 2957 | 30.1% | 0 |
| Búsqueda generativa | 168 | 1 | 776 | 17.8% | 0 |
| Agentes en vivo | 0 | 0 | 232 | 0.0% | 0 |
| Buscador clásico | 0 | 7 | 671 | 0.0% | 0 |

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
