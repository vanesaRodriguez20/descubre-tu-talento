import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Volume2,
  Mic,
  MicOff,
  Calendar,
  Rocket,
  Target,
  Star,
  Smile,
  Pizza,
  Shapes,
  Palette,
  Lightbulb,
  Users,
  Puzzle,
  ShieldCheck,
  Ruler,
  HeartHandshake,
  Moon
} from 'lucide-react';
import { Actividad, CategoriaTalento, PreferenciasAccesibilidadFrontend, Usuario } from '../../types';
import { calcularAfinidadDinamica } from '../../utils/talentDiscovery';
import { soundManager } from '../../utils/audio';
const iconosDinamicos: Record<string, React.ElementType> = {
  Sparkles, ArrowRight, Volume2, Mic, MicOff, Calendar, Rocket, Target, Star,
  Smile, Pizza, Shapes, Palette, Lightbulb, Users, Puzzle, ShieldCheck, Ruler,
  HeartHandshake, Moon
};

const IconoDinamico: React.FC<{
  valor: unknown;
  porDefecto: React.ElementType;
  className?: string;
}> = ({ valor, porDefecto, className }) => {
  const Icono = typeof valor === 'string' ? iconosDinamicos[valor] : undefined;
  const IconoSeleccionado = Icono || porDefecto;

  return <IconoSeleccionado className={className} aria-hidden="true" />;
};

interface StudentHomeDashboardProps {
  usuario: Usuario;
  actividades: Actividad[];
  onNavegar: (ruta: string, categoria?: CategoriaTalento | 'todas') => void;
  onAbrirSimulador: (actividad: Actividad) => void;
  onAbrirTest: () => void;
  onAbrirLienzo: () => void;
  onAbrirAccesibilidad: () => void;
  preferenciasAccesibilidad: PreferenciasAccesibilidadFrontend;
}

export const StudentHomeDashboard: React.FC<StudentHomeDashboardProps> = ({
  usuario,
  actividades,
  onNavegar,
  onAbrirSimulador,
  onAbrirTest,
  onAbrirLienzo,
  onAbrirAccesibilidad,
  preferenciasAccesibilidad
}) => {
  // En LUM el estudiante es conocido exclusivamente por su Alias
  const aliasDisplay = `@${usuario.alias}`;
  const apodoDisplay = usuario.apodo || `Explorador ${aliasDisplay}`;
  const progreso = usuario.progreso;

  // Afinidad calculada dinámicamente según las actividades completadas
  const afinidadEmergente = calcularAfinidadDinamica(usuario.actividadesCompletadas, actividades);

  // Estado para interacción por voz bidireccional con Lumy (STT/TTS)
  const [escuchandoVoz, setEscuchandoVoz] = useState(false);
  const [mensajeVozTranscribiendo, setMensajeVozTranscribiendo] = useState('');
  const [respuestaLumyVoz, setRespuestaLumyVoz] = useState<string | null>(null);

  // Misiones del profesor y zona de juegos filtradas estrictamente por alumno
  const actividadesVisibles = actividades.filter((act) => {
    if (act.destinatarioTipo === 'especifico') {
      return Number(act.estudianteIdEspecifico) === Number(usuario.id);
    }
    return true;
  });

  const misionesDelProfe = actividadesVisibles.filter((a) => a.esMisionProfe);
  const zonaLibreJuegos = actividadesVisibles.filter((a) => a.zonaLibre);

  // Bienvenida con voz
  const escucharBienvenida = () => {
    soundManager.speakText(
      `¡Hola ${aliasDisplay}! Soy Lumy, tu tutora cósmica. Hoy tienes retos en las Misiones del Profe y experimentos libres en la Zona de Juegos.`
    );
  };

  // Iniciar reconocimiento de voz (STT) para que el niño le hable a Lumy
  const handleHablarConLumy = () => {
    soundManager.playClick();
    if (escuchandoVoz) {
      soundManager.stopSpeechRecognition();
      setEscuchandoVoz(false);
      return;
    }

    setMensajeVozTranscribiendo('Te estoy escuchando... Cuéntame qué reto quieres resolver.');
    setEscuchandoVoz(true);

    const iniciado = soundManager.startSpeechRecognition(
      async (transcripcion) => {
        setEscuchandoVoz(false);
        setMensajeVozTranscribiendo(`Dijiste: "${transcripcion}"`);

        // Enviar a la IA de Lumy para respuesta socrática
        try {
          const res = await fetch('/api/lumy/dialogo-socrático', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              mensaje: transcripcion,
              contexto: 'dashboard_estudiante',
              edad: 8
            })
          });

          if (res.ok) {
            const data = await res.json();
            const { textoRespuesta, audioTTSPrompt } = data.data;
            setRespuestaLumyVoz(textoRespuesta);
            soundManager.speakText(audioTTSPrompt || textoRespuesta);
          } else {
            const fallback = '¡Qué buena pregunta! Prueba abriendo el simulador de pizzas o balanzas para ver la magia.';
            setRespuestaLumyVoz(fallback);
            soundManager.speakText(fallback);
          }
        } catch (e) {
          const fallback = '¡Buenísimo! Toca uno de los retos y diviértete aprendiendo.';
          setRespuestaLumyVoz(fallback);
          soundManager.speakText(fallback);
        }
      },
      () => setEscuchandoVoz(false),
      () => setEscuchandoVoz(false)
    );

    if (!iniciado) {
      setEscuchandoVoz(false);
      setMensajeVozTranscribiendo('El micrófono no está disponible en este momento.');
    }
  };

  return (
    <div className="space-y-7 max-w-6xl mx-auto">
      {/* 1. Banner Principal de Bienvenida: Alias y Afinidad Emergente */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 text-white p-6 sm:p-9 shadow-xl shadow-purple-900/10">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-yellow-200">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Portal del Estudiante</span>
              <button
                onClick={escucharBienvenida}
                className="ml-1 p-0.5 rounded-full hover:bg-white/20 cursor-pointer"
                title="Escuchar saludo con Lumy"
              >
                <Volume2 className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight flex items-center justify-center md:justify-start gap-3">
              <span>¡Hola, {aliasDisplay}!</span>
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 fill-yellow-300 shrink-0" aria-hidden="true" />
            </h1>

            <p className="text-sm sm:text-base text-purple-100 font-medium leading-relaxed">
              Tu apodo actual: <span className="text-yellow-300 font-black">{apodoDisplay}</span>.
              Aprende experimentando con pizzas mágicas, balanzas y figuras geométricas sin límites.
            </p>

            {/* Afinidad Dinámica Descubierta por Lumy */}
            <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl text-yellow-300 shrink-0">
                <IconoDinamico valor={afinidadEmergente.icono} porDefecto={Sparkles} className="w-7 h-7" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black text-yellow-300 uppercase tracking-wider">
                  Tu Superpoder en Evolución:
                </p>
                <p className="text-xs font-extrabold text-white">{afinidadEmergente.tituloTalento}</p>
                <p className="text-[10px] text-purple-200 font-medium">{afinidadEmergente.explicacion}</p>
              </div>
            </div>

            {/* Accesos Rápidos */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => onNavegar('actividades')}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black rounded-full shadow-lg hover:scale-102 transition-all cursor-pointer flex items-center gap-2 text-sm"
              >
                <Rocket className="w-4 h-4" aria-hidden="true" />
                <span>Explorar Retos Visuales</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onAbrirTest}
                className="px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold rounded-full transition-all cursor-pointer flex items-center gap-2 text-sm border border-white/30"
              >
                <Target className="w-4 h-4" aria-hidden="true" />
                <span>Test de Talentos</span>
              </button>

              <button
                onClick={handleHablarConLumy}
                className={`px-4 py-3 rounded-full font-black text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                  escuchandoVoz
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-indigo-900/60 hover:bg-indigo-900 text-yellow-300 border border-yellow-300/40'
                }`}
              >
                {escuchandoVoz ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-yellow-300" />}
                <span>{escuchandoVoz ? 'Escuchando...' : 'Hablar con Lumy'}</span>
              </button>
            </div>

            {/* Transcripción de voz interactiva */}
            {mensajeVozTranscribiendo && (
              <div className="p-3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 text-xs space-y-1 animate-in fade-in text-left">
                <p className="font-bold text-yellow-200 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{mensajeVozTranscribiendo}</span>
                </p>
                {respuestaLumyVoz && (
                  <p className="text-white font-semibold leading-relaxed bg-white/10 p-2 rounded-xl flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Lumy: "{respuestaLumyVoz}"</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Tarjeta de Avatar del Niño */}
          <div className="shrink-0 w-44 sm:w-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 bg-purple-900/40 p-4 text-center space-y-2">
            <div className="mx-auto bg-white/20 rounded-2xl w-24 h-24 overflow-hidden shadow-inner">
  <img
    src="src\assets\images\image.png" 
    alt={`Avatar de ${aliasDisplay}`}
    className="w-full h-full object-cover"
  />
</div>
            <p className="font-black text-sm text-yellow-200">{aliasDisplay}</p>
            <div className="text-xs bg-white/20 py-1 px-3 rounded-full font-bold inline-flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" aria-hidden="true" />
              <span>{usuario.estrellas || 0} estrellas</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Centro de Actividades: Misiones del Profe vs Zona Libre */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2b2466] tracking-tight flex items-center gap-2">
              <span>Centro de Actividades</span>
              <span className="text-xs bg-purple-100 text-purple-800 font-extrabold px-3 py-1 rounded-full">
                Nivel {usuario.nivelZPD || 3.5}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-purple-700 font-medium">
              Entrega las misiones con fecha de tu docente o juega libremente en la zona exploratoria
            </p>
          </div>

          <button
            onClick={() => onNavegar('actividades')}
            className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Bloque A: Misiones del Profe */}
          <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/40 rounded-3xl p-5 border-2 border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-200/70 px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Misiones del Profe (Con Fecha Límite)</span>
              </span>
              <span className="text-xs font-bold text-amber-800">{misionesDelProfe.length} asignadas</span>
            </div>

            <div className="space-y-2.5">
              {misionesDelProfe.slice(0, 2).map((mision) => (
                <div
                  key={mision.id}
                  className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-xs hover:border-amber-400 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-xl text-amber-600 shrink-0">
                      <IconoDinamico valor={mision.icono} porDefecto={Pizza} className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-[#2b2466] leading-tight line-clamp-1">
                        {mision.titulo}
                      </h4>
                      <p className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        <span>Entrega: {mision.fechaLimiteEntrega}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onAbrirSimulador(mision)}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform hover:scale-105 cursor-pointer shrink-0"
                  >
                    Resolver
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-amber-800/80 font-medium flex items-start gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>Tu profesora evaluará tu entrega con estrellas y un mensaje motivador.</span>
            </p>
          </div>

          {/* Bloque B: Zona Libre Exploratoria */}
          <div className="bg-gradient-to-br from-purple-50/70 to-indigo-50/40 rounded-3xl p-5 border-2 border-purple-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-purple-900 bg-purple-200/70 px-3 py-1 rounded-full">
                <Palette className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Zona Libre Exploratoria</span>
              </span>
              <span className="text-xs font-bold text-purple-800">Sin límite de tiempo</span>
            </div>

            <div className="space-y-2.5">
              {zonaLibreJuegos.slice(0, 2).map((juego) => (
                <div
                  key={juego.id}
                  className="p-3.5 bg-white rounded-2xl border border-purple-200 shadow-xs hover:border-purple-400 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl text-purple-600 shrink-0">
                      <IconoDinamico valor={juego.icono} porDefecto={Shapes} className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-[#2b2466] leading-tight line-clamp-1">
                        {juego.titulo}
                      </h4>
                      <p className="text-[11px] text-purple-600 font-medium line-clamp-1 mt-0.5">
                        {juego.descripcion}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onAbrirSimulador(juego)}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform hover:scale-105 cursor-pointer shrink-0"
                  >
                    Jugar
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={onAbrirLienzo}
                className="text-xs font-black text-purple-700 hover:text-purple-900 underline flex items-center gap-1.5 cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Abrir Lienzo y Xilófono Cósmico</span>
              </button>
              <span className="text-[11px] text-purple-500 font-bold">¡Dibuja y crea libremente!</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Panel de Progreso y Habilidades para Lectura con Padres */}
      <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-50 pb-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Lectura Guiada para la Familia</span>
            </span>
            <h3 className="text-xl font-black text-[#2b2466] tracking-tight mt-1">
              Habilidades y Resiliencia en LUM
            </h3>
          </div>

          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-purple-700">{progreso}%</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avance Global</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Puzzle className="w-5 h-5" aria-hidden="true" />
            </div>
            <h4 className="font-extrabold text-sm text-[#2b2466]">Pensamiento Lógico</h4>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              Comprende relaciones entre las partes y el todo mediante balanzas y fracciones visuales.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <h4 className="font-extrabold text-sm text-[#2b2466]">Resiliencia Creativa</h4>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              No se detiene ante el error: prueba distintas alternativas manteniendo optimismo y curiosidad.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Ruler className="w-5 h-5" aria-hidden="true" />
            </div>
            <h4 className="font-extrabold text-sm text-[#2b2466]">Percepción Espacial</h4>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              Distingue entre bordes, áreas y patrones geométricos antes de responder.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" aria-hidden="true" />
            </div>
            <h4 className="font-extrabold text-sm text-[#2b2466]">Empatía y Colaboración</h4>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              Disfruta compartir materiales y ayudar a otros compañeros a aprender juntos.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <div className="h-3.5 w-full bg-purple-100 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, Math.max(5, progreso))}%` }}
            />
          </div>
        </div>
      </section>

      {/* 4. Pie con Atajo al Perfil y Accesibilidad */}
      <section className="bg-gradient-to-r from-purple-100/70 via-indigo-50 to-amber-50 rounded-3xl p-5 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-2xl shadow-xs text-purple-600">
            <IconoDinamico valor={usuario.avatar} porDefecto={Smile} className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-black text-sm text-[#2b2466]">{aliasDisplay}</h4>
            <p className="text-xs text-purple-700 font-medium">{apodoDisplay}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavegar('perfil')}
            className="px-4 py-2 bg-white hover:bg-purple-50 text-purple-900 font-bold text-xs rounded-xl border border-purple-200 transition-colors cursor-pointer"
          >
            Editar Avatar y Apodo
          </button>
          <button
            onClick={onAbrirAccesibilidad}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Moon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Apariencia / Tema</span>
          </button>
        </div>
      </section>
    </div>
  );
};