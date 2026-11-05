import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Palette, Sparkles, Music, HelpCircle, Download, RotateCcw, CheckCircle2, Award, Heart, Volume2 } from 'lucide-react';
import { PREGUNTAS_QUIZ } from '../../data/initialData';
import { CategoriaTalento, Usuario } from '../../types';
import { soundManager } from '../../utils/audio';

interface MiniEstudioViewProps {
  usuarioActual: Usuario | null;
  onTalentoDescubierto: (categoria: CategoriaTalento) => void;
  tabInicial?: 'lienzo' | 'test' | 'musica';
}

export const MiniEstudioView: React.FC<MiniEstudioViewProps> = ({
  usuarioActual,
  onTalentoDescubierto,
  tabInicial = 'lienzo'
}) => {
  const [tabActiva, setTabActiva] = useState<'lienzo' | 'test' | 'musica'>(tabInicial);

  // --- ESTADO LIENZO ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [colorPincel, setColorPincel] = useState('#7c3aed');
  const [grosor, setGrosor] = useState(6);
  const [modoHerramienta, setModoHerramienta] = useState<'pincel' | 'goma' | 'arcoiris' | 'estampa'>('pincel');
  const [estampaSeleccionada, setEstampaSeleccionada] = useState('⭐');
  const [dibujando, setDibujando] = useState(false);
  const [dibujoGuardado, setDibujoGuardado] = useState(false);

  // Paleta de colores para niños
  const colores = [
    { hex: '#7c3aed', nombre: 'Violeta' },
    { hex: '#ec4899', nombre: 'Rosa' },
    { hex: '#3b82f6', nombre: 'Azul' },
    { hex: '#10b981', nombre: 'Esmeralda' },
    { hex: '#f59e0b', nombre: 'Ámbar' },
    { hex: '#ef4444', nombre: 'Rojo' },
    { hex: '#1e293b', nombre: 'Carbón' },
  ];

  const estampas = ['⭐', '🌟', '🎨', '🚀', '💖', '🐾', '👑', '🌈', '⚽', '📚'];

  useEffect(() => {
    if (tabActiva === 'lienzo') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }, [tabActiva]);

  const iniciarDibujo = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    if (modoHerramienta === 'estampa') {
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(estampaSeleccionada, x, y);
      soundManager.playClick();
      return;
    }

    setDibujando(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const trazarDibujo = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!dibujando) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = modoHerramienta === 'goma' ? grosor * 3 : grosor;

    if (modoHerramienta === 'goma') {
      ctx.strokeStyle = '#ffffff';
    } else if (modoHerramienta === 'arcoiris') {
      const hue = (Date.now() / 10) % 360;
      ctx.strokeStyle = `hsl(${hue}, 90%, 55%)`;
    } else {
      ctx.strokeStyle = colorPincel;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const terminarDibujo = () => {
    setDibujando(false);
  };

  const limpiarLienzo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    soundManager.playClick();
  };

  const descargarDibujo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `mi_obra_de_talento_${Date.now()}.png`;
    a.click();
    soundManager.playSuccessChime();
    setDibujoGuardado(true);
    setTimeout(() => setDibujoGuardado(false), 3000);
  };

  // --- ESTADO TEST DE TALENTOS ---
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<CategoriaTalento[]>([]);
  const [resultadoQuiz, setResultadoQuiz] = useState<CategoriaTalento | null>(null);

  const handleSeleccionarOpcion = (cat: CategoriaTalento) => {
    soundManager.playClick();
    const nuevas = [...respuestas, cat];
    setRespuestas(nuevas);

    if (preguntaActual + 1 < PREGUNTAS_QUIZ.length) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      // Calcular talento predominante
      const conteo: Record<CategoriaTalento, number> = { matematicas: 0, crear: 0, deporte: 0, aprender: 0, ayudar: 0 };
      nuevas.forEach((c) => conteo[c]++);
      let mayorCat: CategoriaTalento = 'matematicas';
      let maxCount = -1;
      (Object.keys(conteo) as CategoriaTalento[]).forEach((k) => {
        if (conteo[k] > maxCount) {
          maxCount = conteo[k];
          mayorCat = k;
        }
      });
      setResultadoQuiz(mayorCat);
      onTalentoDescubierto(mayorCat);
      soundManager.playAchievementFanfare();
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  const reiniciarQuiz = () => {
    setPreguntaActual(0);
    setRespuestas([]);
    setResultadoQuiz(null);
  };

  const getDetalleResultado = (cat: CategoriaTalento) => {
    switch (cat) {
      case 'matematicas':
        return {
          titulo: '🍕 Mente Lógica y Numérica',
          desc: 'Tienes una intuición matemática brillante. Entiendes el porqué de los números, las balanzas y las proporciones con asombrosa facilidad.',
          icono: '🍕',
          color: 'from-amber-400 to-orange-300'
        };
      case 'crear':
        return {
          titulo: '🎨 Pequeño Creador y Visionario',
          desc: 'Tu imaginación no tiene límites. Te apasiona pintar, inventar historias, hacer música y darle color al mundo.',
          icono: '🎨',
          color: 'from-purple-400 to-pink-300'
        };
      case 'deporte':
        return {
          titulo: '⚽ Campeón de la Energía y Movimiento',
          desc: 'Tienes una chispa imparable de dinamismo. Te encanta la actividad física, el juego en equipo y superar nuevos desafíos corporales.',
          icono: '⚽',
          color: 'from-blue-500 to-sky-400'
        };
      case 'aprender':
        return {
          titulo: '🔬 Explorador Científico y Curioso',
          desc: 'Tienes una mente brillante y observadora. Te fascina saber cómo funcionan las cosas, leer cuentos fascinantes y descubrir misterios.',
          icono: '🔬',
          color: 'from-purple-500 to-indigo-400'
        };
      case 'ayudar':
      default:
        return {
          titulo: '💖 Súper Corazón Solidario',
          desc: 'Tu mayor superpoder es la empatía. Te preocupas por tus compañeros, sabes escuchar y haces del mundo un lugar más cálido y amable.',
          icono: '🤝',
          color: 'from-pink-500 to-rose-400'
        };
    }
  };

  // --- ESTADO XILÓFONO MUSICAL ---
  const notasXilofono = [
    { nota: 'DO', freq: 261.63, color: 'bg-red-400 hover:bg-red-500 text-white', tecla: '1' },
    { nota: 'RE', freq: 293.66, color: 'bg-orange-400 hover:bg-orange-500 text-white', tecla: '2' },
    { nota: 'MI', freq: 329.63, color: 'bg-yellow-400 hover:bg-yellow-500 text-purple-950', tecla: '3' },
    { nota: 'FA', freq: 349.23, color: 'bg-emerald-400 hover:bg-emerald-500 text-white', tecla: '4' },
    { nota: 'SOL', freq: 392.00, color: 'bg-sky-400 hover:bg-sky-500 text-white', tecla: '5' },
    { nota: 'LA', freq: 440.00, color: 'bg-indigo-400 hover:bg-indigo-500 text-white', tecla: '6' },
    { nota: 'SI', freq: 493.88, color: 'bg-purple-400 hover:bg-purple-500 text-white', tecla: '7' },
    { nota: 'DO+', freq: 523.25, color: 'bg-pink-400 hover:bg-pink-500 text-white', tecla: '8' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado del Mini-Estudio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2b2466] tracking-tight">
            Mini-Estudio de Talentos 🎨
          </h2>
          <p className="text-xs sm:text-sm text-purple-700 font-medium">
            Espacio práctico para experimentar con arte, música o descubrir tu vocación mágica
          </p>
        </div>

        {/* Pestañas de modo */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-purple-100 shadow-xs self-start sm:self-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setTabActiva('lienzo');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tabActiva === 'lienzo'
                ? 'bg-purple-600 text-white shadow-xs font-black'
                : 'text-purple-700 hover:bg-purple-50'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Pizarra Mágica</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setTabActiva('test');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tabActiva === 'test'
                ? 'bg-purple-600 text-white shadow-xs font-black'
                : 'text-purple-700 hover:bg-purple-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test de Talentos</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setTabActiva('musica');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              tabActiva === 'musica'
                ? 'bg-purple-600 text-white shadow-xs font-black'
                : 'text-purple-700 hover:bg-purple-50'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Xilófono</span>
          </button>
        </div>
      </div>

      {/* CONTENIDO 1: LIENZO DE DIBUJO */}
      {tabActiva === 'lienzo' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm space-y-4">
          {/* Barra de herramientas de dibujo */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
            {/* Colores */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-900 hidden sm:inline">Color:</span>
              <div className="flex items-center gap-1.5">
                {colores.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setColorPincel(c.hex);
                      setModoHerramienta('pincel');
                    }}
                    title={c.nombre}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer shadow-xs ${
                      colorPincel === c.hex && modoHerramienta === 'pincel'
                        ? 'ring-3 ring-purple-600 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Herramientas especiales */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setModoHerramienta('pincel')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  modoHerramienta === 'pincel' ? 'bg-purple-600 text-white' : 'bg-white text-purple-900 hover:bg-purple-100'
                }`}
              >
                Pincel
              </button>
              <button
                onClick={() => setModoHerramienta('arcoiris')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  modoHerramienta === 'arcoiris' ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white' : 'bg-white text-purple-900 hover:bg-purple-100'
                }`}
              >
                🌈 Arcoíris
              </button>
              <button
                onClick={() => setModoHerramienta('goma')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                  modoHerramienta === 'goma' ? 'bg-purple-600 text-white' : 'bg-white text-purple-900 hover:bg-purple-100'
                }`}
              >
                Goma
              </button>
            </div>

            {/* Sellos / Estampas */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-purple-900 hidden md:inline">Sellos:</span>
              {estampas.slice(0, 6).map((est) => (
                <button
                  key={est}
                  onClick={() => {
                    setEstampaSeleccionada(est);
                    setModoHerramienta('estampa');
                  }}
                  className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer ${
                    modoHerramienta === 'estampa' && estampaSeleccionada === est
                      ? 'bg-purple-200 ring-2 ring-purple-500 scale-110'
                      : 'bg-white hover:bg-purple-100'
                  }`}
                >
                  {est}
                </button>
              ))}
            </div>

            {/* Acciones del Lienzo */}
            <div className="flex items-center gap-2">
              <button
                onClick={limpiarLienzo}
                title="Borrar todo"
                className="p-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpiar</span>
              </button>
              <button
                onClick={descargarDibujo}
                className="px-3 py-1.5 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Guardar Dibujo</span>
              </button>
            </div>
          </div>

          {/* Área del Canvas */}
          <div className="border-4 border-dashed border-purple-200 rounded-2xl overflow-hidden bg-white shadow-inner flex justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={420}
              onMouseDown={iniciarDibujo}
              onMouseMove={trazarDibujo}
              onMouseUp={terminarDibujo}
              onMouseLeave={terminarDibujo}
              onTouchStart={iniciarDibujo}
              onTouchMove={trazarDibujo}
              onTouchEnd={terminarDibujo}
              className="touch-none w-full max-w-[750px] cursor-crosshair block bg-white"
            />
          </div>

          {dibujoGuardado && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-800 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Tu obra mágica ha sido descargada a tu equipo! 🎨</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO 2: TEST DE SUPERPODERES */}
      {tabActiva === 'test' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm">
          {!resultadoQuiz ? (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-1.5 text-center">
                <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-black rounded-full">
                  Pregunta {preguntaActual + 1} de {PREGUNTAS_QUIZ.length}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#2b2466] leading-snug">
                  {PREGUNTAS_QUIZ[preguntaActual].pregunta}
                </h3>
              </div>

              {/* Opciones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PREGUNTAS_QUIZ[preguntaActual].opciones.map((opcion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeleccionarOpcion(opcion.categoria)}
                    className="p-5 rounded-2xl bg-purple-50/60 hover:bg-purple-100/80 border-2 border-purple-100 hover:border-purple-300 transition-all text-left flex items-start gap-3.5 cursor-pointer group"
                  >
                    <span className="text-3xl shrink-0 group-hover:scale-115 transition-transform">
                      {opcion.icono}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#2b2466] leading-relaxed">
                      {opcion.texto}
                    </span>
                  </button>
                ))}
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    const texto = `${PREGUNTAS_QUIZ[preguntaActual].pregunta}. ` +
                      PREGUNTAS_QUIZ[preguntaActual].opciones.map(o => o.texto).join('. ');
                    soundManager.speakText(texto);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Escuchar pregunta y opciones</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center max-w-lg mx-auto space-y-5 py-4 animate-in fade-in zoom-in-95">
              {(() => {
                const info = getDetalleResultado(resultadoQuiz);
                return (
                  <>
                    <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-300 to-yellow-200 flex items-center justify-center text-5xl shadow-lg shadow-amber-200 animate-bounce">
                      {info.icono}
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-black uppercase tracking-widest text-purple-600">
                        ¡Tu Superpoder Revelado!
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-[#2b2466]">
                        {info.titulo}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                        {info.desc}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs font-bold text-purple-900 flex items-center justify-center gap-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span>¡Tu perfil ha sido actualizado con tu talento destacado!</span>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-3">
                      <button
                        onClick={reiniciarQuiz}
                        className="px-5 py-2.5 text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors cursor-pointer"
                      >
                        Repetir Test
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* CONTENIDO 3: XILÓFONO MUSICAL */}
      {tabActiva === 'musica' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h3 className="text-xl font-extrabold text-[#2b2466]">
              Xilófono Mágico de Colores 🎵
            </h3>
            <p className="text-xs text-purple-600 font-medium">
              Haz clic en cada barra para tocar notas reales y experimentar con ritmos alegres.
            </p>
          </div>

          {/* Barras del Xilófono */}
          <div className="flex items-end justify-center gap-2 sm:gap-3 py-6 px-4 bg-purple-50/50 rounded-3xl border border-purple-100 max-w-2xl mx-auto">
            {notasXilofono.map((n, idx) => {
              const altura = 200 - idx * 12; // Altura gradual como xilófono real
              return (
                <button
                  key={n.nota}
                  onClick={() => soundManager.playNote(n.freq)}
                  style={{ height: `${altura}px` }}
                  className={`w-10 sm:w-14 rounded-2xl shadow-md transition-all active:scale-95 flex flex-col justify-between py-3 items-center cursor-pointer ${n.color}`}
                >
                  <span className="text-[10px] font-black opacity-80">{n.tecla}</span>
                  <span className="text-xs sm:text-sm font-black">{n.nota}</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-500 font-semibold">
              💡 Consejo: Prueba tocar la secuencia: <span className="text-purple-700 font-extrabold">1 - 1 - 5 - 5 - 6 - 6 - 5</span> (Estrellita dónde estás)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
