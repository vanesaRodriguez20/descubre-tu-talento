import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Play,
  Square,
  Mic,
  MicOff,
  Send,
  Star,
  ShieldAlert,
  Smile,
  HelpCircle,
  X,
  MessageCircle
} from 'lucide-react';
import { AlertaSeguridad, Usuario } from '../types';
import { soundManager } from '../utils/audio';

interface LumyAssistantProps {
  usuarioActual?: Usuario | null;
  onNuevaAlertaSeguridad?: (alerta: AlertaSeguridad) => void;
  mensajeContextual?: string;
  modoOscuro?: boolean;
}

interface MensajeLumy {
  id: string;
  remitente: 'lumy' | 'nino';
  texto: string;
  esAlerta?: boolean;
}

// Lista de palabras no permitidas / lenguaje inapropiado para protección de menores
const PALABRAS_INAPROPIADAS = [
  'tonto', 'tonta', 'estupido', 'estupida', 'idiota', 'mierda', 'puta', 'puto',
  'maldito', 'maldita', 'carajo', 'imbecil', 'marica', 'culiao', 'pendejo', 'pendeja',
  'groseria', 'estupidez', 'muerete', 'callate', 'odio', 'asco', 'bobo', 'boba'
];

export const LumyAssistant: React.FC<LumyAssistantProps> = ({
  usuarioActual,
  onNuevaAlertaSeguridad,
  mensajeContextual,
  modoOscuro = false
}) => {
  const [hablando, setHablando] = useState(false);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [grabandoVoz, setGrabandoVoz] = useState(false);
  const [inputTexto, setInputTexto] = useState('');
  const [estadoEmocional, setEstadoEmocional] = useState<'feliz' | 'pensando' | 'hablando' | 'atenta'>('feliz');
  
  const [historialMensajes, setHistorialMensajes] = useState<MensajeLumy[]>([
    {
      id: 'm1',
      remitente: 'lumy',
      texto: usuarioActual?.rol === 'docente'
        ? `¡Hola ${usuarioActual.nombre || 'Docente'}! Soy Lumy, tu asistente pedagógica. Te ayudo a monitorear la perseverancia del aula y redactar feedback motivador.`
        : `¡Hola @${usuarioActual?.alias || 'amigo'}! Soy Lumy, tu estrellita cósmica de voz ⭐. ¡Pregúntame cualquier duda de matemáticas o pide una pista mágica!`
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Monitor SpeechSynthesis state
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const interval = setInterval(() => {
      const isSpeaking = window.speechSynthesis.speaking;
      setHablando(isSpeaking);
      if (isSpeaking) {
        setEstadoEmocional('hablando');
      } else if (estadoEmocional === 'hablando') {
        setEstadoEmocional('feliz');
      }
    }, 200);

    return () => clearInterval(interval);
  }, [estadoEmocional]);

  useEffect(() => {
    if (panelAbierto) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [historialMensajes, panelAbierto]);

  const hablarTexto = (texto: string) => {
    soundManager.speakText(texto);
    setHablando(true);
    setEstadoEmocional('hablando');
  };

  const detenerVoz = () => {
    soundManager.stopSpeech();
    setHablando(false);
    setEstadoEmocional('feliz');
  };

  // Filtro de Lenguaje Inapropiado y Alertas de Convivencia para el Docente
  const verificarLenguajeSeguro = (texto: string): boolean => {
    const textoNormalizado = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const contieneGroseria = PALABRAS_INAPROPIADAS.some((palabra) => {
      const regex = new RegExp(`\\b${palabra}\\b`, 'i');
      return regex.test(textoNormalizado);
    });

    if (contieneGroseria) {
      // 1. Respuesta pedagógica inmediata de Lumy
      const respuestaLumy = `En LUM cuidamos nuestro universo con palabras brillantes y respetuosas. Las palabras amables nos dan superpoderes para aprender. He avisado a tu profe para que conversemos con amor.`;
      
      setHistorialMensajes((prev) => [
        ...prev,
        { id: 'usr_' + Date.now(), remitente: 'nino', texto, esAlerta: true },
        { id: 'lum_' + Date.now(), remitente: 'lumy', texto: respuestaLumy, esAlerta: true }
      ]);

      hablarTexto(respuestaLumy);

      // 2. Notificación en tiempo real al docente
      const nuevaAlerta: AlertaSeguridad = {
        id: 'alt_' + Date.now(),
        idEstudiante: usuarioActual?.id || 1,
        aliasEstudiante: usuarioActual?.alias || 'alumno',
        tipo: 'lenguaje_inapropiado',
        mensajeDetectado: texto,
        fecha: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        atendida: false,
        orientacionLumy: 'Lumy reforzó pacíficamente el valor de las palabras amables y canalizó el reporte al docente.'
      };

      onNuevaAlertaSeguridad?.(nuevaAlerta);
      return false; // Indica que se activó la alerta
    }

    return true; // Mensaje limpio
  };

  // Enviar mensaje del estudiante a Lumy
  const handleEnviarMensaje = (textoAEnviar?: string) => {
    const mensaje = (textoAEnviar || inputTexto).trim();
    if (!mensaje) return;

    soundManager.playClick();
    setInputTexto('');

    // Verificar si contiene palabras inapropiadas
    const esSeguro = verificarLenguajeSeguro(mensaje);
    if (!esSeguro) return;

    // Agregar mensaje del usuario
    setHistorialMensajes((prev) => [
      ...prev,
      { id: 'usr_' + Date.now(), remitente: 'nino', texto: mensaje }
    ]);

    setEstadoEmocional('pensando');

    // Respuestas dinámicas y empáticas de Lumy
    setTimeout(() => {
      let respuesta = '';
      const lower = mensaje.toLowerCase();

      if (lower.includes('pizza') || lower.includes('fraccion') || lower.includes('fracciones')) {
        respuesta = '¡Las fracciones son deliciosas! Imagina que cortas una pizza en 4 rebanadas iguales: si comes 2, has comido 2/4, que es exactamente la mitad de la pizza entera.';
      } else if (lower.includes('igual') || lower.includes('balanza') || lower.includes('ecuacion')) {
        respuesta = 'El signo igual "=" es como una balanza cósmica en perfecto equilibrio. Lo que pones a la izquierda siempre debe pesar exactamente lo mismo que a la derecha.';
      } else if (lower.includes('area') || lower.includes('perimetro') || lower.includes('geometria')) {
        respuesta = '¡El perímetro es la cerca que caminas alrededor del patio, y el área es todo el pastito verde donde juegas adentro con tu mascota!';
      } else if (lower.includes('tienda') || lower.includes('dinero') || lower.includes('moneda')) {
        respuesta = 'En la tiendita galáctica sumas monedas para llegar al precio exacto. Si el juguete cuesta $8 y das una moneda de $10, ¡te devuelven $2 de cambio!';
      } else if (lower.includes('superpoder') || lower.includes('talento') || lower.includes('diploma')) {
        respuesta = `¡Tu gran superpoder es tu curiosidad cósmica, @${usuarioActual?.alias || 'explorador'}! Cada intento te hace más sabio. ¡Mira tu diploma en la sección de Estadísticas!`;
      } else if (lower.includes('chiste')) {
        respuesta = '¿Qué le dijo el número 0 al número 8? ¡Me gusta tu cinturón nuevo! Jajaja ⭐.';
      } else if (lower.includes('espacio') || lower.includes('estrella')) {
        respuesta = '¿Sabías que las estrellas brillan porque tienen fuegos cósmicos gigantes? ¡Así como tus neuronas cuando descubres un nuevo acertijo!';
      } else {
        respuesta = `¡Qué interesante pregunta, @${usuarioActual?.alias || 'amigo'}! En LUM cada reto es una oportunidad para experimentar. ¡Toca los botones del simulador y déjate sorprender!`;
      }

      setHistorialMensajes((prev) => [
        ...prev,
        { id: 'lum_' + Date.now(), remitente: 'lumy', texto: respuesta }
      ]);

      hablarTexto(respuesta);
    }, 600);
  };

  // Reconocimiento de Voz nativo (Micrófono para niños que no escriben rápido)
  const toggleReconocimientoVoz = () => {
    soundManager.playClick();
    if (grabandoVoz) {
      soundManager.stopSpeechRecognition();
      setGrabandoVoz(false);
      return;
    }

    setGrabandoVoz(true);
    setEstadoEmocional('atenta');

    const iniciado = soundManager.startSpeechRecognition(
      (transcripcion) => {
        setGrabandoVoz(false);
        setInputTexto(transcripcion);
        handleEnviarMensaje(transcripcion);
      },
      (err) => {
        setGrabandoVoz(false);
        setEstadoEmocional('feliz');
      },
      () => {
        setGrabandoVoz(false);
      }
    );

    if (!iniciado) {
      setGrabandoVoz(false);
      setEstadoEmocional('feliz');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* PANEL DE CONVERSACIÓN INMERSIVO DE LUMY */}
      {panelAbierto && (
        <div className="mb-3 w-92 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#1b1933] rounded-3xl p-5 shadow-2xl border-2 border-amber-300 dark:border-amber-500/70 animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-3.5 transition-colors">
          {/* Header de Lumy */}
          <div className="flex items-center justify-between border-b border-amber-100 dark:border-purple-900/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-gradient-to-tr from-amber-300 to-yellow-200 p-0.5 shadow-md shrink-0 relative animate-float">
                <img
                  src="src\assets\images\icon.png"
                  alt="Lumy la estrellita de voz"
                  className="w-full h-full object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
                {hablando && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-ping" />
                )}
              </div>

              <div>
                <h4 className="font-black text-sm text-[#2b2466] dark:text-purple-100 flex items-center gap-1.5">
                  <span>Lumy la Estrellita</span>
                  <span className="text-amber-500">⭐</span>
                </h4>
                <p className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-pulse" />
                  <span>
                    {hablando
                      ? 'Hablando contigo...'
                      : grabandoVoz
                      ? 'Escuchando tu voz...'
                      : 'Tutora Cósmica Activa'}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                detenerVoz();
                setPanelAbierto(false);
              }}
              className="w-7 h-7 rounded-full bg-amber-50 dark:bg-purple-900/60 hover:bg-amber-100 dark:hover:bg-purple-800 text-amber-900 dark:text-purple-200 font-bold flex items-center justify-center text-xs cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ESTADO VISUAL Y EMOCIONAL DE LUMY */}
          <div className="p-2.5 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-purple-950/60 dark:to-indigo-950/60 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 flex items-center justify-between text-xs font-bold text-amber-950 dark:text-amber-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>
                {estadoEmocional === 'hablando'
                  ? '¡Te estoy hablando con voz cósmica!'
                  : estadoEmocional === 'pensando'
                  ? 'Analizando una pista mágica...'
                  : estadoEmocional === 'atenta'
                  ? '¡Háblame, te escucho con atención!'
                  : 'Lista para resolver misterios'}
              </span>
            </span>

            {hablando && (
              <div className="flex items-center gap-1">
                <span className="w-1 h-3 bg-amber-500 rounded-full animate-bounce" />
                <span className="w-1 h-5 bg-amber-600 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            )}
          </div>

          {/* HISTORIAL DE CONVERSACIÓN / CHAT SCROLL */}
          <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1 scrollbar-none text-xs">
            {historialMensajes.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.remitente === 'nino' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.remitente === 'lumy' && (
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-purple-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ⭐
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.esAlerta
                      ? 'bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200 font-bold'
                      : msg.remitente === 'nino'
                      ? 'bg-purple-600 text-white rounded-tr-xs'
                      : 'bg-amber-50 dark:bg-purple-900/60 text-[#2b2466] dark:text-purple-100 border border-amber-200/60 dark:border-purple-800 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.texto}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* PREGUNTAS RÁPIDAS PARA NIÑOS (1 CLIC SIN TENER QUE ESCRIBIR) */}
          <div className="space-y-1.5 pt-1 border-t border-amber-100 dark:border-purple-900/60">
            <p className="text-[10px] font-bold text-slate-400 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1">
              <span>💡</span>
              <span>Preguntas rápidas para Lumy:</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '🍕 ¿Qué es una fracción?', text: '¿Me explicas cómo funciona una fracción?' },
                { label: '⚖️ Balanza mágica', text: '¿Cómo funciona la balanza del equilibrio?' },
                { label: '📐 Perímetro vs Área', text: '¿Cuál es la diferencia entre perímetro y área?' },
                { label: '⭐ ¿Cuál es mi superpoder?', text: '¿Cuál es mi superpoder hoy según mis retos?' },
                { label: '😄 Un chiste', text: '¡Lumy, cuéntame un chiste divertido!' }
              ].map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleEnviarMensaje(pill.text)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-900 dark:text-purple-200 border border-purple-200/80 dark:border-purple-800 transition-colors cursor-pointer"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* ENTRADA DE VOZ O TEXTO */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={toggleReconocimientoVoz}
              title={grabandoVoz ? 'Detener dictado por voz' : 'Hablar por micrófono con Lumy'}
              className={`p-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
                grabandoVoz
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
                  : 'bg-amber-400 hover:bg-amber-500 text-purple-950'
              }`}
            >
              {grabandoVoz ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputTexto}
              onChange={(e) => setInputTexto(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEnviarMensaje()}
              placeholder="Escribe o habla con tu voz..."
              className="flex-1 px-3 py-2 bg-purple-50/70 dark:bg-purple-950/50 rounded-2xl border border-purple-200/70 dark:border-purple-800 text-xs font-bold text-[#2b2466] dark:text-purple-100 outline-none placeholder:text-purple-300"
            />

            <button
              type="button"
              onClick={() => handleEnviarMensaje()}
              className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl cursor-pointer transition-colors shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* BOTONES DE CONTROL DE VOZ */}
          {hablando && (
            <button
              onClick={detenerVoz}
              className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Silenciar voz de Lumy</span>
            </button>
          )}
        </div>
      )}

      {/* BOTÓN FLOTANTE ESTRELLITA LUMY (CON AURA BRILLANTE) */}
      <button
        onClick={() => {
          soundManager.playClick();
          setPanelAbierto(!panelAbierto);
          if (!panelAbierto && !hablando) {
            hablarTexto(
              mensajeContextual ||
              `¡Hola @${usuarioActual?.alias || 'amigo'}! Soy Lumy tu estrellita de voz. ¡Pregúntame cualquier duda o pídemelas por voz con el micrófono!`
            );
          }
        }}
        title="Asistente de Voz Lumy (Estrellita Interactiva)"
        className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 p-1 shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer relative group border-2 border-white ring-4 ring-amber-300/40"
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-inner flex items-center justify-center">
          <img
            src="src\assets\images\icon.png"
            alt="Estrellita Lumy"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Indicador de voz activa */}
        {hablando && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-xs text-white shadow-md animate-pulse">
            🔊
          </span>
        )}

        {!hablando && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[10px] font-black shadow-xs">
            ⭐
          </span>
        )}
      </button>
    </div>
  );
};
