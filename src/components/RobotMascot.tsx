import React, { useState } from 'react';
import { Volume2, Sparkles, MessageCircle, RefreshCw, X, ChevronRight } from 'lucide-react';
import { Actividad } from '../types';
import { soundManager } from '../utils/audio';

interface RobotMascotProps {
  actividades: Actividad[];
  onSeleccionarActividad?: (act: Actividad) => void;
}

const CONSEJOS_ROBOT = [
  '¡Hola! ¿Sabías que cuando dibujas estás ejercitando tu imaginación espacial? ¡Es un superpoder increíble!',
  '¡Mover el cuerpo 10 minutos al día llena tu cerebro de energía y te ayuda a concentrarte mejor!',
  'Preguntar "¿Por qué?" es lo que hacen los grandes científicos de todo el mundo. ¡Sigue siendo curioso!',
  'Compartir tus juguetes o una sonrisa con un compañero crea lazos mágicos de amistad para siempre.',
  'No te preocupes si algo no sale a la primera. Cada error es solo un paso más para dominar tu talento.',
  'Hoy es un día perfecto para inventar una canción graciosa con rimas disparatadas. ¡Pruébalo!'
];

export const RobotMascot: React.FC<RobotMascotProps> = ({ actividades, onSeleccionarActividad }) => {
  const [abierto, setAbierto] = useState(false);
  const [indiceConsejo, setIndiceConsejo] = useState(0);

  const consejoActual = CONSEJOS_ROBOT[indiceConsejo];

  const siguienteConsejo = () => {
    soundManager.playClick();
    setIndiceConsejo((prev) => (prev + 1) % CONSEJOS_ROBOT.length);
  };

  const hablarConsejo = () => {
    soundManager.speakText(`Toby dice: ${consejoActual}`);
  };

  const sugerirRetoAleatorio = () => {
    soundManager.playClick();
    if (actividades.length === 0) return;
    const aleatoria = actividades[Math.floor(Math.random() * actividades.length)];
    if (onSeleccionarActividad) {
      onSeleccionarActividad(aleatoria);
    }
    soundManager.speakText(`Te sugiero el reto: ${aleatoria.titulo}. ¡Diviértete!`);
    setAbierto(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Globo de diálogo de Toby */}
      {abierto && (
        <div className="mb-3 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-3xl p-5 shadow-2xl border-2 border-purple-200 animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-3">
          <div className="flex items-center justify-between border-b border-purple-50 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <h4 className="font-extrabold text-xs text-[#2b2466] leading-none">
                  Toby, tu Robot Guía
                </h4>
                <span className="text-[10px] text-purple-600 font-bold">
                  Compañero de talentos
                </span>
              </div>
            </div>
            <button
              onClick={() => setAbierto(false)}
              className="w-6 h-6 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold flex items-center justify-center text-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-700 font-semibold leading-relaxed">
            "{consejoActual}"
          </p>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={hablarConsejo}
              className="p-1.5 rounded-full text-purple-600 hover:bg-purple-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Escuchar en voz alta"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Escuchar</span>
            </button>

            <button
              onClick={siguienteConsejo}
              className="text-[11px] font-bold text-slate-500 hover:text-purple-600 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Otro consejo</span>
            </button>
          </div>

          <button
            onClick={sugerirRetoAleatorio}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Sugiéreme un reto al azar</span>
          </button>
        </div>
      )}

      {/* Botón flotante con el avatar de Toby */}
      <button
        onClick={() => {
          soundManager.playClick();
          setAbierto(!abierto);
        }}
        title="Hablar con Toby tu Robot Guía"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-1 shadow-xl hover:shadow-2xl shadow-purple-900/30 hover:scale-110 active:scale-95 transition-all cursor-pointer relative group"
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white shadow-inner">
          <img
            src="/src/assets/images/mascot_robot_companion_1793812492375.jpg"
            alt="Robot Toby"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[10px] font-black shadow-xs">
          ⭐
        </span>
      </button>
    </div>
  );
};
