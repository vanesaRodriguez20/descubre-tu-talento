import { Actividad, AlertaSeguridad, EntregaActividad, Logro, PinVisualItem, PreguntaQuiz, Usuario } from '../types';

export const AVATARES_DISPONIBLES = [
  { id: 'avatar_ana', emoji: '👧', nombre: 'Estudiante Astral' },
  { id: 'avatar_carlos', emoji: '👦', nombre: 'Aventurero Solar' },
  { id: 'avatar_sofia', emoji: '👧🏽', nombre: 'Científica Cósmica' },
  { id: 'avatar_mateo', emoji: '🧒🏻', nombre: 'Guardián del Bosque' },
  { id: 'avatar_vale', emoji: '👧🏼', nombre: 'Pintora de Estrellas' },
  { id: 'avatar_lucas', emoji: '👦🏾', nombre: 'Explorador Veloz' },
  { id: 'avatar_zorro', emoji: '🦊', nombre: 'Zorrito Astuto' },
  { id: 'avatar_leo', emoji: '🦁', nombre: 'León Valiente' },
];

export const PIN_VISUAL_CATALOGO: PinVisualItem[] = [
  { id: 'estrella', emoji: '⭐', nombre: 'Estrella', color: 'bg-amber-100 border-amber-300 text-amber-600' },
  { id: 'cohete', emoji: '🚀', nombre: 'Cohete', color: 'bg-purple-100 border-purple-300 text-purple-600' },
  { id: 'manzana', emoji: '🍎', nombre: 'Manzana', color: 'bg-red-100 border-red-300 text-red-600' },
  { id: 'delfin', emoji: '🐬', nombre: 'Delfín', color: 'bg-sky-100 border-sky-300 text-sky-600' },
  { id: 'corazon', emoji: '❤️', nombre: 'Corazón', color: 'bg-pink-100 border-pink-300 text-pink-600' },
  { id: 'sol', emoji: '☀️', nombre: 'Sol', color: 'bg-yellow-100 border-yellow-300 text-yellow-600' },
  { id: 'pelota', emoji: '⚽', nombre: 'Pelota', color: 'bg-emerald-100 border-emerald-300 text-emerald-600' },
  { id: 'pizza', emoji: '🍕', nombre: 'Pizza', color: 'bg-orange-100 border-orange-300 text-orange-600' },
];

export const ACTIVIDADES_INICIALES: Actividad[] = [
  {
    id: 101,
    titulo: 'La Pizza Mágica: Comprensión Visual de Fracciones',
    descripcion: 'Aprende qué significa una fracción partiendo y repartiendo una pizza mágica en partes iguales.',
    categoria: 'matematicas',
    puntos: 15,
    duracionMinutos: 15,
    icono: '🍕',
    fechaLimiteEntrega: '15 de Noviembre, 2026',
    tipoInteractivo: 'fracciones',
    zonaLibre: false,
    esMisionProfe: true,
    nivelZPDRequerido: 2.5,
    explicacionConceptual: 'Una fracción representa partir una unidad completa en trozos idénticos y tomar algunos.',
    audioGuiaLumy: '¡Hola, soy Lumy! Toca los cortes de pizza. Si cortas en 4 y tomas 2, ¡tienes exactamente la mitad de la pizza!',
    instrucciones: [
      'Mira la pizza mágica en pantalla.',
      'Corta en medios (1/2), cuartos (1/4) u octavos (1/8).',
      'Elige la porción que mejor representa tu respuesta visual.'
    ],
    opcionesVisualesRespuesta: [
      { id: 'op_1', textoVisual: '2 cuartos es exactamente igual a 1 mitad (1/2)', icono: '🍕', esRecomendada: true },
      { id: 'op_2', textoVisual: '4 octavos llenan medio plato de pizza', icono: '🥧' },
      { id: 'op_3', textoVisual: 'Entre más trozos corto, más pequeño es cada pedazo', icono: '✨' }
    ]
  },
  {
    id: 102,
    titulo: 'La Balanza del Equilibrio: Pensamiento Algebraico',
    descripcion: 'Comprende el signo "=" como una balanza que siempre busca estar nivelada, no solo como un resultado.',
    categoria: 'matematicas',
    puntos: 15,
    duracionMinutos: 15,
    icono: '⚖️',
    fechaLimiteEntrega: '18 de Noviembre, 2026',
    tipoInteractivo: 'balanza',
    zonaLibre: false,
    esMisionProfe: true,
    nivelZPDRequerido: 3.0,
    explicacionConceptual: 'En matemáticas, el signo igual (=) significa que el peso en la izquierda tiene exactamente el mismo valor que en la derecha.',
    audioGuiaLumy: 'Soy Lumy tu estrellita. Si un platillo baja, pesa más. ¡Suma el peso que falta en el otro lado para que queden parejos!',
    instrucciones: [
      'Observa hacia dónde se inclina la balanza.',
      'Añade manzanas hasta que la aguja quede en el centro.',
      'Marca tu deducción visual abajo.'
    ],
    opcionesVisualesRespuesta: [
      { id: 'op_b1', textoVisual: 'Añadí 3 manzanas al plato derecho para equilibrar (2 + 3 = 5)', icono: '🍎', esRecomendada: true },
      { id: 'op_b2', textoVisual: 'Ambos platos deben tener el mismo peso total', icono: '⚖️' },
      { id: 'op_b3', textoVisual: 'El signo igual funciona como un balancín de juegos', icono: '🎠' }
    ]
  },
  {
    id: 103,
    titulo: 'Detectives de Patrones y Secuencias Geométricas',
    descripcion: 'Descubre la regla secreta que siguen las estrellas y figuras geométricas en su camino cósmico.',
    categoria: 'matematicas',
    puntos: 15,
    duracionMinutos: 20,
    icono: '🔷',
    fechaLimiteEntrega: '20 de Noviembre, 2026',
    tipoInteractivo: 'patrones',
    zonaLibre: true,
    esMisionProfe: false,
    nivelZPDRequerido: 2.0,
    explicacionConceptual: 'Las matemáticas son la ciencia de los patrones. Encontrar qué se repite te permite predecir el futuro de la serie.',
    audioGuiaLumy: '¡Fíjate en las formas! Descubre el ritmo de la serie para saber cuál figura sigue después.',
    instrucciones: [
      'Mira la fila de figuras de colores.',
      'Encuentra el patrón que se repite.',
      'Selecciona la figura misteriosa que completa la fila.'
    ],
    opcionesVisualesRespuesta: [
      { id: 'op_p1', textoVisual: 'El patrón se repite cada 3 figuras (Círculo, Triángulo, Cuadrado)', icono: '🔷', esRecomendada: true },
      { id: 'op_p2', textoVisual: 'La figura número 10 es un Círculo azul', icono: '🔵' }
    ]
  },
  {
    id: 104,
    titulo: 'El Arquitecto del Patio: Perímetro y Área Visual',
    descripcion: 'Diseña una cerca para mascotas y descubre por qué dos figuras con la misma cerca pueden tener diferente espacio adentro.',
    categoria: 'matematicas',
    puntos: 20,
    duracionMinutos: 20,
    icono: '📐',
    fechaLimiteEntrega: '24 de Noviembre, 2026',
    tipoInteractivo: 'geometria',
    zonaLibre: true,
    esMisionProfe: false,
    nivelZPDRequerido: 3.5,
    explicacionConceptual: 'El perímetro es la cerca exterior; el área es el pasto donde puedes jugar.',
    audioGuiaLumy: 'Recuerda: El borde es el perímetro y el piso es el área. ¡Coloca los bloques de madera para experimentar!',
    instrucciones: [
      'Arma un corral rectangular.',
      'Cuenta cuántos cuadros de pasto caben adentro.',
      'Cambia la forma y compara el espacio.'
    ],
    opcionesVisualesRespuesta: [
      { id: 'op_g1', textoVisual: 'El perímetro es el borde de madera y el área es el pasto interior', icono: '🏡', esRecomendada: true },
      { id: 'op_g2', textoVisual: 'Un corral cuadrado tiene más espacio interior que uno muy angosto', icono: '🟩' }
    ]
  },
  {
    id: 105,
    titulo: 'La Tiendita Galáctica: Monedas y Presupuesto',
    descripcion: 'Aprende a sumar y calcular el cambio usando monedas cósmicas para comprar meriendas espaciales.',
    categoria: 'matematicas',
    puntos: 15,
    duracionMinutos: 15,
    icono: '🪙',
    fechaLimiteEntrega: '26 de Noviembre, 2026',
    tipoInteractivo: 'presupuesto',
    zonaLibre: false,
    esMisionProfe: true,
    nivelZPDRequerido: 2.8,
    explicacionConceptual: 'El dinero y el presupuesto consisten en combinar monedas de distintos valores para igualar el precio justo.',
    audioGuiaLumy: '¡Bienvenido a la tiendita galáctica! Elige tus monedas para pagar el jugo cósmico sin pasarte de tu presupuesto.',
    instrucciones: [
      'Mira el precio del artículo en la tienda.',
      'Haz clic en las monedas para completar el valor exacto.',
      'Comprueba que el pago esté equilibrado y guarda tu compra.'
    ],
    opcionesVisualesRespuesta: [
      { id: 'op_pr1', textoVisual: 'Pagué $8 juntando una moneda de $5, una de $2 y una de $1 (5+2+1=8)', icono: '🪙', esRecomendada: true },
      { id: 'op_pr2', textoVisual: 'Comprendí cómo agrupar monedas para pagar el valor exacto', icono: '💰' }
    ]
  },
  {
    id: 1,
    titulo: 'Lienzo de Expresión Libre y Pintura Astral',
    descripcion: 'Dibuja con el pincel arcoíris y añade sellos luminosos para expresar tus emociones.',
    categoria: 'crear',
    puntos: 10,
    duracionMinutos: 15,
    icono: '🎨',
    fechaLimiteEntrega: '19 de Noviembre, 2026',
    tipoInteractivo: 'lienzo',
    zonaLibre: true,
    esMisionProfe: false,
    audioGuiaLumy: '¡Toma el pincel cósmico y crea lo que sientas en tu corazón! Puedes usar colores mágicos y sellos brillantes.',
    instrucciones: [
      'Pinta en el lienzo interactivo con colores o modo arcoíris.',
      'Añade sellos luminosos a tu obra.',
      'Guarda tu creación artística.'
    ],
    opcionesVisualesRespuesta: [
      { id: 'op_c1', textoVisual: 'Creé un dibujo cósmico usando colores brillantes', icono: '🎨', esRecomendada: true },
      { id: 'op_c2', textoVisual: 'Usé sellos mágicos para decorar mi constelación', icono: '🌟' }
    ]
  },
  {
    id: 2,
    titulo: 'Compositor de Melodías con Xilófono Cósmico',
    descripcion: 'Toca las notas musicales de colores y compone tu propia canción de bienvenida.',
    categoria: 'crear',
    puntos: 10,
    duracionMinutos: 10,
    icono: '🎵',
    fechaLimiteEntrega: '22 de Noviembre, 2026',
    tipoInteractivo: 'xilofono',
    zonaLibre: true,
    esMisionProfe: false,
    audioGuiaLumy: '¡Toca las barras del xilófono! Cada color tiene una nota musical única. Toca 5 notas para crear una melodía.',
    instrucciones: [
      'Pulsa las teclas de colores en el xilófono.',
      'Escucha los tonos agudos y graves en tiempo real.',
      'Toca una secuencia de 5 notas que rimen y grábala.'
    ],
    opcionesVisualesRespuesta: [
      { id: 'op_m1', textoVisual: 'Compuse una melodía alegre con notas agudas y graves', icono: '🎶', esRecomendada: true }
    ]
  },
  {
    id: 3,
    titulo: 'Desafío de Pases y Puntería con Balón',
    descripcion: 'Practica 20 pases con un balón o haz 10 saltos coordinados con energía.',
    categoria: 'deporte',
    puntos: 10,
    duracionMinutos: 15,
    icono: '⚽',
    fechaLimiteEntrega: '17 de Noviembre, 2026',
    tipoInteractivo: 'deporte',
    zonaLibre: false,
    esMisionProfe: true,
    audioGuiaLumy: '¡Apunta a los aros y porterías cósmicas! Cada tiro exitoso suma puntos de energía física.',
    instrucciones: [
      'Dispara a la portería o diana cósmica.',
      'Logra 5 tiros acertados seguidos.',
      '¡Siente la energía y coordinación en tu cuerpo!'
    ],
    opcionesVisualesRespuesta: [
      { id: 'op_d1', textoVisual: 'Completé los 20 pases manteniendo el equilibrio', icono: '⚽', esRecomendada: true }
    ]
  },
  {
    id: 7,
    titulo: 'Misión Amabilidad: Ayuda a un Compañero o Familiar',
    descripcion: 'Haz un gesto especial hoy: comparte tus materiales o ayuda a ordenar la mesa con alegría.',
    categoria: 'ayudar',
    puntos: 10,
    duracionMinutos: 10,
    icono: '🤝',
    fechaLimiteEntrega: '21 de Noviembre, 2026',
    tipoInteractivo: 'amabilidad',
    zonaLibre: false,
    esMisionProfe: true,
    audioGuiaLumy: 'La empatía es uno de los mayores talentos humanos. Elige qué gesto solidario hiciste hoy para iluminar el día de alguien.',
    instrucciones: [
      'Selecciona el acto de amabilidad que realizaste hoy.',
      'Elige el corazón de agradecimiento.',
      'Guarda tu medalla de compañerismo con Lumy.'
    ],
    opcionesVisualesRespuesta: [
      { id: 'op_a1', textoVisual: 'Compartí mis materiales y ayudé con una sonrisa', icono: '🤝', esRecomendada: true }
    ]
  }
];

export const USUARIOS_INICIALES: Usuario[] = [
  {
    id: 1,
    alias: 'ana_estrella',
    pin: '1234',
    pinVisual: ['estrella', 'cohete', 'manzana', 'delfin'],
    apodo: 'Capitana de las Fracciones ⭐',
    correoPadres: 'familia.gomez@gmail.com',
    rol: 'niño',
    progreso: 75,
    categoriaTalento: 'matematicas', // Se actualiza dinámicamente según actividades completadas
    avatar: '👧',
    actividadesCompletadas: [101, 102, 1, 7],
    notasDocente: 'Comprensión lógica brillante en fracciones y equilibrio de balanzas.',
    estrellas: 18,
    nivelZPD: 3.5,
    indiceResiliencia: 88,
    habilidadesCualitativas: {
      pensamientoLogico: {
        nivel: 85,
        descripcionParaPadres: 'Papá y Mamá: Visualiza cómo las partes forman un todo y deduce equivalencias con gran rapidez.'
      },
      resilienciaCreativa: {
        nivel: 90,
        descripcionParaPadres: 'Frente a un ejercicio difícil no se rinde: reintenta hasta 3 veces cambiando de estrategia con entusiasmo.'
      },
      percepcionEspacial: {
        nivel: 80,
        descripcionParaPadres: 'Anticipa simetrías y particiones geométricas antes de mover las fichas en la pantalla.'
      },
      cooperacionEmpatia: {
        nivel: 78,
        descripcionParaPadres: 'Le gusta explicar a sus compañeros cómo resolvió los acertijos utilizando metáforas sencillas.'
      }
    }
  },
  {
    id: 2,
    alias: 'carlos_rayo',
    pin: '5678',
    pinVisual: ['pelota', 'sol', 'cohete', 'pizza'],
    apodo: 'Rayo Dinámico ⚡',
    correoPadres: 'padres.martinez@hotmail.com',
    rol: 'niño',
    progreso: 40,
    categoriaTalento: 'deporte',
    avatar: '👦',
    actividadesCompletadas: [3, 101],
    notasDocente: 'Muy activo, gran energía y excelente progreso cuando asocia matemáticas al juego físico.',
    estrellas: 10,
    nivelZPD: 2.2,
    indiceResiliencia: 72,
    habilidadesCualitativas: {
      pensamientoLogico: {
        nivel: 60,
        descripcionParaPadres: 'Aprende mejor con retos táctiles y tiempos breves de concentración activa.'
      },
      resilienciaCreativa: {
        nivel: 75,
        descripcionParaPadres: 'Encuentra soluciones kinestésicas y se mantiene positivo ante el error.'
      },
      percepcionEspacial: {
        nivel: 68,
        descripcionParaPadres: 'Gran coordinación y sentido del ritmo corporal.'
      },
      cooperacionEmpatia: {
        nivel: 85,
        descripcionParaPadres: 'Excelente espíritu de equipo y compañerismo en dinámicas colectivas.'
      }
    }
  },
  {
    id: 3,
    alias: 'sofia_luna',
    pin: '2468',
    pinVisual: ['corazon', 'estrella', 'sol', 'manzana'],
    apodo: 'Arquitecta del Cosmos 📐',
    correoPadres: 'chen.familia@gmail.com',
    rol: 'niño',
    progreso: 90,
    categoriaTalento: 'matematicas',
    avatar: '👧🏽',
    actividadesCompletadas: [101, 102, 103, 1, 7],
    notasDocente: 'Curiosidad geométrica sobresaliente; explica sus deducciones con claridad.',
    estrellas: 24,
    nivelZPD: 4.2,
    indiceResiliencia: 95,
    habilidadesCualitativas: {
      pensamientoLogico: {
        nivel: 95,
        descripcionParaPadres: 'Capacidad de deducción abstracta superior; descubre patrones y leyes matemáticas espontáneamente.'
      },
      resilienciaCreativa: {
        nivel: 92,
        descripcionParaPadres: 'Ve los retos difíciles como pasatiempos fascinantes y explora múltiples vías de solución.'
      },
      percepcionEspacial: {
        nivel: 94,
        descripcionParaPadres: 'Dominio de simetrías, áreas y rotaciones espaciales en 2D y 3D.'
      },
      cooperacionEmpatia: {
        nivel: 88,
        descripcionParaPadres: 'Comunica sus ideas con gentileza y apoya a quien lo necesite.'
      }
    }
  },
  {
    id: 4,
    alias: 'mateo_amigo',
    pin: '1357',
    pinVisual: ['delfin', 'corazon', 'estrella', 'sol'],
    apodo: 'Guardián Amable 🤝',
    correoPadres: 'rivas.tutor@outlook.com',
    rol: 'niño',
    progreso: 55,
    categoriaTalento: 'ayudar',
    avatar: '🧒🏻',
    actividadesCompletadas: [7, 101, 3],
    notasDocente: 'Muy empático; ayuda a sus compañeros a entender los problemas con paciencia.',
    estrellas: 14,
    nivelZPD: 2.8,
    indiceResiliencia: 80,
    habilidadesCualitativas: {
      pensamientoLogico: {
        nivel: 70,
        descripcionParaPadres: 'Avanza seguro cuando se siente acompañado y escucha las explicaciones por voz de Lumy.'
      },
      resilienciaCreativa: {
        nivel: 78,
        descripcionParaPadres: 'Responde favorablemente al refuerzo positivo y las metáforas de amistad.'
      },
      percepcionEspacial: {
        nivel: 72,
        descripcionParaPadres: 'Buena comprensión contextual de problemas de la vida cotidiana.'
      },
      cooperacionEmpatia: {
        nivel: 96,
        descripcionParaPadres: 'Sensibilidad excepcional hacia el bienestar de los demás y el trabajo solidario.'
      }
    }
  },
  {
    id: 5,
    alias: 'vale_arte',
    pin: '9999',
    pinVisual: ['pizza', 'manzana', 'estrella', 'corazon'],
    apodo: 'Pintora de Sueños 🎨',
    correoPadres: 'ortiz.vale.padres@gmail.com',
    rol: 'niño',
    progreso: 30,
    categoriaTalento: 'crear',
    avatar: '👧🏼',
    actividadesCompletadas: [1, 2],
    notasDocente: 'Aprende mejor cuando dibuja los problemas matemáticos.',
    estrellas: 8,
    nivelZPD: 2.0,
    indiceResiliencia: 68,
    habilidadesCualitativas: {
      pensamientoLogico: {
        nivel: 62,
        descripcionParaPadres: 'Aprende matemáticas traduciéndolas a esquemas gráficos e ilustraciones coloridas.'
      },
      resilienciaCreativa: {
        nivel: 94,
        descripcionParaPadres: 'Imaginación desbordante para idear enfoques artísticos únicos.'
      },
      percepcionEspacial: {
        nivel: 86,
        descripcionParaPadres: 'Gran sentido del color, proporción y composición estética.'
      },
      cooperacionEmpatia: {
        nivel: 80,
        descripcionParaPadres: 'Comparte con alegría sus dibujos y expresa emociones con fluidez.'
      }
    }
  },
  {
    id: 100,
    nombre: 'Profesora Laura Salcedo',
    correo: 'docente@lum.edu',
    password: '1000',
    alias: 'profe_laura',
    pin: '1000',
    rol: 'docente',
    progreso: 100,
    categoriaTalento: 'mixto',
    avatar: '👩‍🏫',
    actividadesCompletadas: []
  }
];

export const ALERTAS_INICIALES: AlertaSeguridad[] = [
  {
    id: 'alt_1',
    idEstudiante: 2,
    aliasEstudiante: 'carlos_rayo',
    tipo: 'palabra_sensible',
    mensajeDetectado: 'este ejercicio es una bobada no puedo',
    fecha: 'Hoy, 09:12 AM',
    atendida: false,
    orientacionLumy: 'Lumy reforzó la perseverancia con voz calmada: "Respiramos hondo juntos, las dificultades son pistas para aprender". Se notificó al docente para apoyo pedagógico.'
  }
];


export const ENTREGAS_INICIALES: EntregaActividad[] = [
  {
    idActividad: 101,
    idEstudiante: 1,
    fechaEntrega: 'Hoy, 09:30 AM',
    respuestaOTrabajo: '2 cuartos es exactamente igual a 1 mitad (1/2)',
    reaccionIcono: '🍕',
    simulacionCompletada: true,
    estado: 'evaluada',
    calificacionEstrellas: 5,
    mensajeMotivadorDocente: '¡Extraordinario razonamiento visual! Comprendiste que dos cuartos completan la misma cantidad que media pizza. ¡Sigue brillando!',
    fechaEvaluacion: 'Hoy, 10:15 AM'
  },
  {
    idActividad: 102,
    idEstudiante: 1,
    fechaEntrega: 'Ayer, 04:12 PM',
    respuestaOTrabajo: 'Añadí 3 manzanas al plato derecho para equilibrar (2 + 3 = 5)',
    reaccionIcono: '⚖️',
    simulacionCompletada: true,
    estado: 'evaluada',
    calificacionEstrellas: 5,
    mensajeMotivadorDocente: '¡Excelente pensamiento algebraico! Descubriste que el signo igual es un balance que conecta los dos lados con armonía.',
    fechaEvaluacion: 'Ayer, 05:00 PM'
  },
  {
    idActividad: 101,
    idEstudiante: 3,
    fechaEntrega: 'Hoy, 08:45 AM',
    respuestaOTrabajo: '4 octavos llenan medio plato de pizza',
    reaccionIcono: '🌟',
    simulacionCompletada: true,
    estado: 'evaluada',
    calificacionEstrellas: 5,
    mensajeMotivadorDocente: '¡Impresionante deducción geométrica! Demostraste que las matemáticas se pueden ver y saborear en la vida diaria.',
    fechaEvaluacion: 'Hoy, 09:20 AM'
  },
  {
    idActividad: 101,
    idEstudiante: 2,
    fechaEntrega: 'Hoy, 10:00 AM',
    respuestaOTrabajo: '2 cuartos es exactamente igual a 1 mitad (1/2)',
    reaccionIcono: '⚽',
    simulacionCompletada: true,
    estado: 'enviada'
  }
];

export const LOGROS_INICIALES: Logro[] = [
  {
    id: 'primer_paso',
    titulo: 'Primer Descubrimiento',
    descripcion: 'Iniciaste tu viaje en LUM explorando tus habilidades.',
    icono: '🌟',
    progresoRequerido: 10,
    categoria: 'general',
    desbloqueado: true,
    habilidadClave: 'Curiosidad Inicial',
    explicacionParaPadres: 'Papá y Mamá: Tu hijo dio su primer paso exploratorio en la plataforma.'
  },
  {
    id: 'matematico_intuitivo',
    titulo: 'Mago del Equilibrio',
    descripcion: 'Comprendiste visualmente fracciones y balanzas algebraicas.',
    icono: '🍕',
    progresoRequerido: 25,
    categoria: 'matematicas',
    desbloqueado: true,
    habilidadClave: 'Pensamiento Lógico Deductivo',
    explicacionParaPadres: 'Papá y Mamá: Esta medalla certifica que tu hijo comprende la equivalencia matemática sin memorizar cuentas.'
  },
  {
    id: 'creativo_estrella',
    titulo: 'Mente Creativa',
    descripcion: 'Exploraste actividades de arte, color o música.',
    icono: '🎨',
    progresoRequerido: 40,
    categoria: 'crear',
    desbloqueado: true,
    habilidadClave: 'Expresión Artística',
    explicacionParaPadres: 'Papá y Mamá: Estimula el pensamiento lateral y la creatividad.'
  },
  {
    id: 'energia_activa',
    titulo: 'Campeón de Resiliencia',
    descripcion: 'Completaste desafíos difíciles reintentando con optimismo.',
    icono: '🛡️',
    progresoRequerido: 50,
    categoria: 'deporte',
    desbloqueado: true,
    habilidadClave: 'Resiliencia ante el Error',
    explicacionParaPadres: 'Papá y Mamá: No se rindió ante el primer obstáculo: probó alternativas hasta alcanzar el éxito.'
  },
  {
    id: 'explorador_activo',
    titulo: 'Explorador en Marcha',
    descripcion: 'Alcanzaste el 60% de descubrimiento de tus talentos.',
    icono: '🚀',
    progresoRequerido: 60,
    categoria: 'general',
    desbloqueado: true,
    habilidadClave: 'Autonomía de Aprendizaje',
    explicacionParaPadres: 'Papá y Mamá: Ha desarrollado constancia y disfrute del aprendizaje.'
  },
  {
    id: 'pequeno_sabio',
    titulo: 'Ojo de Arquitecto',
    descripcion: 'Investigaste áreas, perímetros y patrones espaciales.',
    icono: '📐',
    progresoRequerido: 75,
    categoria: 'matematicas',
    desbloqueado: true,
    habilidadClave: 'Percepción Espacial',
    explicacionParaPadres: 'Papá y Mamá: Comprende la diferencia entre borde y superficie interior.'
  },
  {
    id: 'gran_corazon',
    titulo: 'Súper Compañero',
    descripcion: 'Compartiste tu ayuda con amigos, familia o la naturaleza.',
    icono: '💖',
    progresoRequerido: 85,
    categoria: 'ayudar',
    desbloqueado: false,
    habilidadClave: 'Empatía y Colaboración',
    explicacionParaPadres: 'Papá y Mamá: Valora el trabajo cooperativo y el apoyo mutuo.'
  },
  {
    id: 'maestro_talento',
    titulo: 'Gran Maestro de Talentos',
    descripcion: '¡Descubriste todos tus superpoderes al 100%!',
    icono: '👑',
    progresoRequerido: 100,
    categoria: 'general',
    desbloqueado: false,
    habilidadClave: 'Maestría Holística',
    explicacionParaPadres: 'Papá y Mamá: Máxima distinción en LUM por completar todos los retos con excelencia conceptual.'
  }
];

export const LOGROS_BASE = LOGROS_INICIALES;

export const PREGUNTAS_QUIZ: PreguntaQuiz[] = [
  {
    id: 1,
    pregunta: 'Si pudieras tener una tarde mágica para hacer lo que quieras, ¿qué elegirías?',
    opciones: [
      { texto: 'Resolver un acertijo secreto o construir con bloques mágicos', icono: '🧩', categoria: 'matematicas' },
      { texto: 'Pintar un mural gigante con pinturas brillantes y música', icono: '🎨', categoria: 'crear' },
      { texto: 'Organizar un partido o carrera de obstáculos en el parque', icono: '⚽', categoria: 'deporte' },
      { texto: 'Preparar una sorpresa o ayudar a cuidar cachorritos rescatados', icono: '🐾', categoria: 'ayudar' }
    ]
  },
  {
    id: 2,
    pregunta: 'Cuando ves un reto difícil, ¿qué te parece más divertido?',
    opciones: [
      { texto: 'Encontrar el truco matemático o el patrón oculto', icono: '🔍', categoria: 'matematicas' },
      { texto: 'Inventar una forma creativa y artística de resolverlo', icono: '🎭', categoria: 'crear' },
      { texto: 'Moverme con rapidez y poner a prueba mis reflejos', icono: '🏃', categoria: 'deporte' },
      { texto: 'Hacerlo en equipo para que todos aprendamos juntos', icono: '🤝', categoria: 'ayudar' }
    ]
  },
  {
    id: 3,
    pregunta: '¿Qué regalo te gustaría recibir en tu cumpleaños?',
    opciones: [
      { texto: 'Un juego de lógica, rompecabezas 3D o balanza de precisión', icono: '🎲', categoria: 'matematicas' },
      { texto: 'Un set de acuarelas, plastilina o un instrumento musical', icono: '🎸', categoria: 'crear' },
      { texto: 'Una bicicleta, patines o un balón profesional', icono: '🛹', categoria: 'deporte' },
      { texto: 'Un kit para sembrar plantas y cuidar el colegio', icono: '🌻', categoria: 'ayudar' }
    ]
  },
  {
    id: 4,
    pregunta: '¿Qué frase describe mejor lo que te hace sentir orgulloso?',
    opciones: [
      { texto: '"¡Comprendí exactamente por qué funciona este ejercicio!"', icono: '💡', categoria: 'matematicas' },
      { texto: '"¡Miren lo que creé con mi imaginación!"', icono: '✨', categoria: 'crear' },
      { texto: '"¡Superé mi propia marca corriendo o jugando!"', icono: '🏆', categoria: 'deporte' },
      { texto: '"¡Logré que alguien sonriera hoy!"', icono: '❤️', categoria: 'ayudar' }
    ]
  }
];
