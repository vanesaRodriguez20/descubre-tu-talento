import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
  Calendar,
  Volume2,
  Star,
  Mic,
  MicOff,
  Check,
  Play
} from 'lucide-react';
import { Actividad, CategoriaTalento, EntregaActividad, Usuario } from '../../types';
import { MathSimulators } from '../MathSimulators';
import { soundManager } from '../../utils/audio';

interface ActividadesViewProps {
  actividades: Actividad[];
  usuarioActual: Usuario | null;
  entregas: EntregaActividad[];
  categoriaActiva: CategoriaTalento | 'todas';
  onCambiarCategoria: (cat: CategoriaTalento | 'todas') => void;
  onEnviarEntrega: (idActividad: number, respuesta: string, reaccion?: string) => void;
  busqueda: string;
}

export const ActividadesView: React.FC<ActividadesViewProps> = ({
  actividades,
  usuarioActual,
  entregas,
  categoriaActiva,
  onCambiarCategoria,
  onEnviarEntrega,
  busqueda
}) => {
  const [filtroEstado, setFiltroEstado] = useState<'todas' | 'pendientes' | 'completadas'>('todas');
  const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);

  // Respuesta visual para el niño (sin requerir escribir párrafos)
  const [opcionVisualElegida, setOpcionVisualElegida] = useState<string>('');
  const [selloElegido, setSelloElegido] = useState<string>('⭐');
  const [grabandoVoz, setGrabandoVoz] = useState(false);
  const [textoVozDictado, setTextoVozDictado] = useState('');

  const sellosDisponibles = ['⭐', '🚀', '🍕', '💡', '🌈', '🏆', '🎉'];

  // Categorías con estilo visual y emojis
  const categorias: { id: CategoriaTalento | 'todas'; nombre: string; icono: string; color: string }[] = [
    { id: 'todas', nombre: 'Todos los Retos', icono: '🌟', color: 'bg-purple-600 text-white' },
    { id: 'matematicas', nombre: 'Matemáticas Vivas', icono: '🍕', color: 'bg-amber-500 text-white' },
    { id: 'crear', nombre: 'Arte & Música', icono: '🎨', color: 'bg-pink-500 text-white' },
    { id: 'deporte', nombre: 'Juego & Movimiento', icono: '⚽', color: 'bg-sky-500 text-white' },
    { id: 'ayudar', nombre: 'Compañerismo', icono: '🤝', color: 'bg-emerald-500 text-white' }
  ];

  // Filtrado de actividades con aislamiento estricto por destinatario
  const actividadesFiltradas = actividades.filter((act) => {
    // Si la actividad fue asignada a un alumno específico, SÓLO se muestra a ese estudiante
    if (act.destinatarioTipo === 'especifico') {
      if (!usuarioActual || Number(act.estudianteIdEspecifico) !== Number(usuarioActual.id)) {
        return false;
      }
    }

    if (categoriaActiva !== 'todas' && act.categoria !== categoriaActiva) return false;

    const estaCompletada = usuarioActual?.actividadesCompletadas.includes(act.id);
    if (filtroEstado === 'pendientes' && estaCompletada) return false;
    if (filtroEstado === 'completadas' && !estaCompletada) return false;

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      return act.titulo.toLowerCase().includes(q) || act.descripcion.toLowerCase().includes(q);
    }
    return true;
  });


  const abrirReto = (act: Actividad) => {
    soundManager.playClick();
    setActividadSeleccionada(act);
    setOpcionVisualElegida(act.opcionesVisualesRespuesta?.[0]?.textoVisual || '');
    setTextoVozDictado('');
  };

  const pedirExplicacionLumy = (act: Actividad) => {
    soundManager.playClick();
    soundManager.speakText(
      act.audioGuiaLumy ||
        `¡Hola @${usuarioActual?.alias || 'amigo'}! En este reto de ${act.titulo}, explora las figuras mágicas y comparte tu respuesta con un clic.`
    );
  };

  const toggleGrabacionVoz = () => {
    soundManager.playClick();
    if (grabandoVoz) {
      soundManager.stopSpeechRecognition();
      setGrabandoVoz(false);
      return;
    }

    setGrabandoVoz(true);
    const iniciado = soundManager.startSpeechRecognition(
      (transcripcion) => {
        setGrabandoVoz(false);
        setTextoVozDictado(transcripcion);
        setOpcionVisualElegida(transcripcion);
        soundManager.speakText(`Grabé tu respuesta: ${transcripcion}`);
      },
      (error) => {
        setGrabandoVoz(false);
      },
      () => {
        setGrabandoVoz(false);
      }
    );

    if (!iniciado) {
      setGrabandoVoz(false);
    }
  };

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actividadSeleccionada) return;

    const respuestaFinal = opcionVisualElegida || textoVozDictado || 'Reto visual explorado con éxito';
    onEnviarEntrega(actividadSeleccionada.id, respuestaFinal, selloElegido);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    soundManager.playAchievementFanfare();
    soundManager.speakText('¡Reto enviado a tu docente con éxito! Recibirás tus estrellas y mensaje motivador.');

    setActividadSeleccionada(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Banner Superior con Voz de Lumy */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 text-white p-6 sm:p-7 rounded-3xl shadow-xl shadow-purple-900/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-yellow-200">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Misiones y Juegos Visuales</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Tus Retos de Aprendizaje 🚀
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 font-medium max-w-xl">
            Toca los simuladores para experimentar. No necesitas escribir: puedes responder con iconos visuales o grabando tu voz con Lumy.
          </p>
        </div>

        <button
          onClick={() =>
            soundManager.speakText(
              'Bienvenido a tus retos. Toca cualquier tarjeta para jugar con pizzas mágicas, balanzas y figuras geométricas.'
            )
          }
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black text-xs rounded-full shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 shrink-0"
        >
          <Volume2 className="w-4 h-4" />
          <span>Voz de Lumy</span>
        </button>
      </div>

      {/* Selector de Categorías Visuales Grandes */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              soundManager.playClick();
              onCambiarCategoria(cat.id);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-xs hover:scale-102 ${
              categoriaActiva === cat.id
                ? `${cat.color} shadow-md`
                : 'bg-white text-purple-900 border border-purple-100 hover:bg-purple-50'
            }`}
          >
            <span className="text-base">{cat.icono}</span>
            <span>{cat.nombre}</span>
          </button>
        ))}
      </div>

      {/* Grid de Actividades Altamente Visuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {actividadesFiltradas.map((act) => {
          const completada = usuarioActual?.actividadesCompletadas.includes(act.id);
          const entregaUsuario = entregas.find(
            (e) => e.idActividad === act.id && e.idEstudiante === usuarioActual?.id
          );

          return (
            <div
              key={act.id}
              className={`rounded-3xl border-2 transition-all p-5 flex flex-col justify-between space-y-4 hover:-translate-y-1 shadow-sm ${
                completada
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-purple-100 hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                {/* Cabecera con Icono Gigante y Plazo */}
                <div className="flex items-start justify-between gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-100 to-yellow-50 flex items-center justify-center text-3xl shadow-xs border border-amber-200">
                    {act.icono || '🎯'}
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      <span>{act.fechaLimiteEntrega}</span>
                    </span>
                    <p className="text-[10px] font-black text-purple-600 uppercase">+{act.puntos} puntos</p>
                  </div>
                </div>

                {/* Título y Descripción Conceptual */}
                <div>
                  <h3 className="font-black text-base text-[#2b2466] leading-tight line-clamp-2">
                    {act.titulo}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-2 leading-relaxed">
                    {act.descripcion}
                  </p>
                </div>

                {/* Mensaje Motivador de la Docente si ya fue evaluada */}
                {entregaUsuario && entregaUsuario.estado === 'evaluada' && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-900 flex items-center gap-1">
                        <span>👩‍🏫</span>
                        <span>Mensaje de tu Profesora:</span>
                      </span>
                      <div className="flex text-amber-500 text-xs">
                        {'⭐'.repeat(entregaUsuario.calificacionEstrellas || 5)}
                      </div>
                    </div>
                    <p className="text-xs text-purple-900 font-semibold italic">
                      "{entregaUsuario.mensajeMotivadorDocente}"
                    </p>
                  </div>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="pt-2 border-t border-purple-50 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => pedirExplicacionLumy(act)}
                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl flex items-center gap-1 text-xs font-bold cursor-pointer transition-colors"
                  title="Escuchar audio de Lumy"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-[11px]">Voz Lumy</span>
                </button>

                {completada ? (
                  <div className="px-3.5 py-2 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>¡Entregado!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => abrirReto(act)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-full shadow-sm flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                  >
                    <span>Abrir Reto</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE RESOLUCIÓN DEL RETO (VISUAL & VOZ - CERO TEXTO OBLIGATORIO) */}
      {actividadSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-purple-100 space-y-5 animate-in fade-in max-h-[92vh] overflow-y-auto">
            {/* Cabecera */}
            <div className="flex items-start justify-between border-b border-purple-50 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 bg-amber-100 rounded-2xl">{actividadSeleccionada.icono}</span>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Plazo de Entrega: {actividadSeleccionada.fechaLimiteEntrega}
                  </span>
                  <h3 className="font-black text-lg text-[#2b2466] leading-tight mt-1">
                    {actividadSeleccionada.titulo}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActividadSeleccionada(null)}
                className="w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold flex items-center justify-center cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Asistente Lumy de Audio */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-950 font-bold">
                <span className="text-xl">⭐</span>
                <span>¿Quieres escuchar la pista de Lumy antes de resolver?</span>
              </div>
              <button
                onClick={() => pedirExplicacionLumy(actividadSeleccionada)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Escuchar</span>
              </button>
            </div>

            {/* Simulador Interactivo para todas las actividades */}
            {actividadSeleccionada.tipoInteractivo && (
              <div className="p-4 bg-purple-50/70 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-extrabold text-xs text-purple-900 dark:text-purple-200 uppercase tracking-wide flex items-center gap-1.5">
                    <span>🎮</span>
                    <span>Experimento y Reto Interactivo:</span>
                  </p>
                  {opcionVisualElegida && (
                    <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Reto practicado</span>
                    </span>
                  )}
                </div>
                <MathSimulators
                  tipo={actividadSeleccionada.tipoInteractivo}
                  onSimulacionCompletada={(exp) => {
                    setOpcionVisualElegida(exp);
                  }}
                />
              </div>
            )}

            {/* Formulario de Entrega: Opciones Visuales o Grabación de Voz (Sin escribir) */}
            <form onSubmit={handleEnviar} className="space-y-4">
              <div className="space-y-2">
                <label className="font-black text-xs text-[#2b2466] flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Selecciona tu conclusión visual (o dísela a Lumy con tu voz):</span>
                </label>

                {/* Tarjetas de opciones visuales para tocar */}
                <div className="grid grid-cols-1 gap-2">
                  {(
                    actividadSeleccionada.opcionesVisualesRespuesta || [
                      { id: '1', textoVisual: '¡Lo resolví observando el equilibrio en la pantalla!', icono: '⚖️' },
                      { id: '2', textoVisual: 'Comprendí que partir en trozos iguales crea fracciones', icono: '🍕' }
                    ]
                  ).map((op) => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setOpcionVisualElegida(op.textoVisual);
                      }}
                      className={`p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                        opcionVisualElegida === op.textoVisual
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md font-black'
                          : 'bg-white border-purple-100 hover:bg-purple-50 text-slate-800 font-semibold'
                      }`}
                    >
                      <span className="text-2xl p-1 bg-white/20 rounded-xl">{op.icono}</span>
                      <span className="text-xs flex-1">{op.textoVisual}</span>
                      {opcionVisualElegida === op.textoVisual && (
                        <div className="w-5 h-5 rounded-full bg-white text-purple-600 flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opción de Voz con Micrófono STT */}
              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-purple-900 flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5 text-purple-600" />
                    <span>¿Prefieres explicarlo hablando?</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {textoVozDictado ? `Tu voz: "${textoVozDictado}"` : 'Toca el micrófono y cuéntale tu idea a Lumy'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleGrabacionVoz}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                    grabandoVoz
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {grabandoVoz ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{grabandoVoz ? 'Grabando...' : 'Grabar Voz'}</span>
                </button>
              </div>

              {/* Selector de Sello Mágico para la Entrega */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Elige un sello mágico para tu entrega:</label>
                <div className="flex gap-2">
                  {sellosDisponibles.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setSelloElegido(s);
                      }}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-transform cursor-pointer ${
                        selloElegido === s
                          ? 'bg-amber-100 border-amber-400 scale-110 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActividadSeleccionada(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-full shadow-md cursor-pointer transition-transform hover:scale-105"
                >
                  🚀 Enviar Reto a mi Profe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
