---
title: "Qué es un forward deployed engineer (FDE): el ingeniero que se queda hasta producción"
slug: "que-es-un-forward-deployed-engineer"
date: "2026-09-21"
dateModified: "2026-09-21"
description: "Un forward deployed engineer es un ingeniero de software que trabaja dentro de la empresa cliente para poner el producto de su empresa en producción, y devuelve lo aprendido al producto. En 2026 construye con agentes de IA y entrega agentes que hacen el trabajo completo de una persona. Origen en Palantir, por qué OpenAI, Anthropic, AWS y Microsoft lo han convertido en el puesto de 2026, cómo se monta un equipo según Javi Santana (Tinybird), cómo está en España y qué críticas tiene."
category: "inteligencia-artificial"
tags: ["forward deployed engineer", "fde", "agentes de ia", "servicios nativos de ia", "palantir", "definiciones", "carrera profesional"]
readingTime: 17
author: "Alfonso Gutiérrez"
wordCount: 3900
image: ""
---

**Un *forward deployed engineer* (FDE, «ingeniero desplegado en el cliente») es un ingeniero de software que trabaja para la empresa que fabrica un producto, pero lo hace dentro de la empresa cliente: entiende su problema real, integra el producto con sus sistemas y sus datos, construye lo que falta y se queda hasta que está en producción. Y, a la vuelta, lleva lo aprendido al equipo de producto.** No es un consultor, que diagnostica y se va; ni un *solutions engineer*, que hace la demo antes de la venta; ni *customer success*, que gestiona la relación después. Es el que se hace responsable de que funcione.

El término lo acuñó Palantir hace más de quince años y durante mucho tiempo fue una rareza suya. En 2026 se ha convertido en el puesto de moda de la industria: OpenAI, Anthropic, Amazon Web Services y Microsoft han creado en cuatro meses unidades enteras de FDE, y en España ya hay decenas de ofertas con ese título. Este artículo explica qué es exactamente, de dónde viene, por qué ha explotado ahora, cómo se monta un equipo —a partir de la guía que [Javi Santana](https://javisantana.com/fde/) publicó el 18 de septiembre de 2026 tras ocho años haciéndolo en Tinybird— y qué hay de cierto en las críticas.

## Definición

> **Forward deployed engineer (FDE):** ingeniero de software, empleado por el fabricante de un producto, que se integra en el equipo del cliente durante un periodo definido para implantar ese producto en su entorno real —datos, sistemas, procesos—, escribiendo código de producción cuando hace falta, y que devuelve al equipo de producto lo que el despliegue enseña.

Tres rasgos lo distinguen de todo lo que se le parece:

1. **Trabaja desde dentro del problema del cliente hacia el producto**, no desde el producto hacia fuera. La materia prima es el conocimiento tácito de cómo funciona de verdad esa empresa, que no cabe en una lista de requisitos.
2. **Es responsable del resultado en producción**, no de la recomendación ni de la demo. En palabras de Javi Santana, la diferencia con un consultor es que el FDE «tiene *skin in the game*, se queda hasta el final y asume responsabilidad».
3. **Cierra el bucle con producto.** Lo que resuelve a mano para un cliente se convierte en funcionalidad para todos. Si esto falta, no es un FDE: es un implantador.

| | Consultor | *Solutions engineer* | *Customer success* | **FDE** |
| --- | --- | --- | --- | --- |
| Cuándo actúa | Antes y durante | Antes de la venta | Después de la venta | Desde la venta hasta producción |
| Qué entrega | Diagnóstico y recomendaciones | Demos y pruebas de concepto | Relación y renovación | Sistema funcionando |
| Escribe código de producción | Rara vez | No | No | Sí |
| Responde del resultado | No | No | Parcialmente | Sí |
| Alimenta el producto | No | Poco | Poco | Es parte del trabajo |

## De dónde viene: Palantir y la jerga militar

La expresión *forward deployed* es jerga militar estadounidense: fuerzas desplegadas hacia delante, cerca del teatro de operaciones. [Palantir](https://en.wikipedia.org/wiki/Forward_Deployed_Engineer), que vendía a agencias de inteligencia y al ejército, usa el título para su personal desde 2009. Shyam Sankar, hoy director de tecnología de la compañía y empleado número 13, fue quien concibió el puesto y el primero en ocuparlo.

El problema que resolvía era concreto: los primeros clientes de Palantir no podían explicar lo que necesitaban, porque sus datos y sus procesos eran clasificados. La única manera de construir software que funcionase era enviar a un ingeniero con habilitación de seguridad a sentarse en la base durante meses, aprender el dominio y escribir código allí. Palantir formalizó dos perfiles dentro del equipo desplegado —los *Deltas*, ingenieros que escriben código de producción sobre datos rotos, y los *Echos*, estrategas que entienden la política interna y las barreras de adopción— frente a los *Devs*, los ingenieros de producto. La distinción que se suele citar es que el foco de un *Dev* es una capacidad para muchos clientes, y el de un *Delta*, muchas capacidades para un cliente.

Quien mejor ha contado cómo funcionaba por dentro es [Nabeel Qureshi](https://nabeelqu.substack.com/p/reflections-on-palantir), que fue FDE en Palantir ocho años y publicó sus *Reflections on Palantir* en octubre de 2024. Algunos hechos de su relato:

- Los FDE pasaban **tres o cuatro días a la semana en las oficinas del cliente**. «Coger un avión primero y preguntar después» era el sesgo cultural.
- El objetivo era **capturar el conocimiento tácito** de cómo trabaja la organización, no la «lista aplanada de requisitos» del software empresarial clásico.
- **El producto salía de los despliegues.** Herramientas como Magritte (ingesta de datos), Contour (visualización) o Workshop (constructor de interfaces) nacieron de lo que los FDE tenían que hacer a mano en clientes como Airbus, y los ingenieros de producto las generalizaron después. Así tomó forma buena parte de Foundry. «Tu trabajo era resolver el problema sin preocuparte de sobreajustar; el de producto era coger lo que habías construido y generalizarlo».
- El coste era real: **meses de piloto solo para conseguir acceso a los datos**, negociando con los «dueños del dato» que justificaban su existencia como guardianes; viajes sin control; y código escrito para salir del paso, con la deuda técnica que eso deja.

Hay un efecto secundario que Qureshi documenta y que explica el prestigio actual del puesto: Palantir se convirtió en una **fábrica de fundadores**. En una promoción típica de Y Combinator hay más fundadores procedentes de Palantir que de Google, con una plantilla cincuenta veces menor. La razón es que un FDE aprende a leer una sala, a negociar acceso y a entender un sector desde dentro, que es exactamente lo que hace falta para montar una empresa.

## Por qué ha explotado en 2026

Durante quince años el FDE fue una peculiaridad de Palantir. Lo que lo ha convertido en el puesto del momento es la IA generativa, y la razón la resume [a16z](https://www.a16z.news/p/introducing-the-a16z-fde-fellowship) en una frase: «para los productos nativos de IA, el trabajo que se hace ahora mismo en el campo no es solo despliegue: es I+D». Los agentes «son tan sofisticados como el contexto y los flujos de trabajo a los que llegan», y ese contexto está dentro de cada empresa, no en el modelo.

La cronología de los últimos dos años deja claro el tamaño de la apuesta, y que todos los grandes proveedores de IA han llegado a la misma conclusión:

| Fecha | Quién | Qué |
| --- | --- | --- |
| 2024-25 | OpenAI | Crea su equipo de FDE y lo hace crecer con rapidez |
| Jun 2025 | a16z | Declara al FDE «el puesto más caliente de las *startups*» |
| Nov 2025 | [ElevenLabs](https://elevenlabs.io/blog/forward-deployed-engineers) | Presenta a sus FDE: integran agentes de voz en el CRM, el *contact center* y los datos del cliente, con fases de implantación, estabilización y colaboración continua |
| Ene 2026 | a16z | Publica *Forward-deployed job titles*, el análisis de por qué el título importa |
| May 2026 | Anthropic | Lanza una empresa de servicios de IA con socios financieros |
| 11 may 2026 | [OpenAI](https://openai.com/index/openai-launches-the-deployment-company/) | Lanza la OpenAI Deployment Company y compra Tomoro: unos 150 FDE desde el primer día |
| May 2026 | Google Cloud | Contrata cientos de ingenieros con este perfil |
| 30 jun 2026 | [AWS](https://www.aboutamazon.com/news/aws/aws-1-billion-forward-deployed-ai-engineers) | Crea su unidad de FDE: *pods* de cinco o seis ingenieros en ciclos de 45 días, con NFL, NBA, Southwest Airlines o Cox Automotive como primeros clientes |
| 2 jul 2026 | Microsoft | Microsoft Frontier Co.: 6.000 personas incrustadas en clientes (Unilever y Novo Nordisk entre los primeros) |
| Jul 2026 | a16z | Primera promoción de su *FDE Fellowship*: 65 becarios de OpenAI, Mistral, Cognition, Decagon y otras, elegidos entre miles de solicitudes |

Anthropic describe el puesto en su [oferta pública](https://job-boards.greenhouse.io/anthropic/jobs/5302966008) con precisión: «trabajar dentro de los sistemas del cliente para construir aplicaciones de producción con los modelos Claude» y entregar «servidores MCP, subagentes y *skills* de agente» para flujos de trabajo reales, con un 25 % de viajes. Es decir: el FDE de 2026 no instala software; construye los agentes y las conexiones que hacen que un modelo genérico funcione en una empresa concreta, y lo hace, a su vez, con agentes.

El motivo de fondo es económico. La mayoría de los pilotos de IA en empresas no llegan a producción, y la diferencia entre los que llegan y los que no rara vez es el modelo: es la integración con los datos, los permisos, los procesos y las personas. Ese trabajo no se vende como licencia; se hace desde dentro. Quien lo hace es el FDE, y por eso los grandes proveedores han decidido tenerlo en plantilla en lugar de dejárselo a consultoras.

## Cómo se monta un equipo FDE: la guía de Javi Santana

El texto más útil que se ha escrito en español sobre el tema es [«Forward Deployed Engineer a pie de calle»](https://javisantana.com/fde/), de Javi Santana, cofundador de Tinybird, publicado el 18 de septiembre de 2026 a partir de ocho años dirigiendo ese equipo. Estas son sus ideas principales, con sus palabras cuando conviene.

**El objetivo es uno solo.** «Tu objetivo es poner al cliente en producción lo antes posible». La retención, la relación y la expansión de cuenta vienen como consecuencia, no como meta.

**Por qué existe el equipo.** En B2B con implantaciones complejas «es muy difícil que tu software se acople perfectamente a los requisitos de una empresa». Algunos clientes tienen problemas lo bastante valiosos como para justificar ingenieros dedicados, y ese trabajo financia la investigación de producto a la vez que el cliente recibe una solución.

**Quién lo forma.** Ingenieros de verdad, preferiblemente de *backend*, aunque el dominio sea otro (Santana contrata ingenieros *backend* para un producto de datos). Lo que busca no es experiencia con clientes, que se aprende, sino capacidad de descubrir lo que no se sabe: «si se pone a resolver sin preguntar, mala señal; si pregunta, plantea hipótesis, busca entender». Y no escatimar en ellos.

**Por qué un equipo y no personas sueltas.** Hace falta alguien que asegure la ejecución, que prepare el *onboarding*, que organice los procesos y que decida cuándo apretar para cerrar.

**Cómo se trabaja con el cliente.** En la primera reunión se piden los datos: «nada de organizamos una siguiente reunión, se va directamente al grano». Un canal permanente en tiempo real (Slack), un documento compartido con el objetivo, *check-ins* semanales obligatorios, reuniones solo cuando hay que decidir algo, y seguimiento después de producción.

**Cómo se trabaja por dentro.** Revisión semanal de la cartera (clientes importantes, con potencial, en mantenimiento), recopilación de problemas y funcionalidades bloqueantes —que no pasan a producto inmediatamente—, y revisión de las novedades del producto para ver dónde encajan en casos reales.

**La relación con producto.** Lo ideal es que los FDE hayan desarrollado el producto al principio, para no construir castillos en el aire. El líder del equipo participa en las reuniones de producto como piloto de pruebas. Y una regla de cultura: se da la cara por el producto, sin usar a los compañeros como excusa. «No hay cosa más patética que usar a compañeros como palanca para negociar».

**Contratación y formación.** Ejercicio técnico abierto y sencillo, en el que lo que se evalúa es cómo acota el problema con preguntas e hipótesis. El *onboarding* es largo y deliberado: fundamentos repetidos «200 veces», curso grabado, ejercicios reales, entrada gradual en clientes acompañado, escritura diaria de lo aprendido y, al final, «echarlos a los leones».

**Lo no técnico se lo queda otro.** Hace falta una figura de negocio —un *account executive*, el CEO— que marque ritmo, ponga límites y haga de «poli malo». Nunca debe meterse en discusiones técnicas, y la parte comercial nunca se mezcla con la gente técnica. Los acuerdos iniciales fijan tiempo, dedicación y límites.

**Cuándo no tiene sentido.** En B2C, en B2B sencillo, cuando el autoservicio basta, o cuando compite con el crecimiento orgánico y el *product-led growth*.

**Los errores que ha visto.** Dependencia excesiva del FDE para retener al cliente; clientes que esperan servicios fuera del alcance; producto que se apoya en personas en lugar de mejorar; FDE que culpan al producto sin atacar la raíz. Y el límite estructural, dicho sin adornos: «no escala, es decir, para crecer necesitas más gente y la gente es lo peor».

La reflexión final es la que explica por qué el puesto forma tan bien: los desarrolladores que pasan por ahí adquieren una soltura con el cliente que después llevan a cualquier otro rol, y lo echan de menos.

## Lo que cambia en 2026: el FDE construye con agentes y entrega agentes

Hay dos diferencias entre el FDE de Palantir de 2010 y el de 2026 que ninguna de las fuentes anteriores dice de forma explícita, y que son las que explican por qué el puesto ha dejado de ser una rareza.

**La primera es cómo construye.** El FDE de 2026 no programa solo: trabaja con agentes de IA que escriben, prueban y despliegan código con él. Es lo que hace posible que AWS prometa comprimir «los plazos de meses a días» y organice sus despliegues en ciclos de 45 días con *pods* de cinco o seis personas, algo impensable cuando un ingeniero desplegado tardaba semanas en tener «software real que la gente pudiera usar», como cuenta Qureshi de sus primeros años. La velocidad de un FDE ya no la marca lo que puede teclear, sino lo bien que entiende el problema y lo bien que dirige a los agentes que lo resuelven.

**La segunda es qué entrega, y es la más importante.** El implantador clásico —y el FDE de Palantir— ponía en producción una herramienta para que el usuario hiciera mejor su trabajo. El FDE de IA pone en producción un agente que **hace el trabajo completo que hacía el humano**: no ayuda al contable a conciliar, concilia; no da al agente de aduanas una pantalla mejor, clasifica la mercancía y prepara el DUA. Por eso el trabajo de campo es I+D, como dice a16z: lo que el FDE está haciendo en el cliente es **enseñar a la IA el proceso entero de una persona**, con sus excepciones, sus reglas no escritas y sus «esto se hace así porque sí». Es exactamente el «libro de reglas» del que hablábamos en el [artículo sobre servicios nativos de IA](/blog/que-es-un-servicio-nativo-de-ia/): la lista de lo que significa «correcto» en ese nicho y de todas las formas en que la IA se equivoca, escrita error a error desde dentro. El FDE es quien la escribe, y la capa de revisión —qué sale solo y qué mira una persona— es lo que decide con el cliente.

Esto cambia el criterio de éxito. Un implantador acababa cuando el usuario sabía usar la herramienta. Un FDE de IA acaba cuando el proceso corre sin el usuario, con una persona revisando lo que el agente marca como dudoso, y cuando lo que ha aprendido de ese cliente está ya en el producto para el siguiente.

### Esto ya lo he vivido, sin nombre

En 1997 yo era el responsable de informática de una empresa de logística internacional, Altrans, y el primer programa que hice en mi vida fue en Access para el departamento comercial. No tenía ni idea de programar, pero vivía los problemas de mis compañeros cada día. Años después, con Velázquez Visual —el Velneo de entonces—, construimos allí la gestión completa, y aquella semilla se convirtió en [Visual Trans](https://visualtrans.com/), que hoy es el estándar del sector en España. Sin aquellos compañeros pacientes probando e iterando, [no existiría](/2020/12/24/del-dogfooding-a-probar-tus-recetas/).

Cuando empezamos Visual Trans todavía no teníamos un producto. Lo que teníamos era una herramienta y una manera de trabajar: cogíamos Velázquez Visual, nos metíamos en el cliente y resolvíamos lo que hiciera falta desde dentro. No éramos programadores en el sentido de hoy, ni consultores, ni implantadores; éramos las tres cosas a la vez, que es exactamente la descripción de un FDE. Terminábamos un fichero a medida para Odiel, hacíamos otra cosa a medida para su oficina de Valencia, y lo que servía lo íbamos incorporando. El producto creció con aquellas personalizaciones, que tratábamos de estandarizar para todos los clientes; durante mucho tiempo hubo hasta carpetas con el nombre de cada cliente dentro del código, y poco a poco aquello se fue convirtiendo en producto. Es, paso por paso, lo que Qureshi cuenta de Foundry: el FDE resuelve sobreajustando y producto generaliza después. Nosotros éramos las dos cosas.

No había *sprints* ni metodología: todo era en tiempo real y en caliente, al lado del usuario, y la herramienta nos dejaba codificar lo bastante rápido como para que esa forma de trabajar fuera viable. Ese es el punto: el FDE solo funciona si la distancia entre entender el problema y tener algo en producción se mide en días. Con Velázquez Visual esa distancia era corta para su época. Con agentes de IA es más corta todavía, y por eso el puesto ha vuelto.

Pero hay una diferencia que estoy sintiendo ahora y que no es de velocidad, sino de naturaleza. Entonces veías al usuario, mirabas lo que hacía y le ayudabas a hacerlo mejor: le dabas una pantalla, un proceso, un informe. Ahora ves al usuario e intentas hacer **todo lo que hace, completo, de principio a fin**. Lo que haces ya no es ayudar a una persona: es **formar a un agente para que haga el trabajo de esa persona**. Y la palabra exacta es *formar*, no *educar* ni *programar*: se parece mucho más a cómo se forma a alguien que entra nuevo en un departamento —le enseñas el proceso, le pones al lado de quien lo hace, le corriges los errores uno a uno, decides qué puede firmar solo y qué tiene que consultar— que a escribir una especificación. El FDE de IA es, en la práctica, un formador de agentes.

Y aquí está lo que lo convierte en un negocio distinto del de 1997: un agente formado en un cliente va a más clientes. En Visual MS lo estamos viendo con los agentes que hemos puesto en producción este año en procesos administrativos y de aduanas: se forman dentro de un cliente, con sus excepciones y sus reglas no escritas, y lo que aprenden ahí —el libro de reglas— no se queda en una carpeta con el nombre del cliente, como pasaba en Visual Trans, sino que es directamente lo que se lleva al siguiente. Las carpetas de Odiel tardaron años en estandarizarse; el agente formado en un cliente se estandariza en el momento en que se le pone delante del segundo. Antes el producto era la herramienta y las personalizaciones eran el coste de venderla; ahora el producto es el agente formado, y cada cliente nuevo es una formación más corta que la anterior. Es el mismo bucle de hace treinta años, con una diferencia: lo que se acumula ya no es código, es criterio.

## Las críticas, y cuáles tienen razón

**«Es un cambio de nombre».** Es la crítica más repetida, y tiene una parte de verdad. Tom Hollands lo analizó en a16z en enero de 2026 bajo el nombre de *title arbitrage*: Palantir cogió a sus *solutions engineers* e *integration engineers* —«históricamente de los roles de menor estatus dentro de una organización de ingeniería»— y les dio un título nuevo que confiere legitimidad, señala que ese trabajo es estratégico y atrae talento. Hollands lo considera una jugada acertada, y cita otros casos: el *Site Reliability Engineer* de Google, el *Imagineer* de Disney, el *Legal Engineer* de Harvey. La Wikipedia recoge la versión académica de la misma crítica, publicada en *Academy of Management Review*: una estrategia de proyección organizativa para dar importancia a roles que antes se llamaban de otra manera. El matiz es que el título nuevo también describe trabajo nuevo: escribir código de producción en sistemas ajenos y responder del resultado no era lo que hacía un *solutions engineer*.

**«No se puede copiar».** Esta viene de dentro. Shyam Sankar advirtió en abril de 2025 de que el modelo no se puede reproducir por imitación: funciona «a través de la propiedad total de la implantación: esa es la fuente del bucle de retroalimentación, de la calidad y de la mejora». Si se copia solo la estructura —ingenieros en el cliente— sin la responsabilidad radical ni la conexión con producto, «quítale eso y tienes un barniz». Es un aviso relevante cuando AWS y Microsoft despliegan miles de personas bajo ese título en cuestión de semanas.

**«Genera deuda técnica y dependencia».** Qureshi y Santana lo reconocen desde dentro. El FDE escribe código que resuelve rápido, y eso deja atajos; y si el producto se acostumbra a que una persona tape sus carencias, deja de mejorar. La respuesta de ambos es la misma: el equipo de producto existe para generalizar, y el FDE que culpa al producto sin atacar la raíz no está haciendo su trabajo.

**«Es un trabajo duro y poco glamuroso».** Viajes, plazos cortos y presión para resolver problemas ajenos. Sankar lo dice a su manera: «las trayectorias profesionales están sin definir, pero el acceso a problemas motivadores y a colegas excepcionales está garantizado».

## El FDE en España

El mercado español va por detrás pero ya existe. [Manfred](https://www.getmanfred.com/en/blog/forward-deployed-engineer-espana) contaba **84 ofertas activas en LinkedIn** con este título en marzo de 2026, cuando un año antes probablemente no había ninguna.

El caso de referencia en España es Tinybird, precisamente porque lleva ocho años con el equipo montado y porque su fundador ha documentado cómo. Fuera de las *startups* de datos e IA, el perfil encaja en cualquier empresa de software B2B con implantaciones complejas: ERP, logística, aduanas, banca. Muchas de ellas ya tienen a esa persona; lo que no tienen es el nombre, la responsabilidad sobre producción ni el canal de vuelta a producto, que es lo que convierte a un implantador en un FDE.

## FDE y servicios nativos de IA: dos caras de lo mismo

Ayer publicábamos la [guía de Greg Isenberg sobre servicios nativos de IA](/blog/que-es-un-servicio-nativo-de-ia/), y hay una frase suya que conecta las dos ideas: el modelo del *forward-deployed engineer* «es un servicio usado como cuña para entrar en una gran cuenta. Es como los ganadores entran por la puerta». El FDE es la versión de gran empresa de lo mismo que Isenberg propone a pequeña escala: hacer el trabajo dentro del cliente, aprender qué significa «correcto» y convertirlo en producto. Palantir lo hizo con Foundry. OpenAI, Anthropic, AWS y Microsoft están intentando hacerlo con los agentes de IA. Y una empresa de software mediana puede hacerlo con su propio producto y sus propios clientes, sin llamarlo de ninguna manera en particular.

## Preguntas frecuentes

### ¿Qué diferencia hay entre un forward deployed engineer y un consultor?

El consultor diagnostica, recomienda y se va, y no responde de lo que pasa después. El FDE escribe código de producción dentro de los sistemas del cliente, se queda hasta que el producto funciona, responde del resultado y devuelve lo aprendido al equipo de producto de su empresa.

### ¿Qué diferencia hay entre un forward deployed engineer y un solutions engineer?

El *solutions engineer* trabaja antes de la venta: hace demos y pruebas de concepto para demostrar que el producto puede resolver el problema. El FDE trabaja después: implanta el producto de verdad, en producción, y es responsable de que funcione. Palantir creó el título de FDE, en parte, para dar rango a un trabajo que antes se llamaba así.

### ¿En qué se diferencia el FDE de IA del implantador de toda la vida?

En dos cosas. Construye con agentes de IA que escriben y prueban código con él, lo que comprime los plazos de meses a semanas. Y lo que pone en producción no es una herramienta para que el usuario trabaje mejor, sino un agente que hace el trabajo completo que hacía esa persona, con una capa de revisión humana para los casos dudosos. Su trabajo es enseñar a la IA el proceso entero, no enseñar al usuario la pantalla.

### ¿Cuándo tiene sentido montar un equipo de FDE?

En B2B con productos técnicos cuya implantación es compleja, cuando algunos clientes tienen problemas lo bastante valiosos como para justificar ingenieros dedicados. No tiene sentido en B2C, en B2B sencillo ni cuando el autoservicio basta.

---

## Fuentes

- Javi Santana, [*Forward Deployed Engineer a pie de calle*](https://javisantana.com/fde/), 18 de septiembre de 2026, y su [aviso en Substack](https://javisantana.substack.com/p/la-guia-definitiva-sobre-el-forward), 20 de septiembre de 2026.
- Nabeel S. Qureshi, [*Reflections on Palantir*](https://nabeelqu.substack.com/p/reflections-on-palantir), 15 de octubre de 2024.
- Wikipedia, [*Forward Deployed Engineer*](https://en.wikipedia.org/wiki/Forward_Deployed_Engineer), con sus referencias a Reuters, CNBC, WSJ y *Academy of Management Review*.
- Tom Hollands (a16z), [*Forward-deployed job titles*](https://www.a16z.news/p/forward-deployed-job-titles), 27 de enero de 2026.
- a16z, [*Introducing the a16z FDE Fellowship*](https://www.a16z.news/p/introducing-the-a16z-fde-fellowship), 2026.
- TBPN Digest, [Shyam Sankar sobre por qué el FDE no se puede copiar por imitación](https://www.tbpndigest.com/story/2025-04-17/palantirs-shyam-sankar-on-enterprise-ai-autonomy-defense-reformation-and-why-the-forward-deployed-engineer-cant-be-cargo-culted), 17 de abril de 2025.
- Anthropic, [oferta de *Forward Deployed Engineer, Applied AI*](https://job-boards.greenhouse.io/anthropic/jobs/5302966008), 2026.
- OpenAI, [*OpenAI launches the OpenAI Deployment Company*](https://openai.com/index/openai-launches-the-deployment-company/), 11 de mayo de 2026.
- Amazon, [*AWS invests $1 billion to embed AI forward deployed engineers with customers*](https://www.aboutamazon.com/news/aws/aws-1-billion-forward-deployed-ai-engineers), 30 de junio de 2026; [CNBC](https://www.cnbc.com/2026/06/30/aws-amazon-ai-forward-deployed-engineers.html).
- CNBC, [*Microsoft commits $2.5 billion, 6,000 employees to AI implementation unit*](https://www.cnbc.com/2026/07/02/microsoft-commits-2point5-billion-6000-employees-ai-implementation-unit.html), 2 de julio de 2026.
- ElevenLabs, [*Meet our Forward Deployed Engineers*](https://elevenlabs.io/blog/forward-deployed-engineers), 20 de noviembre de 2025.
- Manfred, [*Qué es un Forward Deployed Engineer y cómo contratar en España*](https://www.getmanfred.com/en/blog/forward-deployed-engineer-espana), 27 de marzo de 2026.
