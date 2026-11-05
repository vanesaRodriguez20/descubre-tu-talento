export type CategoriaTalento = 'matematicas' | 'crear' | 'deporte' | 'aprender' | 'ayudar';

export type AfinidadTalento = CategoriaTalento | 'descubriendo' | 'mixto';

export type RolUsuario = 'niño' | 'docente';

/**
 * Configuración de Accesibilidad Universal Inclusiva (100% Funcional)
 */
export interface PreferenciasAccesibilidadFrontend {
  modoOscuro: boolean;
  altoContraste: boolean;
  tamanoTexto: 'normal' | 'grande' | 'muy-grande';
  fuenteDislexia: boolean;
  lectorCursor: boolean;
  reglaGuiaLectura: boolean;
  movimientoReducido: boolean;
  velocidadVoz: 'lenta' | 'normal' | 'rapida';
}

export interface PinVisualItem {
  id: string;
  emoji: string;
  nombre: string;
  color: string;
}

export interface EntregaActividad {
  idActividad: number;
  idEstudiante: number;
  fechaEntrega: string;
  respuestaOTrabajo: string;
  simulacionCompletada?: boolean;
  estado: 'enviada' | 'evaluada';
  calificacionEstrellas?: number; // 1 to 5
  mensajeMotivadorDocente?: string;
  fechaEvaluacion?: string;
  audioExplicacion?: boolean;
  reaccionIcono?: string; // Sello visual elegido por el niño (ej: 🌟, 🍕, 🚀)
}

export interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: CategoriaTalento;
  puntos: number;
  duracionMinutos?: number;
  icono?: string;
  imagenVisual?: string;
  fechaLimiteEntrega: string; // e.g. "2026-11-15"
  instrucciones?: string[];
  tipoInteractivo?: 'fracciones' | 'balanza' | 'patrones' | 'geometria' | 'presupuesto' | 'lienzo' | 'xilofono' | 'deporte' | 'amabilidad' | 'general';
  explicacionConceptual?: string;
  audioGuiaLumy?: string;
  zonaLibre?: boolean; // Actividades de juego exploratorio libre
  esMisionProfe?: boolean; // Tareas obligatorias asignadas por el docente
  nivelZPDRequerido?: number;
  destinatarioTipo?: 'todos' | 'especifico';
  estudianteIdEspecifico?: number;
  opcionesVisualesRespuesta?: {
    id: string;
    textoVisual: string;
    icono: string;
    esRecomendada?: boolean;
  }[];
}

export interface AlertaSeguridad {
  id: string;
  idEstudiante: number;
  aliasEstudiante: string;
  tipo: 'lenguaje_inapropiado' | 'palabra_sensible';
  mensajeDetectado: string;
  fecha: string;
  atendida: boolean;
  orientacionLumy: string;
}

export interface DiplomaInfo {
  id: string;
  idEstudiante: number;
  aliasEstudiante: string;
  tituloHonorifico: string;
  mensajeEspecialLumy: string;
  fechaEmision: string;
  talentoDestacado: string;
  estrellasTotales: number;
}

export interface Usuario {
  id: number;
  alias: string; // Único identificador público del niño (ej. "ana_estrella") - Cero nombres reales
  nombre?: string; // Para docentes (ej: "Profesora Laura Salcedo")
  correo?: string; // Correo para login del docente
  password?: string; // Contraseña para login del docente
  pin: string; // PIN numérico de 4 dígitos (ej. "1234")
  pinVisual?: string[]; // Secuencia de IDs de iconos visuales (ej. ["cohete", "estrella", "manzana", "delfin"])
  apodo?: string; // Apodo infantil amigable ("Capitana de las Fracciones ⭐")
  correoPadres?: string; // Correo de contacto del tutor legal (NUNCA correo del menor)
  rol: RolUsuario;
  progreso: number; // 0 to 100
  categoriaTalento: AfinidadTalento; // Se va determinando dinámicamente con las actividades
  avatar: string;
  actividadesCompletadas: number[]; // IDs de actividades completadas
  notasDocente?: string;
  estrellas?: number;
  nivelZPD?: number; // 1.0 a 5.0
  indiceResiliencia?: number; // 0 a 100
  habilidadesCualitativas?: {
    pensamientoLogico: { nivel: number; descripcionParaPadres: string };
    resilienciaCreativa: { nivel: number; descripcionParaPadres: string };
    percepcionEspacial: { nivel: number; descripcionParaPadres: string };
    cooperacionEmpatia: { nivel: number; descripcionParaPadres: string };
  };
}

export interface Logro {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  progresoRequerido: number;
  categoria?: CategoriaTalento | 'general';
  desbloqueado: boolean;
  habilidadClave?: string;
  explicacionParaPadres?: string;
}

export interface PreguntaQuiz {
  id: number;
  pregunta: string;
  opciones: {
    texto: string;
    icono: string;
    categoria: CategoriaTalento;
  }[];
}

