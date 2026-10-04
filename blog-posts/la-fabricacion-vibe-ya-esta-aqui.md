---
title: "La fabricación vibe ya está aquí: la guía de Greg Isenberg, en español"
slug: "la-fabricacion-vibe-ya-esta-aqui"
date: "2026-10-04"
dateModified: "2026-10-04"
description: "Se describe un producto en una frase y, una semana después, se tiene en metal y a medida. La guía de Greg Isenberg sobre la fabricación vibe, en español."
category: "inteligencia-artificial"
tags: ["fabricación vibe", "hardware", "impresión 3d", "agentes de ia", "modelos de negocio", "emprendimiento", "inteligencia artificial"]
readingTime: 22
author: "Alfonso Gutiérrez"
wordCount: 4400
image: "/images/blog/fabricacion-vibe/portada.png"
---

> **Fuente.** Este artículo es la versión en español de *«VIBE MANUFACTURING IS HERE»*, publicado por **[Greg Isenberg](https://www.gregisenberg.com/)** en X el 4 de octubre de 2026: [x.com/gregisenberg/status/2106737353431581132](https://x.com/gregisenberg/status/2106737353431581132) (el artículo en sí está en [x.com/i/article/2106728342569250816](https://x.com/i/article/2106728342569250816)). Las ideas, la estructura y todas las cifras son suyas; la redacción en castellano es nuestra, y las ilustraciones son versiones en español que hemos rehecho a partir de las suyas.

![Taller de fabricación vibe: portátil con el CAD, impresora 3D y la pieza de metal ya hecha](/images/blog/fabricacion-vibe/portada.png)

**Por primera vez se puede describir un producto físico en una frase y, una semana después, tenerlo en la mano, cortado en metal y hecho a las medidas exactas.**

Eso es la fabricación vibe, y está a punto de hacer con los productos físicos lo que la programación vibe (*vibe coding*) hizo con el software. Quizá no hoy, pero sí a lo largo de los próximos 24 meses.

La programación vibe permitió que gente que nunca había escrito código construyera aplicaciones. La fabricación vibe permite que cualquiera haga cosas reales. Se describe lo que se quiere. Una IA lo convierte en un fichero de diseño preciso. Una impresora sobre la mesa lo prueba de un día para otro. Una fábrica encontrada en una web lo cotiza en segundos y envía las piezas en días. Un chip de 5 dólares lo hace inteligente, y el agente de IA lo gobierna.

![De la frase al objeto útil: describirlo, generar el fichero, probarlo de noche, enviarlo en días y hacerlo inteligente con un ESP32](/images/blog/fabricacion-vibe/proceso.png)

Ya está pasando, en voz baja. Unas 30.000 personas hacen funcionar una impresora 3D más de siete horas al día, según [Bambu Lab](https://bambulab.com/), la empresa que fabrica las impresoras de consumo más populares del mundo. Eso es una jornada completa. Llevan pequeñas fábricas en habitaciones libres y garajes: imprimen productos, los venden en Etsy y en TikTok Shop, y reimprimen lo que se vende. El sitio de diseños de Bambu, [MakerWorld](https://makerworld.com/), tiene 10 millones de usuarios mensuales y 2,6 millones de diseños originales, y sus usuarios acumularon 290 millones de horas de impresión en 2025. Dentro de las casas está creciendo una economía de fabricación oculta, y la IA está a punto de echarle gasolina.

Esta es la guía completa de la fabricación vibe. Sirve para quien haya querido alguna vez hacer un producto físico, o para quien busque la próxima gran oportunidad de negocio en la IA. Isenberg recorre qué ha cambiado, cómo hacer el primer producto real paso a paso, las oportunidades de negocio a las que él iría, y cómo encajan los agentes personales y cosas como Hugging Face.

## Por qué el hardware era tan difícil

Hay una frase vieja en Silicon Valley: el hardware es difícil. Durante décadas fue lo más cierto que se decía. Isenberg cuenta que se le quedó grabada de oírla a tantos inversores.

Quien quisiera hacer un producto físico en 2010 se metía en esto. Contrataba a un diseñador industrial para que lo bocetara y a un ingeniero mecánico para convertir el boceto en ficheros CAD. Volaba a Shenzhen, visitaba fábricas e intentaba averiguar cuáles se tomarían en serio un pedido pequeño. Pagaba decenas de miles de dólares por un molde de inyección antes de que existiera una sola unidad. Pedía 5.000 unidades porque ese era el mínimo, las guardaba en un almacén y rezaba para que la gente quisiera las 5.000. Si una medida estaba mal, volvía a pagar el molde.

La época de Kickstarter entreabrió la puerta. El autor recuerda cuando Pebble recaudó más de 10 millones de dólares para un reloj inteligente en 2012, y de pronto los equipos pequeños podían financiar el utillaje con preventas. Pero una parte enorme de aquellos proyectos se retrasó, se pasó de presupuesto o murió en la fábrica, porque lo difícil seguía siendo difícil. Seguía haciendo falta alguien que hablara CAD, alguien que entendiera cómo piensan las fábricas, y un montón de dinero inmovilizado en inventario.

Así que el hardware siguió siendo un juego de empresas bien financiadas, y todos los demás se quedaron con el producto medio, diseñado para el cliente medio.

## Los cuatro cambios que lo cambiaron todo

Al software le pasó lo mismo y salió por el otro lado. Primero hacían falta ingenieros. Luego las herramientas *no code* dejaron que quien no era ingeniero construyera cosas pequeñas y sencillas. Después la programación con IA dejó que casi cualquiera construyera casi cualquier cosa. El hardware está viviendo ahora su versión de ese momento, porque cuatro cosas ocurrieron más o menos a la vez.

**1. El diseño se convirtió en código.**

Hay toda una familia de herramientas CAD, como [OpenSCAD](https://openscad.org/) y [CadQuery](https://cadquery.readthedocs.io/), en las que una pieza se escribe como unas pocas líneas de código en lugar de dibujarse con el ratón. Una caja con las esquinas redondeadas y cuatro agujeros para tornillos es un script corto con números dentro. En teoría, cualquier IA que escriba código podría escribir piezas. En la práctica, durante años el resultado fueron sobre todo juguetes.

Luego OpenAI publicó GPT 6 Astra el mes pasado, y ese fue el momento en que mucha gente —el autor incluido— empezó a creer que la IA podía hacer CAD de verdad. OpenAI lo probó en un banco de pruebas nuevo llamado BenchCAD, en el que el modelo mira fotos de un objeto desde varios ángulos y tiene que reconstruirlo escribiendo código CAD. Astra sacó un 95,9 %, muy por delante de todo lo anterior.

En cuestión de días la gente estaba «haciendo CAD vibe». Alguien en un foro de FIRST Robotics conectó Astra con Autodesk Inventor y le hizo diseñar el mecanismo de recogida entero de un robot en unas 7 horas, cajas de engranajes y varillajes plegables incluidos. Todavía tenía huecos que una persona tenía que corregir, pero un año antes eso eran días de trabajo de un ingeniero experto.

Ya se puede describir una pieza en lenguaje corriente, o enseñarle unas fotos, y recibir un diseño preciso y editable. Resulta bastante increíble.

Y hay una oleada de startups corriendo para hacerlo todavía más fácil. El Text-to-CAD de Zoo convierte una frase en un fichero CAD de verdad en un solo paso. Adam, salida de Y Combinator, levantó una ronda semilla el pasado octubre y ya tiene decenas de miles de usuarios diseñando piezas charlando con el sistema. Backflip, fundada por los fundadores de la empresa de impresoras 3D Markforged, levantó 30 millones de dólares de NEA y a16z, y uno de sus mejores trucos es el escaneo a CAD (*scan-to-CAD*): se apunta un escáner 3D a un objeto físico y se recibe un modelo CAD editable.

Va todo muy al principio, pero ya ha empezado.

**2. Las fábricas se convirtieron en API.**

Se sube un fichero de diseño a [SendCutSend](https://sendcutsend.com/), [Xometry](https://www.xometry.com/), [Protolabs](https://www.protolabs.com/) o [JLCPCB](https://jlcpcb.com/) y se obtiene un precio al instante, sin llamadas, sin mínimos y sin que haga falta una relación previa. Las piezas suelen salir en días, y se puede pedir exactamente una.

Solo Xometry hizo 630 millones de dólares de ingresos de *marketplace* en 2025, con un crecimiento del 30 %, y unas 5.000 fábricas y talleres de mecanizado al otro lado de su web. Conviene pararse en lo que eso significa. Hay ahora una nube de fábricas que se pueden alquilar por pieza, del mismo modo que AWS deja alquilar servidores por hora.

**3. Lo inteligente se abarató.**

El ESP32 es un chip con wifi y Bluetooth que cuesta unos pocos dólares y puede mover un motor, leer un sensor, encender un LED y hablar con el teléfono. Hace veinte años, meter un ordenador conectado dentro de un producto era un proyecto para un equipo de ingenieros electrónicos. Hoy es una pieza de 5 dólares y, probablemente, 3 horas.

**4. Cada casa tuvo una fábrica.**

Este es el cambio que la gente infravalora. Bambu Lab hizo impresoras 3D que funcionan al sacarlas de la caja, y según algunas estimaciones sus ventas se multiplicaron aproximadamente por tres el año pasado. Una máquina de entre 300 y 600 dólares imprime hoy piezas que hace una década habrían necesitado un taller profesional. Eso permite probar un diseño en la mesa de un día para otro, corregirlo por la mañana y volver a probarlo esa noche. La iteración en hardware solía llevar meses. Ahora corre más cerca de la velocidad del software.

El autor recuerda la universidad, hacia 2009 y 2010: la impresión 3D personal empezaba a existir, pero era cara y, desde luego, hacía falta muchísimo para llegar a imprimir algo que mereciera la pena. Esa época se acabó.

Cualquiera de estos cambios, por separado, es interesante. Los cuatro juntos cambian quién puede hacer cosas.

## Los productos se están convirtiendo en ficheros

Es una idea a la que el autor vuelve una y otra vez.

Durante toda la historia, un producto fue un objeto físico. El valor vivía en el inventario. Si se hacían estanterías, el negocio eran las 5.000 estanterías sentadas en un almacén, y el mayor riesgo era que nadie las quisiera.

En la fabricación vibe, el producto es un fichero. Más en concreto, es un diseño escrito como código, con cada dimensión importante guardada como variable al principio: el ancho, el alto, el grosor, la separación de los agujeros. Se cambia un número y el diseño entero se reconstruye. Ese fichero puede producir una estantería para una pared y una estantería ligeramente distinta para otra, y ninguna de las dos existe hasta que alguien paga por ella.

Y lo que de verdad cambia es que el modelo de negocio es otro. Los bienes físicos empiezan a comportarse como software. La parte cara, el diseño, se hace una vez. Cada copia posterior se personaliza gratis y se fabrica bajo demanda. No hay almacén ni stock muerto, y los márgenes empiezan a parecerse mucho más a los de una empresa de software que a los de una de hardware.

Ya se ve la versión temprana. MakerWorld deja que los diseñadores publiquen modelos personalizables: se escriben las medidas y el sitio genera un fichero que encaja. Las grandes granjas de impresión ofrecen API que se enchufan a una tienda de Shopify e imprimen cada pedido en el momento en que se hace. Las piezas de una pila completa, del fichero de diseño al producto personalizado y a la puerta de casa, ya existen. Simplemente todavía no se han unido para la mayoría de las categorías.

Lo otro que pasa cuando los productos se vuelven ficheros es que se pueden bifurcar, como el código abierto. El mejor ejemplo es Gridfinity, un sistema de almacenaje de código abierto construido sobre una rejilla sencilla de 42 mm que un youtuber llamado Zack Freedman publicó en 2022. Como el estándar era abierto, miles de personas diseñaron cajas, soportes de herramientas y cajones que encajan todos en la misma rejilla. Se convirtió en un ecosistema entero, con sus vendedores, sus accesorios y sus fans, construido encima de un fichero gratuito.

Ese es el patrón por el que el autor apostaría. Quien crea un gran estándar abierto para una categoría se lleva una comunidad que construye encima, y quien hace los mejores productos para ese estándar se lleva a los clientes.

## Los cacharros que nadie fabricaría

![Tres sitios donde mirar: accesorios de lo que la gente ya compró, recambios y cacharros de micronicho](/images/blog/fabricacion-vibe/cacharros.png)

Durante más de 100 años, los productos tenían que diseñarse para el cliente medio, porque la única forma de que salieran las cuentas era fabricar miles de la misma cosa. Uno ajustaba la casa, la mesa y la vida para que encajaran con el producto.

Cuando el diseño es un fichero y la fábrica hace las piezas de una en una, el producto puede encajar con quien lo usa. Y eso abre una categoría que el autor piensa como los cacharros que nadie fabricaría. Productos para un mercado de 500 personas, o de 50, o de una. Una gran empresa se reiría del tamaño del mercado. Quien trabaja en solitario puede vivir muy bien ahí, porque un producto que le encaja a 500 personas a la perfección puede cobrar lo que quiera.

Hay tres sitios donde él miraría primero.

**1. Accesorios para cosas que la gente ya compró.** Cada producto popular crea una cola larga de necesidades que su fabricante no va a atender nunca. Alguien compra una bici eléctrica concreta, una cafetera de espresso concreta, una furgoneta camper concreta, y al momento quiere un soporte, un sujetador, un organizador o una mejora diseñada exactamente para ese modelo. Los mejores nichos van pegados a algo en lo que la gente ya se gastó mucho dinero, porque a esos dueños es fácil encontrarlos y están dispuestos a gastarse un poco más.

**2. Recambios.** Millones de electrodomésticos, herramientas y juguetes que funcionan perfectamente acaban en la basura porque se rompió una pieza pequeña de plástico y el fabricante dejó de hacerla hace años. Con el escaneo a CAD se puede fotografiar o escanear la pieza rota y recibir un diseño limpio. La gente paga encantada 40 dólares por una pieza de 2 dólares que salva un lavavajillas de 900, y ya la está buscando: hay demanda antes de haber fabricado nada.

**3. Necesidades raras de un negocio.** Clínicas veterinarias, peluquerías, restaurantes, laboratorios, gimnasios, dueños de barcos y contratistas tienen problemas raramente específicos para los que nadie hace un producto. Un soporte para una tableta en un sitio concreto. Una protección para una máquina. Un sujetador para una herramienta que solo existe en un oficio. Las empresas compran más rápido que los consumidores, les importa menos el precio y vuelven a por más cuando algo funciona.

![La curva de cola larga del hardware: la cabeza son los productos de masas; la cola, los nichos que abren la IA y las API de fábrica. Mercados de 500, de 50 o de 1](/images/blog/fabricacion-vibe/curva-cola-larga.png)

Es exactamente lo que le pasó al software. Cuando construir se abarató, la gente construyó para nichos diminutos, y bastantes de esos nichos resultaron ser negocios de verdad. Los productos físicos están a punto de tener su cola larga.

La misma idea.

![Mapa de oportunidades de la fabricación vibe: construir donde el nicho es pequeño y el encaje tiene que ser perfecto —recambios, accesorios a medida y herramientas raras—](/images/blog/fabricacion-vibe/mapa-de-oportunidades.png)

## Los agentes necesitan un cuerpo

Conviene seguirle el razonamiento.

Todo el mundo está construyendo ahora [agentes de IA](/guia/guia-agentes-ia-empresas/) personales. Leen el correo, gestionan el calendario, investigan y hacen los recados por internet. Pero viven enteros dentro de las pantallas. El agente puede reservar a alguien que saque al perro y sigue sin saber si el perro está en casa. Puede pedir la compra y no tiene ni idea de lo que hay en la nevera.

Cada dispositivo inteligente barato que se construye se convierte en un sentido o en una mano para el agente. Un sensor en el buzón le dice que ha llegado un paquete. Una báscula bajo el bote del café le dice que se está acabando, y lo vuelve a pedir. Una pantalla pequeña de tinta electrónica junto a la puerta muestra lo que cree que hay que saber antes de salir. Una cerradura en la cancela lateral deja entrar a quien pasea al perro a las dos de la tarde y cierra a las dos y media.

La fontanería para esto ya está. [Home Assistant](https://www.home-assistant.io/), el centro de hogar inteligente de código abierto, puede exponer cada dispositivo de la casa a un agente de IA por [MCP](/blog/la-guia-definitiva-sobre-el-protocolo-de-contexto-del-modelo-mcp/), el mismo estándar que los agentes usan para hablar con Gmail o con Notion. Espressif, la empresa que fabrica el ESP32, lanzó su propia plataforma de agentes el pasado diciembre para que los desarrolladores puedan meter un agente de voz con llamada a herramientas directamente en sus chips. Los aficionados están cableando placas ESP32 que anuncian sus capacidades a un agente en el momento en que se conectan, como un empleado nuevo que se presenta: «Puedo leer la temperatura, puedo abrir la rejilla, puedo pitar».

El autor cree que estamos a punto de tener una disciplina de diseño nueva: hardware pensado primero para los agentes y después para las personas. Cuenta que lo ha estado hablando con su estudio de diseño, LCA, y que el hardware nativo para agentes tiene, a su juicio, unos cuantos rasgos.

1. **Se describe a sí mismo.** Cuando se conecta, le dice al agente exactamente qué puede percibir y qué puede hacer, en lenguaje corriente.
2. **Informa de su estado sin parar.** Bloqueado o desbloqueado, lleno o vacío, abierto o cerrado, de modo que el agente sepa siempre qué es verdad.
3. **Conserva una anulación física.** Los agentes se equivocan, así que una persona siempre puede abrir la cerradura, pulsar el interruptor o desenchufar con la mano.
4. **Falla en seguro.** Cuando se cae el wifi, la puerta sigue pudiéndose usar y el calefactor se apaga.

Las grandes empresas venderán versiones genéricas de estos dispositivos. Los interesantes serán a medida, hechos para una casa, un taller o un flujo de trabajo concretos, por gente que entiende a la vez el agente y el espacio físico.

## Usar Hugging Face

[Hugging Face](https://huggingface.co/) es la mayor biblioteca de modelos de IA abiertos del mundo, y en la fabricación vibe juega tres papeles muy distintos. La mayoría de la gente solo conoce el primero, y es el que mete en problemas.

**1. Formas.** En Hugging Face hay modelos de texto a 3D y de imagen a 3D, como TRELLIS y Hunyuan3D, que convierten una frase o una foto en una forma 3D en segundos. Son fantásticos para cualquier cosa orgánica o decorativa: una figurita, una lámpara escultórica, un asa con la forma del logo, una ficha de juego a medida. Aquí está la trampa. Hacen formas que se ven bien y miden mal. Lo que producen es una malla, una superficie hecha de miles de triángulos diminutos, sin dimensiones exactas. Una fábrica que corta metal necesita que un agujero de 40 mm sea exactamente de 40 mm. Así que los modelos 3D sirven para lo que la gente mira, y el CAD basado en código sirve para lo que tiene que encajar.

**2. Cerebros.** Hugging Face también aloja modelos pequeños que corren en hardware barato metido dentro del cacharro, sin enviar nada a la nube. Un modelo de voz pequeño como Whisper permite que un dispositivo entienda órdenes habladas. Un modelo de visión diminuto permite que una cámara distinga al perro de un mapache. Ya hay módulos añadidos para hardware de la clase del ESP32 que ejecutan un modelo de lenguaje de unos 500 millones de parámetros con unos 1,5 vatios, del todo sin conexión. Para cualquier cosa dentro de la casa de alguien, «no envía tus datos a ninguna parte» es un argumento de venta potente, y los modelos abiertos lo hacen posible.

**3. Cuerpos.** Aquí es donde la cosa se dispara. Hugging Face compró la empresa francesa de robótica Pollen Robotics en abril de 2025 y empezó a publicar robots de código abierto, entre ellos un robot pequeño de escritorio llamado Reachy Mini que sale desde unos 300 dólares. Su proyecto LeRobot regala el software, los conjuntos de datos y los diseños de brazos de robot de bajo coste que la gente imprime y monta en casa, y a los que luego enseña tareas nuevas demostrándoselas unas pocas docenas de veces.

Juntando las tres cosas se ve hacia dónde va esto. La misma persona que esta noche imprime una carcasa puede descargarse mañana un modelo de visión y montar el fin de semana un brazo robótico que le clasifique los tornillos. La robótica sigue exactamente el mismo camino que el software, de cerrado y caro a abierto y barato, y Hugging Face intenta ser el GitHub de ese camino.

## Montar el taller: la carpeta y los agentes

¿Cómo se monta un pequeño equipo de hardware con IA, con agentes, en la plataforma de agentes que uno elija (Hermes, Claude Code, Cursor, etc.)?

Un agente de programación vive dentro de una carpeta del ordenador. Lee cada fichero, ejecuta código y recuerda lo que se ha decidido porque todo está escrito. Si se le da una carpeta bien ordenada, deja de adivinar. Esta es la estructura que el autor usaría en un proyecto de fabricación vibe:

![Carpeta workshop: requisitos, medidas, diseño paramétrico, reglas de fábrica, materiales, electrónica, lista de materiales, presupuestos, pruebas, diario, clientes y agentes](/images/blog/fabricacion-vibe/taller.png)

Unos pocos de estos ficheros hacen la mayor parte del trabajo.

**requirements.md.** Escribir en números claros lo que el producto tiene que hacer: «aguanta 2 kg de llaves, sobrevive a un pasillo a 40 °C en verano, se monta con dos tornillos, cuesta menos de 35 dólares de fabricar». A partir de ahí, cada diseño que produce la IA se comprueba contra algo real, y no contra si queda bonito.

**factory-rules/** guarda las guías de diseño de cada fábrica que se usa, descargadas y guardadas como texto. La IA las lee antes de diseñar nada, así que deja de dibujar piezas que no se pueden fabricar.

**materials.md** es donde van las lecciones duras. «El PLA se combó en un coche caliente.» «El aluminio 6061 se agrietó en el pliegue; se pasó al 5052.» Una línea así evita pagar dos veces por el mismo error.

**library/** es el arma secreta con el tiempo. Cada bisagra, soporte y carcasa que sale bien se convierte en un bloque de construcción. Al quinto producto, el agente sobre todo encaja piezas que ya se sabe que funcionan.

**tests/** está tomado directamente del software. Se escriben comprobaciones que el código puede ejecutar solo: cada pared de al menos 2 mm de grosor, cada agujero al menos tan ancho como el grosor del metal, el conjunto por debajo de 300 mm de ancho para que quepa en la caja de envío más barata. Cada vez que el diseño cambia, corren las pruebas, y los problemas aparecen en la pantalla en lugar de en el buzón.

Los agentes:

Cuando la carpeta existe, se puede repartir el trabajo entre unos cuantos agentes, cada uno con su fichero de instrucciones en `agents/`. Se construyen de uno en uno.

**1. El agente de diseño** convierte los requisitos y las medidas en código CAD paramétrico. El truco es hacer que dibuje imágenes de la pieza desde tres ángulos después de cada cambio y que mire su propio trabajo, del mismo modo que los mejores modelos se comprueban a sí mismos. Así caza una cantidad sorprendente de sus propios errores.

**2. El agente de fabricabilidad** lee el diseño y las reglas de la fábrica y devuelve una lista de problemas, cada uno con la línea de código que hay que cambiar y una corrección propuesta. Se ejecuta después de cada cambio de diseño, como los equipos de software ejecutan las pruebas antes de publicar.

**3. El agente de aprovisionamiento** pide presupuestos a SendCutSend, Xometry y JLCPCB, busca componentes electrónicos en sitios como DigiKey y LCSC, y mantiene al día `bom.csv`. Redacta los pedidos, y una persona pulsa comprar.

**4. El agente de firmware** escribe la configuración de ESPHome, conecta el dispositivo a Home Assistant y comprueba que cada sensor y cada interruptor informa bien antes de soldar nada.

**5. El agente de costes** suma piezas, acabados, embalaje y envío en un coste unitario a 1, 10, 50 y 500 unidades, y avisa cuando un cambio de diseño empuja el margen por debajo del objetivo. La mayoría de los negocios de hardware mueren porque nadie miraba este número.

**6. El agente de pedidos** es el que convierte esto en un negocio. Un cliente introduce sus medidas, el agente las comprueba contra los límites de `requirements.md`, genera los ficheros a medida, los pasa por el agente de fabricabilidad y deja el pedido en cola para que se apruebe.

Cada agente escribe una línea en `build-log.md` cuando cambia algo. Cuando una pieza vuelve mal, se puede rastrear exactamente qué cambio lo causó, y esa es la diferencia entre una afición y una empresa.

## Cómo fabricar la primera cosa (para venderla o solo para uno mismo)

![Seis pasos para la primera pieza: medir, que la IA escriba el CAD, imprimir una prueba de encaje, una hora con un ingeniero, mandarlo a la fábrica y añadir un ESP32](/images/blog/fabricacion-vibe/primeros-pasos.png)

Concretemos. Supongamos una estantería de metal fina para la entrada, que sujete las llaves, la cartera y las gafas de sol, que quepa en la franja exacta de pared entre el marco de la puerta y el interruptor de la luz, y que le diga al agente cuándo se ha salido de casa sin las llaves. Así la construiría el autor.

**Medir como si dependiera el dinero, porque depende.** Las malas medidas son la razón número uno de que fallen las primeras piezas. La IA diseñará encantada una pieza preciosa que es 4 mm demasiado ancha, y la fábrica la cortará encantada. Unos calibres digitales, por unos 25 dólares, para cualquier cosa pequeña, como agujeros de tornillo o el grosor de un llavero. Para la pared en sí, una aplicación LiDAR del teléfono como Polycam da la forma general, y un metro da los números que importan. Cada medida se escribe en un único fichero de texto con una foto de dónde se tomó, y las críticas se miden tres veces.

**Hacer que la IA escriba el diseño como código.** Describir la pieza a un modelo de frontera y pedirle que escriba el diseño en CadQuery o en OpenSCAD. El *prompt* puede ser tan llano como este:

![Prompt en castellano para un script de CadQuery: estantería de entrada, cada cota como variable, ganchos, hueco para la placa y exportación a DXF, STEP y STL](/images/blog/fabricacion-vibe/prompt-cadquery.png)

```text
Escribe un script de CadQuery para una estantería de entrada montada en la pared.

Pon cada dimensión como una variable al principio del fichero:
- ancho: 300 mm (el hueco entre el marco de la puerta y el interruptor de la luz)
- fondo: 90 mm
- material: chapa de acero de 2 mm
- altura del labio delantero: 15 mm

Añade tres ganchos para llaves por debajo, un hueco oculto detrás
para una placa de circuito pequeña, y dos ranuras en forma de cerradura para colgarla.

Exporta el desarrollo plano como DXF para corte láser, un fichero STEP
de la pieza terminada, y un STL para imprimir en 3D y probar el encaje.
```

Esa línea de poner cada dimensión en una variable es el hábito más importante de toda la guía. Cuando una medida falla, se cambia un número y todo se actualiza. Cuando un amigo quiere una para su pared, se cambian tres números. Esa es la semilla de un producto.

**Saber qué fichero va a cada sitio.** STL es para impresión 3D, una malla hecha de triángulos. STEP es el formato universal de piezas 3D precisas y lo que se envía a un taller de mecanizado. DXF es un dibujo plano en 2D y lo que se envía para chapa cortada a láser. Para piezas plegadas, la mayoría de los talleres de chapa aceptan un fichero STEP de la forma terminada y calculan ellos el desarrollo plano.

**Comprobar que de verdad se puede fabricar.** Un diseño puede verse perfecto en pantalla y ser imposible de fabricar. El metal solo se pliega hasta cierto punto, los agujeros solo pueden ser pequeños hasta cierto punto respecto al material, y una herramienta de corte redonda nunca puede hacer una esquina interior perfectamente viva. El truco es que toda fábrica seria publica sus guías de diseño. Se descargan, se pegan en el chat y se le pide a la IA que contraste el diseño con ellas línea por línea. Cazará un agujero demasiado cerca de un pliegue, que desgarraría el metal, antes de que cueste dinero.

![Llevar los errores a la izquierda: un error de CAD cuesta segundos; uno de impresión 3D, 2 dólares y 40 minutos; un prototipo en metal, 50 dólares y días; un error de 500 unidades es un desastre](/images/blog/fabricacion-vibe/errores-a-la-izquierda.png)

**Imprimirlo primero en plástico.** Antes de pagar el metal, se imprime una versión en una impresora de casa. Casi nunca hace falta imprimir la pieza entera. Si la parte arriesgada es cómo la estantería se encuentra con la pared, se imprime solo esa esquina: una impresión de 40 minutos en lugar de una de 14 horas. En hardware esto se llama prueba de encaje, y es como se itera cinco veces en un día. Para piezas grandes y planas, se imprime el contorno en papel a tamaño real y se pega en la pared con cinta. No cuesta nada y caza la mitad de los errores.

**Pagarle una hora a un ingeniero.** Antes del primer pedido de verdad, se busca un ingeniero mecánico en Upwork y se le paga una hora para que revise los ficheros. Tres preguntas: ¿por dónde se va a romper?, ¿qué va a rechazar la fábrica?, ¿qué cambiarías para abaratarlo? Cuesta unos 100 dólares y es el seguro más barato que se va a comprar. Un comentario como «usa aluminio 5052 en lugar de 6061, porque el 6061 se agrieta al plegarlo» puede salvar un pedido entero.

**Enviarlo.** Se suben los ficheros y se obtiene un presupuesto al instante. SendCutSend corta y pliega chapa, y también puede roscar, insertar herrajes a presión y pintar las piezas al polvo en el color elegido, de modo que llegan con aspecto de acabadas. Xometry y Protolabs se ocupan del mecanizado CNC, el moldeo por inyección y la impresión 3D industrial, en materiales mucho más resistentes que cualquiera que se imprima en casa. JLCPCB y PCBWay hacen placas de circuito y sueldan los componentes. Se piden dos juegos de piezas. Uno se estropeará durante el montaje, y el de repuesto cuesta menos que otra semana de espera.

**Añadir el cerebro.** Se empieza con una placa de desarrollo ESP32, unos cables jumper y un sensor barato, como una báscula pequeña o un interruptor magnético bajo cada gancho. Para la primera versión no hace falta soldar. Se programa con ESPHome, donde en lugar de escribir firmware se escribe un fichero de configuración corto que dice «este pin lee el gancho uno», y la IA puede escribir ese fichero. ESPHome se enchufa directo a Home Assistant, y Home Assistant se lo entrega al agente. A partir de ahí se le puede decir: «si salgo de casa y las llaves siguen en el gancho, mándame un mensaje».

Cuando funciona en la mesa, la IA puede ayudar a diseñar una placa de circuito limpia en KiCad, la herramienta libre de código abierto, y enviarla a JLCPCB. Dos decisiones aquí ahorran meses después. Alimentar el dispositivo con un adaptador de pared certificado y de serie, que entregue baja tensión, para que el cacharro no toque nunca la corriente de la pared directamente. Y usar un módulo ESP32 que ya lleve la certificación FCC de su radio, lo que permite saltarse un trozo grande y caro de los ensayos.

**Hacer uno, y luego corregirlo.** La primera versión fallará en algún sitio. Un tornillo caerá sobre un montante, un gancho quedará 3 mm demasiado bajo. Es normal, y por eso se hace uno antes de hacer diez. Se cambia una variable cada vez, se lleva un diario de fabricación corto y se guardan los ficheros de diseño en git, como el software, para poder volver siempre a la versión que funcionaba. A la versión tres, parecerá que salió de una tienda y encajará mejor que cualquier cosa que venda una tienda.

## El modelo de negocio

![«Si quieres ganar dinero con el software, vende hardware.» Versión en español del tuit de Brian Norgard (@BrianNorgard) del 25 de septiembre de 2026](/images/blog/fabricacion-vibe/tuit-norgard.png)

> «Si quieres ganar dinero con el software, vende hardware.»
>
> — [Brian Norgard (@BrianNorgard)](https://x.com/BrianNorgard), 25 de septiembre de 2026, traducción nuestra

Mucha gente se quedará en fabricar cosas para sí misma, y ese es un gran resultado. Al autor le parece realmente estupendo. Una casa llena de cosas hechas exactamente para la propia vida era un lujo reservado a los muy ricos.

Pero si se quiere vender, la economía es distinta de todo lo que los fundadores de hardware habían tenido delante.

**Vender antes de fabricar.** Como el producto es un fichero, se puede tomar el pedido primero y fabricar después. El cliente escribe sus medidas en un formulario sencillo del sitio, el código genera un diseño que encaja, paga, y solo entonces se corta o se imprime algo. En el mundo viejo se apostaba todo a 5.000 unidades antes de tener un solo cliente. Aquí cada unidad está vendida antes de existir, lo que permite empezar casi sin dinero.

**Hacer las cuentas antes de enamorarse.** Sumar todo: piezas, acabados, electrónica, el tiempo de montaje, el embalaje, el envío de ida y de vuelta, las comisiones del pago y la unidad de vez en cuando que llega doblada. La mayoría de quienes fabrican por primera vez se olvidan de al menos tres de esas partidas. Los productos a medida también son difíciles de revender, así que las devoluciones duelen más de lo habitual. Una regla práctica habitual en hardware es vender a entre tres y cinco veces lo que cuesta fabricar una unidad. El trabajo a medida a menudo puede ir más alto, porque el cliente paga por el encaje, que nadie más puede darle.

**Venderlo de tres maneras.** El producto terminado es la obvia. Pero también se puede vender un kit para quien le guste montar, y un fichero personalizable para quien tenga impresora. El fichero tiene márgenes de casi el 100 % y convierte a los clientes en una comunidad que sugiere el siguiente producto.

**Dejar que la fabricación sea el marketing.** Un vídeo de un producto que pasa de una frase a una pieza de metal terminada en una semana convence más que cualquier anuncio que se pueda comprar, y cada versión que se hace es otra pieza de contenido. Quienes están ganando en esto construyen en público, y su audiencia suele ser los primeros 100 clientes.

**Tratar la certificación como un foso.** Si el producto se enchufa a la pared, hará falta una marca de seguridad como UL o ETL en Estados Unidos. Si lleva radio, necesita la aprobación de la FCC. Si es para niños, hay todo un conjunto aparte de normas y ensayos, y Europa trae sus propias marcas. Es lento, molesto y caro, y exactamente por eso es un foso. La mayoría de los aficionados no lo hará nunca, así que quienes sí lo hacen entran en tiendas, aseguradoras y clientes de empresa a los que los demás tienen cerrada la puerta.

**Escalar cuando la demanda es real.** Cuando los pedidos son estables y el diseño ha dejado de cambiar, se pasa a lotes. Pedir 50 de una pieza en lugar de una cada vez baja el coste unitario deprisa, porque la fábrica reparte el tiempo de preparación entre más piezas. A un volumen serio, las piezas de plástico pueden pasar de la impresión al moldeo por inyección, donde cada pieza cuesta céntimos. La diferencia con el mundo viejo es que se llega ahí con clientes reales y demanda real, en lugar de con una suposición.

Nota: el autor irá añadiendo más ideas de startups de hardware a [Ideabrowser.com](https://ideabrowser.com/) durante los próximos 30 días.

## Dónde se rompe (y a veces sale mal)

La IA está segura de una física que apenas entiende. Diseñará un soporte que se ve perfecto y se parte la primera vez que alguien cuelga un abrigo pesado, porque nunca pensó en la carga, el brazo de palanca ni la fatiga del metal. Cualquier cosa que aguante peso, se caliente, gire o toque la piel necesita una prueba de verdad y, a ser posible, un ingeniero de verdad.

Los materiales sorprenden. El plástico más habitual de la impresión 3D, el PLA, empieza a ablandarse en torno a los 60 °C, lo que significa que una pieza dejada en el salpicadero de un coche en julio puede combarse hasta quedar hecha un charco. Los errores pequeños también se acumulan. Tres piezas que se desvían medio milímetro cada una pueden sumar un conjunto que se niega a cerrar.

Las copias llegan rápido. Si el producto es una forma sencilla, alguien descargará la foto, hará que su propia IA lo recree y lo venderá más barato en Etsy antes del viernes. Los negocios defendibles se construyen sobre cosas difíciles de copiar: un encaje perfecto para un producto concreto, un personalizador paramétrico, la certificación, una marca en la que la gente confía y una comunidad que construye sobre el estándar propio.

Y la responsabilidad es real. En el momento en que se vende algo que se enchufa a la pared, sujeta a un niño o cierra una puerta, se responde de lo que pase cuando falle. Hay que tener seguro, seguir las normas de certificación y diseñar cada dispositivo conectado a un agente de modo que una persona siempre pueda anularlo con la mano.

Cada una de estas cosas es una razón para empezar ahora y aprenderlo bien, porque quien lo haga tendrá una ventaja real sobre la avalancha de gente que imprime lo que esté de moda.

## Hacia dónde va esto

Quien quiera empezar esta semana, que lo deje pequeño. Comprar unos calibres. Elegir una cosa molesta de la casa que ninguna tienda vende en la medida correcta: una estantería, un soporte, un organizador de cables, un sujetador para algo que ya se tiene. Pedirle a una IA que lo escriba en CadQuery, imprimirlo, corregirlo y encargar después una versión en metal a SendCutSend. Si ya se tiene acceso a una impresora, el conjunto probablemente cuesta menos de 100 dólares. La primera vez que llega una caja con una pieza diseñada a partir de una frase, algo se recoloca en la cabeza.

Luego, un paso más. Coger una placa ESP32 y hacer que una cosa de la casa informe al agente. Una puerta, un buzón, una planta. Ver cuánto más útil se vuelve el agente en el momento en que puede ver el mundo real.

El autor cree que miraremos este periodo como miramos los primeros años de la App Store. Un grupo pequeño de personas se dio cuenta de que las herramientas habían cambiado antes que los demás, y construyó la primera ola de productos mientras el espacio estaba abierto de par en par.

Su cálculo es que, en unos pocos años, una parte significativa de las cosas de nuestras casas estará hecha específicamente para nosotros. Diseñada por alguien que nunca fue a una escuela de ingeniería, fabricada en una fábrica que nunca visitó, vendida antes de existir y gobernada por un agente que conoce nuestras rutinas. Las grandes marcas seguirán vendiendo el producto medio a todo el mundo. Lo interesante saldrá de gente que hace cosas para un mercado de 500, o de 50, o de uno.

La programación vibe cambió quién puede construir software. La fabricación vibe está cambiando quién puede construir todo lo demás. E incluso si uno solo fabrica cosas para sí mismo, es una de las habilidades más divertidas que se pueden aprender ahora mismo.

Bienvenidos a la era de la fabricación vibe.

---

*Texto original de Greg Isenberg, publicado en X el 4 de octubre de 2026 y disponible en [este enlace](https://x.com/gregisenberg/status/2106737353431581132) (el artículo, en [este otro](https://x.com/i/article/2106728342569250816)), donde también están las ilustraciones y la referencia a su pódcast [Startup Ideas Pod](https://www.youtube.com/@startupideaspod) y a [Ideabrowser](https://ideabrowser.com/), donde publica ideas validadas como estas. Esta versión en español se publica con atribución completa; si el autor prefiere que se retire, se retirará.*
