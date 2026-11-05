import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Edit3,
  KeyRound,
  Mail,
  Award,
  Sparkles,
  Star,
  Printer,
  ShieldCheck,
  Volume2,
  Copy,
  Check,
  Brain,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Gamepad2,
  X,
  Target,
  GraduationCap
} from 'lucide-react';
import { Actividad, AfinidadTalento, AlertaSeguridad, CategoriaTalento, EntregaActividad, Usuario } from '../../types';
import { AVATARES_DISPONIBLES, PIN_VISUAL_CATALOGO } from '../../data/initialData';
import { MathSimulators } from '../MathSimulators';
import { IconoUI, AvatarUI } from '../IconoUI';
import { calcularAfinidadDinamica } from '../../utils/talentDiscovery';
import { soundManager } from '../../utils/audio';

interface DocenteViewProps {
  usuarios: Usuario[];
  todasLasActividades: Actividad[];
  entregas: EntregaActividad[];
  alertasSeguridad: AlertaSeguridad[];
  onMarcarAlertaAtendida?: (idAlerta: string) => void;
  onGuardarNotaDocente: (idUsuario: number, nuevaNota: string) => void;
  onCrearActividad: (nuevaActividad: Omit<Actividad, 'id'>) => void;
  onCrearEstudiante: (nuevo: Omit<Usuario, 'id'>) => void;
  onActualizarEstudiante: (id: number, datos: Partial<Usuario>) => void;
  onEliminarEstudiante: (idEstudiante: number) => void;
  onEvaluarEntrega: (idActividad: number, idEstudiante: number, estrellas: number, mensajeMotivador: string) => void;
  modoOscuro?: boolean;
  pestanaActiva?: 'estudiantes' | 'entregas' | 'actividades' | 'alertas';
  onCambiarPestana?: (pestana: 'estudiantes' | 'entregas' | 'actividades' | 'alertas') => void;
}

// Por compatibilidad con las otras pantallas, la actividad sigue guardando su "icono"
// como texto. Aquí queda en un solo lugar (antes eran muchos "? :" encadenados).
const ICONO_POR_TIPO: Record<string, string> = {
  fracciones: '🍕',
  balanza: '⚖️',
  patrones: '🔷',
  geometria: '📐',
  presupuesto: '💰',
  lienzo: '🎨',
  xilofono: '🎵',
  deporte: '⚽',
  amabilidad: '🤝'
};

// Clase común del botón de cerrar (la "X" de los modales)
const CLASE_CERRAR =
  'w-7 h-7 rounded-full bg-slate-100 dark:bg-purple-900 text-slate-700 dark:text-purple-200 flex items-center justify-center cursor-pointer';

export const DocenteView: React.FC<DocenteViewProps> = ({
  usuarios,
  todasLasActividades,
  entregas,
  alertasSeguridad,
  onMarcarAlertaAtendida,
  onGuardarNotaDocente,
  onCrearActividad,
  onCrearEstudiante,
  onActualizarEstudiante,
  onEliminarEstudiante,
  onEvaluarEntrega,
  modoOscuro = false,
  pestanaActiva: pestanaActivaProp,
  onCambiarPestana
}) => {
  const [pestanaInterna, setPestanaInterna] = useState<'estudiantes' | 'entregas' | 'actividades' | 'alertas'>('estudiantes');
  const pestanaActiva = pestanaActivaProp || pestanaInterna;

  const cambiarPestana = (p: 'estudiantes' | 'entregas' | 'actividades' | 'alertas') => {
    soundManager.playClick();
    setPestanaInterna(p);
    if (onCambiarPestana) {
      onCambiarPestana(p);
    }
  };

  // Modales
  const [modalNuevoEstudiante, setModalNuevoEstudiante] = useState(false);
  const [modalEditarEstudiante, setModalEditarEstudiante] = useState<Usuario | null>(null);
  const [modalEliminarEstudiante, setModalEliminarEstudiante] = useState<Usuario | null>(null);
  const [modalEstadisticasEstudiante, setModalEstadisticasEstudiante] = useState<Usuario | null>(null);
  const [modalNuevaActividad, setModalNuevaActividad] = useState(false);
  const [modalFichaAcceso, setModalFichaAcceso] = useState<Usuario | null>(null);
  const [modalEvaluar, setModalEvaluar] = useState<{ entrega: EntregaActividad; estudiante: Usuario; actividad: Actividad } | null>(null);
  const [simuladorPruebaActividad, setSimuladorPruebaActividad] = useState<Actividad | null>(null);

  // Form Nuevo Estudiante (SOLO ALIAS Y PIN, CERO CORREOS)
  const [aliasEst, setAliasEst] = useState('');
  const [apodoEst, setApodoEst] = useState('');
  const [pinEst, setPinEst] = useState('');
  const [pinVisualEst, setPinVisualEst] = useState<string[]>(['estrella', 'cohete', 'manzana', 'delfin']);
  const [avatarEst, setAvatarEst] = useState('👧');

  // Form Nueva Actividad con Selección de Destinatario y Simulador Funcional
  const [tituloAct, setTituloAct] = useState('');
  const [catAct, setCatAct] = useState<CategoriaTalento>('matematicas');
  const [descAct, setDescAct] = useState('');
  const [puntosAct, setPuntosAct] = useState(15);
  const [duracionAct, setDuracionAct] = useState(15);
  const [fechaEntregaAct, setFechaEntregaAct] = useState('28 de Noviembre, 2026');
  const [destinatarioTipoAct, setDestinatarioTipoAct] = useState<'todos' | 'especifico'>('todos');
  const [estudianteIdEspecificoAct, setEstudianteIdEspecificoAct] = useState<number>(0);
  const [tipoInteractivoAct, setTipoInteractivoAct] = useState<
    'fracciones' | 'balanza' | 'patrones' | 'geometria' | 'presupuesto' | 'lienzo' | 'xilofono' | 'deporte' | 'amabilidad'
  >('fracciones');
  const [esMisionObligatoria, setEsMisionObligatoria] = useState(true);

  // Form Evaluación
  const [calificacionEstrellas, setCalificacionEstrellas] = useState(5);
  const [mensajeMotivador, setMensajeMotivador] = useState('');

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroArea, setFiltroArea] = useState('todas');
  const [copiadoPin, setCopiadoPin] = useState(false);

  const estudiantes = usuarios.filter((u) => u.rol === 'niño');
  const alertasPendientes = alertasSeguridad.filter((a) => !a.atendida);

  const generarPinAleatorio = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setPinEst(pin);
    const shuffle = [...PIN_VISUAL_CATALOGO].sort(() => 0.5 - Math.random());
    setPinVisualEst(shuffle.slice(0, 4).map((i) => i.id));
    soundManager.playClick();
  };

  const handleCrearEstudianteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aliasEst.trim() || !pinEst.trim()) return;

    onCrearEstudiante({
      alias: aliasEst.trim().toLowerCase().replace(/\s+/g, '_'),
      apodo: apodoEst.trim() || `Explorador @${aliasEst.trim().toLowerCase()}`,
      pin: pinEst.trim(),
      pinVisual: pinVisualEst,
      rol: 'niño',
      progreso: 0,
      categoriaTalento: 'descubriendo',
      avatar: avatarEst,
      actividadesCompletadas: [],
      estrellas: 0
    });

    soundManager.playSuccessChime();
    setModalNuevoEstudiante(false);
    setAliasEst('');
    setApodoEst('');
    setPinEst('');
  };

  const handleEditarEstudianteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEditarEstudiante) return;

    onActualizarEstudiante(modalEditarEstudiante.id, {
      alias: aliasEst.trim().toLowerCase().replace(/\s+/g, '_'),
      apodo: apodoEst.trim(),
      pin: pinEst.trim(),
      pinVisual: pinVisualEst,
      avatar: avatarEst
    });

    soundManager.playSuccessChime();
    setModalEditarEstudiante(null);
  };

  const handleConfirmarEliminar = () => {
    if (!modalEliminarEstudiante) return;
    onEliminarEstudiante(modalEliminarEstudiante.id);
    soundManager.playClick();
    setModalEliminarEstudiante(null);
  };

  const abrirEditar = (est: Usuario) => {
    setModalEditarEstudiante(est);
    setAliasEst(est.alias);
    setApodoEst(est.apodo || '');
    setPinEst(est.pin);
    setPinVisualEst(est.pinVisual || ['estrella', 'cohete', 'manzana', 'delfin']);
    setAvatarEst(est.avatar);
    soundManager.playClick();
  };

  const handleCrearActividadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tituloAct.trim() || !descAct.trim()) return;

    onCrearActividad({
      titulo: tituloAct.trim(),
      categoria: catAct,
      descripcion: descAct.trim(),
      puntos: puntosAct,
      duracionMinutos: duracionAct,
      fechaLimiteEntrega: fechaEntregaAct,
      icono: ICONO_POR_TIPO[tipoInteractivoAct] || '🤝',
      tipoInteractivo: tipoInteractivoAct,
      destinatarioTipo: destinatarioTipoAct,
      estudianteIdEspecifico: destinatarioTipoAct === 'especifico' ? Number(estudianteIdEspecificoAct || estudiantes[0]?.id) : undefined,
      esMisionProfe: esMisionObligatoria,
      zonaLibre: !esMisionObligatoria,
      instrucciones: [
        'Observa con atención el reto en pantalla.',
        'Experimenta con los elementos visuales antes de responder.',
        'Explica tu conclusión eligiendo una opción o usando tu voz.'
      ],
      opcionesVisualesRespuesta: [
        { id: 'op_auto1', textoVisual: 'Comprendí el balance del ejercicio y lo resolví paso a paso', icono: '⭐', esRecomendada: true },
        { id: 'op_auto2', textoVisual: 'Probé distintas soluciones hasta encontrar la correcta', icono: '💡' }
      ]
    });

    soundManager.playSuccessChime();
    setModalNuevaActividad(false);
    setTituloAct('');
    setDescAct('');
  };

  const handleGuardarEvaluacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEvaluar) return;

    onEvaluarEntrega(
      modalEvaluar.actividad.id,
      modalEvaluar.estudiante.id,
      calificacionEstrellas,
      mensajeMotivador.trim() || '¡Gran esfuerzo y comprensión de este reto! Sigue descubriendo tus talentos.'
    );

    soundManager.playAchievementFanfare();
    setModalEvaluar(null);
    setMensajeMotivador('');
  };

  const hablarReportePedagogicoLumy = () => {
    const totalEst = estudiantes.length;
    const evaluadas = entregas.filter((e) => e.estado === 'evaluada').length;
    const alertas = alertasPendientes.length;
    soundManager.speakText(
      `Hola Profesora. Lumy reporta ${totalEst} alumnos activos en su aula virtual. Se han evaluado ${evaluadas} entregas y hay ${alertas} avisos de convivencia escolar pendientes.`
    );
  };

  const hablarDiagnosticoAlumno = (est: Usuario) => {
    soundManager.playClick();
    soundManager.speakText(
      `Ficha pedagógica de @${est.alias}. Destaca en comprensión conceptual con ${est.progreso}% de avance y ${est.estrellas || 0} estrellas. Muestra resiliencia creativa alta y excelente respuesta al refuerzo visual.`
    );
  };

  // Filtrado de estudiantes (solo alias y apodo, sin correos de padres)
  const estudiantesFiltrados = estudiantes.filter((est) => {
    const afinidadActual = calcularAfinidadDinamica(est.actividadesCompletadas, todasLasActividades).afinidad;
    if (filtroArea !== 'todas' && afinidadActual !== filtroArea) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      return (
        est.alias.toLowerCase().includes(q) ||
        (est.apodo && est.apodo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header del Panel Docente */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-purple-950/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-yellow-200">
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
            <span>Gestión Pedagógica y Mentoría Docente</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
            <span>Gestión de Aula & Mentoría</span>
            <GraduationCap className="w-8 h-8 text-yellow-300" aria-hidden="true" />
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 font-medium leading-relaxed">
            Administra a tus alumnos mediante <span className="text-yellow-300 font-bold">Alias y PINs</span>, asigna actividades para toda la clase o alumnos específicos, y revisa alertas de convivencia y reportes de talento.
          </p>
        </div>

        {/* Tarjeta de Asistencia Proactiva de Lumy para la Docente */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center shadow-md shrink-0">
            <Star className="w-6 h-6 fill-current" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black text-yellow-300">Lumy Co-Tutor</p>
            <p className="text-[11px] text-purple-100 font-medium">Asistencia activa en aula</p>
            <button
              onClick={hablarReportePedagogicoLumy}
              className="text-[10px] font-black text-yellow-300 hover:text-white underline flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3 h-3" />
              <span>Escuchar informe de aula</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Pestañas de Navegación del Rol Docente */}
      <div className="flex flex-wrap items-center gap-2 border-b border-purple-100 dark:border-purple-900/50 pb-2">
        <button
          onClick={() => cambiarPestana('estudiantes')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            pestanaActiva === 'estudiantes'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-purple-800 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestión de Alumnos ({estudiantes.length})</span>
        </button>

        <button
          onClick={() => cambiarPestana('entregas')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            pestanaActiva === 'entregas'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-purple-800 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Evaluar Entregas ({entregas.length})</span>
        </button>

        <button
          onClick={() => cambiarPestana('actividades')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            pestanaActiva === 'actividades'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-purple-800 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Retos & Asignaciones ({todasLasActividades.length})</span>
        </button>

        <button
          onClick={() => cambiarPestana('alertas')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer relative ${
            pestanaActiva === 'alertas'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-purple-800 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Alertas de Convivencia</span>
          {alertasPendientes.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
              {alertasPendientes.length}
            </span>
          )}
        </button>
      </div>

      {/* 3. PESTAÑA: GESTIÓN DE ALUMNOS (CRUD COMPLETO) */}
      {pestanaActiva === 'estudiantes' && (
        <div className="bg-white dark:bg-[#1b1933] rounded-3xl border border-purple-100 dark:border-purple-900/60 shadow-sm p-6 space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-purple-50 dark:border-purple-900/50">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por @alias o apodo de estudiante..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800 outline-none text-[#2b2466] dark:text-purple-100 font-medium"
                />
              </div>
            </div>

            <button
              onClick={() => {
                generarPinAleatorio();
                setModalNuevoEstudiante(true);
              }}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Alumno al Aula</span>
            </button>
          </div>

          {/* Tabla de Alumnos con Acciones CRUD y Estadísticas */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-purple-100 dark:border-purple-900/60 text-slate-400 dark:text-purple-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Estudiante (Alias)</th>
                  <th className="py-3 px-3">Talento Dinámico</th>
                  <th className="py-3 px-3">PIN / Figuras</th>
                  <th className="py-3 px-3">Progreso</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 dark:divide-purple-900/40">
                {estudiantesFiltrados.map((est) => {
                  const afinidadInfo = calcularAfinidadDinamica(est.actividadesCompletadas, todasLasActividades);
                  return (
                    <tr key={est.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <AvatarUI avatar={est.avatar} alias={est.alias} className="w-10 h-10 text-lg" />
                          <div>
                            <p className="font-black text-sm text-[#2b2466] dark:text-purple-100">@{est.alias}</p>
                            <p className="text-[11px] text-purple-600 dark:text-purple-300 font-medium">{est.apodo || 'Explorador'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/50">
                          <IconoUI nombre={afinidadInfo.icono} className="w-3.5 h-3.5" />
                          <span>{afinidadInfo.tituloTalento.split(' ')[2] || afinidadInfo.tituloTalento}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-mono font-bold">
                        <div className="space-y-1">
                          <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-md text-xs">
                            {est.pin}
                          </span>
                          <div className="flex items-center gap-1 text-purple-700 dark:text-purple-300">
                            {(est.pinVisual || ['estrella', 'cohete', 'manzana', 'delfin']).map((vid, idx) => {
                              const icon = PIN_VISUAL_CATALOGO.find((cat) => cat.id === vid);
                              return <IconoUI key={idx} nombre={vid} alterno={icon?.emoji} className="w-4 h-4" fallback={Star} />;
                            })}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-purple-700 dark:text-purple-300">{est.progreso}%</span>
                          <div className="w-16 h-2 bg-purple-100 dark:bg-purple-950 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-amber-400 rounded-full"
                              style={{ width: `${est.progreso}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón Ver Estadísticas de Talento */}
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              setModalEstadisticasEstudiante(est);
                            }}
                            title="Ver Ficha y Estadísticas de Talento"
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-200 rounded-lg text-xs font-bold border border-indigo-200 dark:border-indigo-800 cursor-pointer flex items-center gap-1"
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Talento</span>
                          </button>

                          {/* Botón Ficha PIN */}
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              setModalFichaAcceso(est);
                            }}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-200 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-900/60 cursor-pointer"
                          >
                            PIN
                          </button>

                          {/* Botón Modificar / Editar */}
                          <button
                            onClick={() => abrirEditar(est)}
                            className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-700 dark:text-purple-200 rounded-lg text-xs font-bold border border-purple-200 dark:border-purple-800 cursor-pointer"
                          >
                            Editar
                          </button>

                          {/* Botón Eliminar Estudiante (CRUD) */}
                          <button
                            onClick={() => {
                              soundManager.playClick();
                              setModalEliminarEstudiante(est);
                            }}
                            title="Eliminar Estudiante"
                            aria-label="Eliminar Estudiante"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-600 dark:text-rose-300 rounded-lg text-xs font-bold border border-rose-200 dark:border-rose-900/60 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. PESTAÑA: EVALUAR ENTREGAS */}
      {pestanaActiva === 'entregas' && (
        <div className="bg-white dark:bg-[#1b1933] rounded-3xl border border-purple-100 dark:border-purple-900/60 shadow-sm p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-purple-50 dark:border-purple-900/50">
            <div>
              <h3 className="font-black text-lg text-[#2b2466] dark:text-white">Bandeja de Entregas</h3>
              <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">Revisa las respuestas visuales y envía mensajes motivadores</p>
            </div>
            <span className="text-xs font-black bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
              {entregas.filter((e) => e.estado === 'enviada').length} pendientes por evaluar
            </span>
          </div>

          <div className="space-y-3">
            {entregas.map((ent, idx) => {
              const alumno = estudiantes.find((e) => e.id === ent.idEstudiante);
              const actividad = todasLasActividades.find((a) => a.id === ent.idActividad);
              if (!alumno || !actividad) return null;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AvatarUI avatar={alumno.avatar} alias={alumno.alias} className="w-8 h-8 text-sm" />
                      <p className="font-extrabold text-sm text-[#2b2466] dark:text-purple-100">@{alumno.alias}</p>
                      <span className="text-xs text-slate-400">· {actividad.titulo}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-purple-200 italic font-medium flex items-center gap-1.5 flex-wrap">
                      <span>Respuesta del menor: "{ent.respuestaOTrabajo}"</span>
                      {ent.reaccionIcono && <IconoUI nombre={ent.reaccionIcono} className="w-4 h-4 text-purple-600" />}
                    </p>
                    {ent.mensajeMotivadorDocente && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                        Tu mensaje motivador: "{ent.mensajeMotivadorDocente}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setModalEvaluar({ entrega: ent, estudiante: alumno, actividad });
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer"
                    >
                      {ent.estado === 'evaluada' ? 'Re-evaluar' : 'Evaluar y Motivar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. PESTAÑA: CATÁLOGO DE RETOS & ASIGNACIONES */}
      {pestanaActiva === 'actividades' && (
        <div className="bg-white dark:bg-[#1b1933] rounded-3xl border border-purple-100 dark:border-purple-900/60 shadow-sm p-6 space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-50 dark:border-purple-900/50">
            <div>
              <h3 className="font-black text-lg text-[#2b2466] dark:text-white">Retos y Misiones del Aula</h3>
              <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">Asigna actividades para toda la clase o para un alumno en específico y ejecútalas en el ordenador</p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                setModalNuevaActividad(true);
              }}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nueva Actividad</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todasLasActividades.map((act) => {
              const alumnoDestino = act.estudianteIdEspecifico
                ? estudiantes.find((e) => e.id === act.estudianteIdEspecifico)
                : null;

              return (
                <div
                  key={act.id}
                  className="p-5 rounded-2xl border border-purple-100 dark:border-purple-900/60 bg-purple-50/20 dark:bg-purple-950/20 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2.5 bg-white dark:bg-purple-900/60 rounded-2xl shadow-xs border border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-200">
                        <IconoUI nombre={act.icono} alterno={act.tipoInteractivo} className="w-7 h-7" />
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#2b2466] dark:text-purple-100 leading-snug">
                          {act.titulo}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {act.destinatarioTipo === 'especifico' && alumnoDestino ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              <span>Para @{alumnoDestino.alias}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>Toda la clase</span>
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-slate-400">
                            Límite: {act.fechaLimiteEntrega}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-black rounded-lg">
                      +{act.puntos} pts
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-purple-200 font-medium leading-relaxed">
                    {act.descripcion}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-purple-100/60 dark:border-purple-900/40">
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
                      Simulador: <strong className="uppercase">{act.tipoInteractivo || 'General'}</strong>
                    </span>

                    {/* Botón para Probar y Ejecutar Actividad en la Computadora */}
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setSimuladorPruebaActividad(act);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform hover:scale-105"
                    >
                      <Gamepad2 className="w-3.5 h-3.5" />
                      <span>Ejecutar en Computadora</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. PESTAÑA: ALERTAS DE CONVIVENCIA Y LENGUAJE */}
      {pestanaActiva === 'alertas' && (
        <div className="bg-white dark:bg-[#1b1933] rounded-3xl border border-purple-100 dark:border-purple-900/60 shadow-sm p-6 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-purple-50 dark:border-purple-900/50">
            <div>
              <h3 className="font-black text-lg text-[#2b2466] dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Monitoreo de Lenguaje & Convivencia Lumy</span>
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">
                Lumy interviene educativamente ante palabras inapropiadas o frustración y te notifica de inmediato
              </p>
            </div>
            <span className="text-xs font-black bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900">
              {alertasPendientes.length} alertas pendientes
            </span>
          </div>

          {alertasSeguridad.length === 0 ? (
            <div className="p-8 text-center space-y-2 flex flex-col items-center">
              <Sparkles className="w-10 h-10 text-amber-500" aria-hidden="true" />
              <p className="font-bold text-sm text-[#2b2466] dark:text-purple-100">
                ¡Convivencia estelar impecable!
              </p>
              <p className="text-xs text-slate-400">
                No se han registrado palabras inapropiadas en las interacciones con Lumy.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alertasSeguridad.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    alt.atendida
                      ? 'bg-slate-50 dark:bg-purple-950/20 border-slate-200 dark:border-purple-900/40 opacity-70'
                      : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-rose-900 dark:text-rose-200">
                          @{alt.aliasEstudiante}
                        </span>
                        <span className="text-xs text-slate-400">· {alt.fecha}</span>
                        {alt.atendida ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Revisada
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                            Atención requerida
                          </span>
                        )}
                      </div>

                      <div className="p-2 rounded-xl bg-white/80 dark:bg-purple-950/60 border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-950 dark:text-rose-100 font-bold">
                        Texto detectado: "{alt.mensajeDetectado}"
                      </div>

                      <p className="text-xs text-purple-900 dark:text-purple-200 italic font-medium">
                        Orientación brindada por Lumy: "{alt.orientacionLumy}"
                      </p>
                    </div>

                    {!alt.atendida && (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onMarcarAlertaAtendida?.(alt.id);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs cursor-pointer shrink-0"
                      >
                        Marcar como Atendida
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: AÑADIR NUEVO ESTUDIANTE */}
      {modalNuevoEstudiante && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1b1933] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 dark:border-purple-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-purple-50 dark:border-purple-900/50 pb-2">
              <h3 className="font-black text-base text-[#2b2466] dark:text-white">Añadir Alumno al Aula</h3>
              <button
                onClick={() => setModalNuevoEstudiante(false)}
                aria-label="Cerrar"
                className={CLASE_CERRAR}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCrearEstudianteSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-[#2b2466] dark:text-purple-200">Alias del Alumno * (Sin nombres reales)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 font-bold">@</span>
                  <input
                    type="text"
                    required
                    value={aliasEst}
                    onChange={(e) => setAliasEst(e.target.value)}
                    placeholder="ana_estrella"
                    className="w-full pl-8 pr-3 py-2.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 outline-none text-xs font-bold text-purple-900 dark:text-purple-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#2b2466] dark:text-purple-200">Apodo Amigable (Opcional)</label>
                <input
                  type="text"
                  value={apodoEst}
                  onChange={(e) => setApodoEst(e.target.value)}
                  placeholder="Capitana Astral"
                  className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 outline-none text-xs font-bold text-purple-900 dark:text-purple-100"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-[#2b2466] dark:text-purple-200">PIN de 4 dígitos *</label>
                  <button
                    type="button"
                    onClick={generarPinAleatorio}
                    className="text-[10px] text-purple-600 dark:text-purple-300 font-bold hover:underline"
                  >
                    Generar otro PIN
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={pinEst}
                  onChange={(e) => setPinEst(e.target.value)}
                  className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 outline-none text-center text-lg font-mono font-black text-purple-900 dark:text-purple-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#2b2466] dark:text-purple-200">Avatar del Alumno</label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATARES_DISPONIBLES.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatarEst(av.emoji)}
                      aria-label={`Avatar ${av.id}`}
                      className={`p-1.5 rounded-xl flex items-center justify-center border-2 cursor-pointer transition-all ${
                        avatarEst === av.emoji
                          ? 'border-purple-600 shadow-md scale-105 bg-purple-100 dark:bg-purple-900'
                          : 'border-transparent bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100'
                      }`}
                    >
                      <AvatarUI avatar={av.emoji} alias={String(av.id)} className="w-10 h-10 text-lg" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNuevoEstudiante(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-full shadow-md cursor-pointer"
                >
                  Guardar Alumno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR ESTUDIANTE */}
      {modalEditarEstudiante && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1b1933] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 dark:border-purple-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-purple-50 dark:border-purple-900/50 pb-2">
              <h3 className="font-black text-base text-[#2b2466] dark:text-white">Modificar Datos de @{modalEditarEstudiante.alias}</h3>
              <button
                onClick={() => setModalEditarEstudiante(null)}
                aria-label="Cerrar"
                className={CLASE_CERRAR}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditarEstudianteSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-[#2b2466] dark:text-purple-200">Alias</label>
                <input
                  type="text"
                  required
                  value={aliasEst}
                  onChange={(e) => setAliasEst(e.target.value)}
                  className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 outline-none text-xs font-bold text-purple-900 dark:text-purple-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#2b2466] dark:text-purple-200">Apodo Amigable</label>
                <input
                  type="text"
                  value={apodoEst}
                  onChange={(e) => setApodoEst(e.target.value)}
                  className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 outline-none text-xs font-bold text-purple-900 dark:text-purple-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#2b2466] dark:text-purple-200">PIN de 4 dígitos</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={pinEst}
                  onChange={(e) => setPinEst(e.target.value)}
                  className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 outline-none text-center text-lg font-mono font-black text-purple-900 dark:text-purple-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalEditarEstudiante(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-full shadow-md cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRMACIÓN DE ELIMINAR ESTUDIANTE (CRUD) */}
      {modalEliminarEstudiante && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1b1933] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 dark:border-rose-900 space-y-4 text-center animate-in fade-in">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-base text-[#2b2466] dark:text-white">
                ¿Eliminar al estudiante @{modalEliminarEstudiante.alias}?
              </h3>
              <p className="text-xs text-slate-500 dark:text-purple-300 font-medium">
                Se removerán sus registros y entregas de forma segura. Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setModalEliminarEstudiante(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarEliminar}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-full shadow-md cursor-pointer"
              >
                Sí, Eliminar Alumno
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FICHA Y ESTADÍSTICAS DE TALENTO DEL ESTUDIANTE */}
      {modalEstadisticasEstudiante && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#1b1933] rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-purple-100 dark:border-purple-800 space-y-5 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3">
              <div className="flex items-center gap-3">
                <AvatarUI
                  avatar={modalEstadisticasEstudiante.avatar}
                  alias={modalEstadisticasEstudiante.alias}
                  className="w-12 h-12 text-xl"
                />
                <div>
                  <h3 className="font-black text-lg text-[#2b2466] dark:text-white">
                    Ficha de Talento: @{modalEstadisticasEstudiante.alias}
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">
                    Diagnóstico cualitativo para mentoría docente y reunión con padres
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalEstadisticasEstudiante(null)}
                aria-label="Cerrar"
                className={CLASE_CERRAR}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Métricas del Alumno */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Progreso</p>
                <p className="text-xl font-black text-purple-700 dark:text-purple-300">{modalEstadisticasEstudiante.progreso}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Estrellas</p>
                <p className="text-xl font-black text-amber-600 dark:text-amber-300 flex items-center justify-center gap-1">
                  <span>{modalEstadisticasEstudiante.estrellas || 0}</span>
                  <Star className="w-5 h-5 fill-current" aria-hidden="true" />
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Retos Completados</p>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-300">{modalEstadisticasEstudiante.actividadesCompletadas.length}</p>
              </div>
            </div>

            {/* Diagnóstico Pedagógico de Lumy */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-purple-950/60 dark:to-indigo-950/60 border border-amber-200 dark:border-purple-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-amber-600" />
                  <span>Diagnóstico Pedagógico Cualitativo de Lumy</span>
                </span>

                <button
                  onClick={() => hablarDiagnosticoAlumno(modalEstadisticasEstudiante)}
                  className="text-[11px] font-bold text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Escuchar</span>
                </button>
              </div>

              <p className="text-xs text-amber-950 dark:text-purple-100 font-medium leading-relaxed">
                {modalEstadisticasEstudiante.notasDocente ||
                  `El estudiante @${modalEstadisticasEstudiante.alias} demuestra gran interés en representaciones visuales y pensamiento abstracto. Frente a ejercicios desafiantes no se bloquea, sino que reintenta con distintas estrategias.`}
              </p>
            </div>

            {/* Desglose de Dimensiones para Padres */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-[#2b2466] dark:text-white uppercase tracking-wider">
                Desglose de Competencias para Padres
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Pensamiento Lógico-Matemático</span>
                    <span className="text-purple-700 dark:text-purple-300">85% · Destacado</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-purple-300 font-medium">
                    {modalEstadisticasEstudiante.habilidadesCualitativas?.pensamientoLogico.descripcionParaPadres ||
                      'Papá y Mamá: Visualiza cómo las partes forman un todo y deduce equivalencias numéricas espontáneamente.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Resiliencia & Curiosidad</span>
                    <span className="text-purple-700 dark:text-purple-300">90% · Sobresaliente</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-purple-300 font-medium">
                    {modalEstadisticasEstudiante.habilidadesCualitativas?.resilienciaCreativa.descripcionParaPadres ||
                      'Frente al error cambia de táctica con buen humor y no teme equivocarse.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalEstadisticasEstudiante(null)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-full cursor-pointer shadow-sm"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CREAR NUEVA ACTIVIDAD (CON DESTINATARIO Y SIMULADOR) */}
      {modalNuevaActividad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#1b1933] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 dark:border-purple-800 space-y-4 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between border-b border-purple-50 dark:border-purple-900/50 pb-2">
              <h3 className="font-black text-base text-[#2b2466] dark:text-white">Crear Nueva Actividad / Misión</h3>
              <button
                onClick={() => setModalNuevaActividad(false)}
                aria-label="Cerrar"
                className={CLASE_CERRAR}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCrearActividadSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-[#2b2466] dark:text-purple-200">Título del Reto *</label>
                <input
                  type="text"
                  required
                  value={tituloAct}
                  onChange={(e) => setTituloAct(e.target.value)}
                  placeholder="Ej: Desafío de Fracciones y Reparto Galáctico"
                  className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 outline-none text-xs font-bold text-purple-900 dark:text-purple-100"
                />
              </div>

              {/* SELECCIÓN DE DESTINATARIO: TODA LA CLASE O ALUMNO ESPECÍFICO */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-800">
                <label className="font-extrabold text-[#2b2466] dark:text-purple-200 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>¿A quién va dirigida esta actividad? *</span>
                </label>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDestinatarioTipoAct('todos')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      destinatarioTipoAct === 'todos'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs font-black'
                        : 'bg-white dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Toda la Clase</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDestinatarioTipoAct('especifico');
                      if (!estudianteIdEspecificoAct && estudiantes.length > 0) {
                        setEstudianteIdEspecificoAct(estudiantes[0].id);
                      }
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      destinatarioTipoAct === 'especifico'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs font-black'
                        : 'bg-white dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800'
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    <span>Alumno Específico</span>
                  </button>
                </div>

                {destinatarioTipoAct === 'especifico' && (
                  <div className="pt-2 space-y-1">
                    <label className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
                      Selecciona al estudiante destinatario:
                    </label>
                    <select
                      value={estudianteIdEspecificoAct}
                      onChange={(e) => setEstudianteIdEspecificoAct(Number(e.target.value))}
                      className="w-full p-2 bg-white dark:bg-purple-900/80 rounded-xl border border-purple-200 dark:border-purple-700 font-bold text-xs"
                    >
                      {estudiantes.map((est) => (
                        <option key={est.id} value={est.id}>
                          @{est.alias} ({est.apodo || 'Alumno'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* SELECCIÓN DE SIMULADOR INTERACTIVO FUNCIONAL */}
              <div className="space-y-1">
                <label className="font-extrabold text-[#2b2466] dark:text-purple-200 flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Simulador Interactivo para la Computadora *</span>
                </label>
                {/* Un <option> no puede mostrar iconos, así que el icono elegido se ve al lado del selector */}
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-100 dark:bg-purple-900 text-amber-800 dark:text-amber-200 shrink-0">
                    <IconoUI nombre={tipoInteractivoAct} className="w-5 h-5" />
                  </span>
                  <select
                    value={tipoInteractivoAct}
                    onChange={(e) => setTipoInteractivoAct(e.target.value as any)}
                    className="w-full p-2.5 bg-amber-50 dark:bg-purple-950/60 rounded-xl border border-amber-200 dark:border-purple-800 font-bold text-xs text-amber-900 dark:text-amber-200"
                  >
                    <option value="fracciones">Simulador de Fracciones con Pizza</option>
                    <option value="balanza">Balanza de Equilibrio Algebraico</option>
                    <option value="patrones">Detectives de Patrones Geométricos</option>
                    <option value="geometria">Cerca y Área de Patio (Geometría)</option>
                    <option value="presupuesto">Tiendita Galáctica y Monedas</option>
                    <option value="lienzo">Pizarra Digital de Dibujo</option>
                    <option value="xilofono">Xilófono Musical con Sonido Real</option>
                    <option value="deporte">Cancha de Reflejos y Puntería</option>
                    <option value="amabilidad">Tarjetas de Empatía y Convivencia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-extrabold text-[#2b2466] dark:text-purple-200">Área</label>
                  <select
                    value={catAct}
                    onChange={(e) => setCatAct(e.target.value as CategoriaTalento)}
                    className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 font-bold text-xs"
                  >
                    <option value="matematicas">Matemáticas</option>
                    <option value="crear">Crear / Arte</option>
                    <option value="deporte">Deportes</option>
                    <option value="ayudar">Ayudar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-[#2b2466] dark:text-purple-200">Fecha Límite *</label>
                  <input
                    type="text"
                    required
                    value={fechaEntregaAct}
                    onChange={(e) => setFechaEntregaAct(e.target.value)}
                    placeholder="Ej: 30 de Noviembre"
                    className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 font-bold text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#2b2466] dark:text-purple-200">Descripción del Reto</label>
                <textarea
                  required
                  rows={2}
                  value={descAct}
                  onChange={(e) => setDescAct(e.target.value)}
                  placeholder="Explica el desafío para el estudiante..."
                  className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 outline-none text-xs font-medium resize-none text-[#2b2466] dark:text-purple-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNuevaActividad(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-full shadow-md cursor-pointer"
                >
                  Publicar Reto en Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: EVALUACIÓN DE ENTREGA */}
      {modalEvaluar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1b1933] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 dark:border-purple-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-purple-50 dark:border-purple-900/50 pb-2">
              <h3 className="font-black text-base text-[#2b2466] dark:text-white">Evaluar Entrega de @{modalEvaluar.estudiante.alias}</h3>
              <button
                onClick={() => setModalEvaluar(null)}
                aria-label="Cerrar"
                className={CLASE_CERRAR}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 text-xs space-y-1">
              <p className="font-bold text-purple-900 dark:text-purple-200">Reto: {modalEvaluar.actividad.titulo}</p>
              <p className="text-slate-600 dark:text-purple-300 italic">"{modalEvaluar.entrega.respuestaOTrabajo}"</p>
            </div>

            <form onSubmit={handleGuardarEvaluacion} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-extrabold text-[#2b2466] dark:text-purple-200">Estrellas Otorgadas (1 a 5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCalificacionEstrellas(num)}
                      aria-label={`${num} estrellas`}
                      className={`w-11 h-9 rounded-xl font-black text-sm flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        calificacionEstrellas >= num
                          ? 'bg-amber-400 text-purple-950 scale-105 shadow-xs'
                          : 'bg-slate-100 dark:bg-purple-900 text-slate-400'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                      <span>{num}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#2b2466] dark:text-purple-200">Mensaje Motivador para el Menor *</label>
                <textarea
                  required
                  rows={3}
                  value={mensajeMotivador}
                  onChange={(e) => setMensajeMotivador(e.target.value)}
                  placeholder="¡Extraordinario razonamiento visual! Tu paciencia te llevó a la solución..."
                  className="w-full p-3 bg-purple-50/60 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 outline-none text-xs font-medium resize-none text-[#2b2466] dark:text-purple-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalEvaluar(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-full shadow-md cursor-pointer"
                >
                  Enviar Evaluación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: PROBAR SIMULADOR EN VIVO (DOCENTE) */}
      {simuladorPruebaActividad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#1b1933] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-purple-200 dark:border-purple-800 space-y-4 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-purple-700 dark:text-purple-200">
                  <IconoUI
                    nombre={simuladorPruebaActividad.icono}
                    alterno={simuladorPruebaActividad.tipoInteractivo}
                    className="w-7 h-7"
                    fallback={Gamepad2}
                  />
                </span>
                <div>
                  <h3 className="font-black text-base text-[#2b2466] dark:text-white">
                    Simulador en Vivo: {simuladorPruebaActividad.titulo}
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">
                    Vista interactiva para niños de 6 a 12 años
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSimuladorPruebaActividad(null)}
                aria-label="Cerrar"
                className={CLASE_CERRAR}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulador renderizado */}
            <MathSimulators
              tipo={simuladorPruebaActividad.tipoInteractivo || 'fracciones'}
              onSimulacionCompletada={(_explicacion: string) => {
                soundManager.playAchievementFanfare();
              }}
            />


            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSimuladorPruebaActividad(null)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-full cursor-pointer shadow-sm"
              >
                Cerrar Simulador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: FICHA DE ACCESO IMPRIMIBLE (PIN) */}
      {modalFichaAcceso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1b1933] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-purple-100 dark:border-purple-800 space-y-4 text-center animate-in fade-in">
            <div className="space-y-1 flex flex-col items-center">
              <AvatarUI avatar={modalFichaAcceso.avatar} alias={modalFichaAcceso.alias} className="w-16 h-16 text-3xl" />
              <h3 className="font-black text-lg text-[#2b2466] dark:text-white">Tarjeta de Acceso del Alumno</h3>
              <p className="text-xs text-slate-500 dark:text-purple-300">Entrega esta tarjeta al estudiante para entrar sin correo</p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/60 rounded-2xl border border-purple-100 dark:border-purple-800 space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Alias Único</p>
                <p className="text-lg font-black text-purple-900 dark:text-purple-100">@{modalFichaAcceso.alias}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">PIN Numérico</p>
                <p className="text-2xl font-mono font-black text-purple-700 dark:text-purple-300 tracking-widest">{modalFichaAcceso.pin}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">PIN Visual (4 Figuras)</p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {(modalFichaAcceso.pinVisual || ['estrella', 'cohete', 'manzana', 'delfin']).map((id, i) => {
                    const item = PIN_VISUAL_CATALOGO.find((cat) => cat.id === id);
                    return (
                      <span key={i} className="p-2 bg-white dark:bg-purple-900 rounded-lg shadow-xs text-purple-700 dark:text-purple-200">
                        <IconoUI nombre={id} alterno={item?.emoji} className="w-6 h-6" fallback={Star} />
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  window.print();
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs rounded-full shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Tarjeta</span>
              </button>
              <button
                onClick={() => setModalFichaAcceso(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-purple-900 hover:bg-slate-200 text-slate-700 dark:text-purple-200 font-bold text-xs rounded-full cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};