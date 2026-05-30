export type JournalEntry = {
  slug: string;
  date: string;
  code: string;
  title: string;
  tag: "Prensa" | "Futuro" | "Estudio" | "Alianza" | "Apuntes";
  excerpt: string;
  body: string[];
};

export const JOURNAL: JournalEntry[] = [
  {
    slug: "casacor-2026",
    date: "May 2026",
    code: "DI-006",
    title: "MILO en CasaCor Perú 2026",
    tag: "Futuro",
    excerpt:
      "Del 5 de mayo al 5 de julio, en el Jockey Club del Perú, levantamos 72 m² de atmósfera. Nuestra primera vez en la vitrina más importante de la región.",
    body: [
      "CasaCor Perú 2026 se celebra en el Jockey Club del Perú, en Lima, del 5 de mayo al 5 de julio. Es la muestra de arquitectura e interiorismo más importante de Latinoamérica, y este año MILO participa por primera vez con una instalación de 72 m². No es poca cosa para nosotros: es entrar a la conversación grande con voz propia.",
      "Pensamos el espacio como se piensa una sobremesa larga — esa en la que nadie quiere levantarse. Madera tornillo del oriente peruano, piedra de Arequipa, una luz que cae lenta como la tarde limeña sobre el malecón. Cada material lo elegimos por cómo se siente al tacto, no solo por cómo se ve en la foto.",
      "Si pasas por el Jockey Club entre mayo y julio, búscanos. Habrá café, habrá conversación y habrá un rincón pensado para quedarse. Eso es, al final, lo único que sabemos hacer: lugares donde el tiempo se estira.",
    ],
  },
  {
    slug: "casa-barranco-en-obra",
    date: "Mar 2026",
    code: "DI-005",
    title: "Casa Barranco entra en obra",
    tag: "Futuro",
    excerpt:
      "Una casa de quincha rehabilitada frente al mar de Barranco. Empezamos a levantar paredes que ya tienen un siglo de memoria.",
    body: [
      "Arrancamos la obra de Casa Barranco: una vivienda de quincha de inicios del siglo XX, a tres cuadras del Puente de los Suspiros, que llevaba años cerrada y esperando. La rehabilitación respeta la estructura original de caña y barro y le suma un patio posterior que abre la casa al cielo abierto del distrito.",
      "Nos gusta trabajar con lo que ya estaba. La pátina de los muros, las baldosas hidráulicas que rescatamos pieza por pieza, el olor a madera vieja que aparece cuando se lija. Restaurar es cocinar a fuego lento: hay que entender el ingrediente antes de tocarlo.",
      "La entrega está prevista para fines de 2026. Iremos contando el proceso aquí, con sus aciertos y sus tropiezos, porque una obra honesta también se cuenta entera.",
    ],
  },
  {
    slug: "milo-en-revista-cosas",
    date: "Dic 2025",
    code: "DI-004",
    title: "Casa Casuarinas en revista Cosas",
    tag: "Prensa",
    excerpt:
      "Nuestra Casa Casuarinas ocupó ocho páginas del especial de arquitectura. Hablamos de cubiertas vegetales y de luz que se cuela entre los árboles.",
    body: [
      "La edición de diciembre dedicó un reportaje a Casa Casuarinas, la vivienda que terminamos en 2024 en Las Casuarinas, Lima. Ocho páginas, fotografía de buena luz y una conversación sobre por qué insistimos en que las casas respiren hacia adentro.",
      "Agradecemos al equipo de la revista por mirar el proyecto con el detalle que merece: la cubierta vegetal como quinto jardín, el hormigón blanco pulido, la carpintería negra que enmarca el verde. Cosas que en la foto se ven y en la casa, además, se sienten frescas al mediodía.",
      "Dejamos por aquí el enlace cuando esté disponible en digital. Mientras tanto, si la encuentran en quiosco, vale la pena el papel.",
    ],
  },
  {
    slug: "alianza-taller-madera-tornillo",
    date: "Sep 2025",
    code: "DI-003",
    title: "Alianza con Taller Madera Tornillo",
    tag: "Alianza",
    excerpt:
      "Unimos manos con un taller de Pucallpa para trabajar madera certificada del oriente. Carpintería con trazabilidad y oficio de generaciones.",
    body: [
      "Firmamos una alianza con Taller Madera Tornillo, un equipo de ebanistas de Pucallpa con tres generaciones de oficio. A partir de ahora, buena parte de nuestra carpintería a medida sale de sus manos, con madera certificada de manejo responsable del oriente peruano.",
      "Nos importa de dónde viene cada tabla. Saber qué árbol fue, quién lo trabajó y cómo se secó cambia por completo el resultado — igual que saber de qué chacra viene el ají amarillo cambia el plato. La trazabilidad no es un trámite: es respeto.",
      "Esta alianza nos permite ofrecer piezas únicas, hechas a mano, con la conciencia tranquila. Y de paso, sostener un oficio que merece seguir vivo.",
    ],
  },
  {
    slug: "cuaderno-de-luz-limena",
    date: "Jun 2025",
    code: "DI-002",
    title: "Apuntes sobre la luz limeña",
    tag: "Apuntes",
    excerpt:
      "Lima no tiene sol la mitad del año, y eso es un regalo. Notas de taller sobre diseñar para un cielo blanco y una luz sin sombras duras.",
    body: [
      "Hay quien se queja del cielo gris de Lima. Nosotros lo celebramos. La garúa y la panza de burro nos dan una luz difusa, sin sombras duras, que envuelve los espacios como una tela fina. Diseñar para ese cielo es distinto a diseñar para el sol pleno del sur.",
      "Estos apuntes nacen del taller, de las pruebas con maquetas y de mirar mucho por la ventana. Anotamos cómo se comporta un muro blanco bajo la garúa de julio, cómo cambia el barro cocido cuando el aire está cargado de mar, qué colores se apagan y cuáles, en cambio, se encienden.",
      "No son conclusiones cerradas. Son notas al margen que compartimos por si a alguien le sirven, y porque pensar en voz alta también es parte del oficio.",
    ],
  },
  {
    slug: "milo-crece-nuevo-taller",
    date: "Feb 2025",
    code: "DI-001",
    title: "MILO crece: nuevo taller en Miraflores",
    tag: "Estudio",
    excerpt:
      "Mudamos el estudio a una casa antigua de Miraflores, con patio y cocina propia. Porque las mejores ideas siempre aparecen cerca de la olla.",
    body: [
      "MILO tiene casa nueva. Nos mudamos a una vivienda de los años cincuenta en Miraflores, a pocas cuadras del malecón, con techos altos, un patio interior lleno de helechos y — esto era innegociable — una cocina de verdad.",
      "Creemos que un estudio se parece a la casa que sueña. Por eso queríamos un lugar con sobremesa: una mesa larga donde caben los planos, los cafés de media mañana y las discusiones que terminan dibujadas en una servilleta. La arquitectura buena se cocina así, despacio y entre varios.",
      "Estamos creciendo, sumando manos al equipo y abriendo la puerta a nuevos encargos. Si quieres conocernos, la cafetera siempre está caliente.",
    ],
  },
];
