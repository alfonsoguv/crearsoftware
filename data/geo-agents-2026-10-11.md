# Informe de rastreadores de IA (GEO)

Fecha de generacion: 2026-10-11T18:16:49.165Z
Origen: https://crearsoftware.com
Ventana: ultimos 28 dias
Peticiones de agentes contabilizadas: 5653

## Por familia

| Familia | Peticiones | Por que importa |
| --- | --- | --- |
| Entrenamiento | 3758 | Alimentan el conocimiento base del modelo |
| Búsqueda generativa | 989 | Construyen el indice que el modelo consulta al responder |
| Buscador clásico | 662 | SEO tradicional, referencia de comparacion |
| Agentes en vivo | 244 | Visitan porque un usuario esta preguntando ahora: generan la cita |

## Por agente

| Agente | Familia | Peticiones |
| --- | --- | --- |
| GPTBot | Entrenamiento | 1318 |
| Meta-ExternalAgent | Entrenamiento | 1195 |
| Amazonbot | Entrenamiento | 832 |
| Bingbot | Búsqueda generativa | 774 |
| Googlebot | Buscador clásico | 662 |
| ClaudeBot | Entrenamiento | 368 |
| ChatGPT-User | Agentes en vivo | 218 |
| PerplexityBot | Búsqueda generativa | 125 |
| OAI-SearchBot | Búsqueda generativa | 90 |
| CCBot | Entrenamiento | 45 |
| Claude-User | Agentes en vivo | 26 |

## Paginas mas leidas por agentes

| Pagina | Peticiones |
| --- | --- |
| / | 380 |
| /blog/ | 137 |
| /2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/ | 44 |
| /2008/03/12/%C2%BFque-es-un-producto/ | 38 |
| /2007/06/23/ejemplos-de-input-output-y-actividades/ | 38 |
| /blog/que-es-un-algoritmo-definicion/ | 34 |
| /blog/que-es-un-diagrama-de-flujo/ | 27 |
| /guia/guia-agentes-ia-empresas/ | 26 |
| /2009/03/22/la-venta-personal-en-internet-saas-paas/ | 22 |
| /blog/que-es-un-servicio-nativo-de-ia/ | 20 |
| /blog/la-fabricacion-vibe-ya-esta-aqui/ | 18 |
| /blog/que-es-un-forward-deployed-engineer/ | 16 |
| /blog/que-es-el-pseudocodigo/ | 15 |
| /2013/06/17/vender-software-por-internet/ | 15 |
| /2025/02/13/novedades-de-alexa-la-ia-generativa-revoluciona-asistentes-de-voz/ | 14 |
| /2009/06/04/que-son-los-stakeholder/ | 14 |
| /llms.txt | 13 |
| /guia/guia-herramientas-productividad-2026/ | 13 |
| /blog/que-es-un-token-en-ia-definicion/ | 12 |
| /blog/que-es-una-variable-en-programacion/ | 12 |

## Formato servido (md vs HTML)

| Familia | Markdown | llms.txt | HTML | % Markdown | Sin medir |
| --- | --- | --- | --- | --- | --- |
| Entrenamiento | 1091 | 3 | 2664 | 29.0% | 0 |
| Búsqueda generativa | 158 | 0 | 831 | 16.0% | 0 |
| Buscador clásico | 0 | 10 | 652 | 0.0% | 0 |
| Agentes en vivo | 0 | 0 | 244 | 0.0% | 0 |

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
