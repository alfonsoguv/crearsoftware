---
title: "Linux kernel management style"
slug: "linux-kernel-management-style"
date: "2007-05-28"
oldUrl: "/2007/05/28/linux-kernel-management-style/"
description: "Via Barrapunto he encontrado una traducción realizada por Alex Fernandez, sobre el manual escrito por el señor Linus Tolvard, dando consejos de como..."
category: "desarrollo-software"
tags: ["linux","experiencia de usuario","liderazgo","software libre"]
readingTime: 13
author: "Alfonso Gutiérrez"
commentCount: 2
wordCount: 2465
image: "/wp-content/uploads/2007/05/torvalds.jpg"
---

Via Barrapunto he encontrado una traducción realizada por Alex Fernandez, sobre el manual escrito por el señor Linus Tolvard, dando consejos de como hay que gestionar a un grupo de programadores de software libre, la verdad que cuanto más leo sobre Linus más me doy cuenta de que lo es realmente es un buen gestor de personas, ese es su éxito. Supo gestionar un grupo de programadores con un fin común que fue crear el Kernel de Linux. Aquí os dejo su doctrina, para leer con calma:

**Estilo de gestión del kernel Linux** Este breve documento describe el estilo de gestión preferido (o inventado, según a quién le preguntes) para el kernel Linux. En teoría debería seguir el formato del documento CodingStyle \[EstiloProgramacion\] hasta cierto punto, y se ha escrito sobre todo para evitar responder (\*) a las mismas preguntas (o parecidas) una y otra vez.

El estilo de gestión es muy personal y mucho más difícil de cuantificarque las reglas de estilo de programación, así que este documento puede tener o no que ver con el mundo real. Empezó como un divertimento, pero eso no quiere decir que no pueda ser verdad. Tendrás que decidir por ti mismo. Por cierto, cuando se habla de "gestor del kernel", es sobre las personas que llevan el liderazgo técnico, no la gente que hace gestión tradicional en las empresas.

Si firmas órdenes de compra o tienes alguna idea sobre el presupuesto de tu grupo, casi seguro que no eres un gestor del kernel. Estas sugerencias pueden o no aplicarse a tu caso. Primero de todo, sugiero comprar "Siete Hábitos de Gente Exitosa", y NO leerlo. Quémalo, es un gesto simbólico estupendo. (\*) Este documento lo consigue no tanto respondiendo a la pregunta, sino haciendo insufriblemente obvio para el que la hace que no tenemos ni la más remota idea de cuál es la respuesta.

Bueno, pues ahí va: **Capítulo 1: Decisiones** Todo el mundo piensa que los gestores toman decisiones, y que tomar decisiones es importante. Cuanto mayor sea la decisión y más penas provoque, más grande debe ser el gestor que la tome. Esto es muy rofundo y muy obvio, pero resulta que no es cierto. La gracia del juego es \_evitar\_ tener que tomar decisiones.

En particular, si alguien te dice: "elige (a) o (b), necesitamos que tú decidas esto", estás en un lío. La gente que gestionas debería conocer los detalles mejor que tú, así que si vienen a ti para que tomes una decisión técnica, estás jodido. Está claro que no eres competente para tomar la decisión por ellos. (Corolario: si la gente que gestionas no conoce los detalles mejor que tú, también estás jodido, aunque por una razón completamente diferente.

En este caso es que estás en el trabajo equivocado, y son más bien\_ellos\_ los que deberían estar gestionando tu brillantez.) Así que la gracia del negocio está en \_evitar\_ las decisiones, por lo menos las más gordas y penosas. Tomar decisiones pequeñas y sin consecuencias está bien, y hace que parezca que sabes lo que haces, así que lo que un gestor del kernel tiene que hacer es convertir las decisiones gordas y penosas en cosas pequeñas que a nadie le importan.

Hay que darse cuenta de que la diferencia crucial entre una decisión gorda y una pequeña es que puedas cambiar de decisión más adelante. Cualquier decisión puede hacerse pequeña si te aseguras de que si te equivocas (y te vas a equivocar \_seguro\_), siempre puedes deshacer el daño más tarde volviendo sobre tus pasos.

De repente, eres el doble de gestor por tomar \_dos\_ decisiones sin importancia: la errónea \_y\_ la correcta. Y la gente hasta verá eso como liderazgo puro (\*cof cof\* y una mierda\*cof cof\*). Así que la clave para evitar las grandes decisiones es evitar hacer cosas que no tengan remedio. No dejes que te arrinconen sin escapatoria posible.

Una rata arrinconada puede que sea peligrosa -- pero un gestor arrinconado es patético. Resulta que, ya que nadie va a darle a un gestor del kernel mucha responsabilidad financiera en \_ningún\_ caso, echar atrás suele ser fácil. Dado que no vas a ser capaz de gastar ingentes cantidades de dinero que luego no puedas recuperar, la única cosa en la que puedes tener que echar atrás es en una decisión técnica, y ahí lo tienes fácil: sólo tienes que decirles a todos que eres un cretinazo incompetente, que lo sientes, y deshacer todo el trabajo inútil que por tu culpa han tenido que hacer durante el último año.

De repente la decisión que tomaste hace un año no es tan gorda como parecía, porque se ha podido deshacer fácilmente. Resulta que hay gente a la que no le gusta este enfoque, por dos motivos:

- admitir que has sido un idiota es más difícil de lo que parece. A todo el mundo le gusta mantener las apariencias, y salir en público a decir que te has equivocado puede resultar dificilillo.

- que alguien te diga que aquéllo en lo que has trabajado durante el último año no sirve para nada, después de todo, puede ser duro para los pobres ingenieros de a pie, y mientras que el \_trabajo\_ se puede deshacer fácilmente con sólo borrarlo, puede que hayas perdido sin remedio la confianza de este ingeniero. Y recuerda: las cosas "irrevocables" son justo lo que intentábamos evitar desde el principio, así que tu decisión sí que era gorda después de todo.

Por suerte, ambos puntos se pueden mitigar bastante: basta admitir de primeras que no tienes ni puñetera idea, y diciéndole a la gente antes de empezar que la decisión es preliminar, y podría ser un error. Deberías reservarte siempre el derecho a cambiar de idea, y que la gente sea \_muy\_ consciente de ello.

Además de que es más fácil admitir que eres estúpido cuando no has hecho \_todavía\_ la cosa estúpida de verdad. Después, cuando resulta que sí que era estúpida, la gente pone los ojos en blanco y dice: "Vaya, lo ha vuelto a hacer", y listo. Esta admisión preventiva de incompetencia puede que sirva también para que la gente que tiene que hacer el trabajo se piense dos veces si vale la pena hacerlo.

Después de todo, si \_ellos\_ no están seguros de si es una buena idea, está claro que tú no deberías animarlos prometiendo que su trabajo se va a incluir. Haz que al menos se lo piensen dos veces antes de embarcarse en una misión de envergadura. Recuerda: más les vale conocer los detalles mejor que tú, y normalmente ya piensan que se saben todas las respuestas.

La mejor cosa que puedes hacer como gestor no es inspirarles confianza, sino más bien inyectarles una buena dosis de pensamiento crítico sobre su trabajo. Por cierto, otra forma de evitar una decisión es lloriquear: "¿no podemos hacer las dos cosas?" y poner aspecto patético. Hazme caso, eso funciona.

Si no está claro cuál de las dos formas es la buena, ya se darán cuenta. La respuesta puede ser que los dos equipos acaben tan frustrados por la situación que abandonen. Esto podría sonar a fracaso, pero en realidad suele ser un signo de que ninguno de los proyectos iba bien, y la razón de que la gente implicada no pudiera tomar una decisión es que los dos estaban mal.

Sales de la situación oliendo a rosas, y de paso has evitado otra decisión donde podías cagarla. **Capítulo 2: Gente** La mayoría de la gente es idiota, y ser un gestor quiere decir que tendrás que tratar con ellos, y más importante todavía: que \_ellos\_ tendrán que tratar \_contigo\_. Resulta que, aunque sea fácil deshacer errores técnicos, no es tan fácil deshacer los trastornos de la personalidad.

Tendrás que vivir con los suyos -- y con los tuyos. Sin embargo, para prepararte como gestor del kernel, lo mejor es no quemar los puentes, no bombardear a la población civil ni alienar a demasiados desarrolladores del kernel. Alienar a la gente es sorprendentemente fácil, y des-alienarlos es complicado.

De forma que "alienar" inmediatamente entra en la categoría de "no reversible", y por tanto cae en la región tabú que vimos en el capítulo 1. Sólo hay que seguir unas reglas sencillitas: (1) no llames a la gente gilip\*llas (al menos no en público) (2) aprende a pedir perdón cuando se te olvide la regla (1) El problema con (1) es que es muy fácil caer en ello, porque hay un millón de formas distintas de decir "eres un gilip\*llas" (\*), a veces sin darte cuenta, y casi siempre con una convicción férrea de que tienes razón.

Y cuanto más convencido estés de que tienes razón (y reconozcámoslo, puedes llamar casi a \_cualquiera\_ gilip\*llas, y muchas veces con razón), más difícil es tener que pedir perdón luego. Para resolver este problema, sólo hay dos opciones:

- volverte bueno de verdad en pedir disculpas

- ser tan generoso con tu "amor" que nadie sienta que se le tiene enfilado injustamente. Si aplicas la inventiva suficiente, puede hasta que se se lo tomen bien. La opción de ser educado en extremo no existe realmente. Nadie confiará en alguien que oculta de forma tan palmaria su carácter verdadero. (\*) Paul Simon cantó "Cincuenta Formas de Perder a Tu Amante", porque francamente: "Un Millón de Formas de Decir a un Desarrollador que Es Un Gilip\*llas" no tiene la misma sonoridad. Pero seguro que lo pensó. **Capítulo 3: Gente II

- La Buena Gente** Si aceptamos que la mayoría de la gente es idiota, el corolario es que por desgracia tú también lo eres, y que mientras podemos recrearnos con la certeza de que somos mejores que la media (porque seamos francos, nadie piensa que sea peor que la media o ni siquiera igual a la media), también tendríamos que admitir que no somos tampoco la pajita más larga, y que siempre habrá por ahí gente que es menos idiota que tú.

Hay gente que no reacciona bien ante las personas inteligentes. Otros se aprovechan de ellas. Asegúrate de que tú, como mantenedor del kernel, estás en el segundo grupo. Hazles la pelota, porque son los que te facilitarán tu trabajo. En particular, tomarán las decisiones por ti, que es lo que buscamos desde el principio.

Así que, cuando encuentres a alguien más listo que tú, síguele. Tus responsabilidades como gestor se limitarán a decir: "Parece buena idea

- dale caña", o "Suena bien, pero ¿qué pasa con xxx?". La segunda versión en particular es una forma estupenda de o bien aprender algo nuevo sobre "xxx", o bien parecer \_extra\_ gestor por señalar algo que la persona más lista no había pensado. En ambos casos sales ganando. También es importante darse cuenta de que la grandeza en un área no siempre se traslada a otras.

Así que puedes espolear a la gente en direcciones específicas, pero reconozcámoslo, pueden ser buenos en lo que hacen, y malos en todo lo demás. Las buenas noticias son que la gente tiende naturalmente hacia lo que hace bien, así que no estás haciendo nada irreversible cuando les espoleas en cierta dirección; pero no aprietes demasiado.

**Capítulo 4: Echando culpas** Las cosas saldrán mal, y la gente querrá tener alguien a quien echar la culpa. Zas, te la quedas tú. No es tan difícil aceptar la culpa, sobre todo si la gente se da más o menos cuenta de que no es \_todo\_ culpa tuya. Lo que nos trae a la mejor forma de aceptar culpas: hacerlo por otro.

Te sentirás bien por cargártela, él se sentirá bien por que no le culpen, y el colega que perdió sus 36 GB de porno por tu incompetencia tendrá que admitir que por lo menos no has intentado escaparte. Después encuentra al desarrollador que la ha cagado y hazle saber \_en privado\_ que la ha cagado. No sólo para que no lo haga más, sino para que sepa que te debe una.

Y, más importante todavía, seguramente sea la persona que sabe arreglarlo. Porque, seamos francos, tú seguro que no eres. Aceptar culpas es también lo que te hace gestor, para empezar. Es parte de lo que hace que la gente confíe en ti, y te concede la gloria potencial, porque eres el que dice "La cagué".

Y, si has seguido las otras reglas, a estas alturas seguro que eres bastante bueno diciéndolo. **Capítulo 5: Cosas a evitar** Hay algo que la gente odia más todavía que que los llamen "gilip\*llas", y es que los llamen "gilip\*llas" con voz santurrona. Por lo primero puedes pedir perdón, por lo segundo seguramente ni te dejen.

Lo más probable es que no lleguen ni a escucharte, aunque por lo demás hagas bien tu trabajo. Todos pensamos que somos mejores que los demás, lo que quiere decir que cuando alguien se da aires de grandeza, puede llegar a ser irritante \_de verdad\_. Puedes ser moral e intelectualmente superior a todos los que te rodean, pero no intentes que sea demasiado obvio a no ser que \_quieras\_ irritar a alguien (\*).

Por las mismas, no seas demasiado educado o sutil sobre las cosas. La educación puede fácilmente terminar ocultando los problemas, y como se suele decir, "En internet, nadie puede oírte ser sutil". Usa un objeto contundente para machacar bien la idea, porque si no será difícil estar seguro de que la gente lo haya comprendido.

El humor puede ayudar a suavizar la contundencia y las moralinas. Pasarse de rosca hasta llegar a ser ridículo puede hacer ver alguna cosa sin que sea dolorosa para el que la recibe, que piensa que eres un payaso. Así puedes traspasar la barrera mental que todos tenemos hacia las críticas. (\*) Truco: los foros de internet que no están relacionados directamente con tu trabajo son una forma estupenda de ventilar tus frustraciones con otra gente.

Escribe mensajes insultantes llenos de sarcasmo de vez en cuando, para meterte en una buena pelea dialéctica de vez en cuando, y te sentirás renovado. Eso sí, ten cuidado de no cagarte demasiado cerca de tu puerta. **Capítulo 6: ¿Por qué yo?** Dado que tu mayor responsabilidad parece ser aceptar las culpas de los demás, y que se vea bien claro que eres un incompetente, la pregunta obvia es ¿por qué meterse en este fregado?

Lo primero, tengas o no legiones de chicas (o chicos, no vamos a ponernos sentenciosos ni sexistas ahora) adolescentes gritando a la puerta de tu camerino, lo que sí tendrás es un sentimiento inmenso de realización personal por estar "al mando". Da igual que en realidad no estés liderando sino intentando estar a la altura de los demás y corriendo tras ellos todo lo rápido que puedes.

Todo el mundo pensará que estás al mando. Es un trabajo estupendo si te lo sabes currar.

![linux](/wp-content/uploads/2007/05/torvalds.jpg)
