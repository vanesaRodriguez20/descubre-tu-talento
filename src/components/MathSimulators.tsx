import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, Volume2, ArrowRight, Heart, Trophy, Music, Palette, Move, Smile } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface MathSimulatorProps {
  tipo: 'fracciones' | 'balanza' | 'patrones' | 'geometria' | 'presupuesto' | 'lienzo' | 'xilofono' | 'deporte' | 'amabilidad' | 'general';
  onSimulacionCompletada: (explicacion: string) => void;
}

export const MathSimulators: React.FC<MathSimulatorProps> = ({ tipo, onSimulacionCompletada }) => {
  // ==========================================
  // 1. SIMULADOR DE FRACCIONES
  // ==========================================
  const [cortes, setCortes] = useState<number>(4); // 2, 4, 8
  const [porcionesSeleccionadas, setPorcionesSeleccionadas] = useState<number[]>([0, 1]);

  const togglePorcion = (index: number) => {
    soundManager.playClick();
    if (porcionesSeleccionadas.includes(index)) {
      setPorcionesSeleccionadas(porcionesSeleccionadas.filter((i) => i !== index));
    } else {
      setPorcionesSeleccionadas([...porcionesSeleccionadas, index]);
    }
  };

  const cambiarCortes = (n: number) => {
    soundManager.playClick();
    setCortes(n);
    setPorcionesSeleccionadas([]);
  };

  // ==========================================
  // 2. SIMULADOR DE BALANZA (ÁLGEBRA VISUAL)
  // ==========================================
  const pesoIzquierdo = 6;
  const pesoFijoDerecho = 2;
  const [pesoCajaMisteriosa, setPesoCajaMisteriosa] = useState<number>(1);
  const pesoTotalDerecho = pesoFijoDerecho + pesoCajaMisteriosa;
  const diferencia = pesoIzquierdo - pesoTotalDerecho;
  const inclinacion = Math.max(-15, Math.min(15, diferencia * 4)); // degrees
  const estaEquilibrada = diferencia === 0;

  // ==========================================
  // 3. SIMULADOR DE PATRONES Y SECUENCIAS
  // ==========================================
  const [opcionPatronSeleccionada, setOpcionPatronSeleccionada] = useState<string | null>(null);
  const respuestaCorrectaPatron = '🟩';
  const patronAcertado = opcionPatronSeleccionada === respuestaCorrectaPatron;

  // ==========================================
  // 4. SIMULADOR DE GEOMETRÍA (PERÍMETRO Y ÁREA)
  // ==========================================
  const [anchoPatio, setAnchoPatio] = useState<number>(4);
  const [largoPatio, setLargoPatio] = useState<number>(3);
  const [mascotaPatio, setMascotaPatio] = useState<string>('🐶');
  const perimetro = 2 * (anchoPatio + largoPatio);
  const area = anchoPatio * largoPatio;

  // ==========================================
  // 5. SIMULADOR DE PRESUPUESTO Y MONEDAS
  // ==========================================
  const productosTienda = [
    { id: 'jugo', nombre: 'Jugo Astral', precio: 8, icono: '🧃' },
    { id: 'galleta', nombre: 'Galleta Estelar', precio: 12, icono: '🍪' },
    { id: 'fruta', nombre: 'Manzana Cósmica', precio: 5, icono: '🍎' }
  ];
  const [productoSeleccionado, setProductoSeleccionado] = useState(productosTienda[0]);
  const [monedasEntregadas, setMonedasEntregadas] = useState<number[]>([]);
  const totalPagado = monedasEntregadas.reduce((acc, curr) => acc + curr, 0);
  const pagoExacto = totalPagado === productoSeleccionado.precio;

  const agregarMoneda = (valor: number) => {
    soundManager.playClick();
    setMonedasEntregadas([...monedasEntregadas, valor]);
  };

  const limpiarMonedas = () => {
    soundManager.playClick();
    setMonedasEntregadas([]);
  };

  // ==========================================
  // 6. MINI-LIENZO DE PINTURA ASTRAL
  // ==========================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dibujando, setDibujando] = useState(false);
  const [colorPincel, setColorPincel] = useState<string>('#9333ea');
  const [modoArcoiris, setModoArcoiris] = useState(false);
  const [trazosHechos, setTrazosHechos] = useState(0);

  const empezarDibujo = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setDibujando(true);
  };

  const dibujar = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!dibujando) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    if (modoArcoiris) {
      const colores = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899'];
      ctx.strokeStyle = colores[Math.floor(Math.random() * colores.length)];
    } else {
      ctx.strokeStyle = colorPincel;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    setTrazosHechos((prev) => prev + 1);
  };

  const terminarDibujo = () => {
    setDibujando(false);
  };

  const limpiarLienzo = () => {
    soundManager.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTrazosHechos(0);
  };

  // ==========================================
  // 7. XILÓFONO CÓSMICO INTERACTIVO
  // ==========================================
  const notasXilofono = [
    { nota: 'Do', freq: 261.63, color: 'bg-rose-500 hover:bg-rose-600', emoji: '🔴' },
    { nota: 'Re', freq: 293.66, color: 'bg-orange-500 hover:bg-orange-600', emoji: '🟠' },
    { nota: 'Mi', freq: 329.63, color: 'bg-amber-400 hover:bg-amber-500 text-amber-950', emoji: '🟡' },
    { nota: 'Fa', freq: 349.23, color: 'bg-emerald-500 hover:bg-emerald-600', emoji: '🟢' },
    { nota: 'Sol', freq: 392.00, color: 'bg-sky-500 hover:bg-sky-600', emoji: '🔵' },
    { nota: 'La', freq: 440.00, color: 'bg-indigo-500 hover:bg-indigo-600', emoji: '🟣' },
    { nota: 'Si', freq: 493.88, color: 'bg-purple-600 hover:bg-purple-700', emoji: '🟤' },
    { nota: 'Do²', freq: 523.25, color: 'bg-pink-500 hover:bg-pink-600', emoji: '⭐' }
  ];
  const [secuenciaTocada, setSecuenciaTocada] = useState<string[]>([]);

  const tocarNota = (nota: string, freq: number) => {
    soundManager.playNote(freq);
    setSecuenciaTocada((prev) => [...prev.slice(-7), nota]);
  };

  // ==========================================
  // 8. DESAFÍO DE DEPORTE Y PUNTERÍA
  // ==========================================
  const [tirosAcertados, setTirosAcertados] = useState<number>(0);
  const [posicionDiana, setPosicionDiana] = useState<number>(2); // 0, 1, 2, 3, 4
  const [tiroExitosoAnim, setTiroExitosoAnim] = useState(false);

  const realizarPase = (posicionSeleccionada: number) => {
    soundManager.playClick();
    if (posicionSeleccionada === posicionDiana) {
      soundManager.playSuccessChime();
      setTiroExitosoAnim(true);
      setTirosAcertados((prev) => Math.min(5, prev + 1));
      setTimeout(() => setTiroExitosoAnim(false), 600);
      setPosicionDiana(Math.floor(Math.random() * 5));
    } else {
      soundManager.speakText('¡Casi! Ajusta la puntería hacia la estrella de energía.');
    }
  };

  // ==========================================
  // 9. MISIÓN DE AMABILIDAD Y EMPATÍA
  // ==========================================
  const actosAmabilidad = [
    { id: '1', texto: 'Compartí mis colores y materiales escolares con un compañero', icono: '🎨' },
    { id: '2', texto: 'Ayudé a ordenar los materiales del aula o de la casa con entusiasmo', icono: '🧹' },
    { id: '3', texto: 'Le di una palabra de ánimo y una sonrisa a alguien que estaba triste', icono: '💬' },
    { id: '4', texto: 'Escuché con paciencia y respeto a un compañero que quería opinar', icono: '👂' }
  ];
  const [actoElegido, setActoElegido] = useState<string>(actosAmabilidad[0].texto);
  const [corazonReaccion, setCorazonReaccion] = useState<string>('💖');

  return (
    <div className="space-y-4">
      {/* ---------------- 1. SIMULADOR: FRACCIONES VISUALES ---------------- */}
      {tipo === 'fracciones' && (
        <div className="p-5 bg-gradient-to-b from-amber-50/70 to-orange-50/70 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl border-2 border-amber-300 dark:border-amber-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-black text-sm text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                <span>🍕</span>
                <span>Laboratorio Visual de Fracciones</span>
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                Corta la pizza mágica y toca las rebanadas para ver la fracción en tiempo real
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-amber-900/60 p-1 rounded-full border border-amber-200 dark:border-amber-700 text-xs font-bold shrink-0">
              {[2, 4, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => cambiarCortes(n)}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    cortes === n ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-amber-900 dark:text-amber-100 hover:bg-amber-100'
                  }`}
                >
                  1/{n}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            <div className="relative w-48 h-48 sm:w-52 sm:h-52">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-md">
                <circle cx="50" cy="50" r="48" fill="#fef3c7" stroke="#d97706" strokeWidth="4" />
                {Array.from({ length: cortes }).map((_, i) => {
                  const anguloPaso = (2 * Math.PI) / cortes;
                  const startAngle = i * anguloPaso;
                  const endAngle = (i + 1) * anguloPaso;
                  const x1 = 50 + 46 * Math.cos(startAngle);
                  const y1 = 50 + 46 * Math.sin(startAngle);
                  const x2 = 50 + 46 * Math.cos(endAngle);
                  const y2 = 50 + 46 * Math.sin(endAngle);
                  const pathData = `M 50 50 L ${x1} ${y1} A 46 46 0 0 1 ${x2} ${y2} Z`;
                  const seleccionada = porcionesSeleccionadas.includes(i);

                  return (
                    <path
                      key={i}
                      d={pathData}
                      onClick={() => togglePorcion(i)}
                      className={`cursor-pointer transition-colors duration-200 stroke-[#b45309] stroke-1 ${
                        seleccionada
                          ? 'fill-amber-500 hover:fill-amber-600'
                          : 'fill-amber-200/90 hover:fill-amber-300'
                      }`}
                    />
                  );
                })}
              </svg>
            </div>

            <div className="text-center space-y-2 bg-white dark:bg-[#1a1733] p-4 rounded-2xl border border-amber-200 dark:border-amber-700 shadow-sm min-w-[170px]">
              <p className="text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Fracción Actual
              </p>
              <div className="flex flex-col items-center leading-none">
                <span className="text-3xl font-black text-amber-900 dark:text-amber-100 tabular-nums">
                  {porcionesSeleccionadas.length}
                </span>
                <span className="w-12 h-1 bg-amber-800 dark:bg-amber-400 rounded-full my-1" />
                <span className="text-3xl font-black text-amber-900 dark:text-amber-100 tabular-nums">
                  {cortes}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold">
                {porcionesSeleccionadas.length === 0
                  ? 'Toca rebanadas para tomarlas'
                  : `${porcionesSeleccionadas.length} de ${cortes} partes`}
              </p>
              {porcionesSeleccionadas.length * 2 === cortes && (
                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black rounded-full">
                  ¡Equivale a 1/2 pizza! ✨
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                soundManager.playSuccessChime();
                onSimulacionCompletada(
                  `Exploré la pizza mágica dividida en ${cortes} partes y tomé ${porcionesSeleccionadas.length} rebanadas (${porcionesSeleccionadas.length}/${cortes}). Comprendí visualmente el significado de las fracciones.`
                );
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-full shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Guardar mi descubrimiento de fracciones</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 2. SIMULADOR: BALANZA DE IGUALDAD ---------------- */}
      {tipo === 'balanza' && (
        <div className="p-5 bg-gradient-to-b from-blue-50/70 to-indigo-50/70 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-2xl border-2 border-indigo-300 dark:border-indigo-800 space-y-4">
          <div>
            <h4 className="font-black text-sm text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
              <span>⚖️</span>
              <span>Laboratorio de la Balanza Ecuacional</span>
            </h4>
            <p className="text-xs text-indigo-800 dark:text-indigo-300 font-medium">
              El signo igual (=) significa equilibrio. Ajusta el peso de la caja misteriosa para nivelar ambos lados.
            </p>
          </div>

          <div className="relative py-6 flex flex-col items-center">
            <div
              className="relative w-72 sm:w-80 h-3 bg-slate-700 rounded-full transition-transform duration-300 origin-center flex items-center justify-between px-2"
              style={{ transform: `rotate(${inclinacion}deg)` }}
            >
              <div className="absolute -left-2 top-3 w-32 flex flex-col items-center">
                <div className="w-0.5 h-12 bg-slate-400" />
                <div className="w-28 h-4 bg-slate-600 rounded-b-xl shadow-md flex items-center justify-center" />
                <div className="mt-1 flex flex-wrap gap-1 justify-center max-w-[120px]">
                  {Array.from({ length: pesoIzquierdo }).map((_, i) => (
                    <span key={i} className="text-base">🍎</span>
                  ))}
                </div>
                <span className="text-[11px] font-black text-indigo-950 dark:text-indigo-200 mt-1">
                  Peso Izq: {pesoIzquierdo}
                </span>
              </div>

              <div className="absolute -right-2 top-3 w-32 flex flex-col items-center">
                <div className="w-0.5 h-12 bg-slate-400" />
                <div className="w-28 h-4 bg-slate-600 rounded-b-xl shadow-md flex items-center justify-center" />
                <div className="mt-1 flex flex-wrap gap-1 justify-center items-center max-w-[120px]">
                  <div className="px-2 py-1 bg-amber-400 rounded-lg text-xs font-black text-purple-950 shadow-xs border border-amber-500">
                    📦 ?
                  </div>
                  {Array.from({ length: pesoFijoDerecho }).map((_, i) => (
                    <span key={i} className="text-base">🍎</span>
                  ))}
                </div>
                <span className="text-[11px] font-black text-indigo-950 dark:text-indigo-200 mt-1">
                  Peso Der: {pesoTotalDerecho}
                </span>
              </div>
            </div>

            <div className="w-6 h-20 bg-slate-600 rounded-t-lg -mt-1 shadow-md" />
            <div className="w-36 h-4 bg-slate-700 rounded-full shadow-lg" />
          </div>

          <div className="p-4 bg-white dark:bg-[#1a1733] rounded-2xl border border-indigo-100 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                ¿Cuántas manzanas pones en la caja misteriosa 📦?
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                Ecuación: 6 = 📦 + 2
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setPesoCajaMisteriosa(Math.max(1, pesoCajaMisteriosa - 1));
                }}
                className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 font-black text-base flex items-center justify-center hover:bg-indigo-200 cursor-pointer"
              >
                -
              </button>
              <span className="text-2xl font-black text-indigo-900 dark:text-indigo-100 w-8 text-center tabular-nums">
                {pesoCajaMisteriosa}
              </span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setPesoCajaMisteriosa(Math.min(10, pesoCajaMisteriosa + 1));
                }}
                className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 font-black text-base flex items-center justify-center hover:bg-indigo-200 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {estaEquilibrada ? (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡Balanza equilibrada! La caja misteriosa vale exactamente 4 (4 + 2 = 6).</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playSuccessChime();
                  onSimulacionCompletada(
                    `Resolví el equilibrio de la balanza: 6 manzanas a la izquierda es igual a 4 manzanas en la caja misteriosa más 2 manzanas fijas (6 = 4 + 2).`
                  );
                }}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
              >
                Guardar
              </button>
            </div>
          ) : (
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs text-indigo-900 dark:text-indigo-300 font-semibold text-center">
              {diferencia > 0
                ? `La izquierda pesa más por ${diferencia}. ¡Agrega manzanas a la caja!`
                : `La derecha se pasó por ${Math.abs(diferencia)}. ¡Quita manzanas de la caja!`}
            </div>
          )}
        </div>
      )}

      {/* ---------------- 3. SIMULADOR: PATRONES Y SECUENCIAS ---------------- */}
      {tipo === 'patrones' && (
        <div className="p-5 bg-gradient-to-b from-purple-50/70 to-pink-50/70 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl border-2 border-purple-300 dark:border-purple-800 space-y-4">
          <div>
            <h4 className="font-black text-sm text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
              <span>🔷</span>
              <span>Descifrador de Patrones Cósmicos</span>
            </h4>
            <p className="text-xs text-purple-800 dark:text-purple-300 font-medium">
              Observa el bloque que se repite y deduce cuál figura sigue en la posición misteriosa #9
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 py-4 bg-white dark:bg-[#1a1733] rounded-2xl border border-purple-100 dark:border-purple-800 shadow-inner flex-wrap px-4">
            {['🔵', '🔺', '🟩', '🔵', '🔺', '🟩', '🔵', '🔺'].map((fig, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl">{fig}</span>
                <span className="text-[10px] text-slate-400 font-mono font-bold mt-1">#{i + 1}</span>
              </div>
            ))}
            <div className="flex flex-col items-center p-2 bg-purple-100 dark:bg-purple-900 rounded-xl border-2 border-dashed border-purple-400">
              <span className="text-2xl sm:text-3xl">{opcionPatronSeleccionada || '❓'}</span>
              <span className="text-[10px] text-purple-700 dark:text-purple-200 font-bold mt-1">#9</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">¿Qué figura debe colocarse en el signo de interrogación?</span>
            <div className="flex items-center justify-center gap-3">
              {['🔵', '🔺', '🟩', '⭐'].map((opc) => (
                <button
                  key={opc}
                  onClick={() => {
                    soundManager.playClick();
                    setOpcionPatronSeleccionada(opc);
                  }}
                  className={`px-4 py-2 text-2xl rounded-2xl border-2 transition-all cursor-pointer ${
                    opcionPatronSeleccionada === opc
                      ? 'bg-purple-600 text-white border-purple-600 scale-110 shadow-md'
                      : 'bg-white dark:bg-purple-900/40 hover:bg-purple-100 border-purple-200'
                  }`}
                >
                  {opc}
                </button>
              ))}
            </div>
          </div>

          {opcionPatronSeleccionada && (
            <div className="pt-1">
              {patronAcertado ? (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2">
                  <span>¡Correcto! El patrón es de 3 elementos (Círculo, Triángulo, Cuadrado). En la posición 9 va el Cuadrado Verde.</span>
                  <button
                    onClick={() => {
                      soundManager.playSuccessChime();
                      onSimulacionCompletada(
                        `Descubrí que la secuencia cósmica sigue un patrón de 3 figuras repetidas y predije que en la posición 9 va el Cuadrado Verde.`
                      );
                    }}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-semibold text-center">
                  Casi lo logras. Revisa qué figura sigue siempre después del triángulo rojo.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------------- 4. SIMULADOR: GEOMETRÍA (PERÍMETRO Y ÁREA) ---------------- */}
      {tipo === 'geometria' && (
        <div className="p-5 bg-gradient-to-b from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-black text-sm text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <span>📐</span>
                <span>El Arquitecto del Patio: Perímetro vs Área</span>
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                Cambia las medidas del patio: el borde de madera es el Perímetro y el pasto verde es el Área
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Mascota:</span>
              {['🐶', '🐱', '🐰'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMascotaPatio(m)}
                  className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center cursor-pointer transition-transform ${
                    mascotaPatio === m ? 'bg-emerald-600 text-white scale-110 shadow-xs' : 'bg-white dark:bg-emerald-900/60'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Cuadrícula interactiva del patio */}
          <div className="flex flex-col items-center justify-center py-3 bg-white dark:bg-[#1a1733] rounded-2xl border border-emerald-200 dark:border-emerald-800 p-4">
            <div
              className="grid gap-1.5 p-2 bg-amber-100 dark:bg-amber-950/60 rounded-xl border-4 border-amber-600 shadow-md transition-all"
              style={{
                gridTemplateColumns: `repeat(${anchoPatio}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: area }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 hover:bg-emerald-400 rounded-lg flex items-center justify-center text-white text-base shadow-xs select-none"
                >
                  {idx === Math.floor(area / 2) ? mascotaPatio : '🌿'}
                </div>
              ))}
            </div>
          </div>

          {/* Controles de Dimensiones y Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white dark:bg-[#1a1733] rounded-xl border border-emerald-100 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-emerald-900 dark:text-emerald-200">Ancho: {anchoPatio} m</p>
                <p className="text-[10px] text-slate-500">Número de columnas</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setAnchoPatio(Math.max(2, anchoPatio - 1));
                  }}
                  className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-black rounded-lg cursor-pointer"
                >
                  -
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setAnchoPatio(Math.min(6, anchoPatio + 1));
                  }}
                  className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-black rounded-lg cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-[#1a1733] rounded-xl border border-emerald-100 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-emerald-900 dark:text-emerald-200">Largo: {largoPatio} m</p>
                <p className="text-[10px] text-slate-500">Número de filas</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setLargoPatio(Math.max(2, largoPatio - 1));
                  }}
                  className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-black rounded-lg cursor-pointer"
                >
                  -
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setLargoPatio(Math.min(5, largoPatio + 1));
                  }}
                  className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-black rounded-lg cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-[#1a1733] rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-around text-center">
            <div>
              <p className="text-[11px] font-bold text-amber-800 dark:text-amber-400">🪵 Perímetro (Cerca)</p>
              <p className="text-2xl font-black text-amber-900 dark:text-amber-200">{perimetro} metros</p>
              <p className="text-[10px] text-slate-500">2 × ({anchoPatio} + {largoPatio})</p>
            </div>
            <div className="w-px h-10 bg-emerald-200 dark:bg-emerald-800" />
            <div>
              <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">🟩 Área (Pasto)</p>
              <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200">{area} m²</p>
              <p className="text-[10px] text-slate-500">{anchoPatio} × {largoPatio} baldosas</p>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                soundManager.playSuccessChime();
                onSimulacionCompletada(
                  `Diseñé un patio de ${anchoPatio}x${largoPatio} metros. Descubrí que la cerca exterior (perímetro) mide ${perimetro}m y el pasto interior (área) tiene ${area}m².`
                );
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Guardar mi diseño de patio</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 5. SIMULADOR: PRESUPUESTO Y MONEDAS ---------------- */}
      {tipo === 'presupuesto' && (
        <div className="p-5 bg-gradient-to-b from-yellow-50/70 to-amber-50/70 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-2xl border-2 border-yellow-300 dark:border-yellow-800 space-y-4">
          <div>
            <h4 className="font-black text-sm text-yellow-950 dark:text-yellow-200 flex items-center gap-1.5">
              <span>🪙</span>
              <span>La Tiendita Galáctica: Monedas y Presupuesto</span>
            </h4>
            <p className="text-xs text-yellow-800 dark:text-yellow-300 font-medium">
              Elige un producto y reúne el valor exacto combinando monedas de $1, $2, $5 y $10
            </p>
          </div>

          {/* Selección de Producto */}
          <div className="grid grid-cols-3 gap-2">
            {productosTienda.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  soundManager.playClick();
                  setProductoSeleccionado(p);
                  setMonedasEntregadas([]);
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  productoSeleccionado.id === p.id
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md font-black scale-105'
                    : 'bg-white dark:bg-amber-950/40 border-amber-200 text-slate-800 dark:text-slate-200 font-bold'
                }`}
              >
                <span className="text-3xl block mb-1">{p.icono}</span>
                <p className="text-xs">{p.nombre}</p>
                <p className="text-sm font-black mt-0.5">${p.precio}</p>
              </button>
            ))}
          </div>

          {/* Bandeja de Monedas */}
          <div className="p-4 bg-white dark:bg-[#1a1733] rounded-2xl border border-yellow-200 dark:border-yellow-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Tu Bandeja de Pago: <strong className="text-amber-600 text-sm">${totalPagado}</strong> / ${productoSeleccionado.precio}
              </span>
              {monedasEntregadas.length > 0 && (
                <button
                  onClick={limpiarMonedas}
                  className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  Vaciar monedas
                </button>
              )}
            </div>

            <div className="min-h-12 p-2 bg-yellow-50 dark:bg-yellow-950/40 rounded-xl border border-dashed border-yellow-300 flex flex-wrap gap-2 items-center">
              {monedasEntregadas.length === 0 ? (
                <span className="text-xs text-slate-400 italic">Haz clic en las monedas de abajo para añadirlas aquí...</span>
              ) : (
                monedasEntregadas.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-amber-400 text-amber-950 font-black text-xs rounded-full border border-amber-500 shadow-xs animate-in zoom-in-75"
                  >
                    🪙 ${val}
                  </span>
                ))
              )}
            </div>

            {/* Dispensador de Monedas */}
            <div className="flex items-center justify-around gap-2 pt-1">
              {[1, 2, 5, 10].map((val) => (
                <button
                  key={val}
                  onClick={() => agregarMoneda(val)}
                  className="px-4 py-2 bg-gradient-to-t from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-amber-950 font-black text-sm rounded-2xl border-2 border-amber-600 shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  +${val}
                </button>
              ))}
            </div>
          </div>

          {pagoExacto ? (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2">
              <span>¡Pago exacto completado! Reuniste ${totalPagado} para comprar tu {productoSeleccionado.nombre}.</span>
              <button
                onClick={() => {
                  soundManager.playSuccessChime();
                  onSimulacionCompletada(
                    `Pagué exactamente $${totalPagado} por el ${productoSeleccionado.nombre} combinando las monedas: ${monedasEntregadas.map(m => `$${m}`).join(' + ')} = $${totalPagado}.`
                  );
                }}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
              >
                Guardar
              </button>
            </div>
          ) : totalPagado > productoSeleccionado.precio ? (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-bold text-center">
              Te pasaste por ${totalPagado - productoSeleccionado.precio}. Quita monedas o vacía la bandeja para dar el monto exacto.
            </div>
          ) : (
            <div className="p-2.5 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 rounded-xl text-xs text-yellow-900 dark:text-yellow-200 font-semibold text-center">
              Faltan ${productoSeleccionado.precio - totalPagado} para completar el precio. ¡Añade más monedas!
            </div>
          )}
        </div>
      )}

      {/* ---------------- 6. MINI-LIENZO: PINTURA ASTRAL ---------------- */}
      {tipo === 'lienzo' && (
        <div className="p-5 bg-gradient-to-b from-pink-50/70 to-purple-50/70 dark:from-pink-950/20 dark:to-purple-950/20 rounded-2xl border-2 border-pink-300 dark:border-pink-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-black text-sm text-pink-950 dark:text-pink-200 flex items-center gap-1.5">
                <span>🎨</span>
                <span>Mini-Lienzo de Expresión Libre</span>
              </h4>
              <p className="text-xs text-pink-800 dark:text-pink-300 font-medium">
                Dibuja con tu dedo o ratón usando colores cósmicos o el modo arcoíris
              </p>
            </div>
            <button
              onClick={limpiarLienzo}
              className="px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
            >
              Borrar todo
            </button>
          </div>

          <div className="border-2 border-purple-300 dark:border-purple-800 rounded-2xl overflow-hidden bg-white shadow-inner flex justify-center">
            <canvas
              ref={canvasRef}
              width={500}
              height={220}
              onMouseDown={empezarDibujo}
              onMouseMove={dibujar}
              onMouseUp={terminarDibujo}
              onMouseLeave={terminarDibujo}
              onTouchStart={empezarDibujo}
              onTouchMove={dibujar}
              onTouchEnd={terminarDibujo}
              className="touch-none cursor-crosshair w-full max-w-[500px] h-[220px]"
            />
          </div>

          {/* Paleta de Colores */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              {['#9333ea', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#1e293b'].map((col) => (
                <button
                  key={col}
                  onClick={() => {
                    soundManager.playClick();
                    setColorPincel(col);
                    setModoArcoiris(false);
                  }}
                  className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${
                    colorPincel === col && !modoArcoiris ? 'scale-125 ring-2 ring-purple-600' : ''
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setModoArcoiris(!modoArcoiris);
                }}
                className={`px-3 py-1 rounded-full text-xs font-black cursor-pointer ${
                  modoArcoiris ? 'bg-gradient-to-r from-red-500 via-yellow-400 to-purple-600 text-white shadow-xs' : 'bg-white border text-purple-900'
                }`}
              >
                🌈 Arcoíris
              </button>
            </div>

            <button
              onClick={() => {
                soundManager.playSuccessChime();
                onSimulacionCompletada(
                  `Pinté una obra astral en el lienzo con ${trazosHechos > 5 ? 'múltiples trazos y colores cósmicos' : 'creatividad libre'}.`
                );
              }}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs rounded-full shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Guardar mi dibujo de arte</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 7. XILÓFONO CÓSMICO ---------------- */}
      {tipo === 'xilofono' && (
        <div className="p-5 bg-gradient-to-b from-indigo-50/70 to-pink-50/70 dark:from-indigo-950/20 dark:to-pink-950/20 rounded-2xl border-2 border-indigo-300 dark:border-indigo-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-black text-sm text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <span>🎵</span>
                <span>Xilófono Cósmico de 8 Notas</span>
              </h4>
              <p className="text-xs text-indigo-800 dark:text-indigo-300 font-medium">
                Toca las barras sonoras de colores y compone tu propia canción
              </p>
            </div>
            {secuenciaTocada.length > 0 && (
              <button
                onClick={() => setSecuenciaTocada([])}
                className="text-xs text-slate-500 hover:underline font-bold cursor-pointer"
              >
                Reiniciar melodía
              </button>
            )}
          </div>

          {/* Teclas del Xilófono */}
          <div className="flex items-end justify-center gap-2 h-44 py-2">
            {notasXilofono.map((n, i) => {
              const altura = 160 - i * 10;
              return (
                <button
                  key={n.nota}
                  onClick={() => tocarNota(n.nota, n.freq)}
                  style={{ height: `${altura}px` }}
                  className={`w-10 sm:w-12 rounded-2xl ${n.color} text-white font-black text-xs flex flex-col justify-between items-center py-2 shadow-md cursor-pointer transition-transform hover:-translate-y-2 active:scale-95`}
                >
                  <span>{n.emoji}</span>
                  <span className="text-[11px] font-black">{n.nota}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-white dark:bg-[#1a1733] rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Melodía: {secuenciaTocada.length === 0 ? 'Toca al menos 4 notas...' : secuenciaTocada.join(' - ')}
            </span>
            <button
              disabled={secuenciaTocada.length < 3}
              onClick={() => {
                soundManager.playSuccessChime();
                onSimulacionCompletada(
                  `Compuse una melodía con el xilófono cósmico tocando las notas: ${secuenciaTocada.join(', ')}.`
                );
              }}
              className="px-4 py-2 bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-full shadow-sm cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Guardar mi melodía</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 8. DESAFÍO DE DEPORTE Y PUNTERÍA ---------------- */}
      {tipo === 'deporte' && (
        <div className="p-5 bg-gradient-to-b from-sky-50/70 to-blue-50/70 dark:from-sky-950/20 dark:to-blue-950/20 rounded-2xl border-2 border-sky-300 dark:border-sky-800 space-y-4">
          <div>
            <h4 className="font-black text-sm text-sky-950 dark:text-sky-200 flex items-center gap-1.5">
              <span>⚽</span>
              <span>Reto de Pases y Puntería Cósmica</span>
            </h4>
            <p className="text-xs text-sky-800 dark:text-sky-300 font-medium">
              Apunta hacia el arco cósmico donde brilla la estrella de energía y completa 5 pases exitosos
            </p>
          </div>

          {/* Campo de Puntería */}
          <div className="p-4 bg-emerald-600 rounded-2xl border-4 border-emerald-700 shadow-md flex flex-col items-center justify-between min-h-[160px] relative overflow-hidden">
            {/* Aros de la Portería */}
            <div className="grid grid-cols-5 gap-2 w-full max-w-sm pt-2">
              {[0, 1, 2, 3, 4].map((pos) => (
                <button
                  key={pos}
                  onClick={() => realizarPase(pos)}
                  className={`h-16 rounded-xl border-2 border-dashed border-white/60 flex items-center justify-center text-2xl transition-all cursor-pointer hover:bg-white/20 active:scale-95 ${
                    posicionDiana === pos ? 'bg-amber-300/40 border-amber-300 animate-pulse' : ''
                  }`}
                >
                  {posicionDiana === pos ? '⭐' : '🥅'}
                </button>
              ))}
            </div>

            <p className="text-xs text-white font-black mt-4">
              {tiroExitosoAnim ? '¡GOOOOL! ⭐ Pase perfecto' : '¡Toca la casilla con la estrella dorada para anotar!'}
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-[#1a1733] rounded-2xl border border-sky-100 dark:border-sky-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Pases Completados: <strong>{tirosAcertados} / 5</strong>
              </span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-base ${i < tirosAcertados ? 'opacity-100' : 'opacity-30'}`}>
                    ⚽
                  </span>
                ))}
              </div>
            </div>

            <button
              disabled={tirosAcertados < 3}
              onClick={() => {
                soundManager.playAchievementFanfare();
                onSimulacionCompletada(
                  `Completé ${tirosAcertados} pases de puntería con balón manteniendo equilibrio y coordinación física.`
                );
              }}
              className="px-4 py-2 bg-sky-600 disabled:opacity-50 hover:bg-sky-700 text-white font-extrabold text-xs rounded-full shadow-sm cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Guardar mi reto deportivo</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 9. MISIÓN DE AMABILIDAD Y EMPATÍA ---------------- */}
      {tipo === 'amabilidad' && (
        <div className="p-5 bg-gradient-to-b from-rose-50/70 to-pink-50/70 dark:from-rose-950/20 dark:to-pink-950/20 rounded-2xl border-2 border-rose-300 dark:border-rose-800 space-y-4">
          <div>
            <h4 className="font-black text-sm text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
              <span>🤝</span>
              <span>Misión de Compañerismo & Empatía</span>
            </h4>
            <p className="text-xs text-rose-800 dark:text-rose-300 font-medium">
              Selecciona qué gesto bondadoso realizaste hoy para hacer sonreír a alguien
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {actosAmabilidad.map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActoElegido(act.texto);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                  actoElegido === act.texto
                    ? 'bg-rose-500 text-white border-rose-600 shadow-md font-black'
                    : 'bg-white dark:bg-rose-950/40 border-rose-100 text-slate-800 dark:text-slate-200 font-semibold hover:bg-rose-50'
                }`}
              >
                <span className="text-3xl p-1 bg-white/20 rounded-xl">{act.icono}</span>
                <span className="text-xs leading-relaxed flex-1">{act.texto}</span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-white dark:bg-[#1a1733] rounded-2xl border border-rose-100 dark:border-rose-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Reacción:</span>
              {['💖', '🌟', '🤝', '🌸'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCorazonReaccion(c)}
                  className={`text-xl p-1 rounded-lg cursor-pointer ${corazonReaccion === c ? 'scale-125 bg-rose-100' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                soundManager.playAchievementFanfare();
                onSimulacionCompletada(
                  `Realicé un acto de empatía y compañerismo: "${actoElegido}".`
                );
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-full shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Guardar mi acto de compañerismo</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 10. GENERAL / OTROS ---------------- */}
      {tipo === 'general' && (
        <div className="p-5 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 text-center space-y-3">
          <p className="text-xs text-purple-900 dark:text-purple-200 font-bold">
            ¡Explora este reto con la ayuda de Lumy y marca tu descubrimiento cuando estés listo!
          </p>
          <button
            onClick={() => {
              soundManager.playSuccessChime();
              onSimulacionCompletada('Completé el reto interactivo y comprendí las ideas principales.');
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-full shadow-sm cursor-pointer"
          >
            Completar reto
          </button>
        </div>
      )}
    </div>
  );
};
