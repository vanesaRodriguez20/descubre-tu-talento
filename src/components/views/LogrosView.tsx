import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Lock, Sparkles, CheckCircle, Printer, Star, Download } from 'lucide-react';
import { Logro, Usuario } from '../../types';
import { soundManager } from '../../utils/audio';

interface LogrosViewProps {
  usuario: Usuario | null;
  logros: Logro[];
}

export const LogrosView: React.FC<LogrosViewProps> = ({ usuario, logros }) => {
  const [mostrarCertificado, setMostrarCertificado] = useState(false);
  const progreso = usuario ? usuario.progreso : 0;
  const nombre = usuario ? usuario.nombre : 'Estudiante Aventurero';

  const logrosCalculados = logros.map((l) => ({
    ...l,
    desbloqueado: progreso >= l.progresoRequerido
  }));

  const desbloqueadosCount = logrosCalculados.filter(l => l.desbloqueado).length;

  const abrirDiploma = () => {
    soundManager.playAchievementFanfare();
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
    setMostrarCertificado(true);
  };

  const imprimirDiploma = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2b2466] tracking-tight">
            Tus Medallas y Logros 🏆
          </h2>
          <p className="text-xs sm:text-sm text-purple-700 font-medium">
            Has desbloqueado <span className="font-extrabold text-purple-900">{desbloqueadosCount} de {logros.length}</span> trofeos mágicos
          </p>
        </div>

        <button
          onClick={abrirDiploma}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-purple-950 font-black text-xs rounded-full shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto transition-transform hover:scale-102"
        >
          <Award className="w-4 h-4 text-purple-900" />
          <span>Ver Mi Diploma Oficial</span>
        </button>
      </div>

      {/* Grid de Logros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {logrosCalculados.map((logro) => {
          const ok = logro.desbloqueado;
          return (
            <div
              key={logro.id}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4 min-h-[180px] ${
                ok
                  ? 'bg-white border-amber-300 shadow-md shadow-amber-500/5 hover:-translate-y-1'
                  : 'bg-white/80 border-purple-100 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm ${
                    ok
                      ? 'bg-gradient-to-tr from-amber-300 to-yellow-100 text-amber-900 ring-2 ring-amber-300'
                      : 'bg-purple-100/70 text-purple-400'
                  }`}
                >
                  {ok ? logro.icono : <Lock className="w-6 h-6 text-purple-400" />}
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      ok ? 'text-amber-800' : 'text-purple-400'
                    }`}>
                      Nivel {logro.progresoRequerido}%
                    </span>
                    {ok ? (
                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>¡Logrado!</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">
                        Bloqueado
                      </span>
                    )}
                  </div>
                  <h3 className={`font-extrabold text-base leading-snug ${
                    ok ? 'text-[#2b2466]' : 'text-slate-600'
                  }`}>
                    {logro.titulo}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {logro.descripcion}
                  </p>
                </div>
              </div>

              {/* Barra de progreso de logro */}
              <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>{ok ? 'Medalla activa' : `Faltan ${Math.max(0, logro.progresoRequerido - progreso)}%`}</span>
                <span className={ok ? 'text-amber-600' : 'text-slate-400'}>
                  {progreso >= logro.progresoRequerido ? '100%' : `${Math.round((progreso / logro.progresoRequerido) * 100)}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Diploma Oficial */}
      {mostrarCertificado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border-4 border-amber-300 space-y-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setMostrarCertificado(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold flex items-center justify-center cursor-pointer text-sm"
            >
              ✕
            </button>

            {/* Certificado con Borde Ornamentado */}
            <div className="border-4 border-double border-amber-400 rounded-2xl p-6 sm:p-8 text-center space-y-4 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/40">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center text-3xl shadow-md">
                ⭐
              </div>

              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-amber-800">
                  República de los Talentos · Certificado Oficial
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
                  DIPLOMA DE PEQUEÑO EXPLORADOR
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Se otorga este reconocimiento especial con honores a:
              </p>

              <div className="py-2">
                <h4 className="text-3xl sm:text-4xl font-black text-purple-700 underline decoration-amber-300 decoration-wavy decoration-2">
                  {nombre}
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-md mx-auto leading-relaxed">
                Por su entusiasmo, curiosidad y dedicación al completar retos y descubrir sus talentos únicos en arte, ciencia, deporte y empatía, alcanzando un progreso del{' '}
                <strong className="text-purple-900 font-extrabold">{progreso}%</strong>.
              </p>

              <div className="pt-6 flex items-center justify-around border-t border-amber-200 text-xs font-bold text-slate-600">
                <div className="text-center">
                  <p className="text-base">🤖</p>
                  <p className="font-extrabold text-purple-900">Toby Robot</p>
                  <p className="text-[10px] text-slate-400">Guía de Talentos</p>
                </div>
                <div className="text-center">
                  <p className="text-base">👩‍🏫</p>
                  <p className="font-extrabold text-purple-900">Comité Pedagógico</p>
                  <p className="text-[10px] text-slate-400">Descubre tu Talento</p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={imprimirDiploma}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-full shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Diploma</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
