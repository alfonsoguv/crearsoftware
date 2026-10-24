# Informe de rastreadores de IA (GEO)

Fecha de generacion: 2026-10-24T10:38:29.847Z
Origen: https://crearsoftware.com
Ventana: ultimos 28 dias
Peticiones de agentes contabilizadas: 6582

## Por familia

| Familia | Peticiones | Por que importa |
| --- | --- | --- |
| Entrenamiento | 4155 | Alimentan el conocimiento base del modelo |
| Búsqueda generativa | 1275 | Construyen el indice que el modelo consulta al responder |
| Agentes en vivo | 274 | Visitan porque un usuario esta preguntando ahora: generan la cita |
| Buscador clásico | 878 | SEO tradicional, referencia de comparacion |

## Por agente

| Agente | Familia | Peticiones |
| --- | --- | --- |
| GPTBot | Entrenamiento | 1314 |
| Meta-ExternalAgent | Entrenamiento | 1202 |
| Amazonbot | Entrenamiento | 1060 |
| Bingbot | Búsqueda generativa | 1005 |
| Googlebot | Buscador clásico | 878 |
| ClaudeBot | Entrenamiento | 534 |
| ChatGPT-User | Agentes en vivo | 248 |
| PerplexityBot | Búsqueda generativa | 144 |
| OAI-SearchBot | Búsqueda generativa | 126 |
| CCBot | Entrenamiento | 45 |
| Claude-User | Agentes en vivo | 26 |

## Paginas mas leidas por agentes

| Pagina | Peticiones |
| --- | --- |
| / | 475 |
| /blog/ | 180 |
| /blog/que-es-un-algoritmo-definicion/ | 48 |
| /2007/06/23/ejemplos-de-input-output-y-actividades/ | 46 |
| /blog/que-es-un-diagrama-de-flujo/ | 46 |
| /2008/03/12/%C2%BFque-es-un-producto/ | 44 |
| /2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/ | 34 |
| /blog/la-fabricacion-vibe-ya-esta-aqui/ | 33 |
| /blog/agentes-en-la-economia-patrick-collison/ | 30 |
| /2009/03/22/la-venta-personal-en-internet-saas-paas/ | 30 |
| /guia/guia-agentes-ia-empresas/ | 29 |
| /blog/que-es-un-servicio-nativo-de-ia/ | 28 |
| /blog/que-es-el-pseudocodigo/ | 26 |
| /blog/que-es-un-forward-deployed-engineer/ | 26 |
| /blog/ser-mas-ambicioso-con-la-ia-felix-rieseberg/ | 24 |
| /categoria/desarrollo-software/ | 23 |
| /blog/que-es-una-variable-en-programacion/ | 22 |
| /blog/embudo-capacidad-llm-andrej-karpathy/ | 18 |
| /guia/guia-desarrollo-software-moderno/ | 18 |
| /blog/que-es-un-bucle-en-programacion/ | 17 |

## Formato servido (md vs HTML)

| Familia | Markdown | llms.txt | HTML | % Markdown | Sin medir |
| --- | --- | --- | --- | --- | --- |
| Entrenamiento | 1095 | 4 | 3056 | 26.4% | 0 |
| Búsqueda generativa | 169 | 1 | 1105 | 13.3% | 0 |
| Agentes en vivo | 0 | 0 | 274 | 0.0% | 0 |
| Buscador clásico | 0 | 12 | 866 | 0.0% | 0 |

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
