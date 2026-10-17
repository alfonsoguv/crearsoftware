# Informe de rastreadores de IA (GEO)

Fecha de generacion: 2026-10-17T16:16:51.986Z
Origen: https://crearsoftware.com
Ventana: ultimos 28 dias
Peticiones de agentes contabilizadas: 5788

## Por familia

| Familia | Peticiones | Por que importa |
| --- | --- | --- |
| Entrenamiento | 3857 | Alimentan el conocimiento base del modelo |
| Búsqueda generativa | 990 | Construyen el indice que el modelo consulta al responder |
| Buscador clásico | 693 | SEO tradicional, referencia de comparacion |
| Agentes en vivo | 248 | Visitan porque un usuario esta preguntando ahora: generan la cita |

## Por agente

| Agente | Familia | Peticiones |
| --- | --- | --- |
| GPTBot | Entrenamiento | 1314 |
| Meta-ExternalAgent | Entrenamiento | 1201 |
| Amazonbot | Entrenamiento | 816 |
| Bingbot | Búsqueda generativa | 782 |
| Googlebot | Buscador clásico | 693 |
| ClaudeBot | Entrenamiento | 481 |
| ChatGPT-User | Agentes en vivo | 225 |
| PerplexityBot | Búsqueda generativa | 111 |
| OAI-SearchBot | Búsqueda generativa | 97 |
| CCBot | Entrenamiento | 45 |
| Claude-User | Agentes en vivo | 23 |

## Paginas mas leidas por agentes

| Pagina | Peticiones |
| --- | --- |
| / | 390 |
| /blog/ | 138 |
| /2007/06/23/ejemplos-de-input-output-y-actividades/ | 38 |
| /blog/que-es-un-diagrama-de-flujo/ | 37 |
| /blog/que-es-un-algoritmo-definicion/ | 37 |
| /2008/03/12/%C2%BFque-es-un-producto/ | 37 |
| /blog/la-fabricacion-vibe-ya-esta-aqui/ | 31 |
| /2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/ | 31 |
| /guia/guia-agentes-ia-empresas/ | 27 |
| /blog/que-es-un-servicio-nativo-de-ia/ | 26 |
| /2009/03/22/la-venta-personal-en-internet-saas-paas/ | 24 |
| /blog/agentes-en-la-economia-patrick-collison/ | 20 |
| /blog/que-es-un-forward-deployed-engineer/ | 19 |
| /blog/que-es-el-pseudocodigo/ | 19 |
| /blog/que-es-una-variable-en-programacion/ | 16 |
| /categoria/desarrollo-software/ | 15 |
| /llms.txt | 15 |
| /guia/guia-desarrollo-software-moderno/ | 15 |
| /blog/embudo-capacidad-llm-andrej-karpathy/ | 14 |
| /2025/02/13/novedades-de-alexa-la-ia-generativa-revoluciona-asistentes-de-voz/ | 13 |

## Formato servido (md vs HTML)

| Familia | Markdown | llms.txt | HTML | % Markdown | Sin medir |
| --- | --- | --- | --- | --- | --- |
| Entrenamiento | 1094 | 3 | 2760 | 28.4% | 0 |
| Búsqueda generativa | 134 | 1 | 855 | 13.5% | 0 |
| Buscador clásico | 0 | 11 | 682 | 0.0% | 0 |
| Agentes en vivo | 0 | 0 | 248 | 0.0% | 0 |

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
