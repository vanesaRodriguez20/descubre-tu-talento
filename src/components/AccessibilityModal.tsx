import React from 'react';
import { Sun, Moon, Sparkles, Check, Volume2, Type, Eye, BookOpen, Compass, ZapOff, RotateCcw } from 'lucide-react';
import { PreferenciasAccesibilidadFrontend } from '../types';
import { soundManager } from '../utils/audio';

interface AccessibilityModalProps {
  abierto: boolean;
  onCerrar: () => void;
  preferencias: PreferenciasAccesibilidadFrontend;
  onActualizarPreferencias: (nuevas: Partial<PreferenciasAccesibilidadFrontend>) => void;
  onRestablecer?: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  abierto,
  onCerrar,
  preferencias,
  onActualizarPreferencias,
  onRestablecer
}) => {
  if (!abierto) return null;

  const handleToggleOscuro = (oscuro: boolean) => {
    soundManager.playClick();
    onActualizarPreferencias({ modoOscuro: oscuro, altoContraste: false });
    soundManager.speakText(oscuro ? 'Modo oscuro activado.' : 'Modo claro activado.');
  };

  const handleToggleAltoContraste = () => {
    soundManager.playClick();
    const nuevo = !preferencias.altoContraste;
    onActualizarPreferencias({ altoContraste: nuevo, modoOscuro: nuevo ? true : preferencias.modoOscuro });
    soundManager.speakText(nuevo ? 'Alto contraste amarillo y negro activado.' : 'Alto contraste desactivado.');
  };

  const handleCambiarTamano = (tamano: 'normal' | 'grande' | 'muy-grande') => {
    soundManager.playClick();
    onActualizarPreferencias({ tamanoTexto: tamano });
    soundManager.speakText(`Tamaño de texto ${tamano === 'normal' ? 'normal' : tamano === 'grande' ? 'grande' : 'muy grande'}.`);
  };

  const handleProbarVoz = () => {
    soundManager.playClick();
    soundManager.speakText('¡Hola! Soy Lumy, tu tutora cósmica. La configuración de accesibilidad y voz está activa y funcionando.');
  };

  const handleCambiarVelocidadVoz = (vel: 'lenta' | 'normal' | 'rapida') => {
    soundManager.playClick();
    onActualizarPreferencias({ velocidadVoz: vel });
    const rate = vel === 'lenta' ? 0.75 : vel === 'rapida' ? 1.15 : 0.95;
    soundManager.defaultRate = rate;
    soundManager.speakText(`Velocidad de voz ${vel}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div
        className={`rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border space-y-5 transition-all my-auto max-h-[92vh] overflow-y-auto ${
          preferencias.altoContraste
            ? 'bg-[#0f172a] border-amber-400 text-slate-100'
            : preferencias.modoOscuro
            ? 'bg-[#18162e] border-purple-800 text-white'
            : 'bg-white border-purple-100 text-[#2b2466]'
        }`}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md">
              ♿
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">Centro de Inclusión & Accesibilidad</h3>
              <p className="text-xs opacity-75 font-medium">Ajustes visuales, auditivos y cognitivos 100% funcionales</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 text-purple-900 dark:text-purple-200 font-black flex items-center justify-center text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 1. SELECCIÓN DE TEMA & CONTRASTE */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider opacity-80 flex items-center gap-1.5">
            <span>🎨</span>
            <span>Tema y Contraste Visual Agradable</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Modo Claro */}
            <button
              type="button"
              onClick={() => handleToggleOscuro(false)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                !preferencias.modoOscuro && !preferencias.altoContraste
                  ? 'bg-purple-50 border-purple-600 text-purple-950 font-black shadow-md ring-2 ring-purple-400'
                  : 'bg-white/5 border-purple-200 dark:border-purple-800 hover:bg-purple-50/50'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold">Modo Claro</span>
            </button>

            {/* Modo Oscuro */}
            <button
              type="button"
              onClick={() => handleToggleOscuro(true)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                preferencias.modoOscuro && !preferencias.altoContraste
                  ? 'bg-purple-950/80 border-purple-400 text-white font-black shadow-md ring-2 ring-purple-400'
                  : 'bg-white/5 border-purple-200 dark:border-purple-800 hover:bg-purple-900/30'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold">Modo Oscuro</span>
            </button>

            {/* Alto Contraste Agradable */}
            <button
              type="button"
              onClick={handleToggleAltoContraste}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                preferencias.altoContraste
                  ? 'bg-slate-900 border-amber-400 text-amber-300 font-black shadow-md ring-2 ring-amber-400'
                  : 'bg-white/5 border-purple-200 dark:border-purple-800 hover:bg-amber-400/10'
              }`}
            >
              <Eye className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold">Alto Contraste</span>
            </button>
          </div>
        </div>


        {/* 2. TAMAÑO DE TEXTO (ESCALA REAL) */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider opacity-80 flex items-center gap-1.5">
            <Type className="w-4 h-4" />
            <span>Tamaño de Texto y Letra</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal', label: 'Normal (100%)', letra: 'A' },
              { id: 'grande', label: 'Grande (115%)', letra: 'A+' },
              { id: 'muy-grande', label: 'Enorme (130%)', letra: 'A++' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleCambiarTamano(t.id as any)}
                className={`p-2.5 rounded-xl border-2 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  preferencias.tamanoTexto === t.id
                    ? 'bg-purple-600 text-white border-purple-600 font-black shadow-md'
                    : 'bg-purple-50/50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 hover:bg-purple-100'
                }`}
              >
                <span className="text-sm font-black">{t.letra}</span>
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. LECTURA Y DISLEXIA */}
        <div className="space-y-2.5 pt-1 border-t border-purple-500/10">
          <label className="text-xs font-black uppercase tracking-wider opacity-80 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Comprensión Lectora y Dislexia</span>
          </label>

          {/* Toggle Fuente Dislexia */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <div>
              <p className="font-extrabold text-xs">Fuente Especial para Dislexia</p>
              <p className="text-[11px] opacity-75">Mayor espaciado y peso en la base para evitar confusiones de letras</p>
            </div>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                const nuevo = !preferencias.fuenteDislexia;
                onActualizarPreferencias({ fuenteDislexia: nuevo });
                soundManager.speakText(nuevo ? 'Fuente para dislexia activada.' : 'Fuente estándar activada.');
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                preferencias.fuenteDislexia ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white block absolute top-0.5 transition-transform ${
                  preferencias.fuenteDislexia ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Toggle Regla Guía de Lectura */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <div>
              <p className="font-extrabold text-xs">Regla Guía de Lectura (TDAH)</p>
              <p className="text-[11px] opacity-75">Franja horizontal dorada que acompaña el ratón para no perder el renglón</p>
            </div>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                const nuevo = !preferencias.reglaGuiaLectura;
                onActualizarPreferencias({ reglaGuiaLectura: nuevo });
                soundManager.speakText(nuevo ? 'Regla de lectura activada.' : 'Regla de lectura desactivada.');
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                preferencias.reglaGuiaLectura ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white block absolute top-0.5 transition-transform ${
                  preferencias.reglaGuiaLectura ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 4. ASISTENCIA DE VOZ & LECTOR AL CURSOR */}
        <div className="space-y-2.5 pt-1 border-t border-purple-500/10">
          <label className="text-xs font-black uppercase tracking-wider opacity-80 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" />
            <span>Asistencia por Voz de Lumy</span>
          </label>

          {/* Lector al cursor */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <div>
              <p className="font-extrabold text-xs">Lector de Pantalla al Tocar o Pasar el Ratón</p>
              <p className="text-[11px] opacity-75">Lumy lee en voz alta los botones o textos que toques en pantalla</p>
            </div>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                const nuevo = !preferencias.lectorCursor;
                onActualizarPreferencias({ lectorCursor: nuevo });
                soundManager.lectorCursorActivo = nuevo;
                soundManager.speakText(nuevo ? 'Lector de cursor activado.' : 'Lector de cursor desactivado.');
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                preferencias.lectorCursor ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white block absolute top-0.5 transition-transform ${
                  preferencias.lectorCursor ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Velocidad de voz de Lumy */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <div>
              <p className="font-extrabold text-xs">Ritmo de Voz de Lumy</p>
              <p className="text-[11px] opacity-75">Elige la velocidad más cómoda para tu procesamiento auditivo</p>
            </div>
            <div className="flex gap-1">
              {[
                { id: 'lenta', label: 'Pausada' },
                { id: 'normal', label: 'Normal' },
                { id: 'rapida', label: 'Rápida' }
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleCambiarVelocidadVoz(v.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    preferencias.velocidadVoz === v.id
                      ? 'bg-purple-600 text-white font-black'
                      : 'bg-white dark:bg-purple-900/60 hover:bg-purple-100 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. MODO CALMO (REDUCCIÓN DE MOVIMIENTO) */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
          <div>
            <p className="font-extrabold text-xs flex items-center gap-1">
              <ZapOff className="w-3.5 h-3.5" />
              <span>Modo Calmo (Reducción de Movimiento)</span>
            </p>
            <p className="text-[11px] opacity-75">Desactiva giros, animaciones rápidas y confeti para evitar fatiga visual</p>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              const nuevo = !preferencias.movimientoReducido;
              onActualizarPreferencias({ movimientoReducido: nuevo });
              soundManager.speakText(nuevo ? 'Modo calmo activado.' : 'Modo calmo desactivado.');
            }}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              preferencias.movimientoReducido ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white block absolute top-0.5 transition-transform ${
                preferencias.movimientoReducido ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-purple-500/10">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleProbarVoz}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Probar Voz de Lumy</span>
            </button>
            {onRestablecer && (
              <button
                type="button"
                onClick={onRestablecer}
                className="px-3 py-2 bg-slate-100 dark:bg-purple-900/40 hover:bg-slate-200 text-slate-700 dark:text-purple-200 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restablecer</span>
              </button>
            )}
          </div>

          <button
            onClick={onCerrar}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs rounded-full shadow-md cursor-pointer transition-all"
          >
            Guardar y Regresar
          </button>
        </div>
      </div>
    </div>
  );
};
