---
title: "Cómo montar un agente de voz con IA que atienda las llamadas de tu empresa"
slug: "montar-agente-de-voz-ia-que-atienda-llamadas"
date: "2026-08-01"
dateModified: "2026-08-01"
description: "Cómo montar un agente de voz con IA que atienda llamadas en España: rutas, arquitectura, coste por minuto, integración con CRM y qué falla en producción."
category: "inteligencia-artificial"
tags: ["agentes de voz", "inteligencia artificial", "ia conversacional", "automatización", "crm", "mcp"]
readingTime: 11
author: "Alfonso Gutiérrez"
wordCount: 2550
image: ""
---

**Montar un agente de voz con IA que atienda llamadas consiste en unir cinco piezas: numeración telefónica, una capa de voz en tiempo real, un modelo que decida qué decir, acceso a los datos donde está la respuesta y una salida hacia una persona cuando la conversación se tuerce.** Solo una de esas cinco piezas es inteligencia artificial. Las otras cuatro son integración, y son las que deciden si el proyecto funciona o se queda en demostración.

La parte de hablar lleva dos años resuelta y es la más barata del sistema. Lo difícil es que el agente **resuelva** —consultar un pedido, cambiar una cita, cualificar un contacto—, y eso no lo vende ningún proveedor.

Esto no es una comparativa de proveedores: para eso está la [comparativa de plataformas de agentes de voz](/2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/). Si vienes de más atrás, la [guía de agentes de IA para empresas](/guia/guia-agentes-ia-empresas/) sitúa la voz en el panorama completo.

## ¿Qué hace falta para crear un agente de voz con IA que atienda llamadas en España?

Hacen falta cinco componentes —numeración, voz, modelo, datos y escalado— y alguien que decida qué ocurre cuando el agente se equivoca, que es una decisión de negocio y no de tecnología.

| Pieza | Qué resuelve | Dónde falla |
|---|---|---|
| **Numeración y troncal SIP** | Que exista un teléfono al que llamar | Los números geográficos españoles exigen acreditar una dirección local; un apartado de correos no vale |
| **Capa de voz en tiempo real** | Escuchar, detectar el fin de turno y responder | Corta al cliente cuando este hace una pausa para pensar |
| **Modelo conversacional** | Decidir qué se dice y qué se ejecuta | Se le pide improvisar en vez de acotarle el guion |
| **Acceso a datos (CRM, ERP, agenda)** | Que la llamada se resuelva, no solo se conteste | El sistema interno no se puede consultar por API |
| **Escalado a una persona** | Salir con dignidad de lo que no sabe | No se diseña: se descubre en producción |

Hay además un requisito no técnico que entra en vigor justo ahora: el **artículo 50 del Reglamento Europeo de IA** obliga, desde el **2 de agosto de 2026**, a informar de que se está hablando con una IA salvo que resulte obvio, con sanciones de hasta 15 millones de euros o el 3 % de la facturación anual mundial. Se resuelve con una frase en el saludo, escrita en el guion y no dejada al criterio del modelo. Y la voz grabada es un dato personal: el RGPD exige base legal, retención y región de procesamiento.

## ¿Comprar una plataforma, desarrollarlo a medida o contratar una agencia de IA de voz?

Las tres son válidas y la elección no depende del presupuesto, sino de dos números: **cuántas intenciones debe cubrir el agente y cuántos sistemas internos tiene que tocar**. Pocas intenciones e integraciones estándar, comprar; muchas integraciones propias, construir; sin equipo técnico, delegar.

| Ruta | Cuándo tiene sentido | Qué controlas | Riesgo principal |
|---|---|---|---|
| **Plataforma SaaS** | 1-3 intenciones claras, integraciones habituales | El guion y poco más | El techo: lo que no contempla, no tiene salida |
| **Desarrollo a medida sobre un SDK** | Integraciones propias, exigencias de latencia o residencia del dato | Todo: modelo, transporte, datos | Lo que montas, lo mantienes |
| **Agencia de IA de voz** | No hay equipo interno y el caso es comercial | El resultado, no el sistema | Opacidad: exige transcripciones y propiedad del guion |

La ruta a medida se ha abaratado porque la infraestructura de voz en tiempo real ya está resuelta por terceros. En Vidiv construimos [Victoria, un agente de voz para cualificación comercial](/2024/10/24/ventas-inteligentes-por-voz/) sobre WebRTC y LiveKit, y la lección resume el apartado: el motor conversacional fue lo rápido; lo lento fue programarla para **actuar** —seguir un guion, escribir en el CRM, avisar al comercial—. Para contexto de mercado, el [análisis del panorama de agentes de voz](/2025/03/10/agentes-de-voz-con-ia-analisis-completo-del-panorama-2025/) recoge por dónde va la inversión.

## ¿Qué piezas lleva dentro un agente de voz telefónico: SIP, STT, LLM y TTS o un modelo de voz a voz (S2S)?

Hay dos arquitecturas. La **cascada** encadena transcripción (STT), modelo de texto (LLM) y síntesis de voz (TTS); el **modelo de voz a voz (S2S)** procesa el audio de extremo a extremo en una pasada. La diferencia práctica no es la calidad de la voz: es la latencia y la gestión de los turnos.

La referencia no es arbitraria. El estudio de Stivers y colaboradores publicado en PNAS en 2009 midió el intervalo entre turnos en diez lenguas y encontró un patrón universal: la respuesta se concentra en los **primeros 200 milisegundos**. Por encima de ese umbral la conversación deja de sentirse natural, y por teléfono el silencio se interpreta como una caída de línea.

En una cascada ese presupuesto se reparte entre cinco tramos —red, detección de fin de turno, transcripción, inferencia y síntesis— y el error de uno se propaga al siguiente: una transcripción mala genera una respuesta mala con voz impecable. El S2S elimina dos saltos y gestiona interrupciones de forma nativa, a cambio de perder el texto intermedio. La comparación detallada está en el artículo sobre [modelos de voz a voz (S2S)](/2025/01/04/modelos-de-voz-a-voz-s2s-la-revolucion-en-la-ia-conversacional/).

Un detalle que ahorra semanas: las APIs de voz en tiempo real actuales admiten **WebRTC, WebSocket y SIP**, y aceptar SIP significa conectar el agente a la telefonía sin pasarela intermedia, el trozo más ingrato del proyecto hace un año.

## ¿Cuánto cuesta desarrollar un agente de voz a medida?

El coste variable por minuto es pequeño y predecible; el coste fijo de integración es el que decide el proyecto. Quien pregunta por el precio suele preguntar por lo primero, y le va a doler lo segundo.

| Partida | Naturaleza | Referencia pública |
|---|---|---|
| Numeración y telefonía | Fija + variable | Minuto entrante terminado por SIP ~0,0040 $ (tarifa pública de Twilio para España, columna de llamadas recibidas). El número lo pone un operador con presencia local |
| Capa conversacional gestionada | Por minuto | ~0,08 $/min en ElevenLabs Agents, con LLM y telefonía aparte; 0,16 $/min al superar la concurrencia contratada |
| Modelo propio de voz a voz | Por tokens de audio | 32 $/millón de tokens de audio de entrada y 64 $ de salida en `gpt-realtime-2.1`; 10 $ y 20 $ en la variante *mini* |
| Integración con CRM y ERP | Fijo, por sistema | Sin tarifa pública: depende de si tus datos se consultan por API |
| Operación y mejora | Fijo mensual | Revisar transcripciones, ajustar el guion, cubrir casos de fallo |

Con esas cifras, una llamada entrante de tres minutos cuesta **0,24 $ de plataforma más 0,01 $ de telefonía: unos 0,25 $**. Mil llamadas al mes salen por 250 $ de coste variable, un número que sorprende en la dirección contraria a la esperada.

Esa fila esconde las dos trampas en las que cae casi todo el que presupuesta con la calculadora de Twilio. La primera: **Twilio no vende números geográficos españoles con voz**. España no aparece en su catálogo de numeración y su propia tarifa lo admite —no hay números con voz en este territorio, se usan los de más de noventa países—, así que el 1,15 $/mes que figura ahí es el precio de partida de un número internacional cualquiera, no de un fijo español. Ese número hay que contratarlo a un operador con presencia en España y no tiene tarifa pública comparable, así que no le pongo cifra. La segunda: los 0,0178 $/min que Twilio publica para España son el minuto **saliente** hacia fijo, no el entrante. Confundirlos multiplica por más de cuatro el coste de telefonía de un sistema que solo recibe llamadas.

El debate sobre el precio por minuto está mal planteado: el presupuesto lo fija el número de sistemas a integrar y el de intenciones a cubrir, trabajo humano no repetible. No doy una horquilla de precio de agencia porque no hay dato público verificable; sí doy el criterio: **cuenta integraciones, cuenta intenciones y multiplica**. En [nuestro caso](/2024/10/24/ventas-inteligentes-por-voz/) el grueso del esfuerzo fue eso.

## ¿Cómo consulta el agente el CRM o el ERP para resolver y no solo hablar?

El agente consulta los sistemas mediante **llamadas a herramientas durante la conversación**: invoca una función que interroga tu API y sigue hablando con la respuesta. Sin esa capa es un contestador elocuente que no resuelve nada.

Hay dos formas de construirla. La clásica es definir a mano una función por operación —consultar pedido, cambiar cita, crear oportunidad— y mantener ese catálogo. La estandarizada es exponer los sistemas mediante el [protocolo de contexto del modelo (MCP)](/2025/04/14/la-guia-definitiva-sobre-el-protocolo-de-contexto-del-modelo-mcp/), para que el mismo servidor sirva al agente de voz y a los que vengan después.

El problema real no es la conexión, es el tiempo: un ERP que tarda cuatro segundos rompe la conversación. Hay tres salidas, y conviene elegirlas de antemano: cachear lo que cambia poco, cubrir la espera con una frase del agente o resolver la operación de forma asíncrona. Y una regla de seguridad: **las lecturas pueden ser automáticas, las escrituras deben confirmarse en voz**, porque un dato mal entendido en el CRM es peor que una llamada sin resolver.

Antes de programar nada, modela la llamada como el proceso que es. Ese ejercicio —el de [ejemplos de input, output y actividades](/2007/06/23/ejemplos-de-input-output-y-actividades/), cuyo apartado sobre IA para SDR aplica directamente— revela qué datos necesita el agente al entrar y qué debe dejar escrito al salir.

## ¿Qué plataformas usan las empresas para desarrollar, probar y desplegar agentes de voz?

No usan una plataforma, usan una cadena de cuatro capas. Creer que el proveedor de voz cubre las cuatro es la confusión habitual: cubre una o dos, y las que faltan se echan de menos pronto.

| Capa | Qué resuelve | La pregunta al elegir |
|---|---|---|
| **Transporte** | Llevar el audio: WebRTC en web, SIP en telefonía | ¿Conecta con mi centralita o solo con la web? |
| **Orquestación** | Turnos, herramientas, estado de la conversación | ¿Puedo versionar el guion y volver atrás? |
| **Evaluación** | Repetir llamadas conocidas tras cada cambio | ¿Sé si el cambio de ayer ha empeorado algo? |
| **Observabilidad** | Transcripción, latencia por tramo, motivo de corte | ¿Veo la latencia desglosada o solo el total? |

La capa que casi nadie tiene es la de **evaluación**, y es la que separa un piloto de un sistema en producción: sin un conjunto de llamadas de regresión no sabes que has degradado el guion hasta que se queja un cliente. Sobre qué proveedor ocupa cada capa, el detalle está en la [comparativa de plataformas de agentes de voz](/2025/03/29/plataformas-de-agentes-de-voz-con-ia-en-europa-especial-foco-en-espana/).

## ¿Qué se rompe al pasar a producción: latencia, interrupciones y conversaciones de varios turnos?

Se rompen cuatro cosas y ninguna aparece en la demostración: la detección del fin de turno, la interrupción, la coherencia a lo largo de varios turnos y el comportamiento bajo concurrencia. Todas funcionan con un interlocutor tranquilo en una sala silenciosa, el escenario en el que nunca se usan.

**El fin de turno.** El sistema decide que has terminado cuando detecta silencio, pero quien dicta un DNI o recuerda un número de pedido hace pausas de más de un segundo y el agente lo interrumpe. Subir el umbral evita cortes y añade latencia a cada turno: se calibra con llamadas reales, no con los valores por defecto.

**La interrupción del cliente.** Cuando alguien corta al agente a mitad de frase, el sistema debe callar de inmediato y entender lo que se le ha dicho. Los modelos de voz a voz lo gestionan de forma nativa; en una cascada hay que implementarlo, y es donde más proyectos se quedan a medias. Los [retos técnicos del español](/2025/01/04/modelos-de-voz-a-voz-s2s-la-revolucion-en-la-ia-conversacional/) —acentos, ruido, manos libres del coche— lo agravan todo a la vez.

**Los varios turnos.** Pasado el cuarto o quinto intercambio el agente empieza a repetir preguntas ya respondidas o a olvidar lo acordado. Se corrige manteniendo un estado explícito de la llamada —qué se ha confirmado y qué falta— en vez de confiar en el historial.

**La concurrencia.** Diez llamadas simultáneas no son diez veces una llamada: los planes gestionados la limitan y penalizan el exceso, que puede duplicar el coste por minuto. Dimensiona por el pico, no por la media.

## ¿Cuándo no merece la pena montar un agente de voz?

No merece la pena en tres situaciones: volumen de llamadas bajo, datos que no se pueden consultar por API y llamadas sin resolución definible.

Con **volumen bajo** los números se explican solos: cuarenta llamadas al mes son unos diez dólares de coste variable y todo lo demás es coste fijo. Ese proyecto solo se sostiene si cada llamada vale mucho: una consulta comercial entrante puede valerlo, una de horario no. Si tu ERP o tu CRM **no se pueden consultar de forma programática**, el proyecto no es de voz: es de exponer una API, y ese es el trabajo a presupuestar primero. Y si la llamada exige escuchar un problema difuso y decidir con criterio, el agente solo sirve para recoger datos y pasar a una persona.

Un último caso, más incómodo: cuando lo que se quiere automatizar es la insatisfacción. Un agente delante de un problema de servicio no lo arregla, lo hace más barato de ignorar. Los clientes lo notan.

La tecnología de voz ya no es el cuello de botella; lo caro sigue siendo definir qué debe resolver la llamada y conectar los sistemas donde está la respuesta. Empieza por el proceso: escribe las diez llamadas más frecuentes que recibes, marca cuáles se resuelven con un solo dato y monta el agente solo para esas.

## Preguntas frecuentes sobre agentes de voz con IA que atienden llamadas

### ¿Cuánto se tarda en poner en marcha un agente de voz que atienda llamadas?

Depende de las integraciones. Un agente que solo informa y toma datos puede atender llamadas reales en semanas sobre una plataforma gestionada; uno que consulta y escribe en un ERP propio tarda lo que tarde exponer esa API, que es el camino crítico. La conversación rara vez retrasa el proyecto.

### ¿Cuánto cuesta un minuto de conversación con un agente de voz?

Con tarifas públicas actuales, algo más de 0,08 $: unos 0,08 $ de plataforma conversacional gestionada (ElevenLabs Agents) más unos 0,0040 $ del minuto entrante terminado por SIP (tarifa de Twilio para España), con el modelo facturado aparte. Los 0,0178 $/min que se citan a menudo son el minuto saliente hacia fijo español, no el entrante. El número va aparte y no tiene tarifa pública comparable: Twilio no ofrece numeración geográfica española con voz, así que hay que contratarla a un operador con presencia en España. Si montas el modelo tú, `gpt-realtime-2.1` se factura por tokens de audio: 32 $ el millón de entrada y 64 $ el de salida.

### ¿Hay que avisar de que quien atiende la llamada es una IA?

Sí. El artículo 50 del Reglamento Europeo de IA, aplicable desde el 2 de agosto de 2026, exige que los sistemas diseñados para interactuar directamente con personas informen de que se trata de una IA, salvo que resulte evidente; las sanciones llegan a 15 millones de euros o el 3 % de la facturación anual mundial. Además, la voz grabada es un dato personal sujeto al RGPD: necesitas base legal y política de retención.

### ¿Puede un agente de voz consultar el ERP de una pyme?

Sí, pero el camino habitual no es una integración nativa sino una API intermedia que exponga solo los datos que el agente necesita. El factor limitante casi nunca es la voz, sino si el ERP se puede consultar de forma programática y con qué latencia: por encima de dos o tres segundos hay que cubrir la espera o ir a asíncrono.

### ¿Es mejor un modelo de voz a voz (S2S) o la cadena STT + LLM + TTS?

Para atención telefónica, el voz a voz gana en lo que más se nota —latencia e interrupciones—, porque procesa el audio en una pasada y gestiona los turnos de forma nativa. La cascada sigue teniendo sentido cuando necesitas el texto intermedio para aplicar reglas de negocio o guardar la transcripción con garantías. Muchos despliegues combinan ambos.

### ¿Qué pasa si el cliente interrumpe o el agente no entiende?

Son dos casos distintos y ambos hay que diseñarlos. La interrupción exige que el agente calle al instante y reinterprete el turno: los modelos de voz a voz lo hacen de serie, en una cascada hay que implementarlo. Para lo que no entiende, la regla es no reintentar más de dos veces y transferir a una persona.

### ¿Necesito una agencia de IA de voz o puedo montarlo con mi equipo?

Si tienes un equipo que ya mantiene integraciones con tu CRM o tu ERP, tienes la parte difícil hecha y la capa de voz se añade sobre un SDK comercial. Si no, una agencia acorta el arranque, pero pacta por escrito tres cosas: propiedad del guion, acceso a las transcripciones y posibilidad de portar el número y la lógica a otro proveedor.
