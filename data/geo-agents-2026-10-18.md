# Informe de rastreadores de IA (GEO)

Fecha de generacion: 2026-10-18T09:39:49.902Z
Origen: https://crearsoftware.com
Ventana: ultimos 28 dias
Peticiones de agentes contabilizadas: 5804

## Por familia

| Familia | Peticiones | Por que importa |
| --- | --- | --- |
| Entrenamiento | 3883 | Alimentan el conocimiento base del modelo |
| Búsqueda generativa | 990 | Construyen el indice que el modelo consulta al responder |
| Buscador clásico | 684 | SEO tradicional, referencia de comparacion |
| Agentes en vivo | 247 | Visitan porque un usuario esta preguntando ahora: generan la cita |

## Por agente

| Agente | Familia | Peticiones |
| --- | --- | --- |
| GPTBot | Entrenamiento | 1314 |
| Meta-ExternalAgent | Entrenamiento | 1193 |
| Amazonbot | Entrenamiento | 853 |
| Bingbot | Búsqueda generativa | 779 |
| Googlebot | Buscador clásico | 684 |
| ClaudeBot | Entrenamiento | 478 |
| ChatGPT-User | Agentes en vivo | 224 |
| PerplexityBot | Búsqueda generativa | 113 |
| OAI-SearchBot | Búsqueda generativa | 98 |
| CCBot | Entrenamiento | 45 |
| Claude-User | Agentes en vivo | 23 |

## Paginas mas leidas por agentes

| Pagina | Peticiones |
| --- | --- |
| / | 386 |
| /blog/ | 140 |
| /blog/que-es-un-algoritmo-definicion/ | 38 |
| /blog/que-es-un-diagrama-de-flujo/ | 38 |
| /2008/03/12/%C2%BFque-es-un-producto/ | 37 |
| /2007/06/23/ejemplos-de-input-output-y-actividades/ | 37 |
| /blog/la-fabricacion-vibe-ya-esta-aqui/ | 31 |
| /2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/ | 30 |
| /blog/que-es-un-servicio-nativo-de-ia/ | 26 |
| /guia/guia-agentes-ia-empresas/ | 26 |
| /2009/03/22/la-venta-personal-en-internet-saas-paas/ | 25 |
| /blog/agentes-en-la-economia-patrick-collison/ | 21 |
| /blog/que-es-un-forward-deployed-engineer/ | 19 |
| /blog/que-es-el-pseudocodigo/ | 19 |
| /blog/que-es-una-variable-en-programacion/ | 18 |
| /categoria/desarrollo-software/ | 16 |
| /guia/guia-desarrollo-software-moderno/ | 16 |
| /llms.txt | 15 |
| /blog/embudo-capacidad-llm-andrej-karpathy/ | 14 |
| /2012/04/04/como-crear-programas/ | 13 |

## Formato servido (md vs HTML)

| Familia | Markdown | llms.txt | HTML | % Markdown | Sin medir |
| --- | --- | --- | --- | --- | --- |
| Entrenamiento | 1086 | 3 | 2794 | 28.0% | 0 |
| Búsqueda generativa | 130 | 1 | 859 | 13.1% | 0 |
| Buscador clásico | 0 | 11 | 673 | 0.0% | 0 |
| Agentes en vivo | 0 | 0 | 247 | 0.0% | 0 |

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
