# Informe de rastreadores de IA (GEO)

Fecha de generacion: 2026-09-27T09:42:26.541Z
Origen: https://crearsoftware.com
Ventana: ultimos 28 dias
Peticiones de agentes contabilizadas: 3927

## Por familia

| Familia | Peticiones | Por que importa |
| --- | --- | --- |
| Entrenamiento | 2347 | Alimentan el conocimiento base del modelo |
| Buscador clásico | 600 | SEO tradicional, referencia de comparacion |
| Búsqueda generativa | 777 | Construyen el indice que el modelo consulta al responder |
| Agentes en vivo | 203 | Visitan porque un usuario esta preguntando ahora: generan la cita |

## Por agente

| Agente | Familia | Peticiones |
| --- | --- | --- |
| Amazonbot | Entrenamiento | 1654 |
| Bingbot | Búsqueda generativa | 626 |
| Googlebot | Buscador clásico | 600 |
| ClaudeBot | Entrenamiento | 586 |
| ChatGPT-User | Agentes en vivo | 182 |
| PerplexityBot | Búsqueda generativa | 104 |
| CCBot | Entrenamiento | 55 |
| OAI-SearchBot | Búsqueda generativa | 46 |
| Meta-ExternalAgent | Entrenamiento | 36 |
| Claude-User | Agentes en vivo | 21 |
| GPTBot | Entrenamiento | 16 |
| Claude-SearchBot | Búsqueda generativa | 1 |

## Paginas mas leidas por agentes

| Pagina | Peticiones |
| --- | --- |
| / | 338 |
| /blog/ | 87 |
| /2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/ | 63 |
| /2007/06/23/ejemplos-de-input-output-y-actividades/ | 48 |
| /2008/03/12/%C2%BFque-es-un-producto/ | 37 |
| /guia/guia-agentes-ia-empresas/ | 32 |
| /blog/que-es-un-algoritmo-definicion/ | 28 |
| /guia/guia-herramientas-productividad-2026/ | 22 |
| /2009/03/22/la-venta-personal-en-internet-saas-paas/ | 20 |
| /2012/04/04/como-crear-programas/ | 16 |
| /2009/06/04/que-son-los-stakeholder/ | 15 |
| /2007/06/11/oss-en-universidad-de-limerick/ | 14 |
| /2007/10/27/%C2%BFcuales-son-las-orientaciones-culturales-segun-harrison1972/ | 14 |
| /2025/01/08/ia-en-2025-las-10-tendencias-mas-destacadas/ | 13 |
| /2025/04/14/la-guia-definitiva-sobre-el-protocolo-de-contexto-del-modelo-mcp/ | 13 |
| /2007/04/27/carta-de-bill-gates-en-favor-del-software-propietario/ | 13 |
| /2025/01/05/impacto-de-la-inteligencia-artificial-en-los-roles-creativos-en-2025/ | 12 |
| /2009/02/14/realismo-idealismo-y-constructivismo/ | 11 |
| /2013/06/17/vender-software-por-internet/ | 11 |
| /guia/guia-desarrollo-software-moderno/ | 11 |

## Formato servido (md vs HTML)

| Familia | Markdown | llms.txt | HTML | % Markdown | Sin medir |
| --- | --- | --- | --- | --- | --- |
| Entrenamiento | 413 | 4 | 1930 | 17.6% | 0 |
| Buscador clásico | 0 | 4 | 596 | 0.0% | 0 |
| Búsqueda generativa | 148 | 1 | 628 | 19.0% | 0 |
| Agentes en vivo | 0 | 0 | 203 | 0.0% | 0 |

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
