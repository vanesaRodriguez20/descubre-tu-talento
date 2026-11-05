import React, { useState } from 'react';
import { User, Award, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { AVATARES_DISPONIBLES } from '../../data/initialData';
import { Actividad, Usuario } from '../../types';
import { calcularAfinidadDinamica } from '../../utils/talentDiscovery';
import { soundManager } from '../../utils/audio';

interface PerfilViewProps {
  usuario: Usuario | null;
  todasLasActividades: Actividad[];
  onActualizarAvatar: (nuevoAvatar: string) => void;
  onReiniciarProgreso: () => void;
}

export const PerfilView: React.FC<PerfilViewProps> = ({
  usuario,
  todasLasActividades,
  onActualizarAvatar
}) => {
  const [modalAvatarAbierto, setModalAvatarAbierto] = useState(false);

  if (!usuario) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border border-purple-100">
        <p className="text-sm font-bold text-slate-600">Por favor inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  const esDocente = usuario.rol === 'docente';
  const completadas = todasLasActividades.filter((a) =>
    usuario.actividadesCompletadas?.includes(a.id)
  );

  // Afinidad dinámica emergente
  const afinidadInfo = calcularAfinidadDinamica(usuario.actividadesCompletadas, todasLasActividades);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header del Perfil: Solo Alias para el alumno */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left relative overflow-hidden">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center text-5xl shadow-xl shadow-purple-500/20 ring-4 ring-white">
            {usuario.avatar}
          </div>
          <button
            onClick={() => setModalAvatarAbierto(true)}
            className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-white hover:bg-purple-50 text-[10px] font-extrabold text-purple-700 rounded-full shadow-md border border-purple-100 cursor-pointer"
          >
            Cambiar
          </button>
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2b2466]">
              {esDocente ? usuario.nombre : `@${usuario.alias}`}
            </h2>
            <span className="px-3 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800">
              {esDocente ? '👩‍🏫 Docente' : '🌟 Alumno'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-purple-700 font-semibold">
            {esDocente ? 'Coordinación Pedagógica' : usuario.apodo || 'Explorador LUM'}
          </p>

          <p className="text-xs text-slate-500 font-medium">
            {usuario.progreso}% completado · {completadas.length} retos superados · {usuario.estrellas || 0} ⭐ estrellas
          </p>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-3xl sm:text-4xl font-black text-purple-700">{usuario.progreso}%</div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progreso General</p>
        </div>
      </div>

      {/* Tarjeta de Afinidad Dinámica Descubierta */}
      {!esDocente && (
        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-3xl border border-amber-200 shadow-sm flex items-center gap-4">
          <span className="text-4xl p-3 bg-white rounded-2xl shadow-xs">{afinidadInfo.icono}</span>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider bg-amber-200/70 px-2.5 py-0.5 rounded-full">
              Superpoder Emergente
            </span>
            <h3 className="text-lg font-black text-amber-950">{afinidadInfo.tituloTalento}</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">{afinidadInfo.explicacion}</p>
          </div>
        </div>
      )}

      {/* Modal para Cambiar Avatar */}
      {modalAvatarAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-purple-100 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-purple-50 pb-2">
              <h3 className="font-black text-base text-[#2b2466]">Elige tu Avatar Mágico</h3>
              <button
                onClick={() => setModalAvatarAbierto(false)}
                className="w-7 h-7 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5 pt-2">
              {AVATARES_DISPONIBLES.map((av) => (
                <button
                  key={av.id}
                  onClick={() => {
                    soundManager.playClick();
                    onActualizarAvatar(av.emoji);
                    setModalAvatarAbierto(false);
                  }}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-3xl transition-transform hover:scale-110 cursor-pointer ${
                    usuario.avatar === av.emoji
                      ? 'bg-purple-100 border-purple-400 shadow-xs'
                      : 'bg-purple-50/50 border-purple-100 hover:bg-purple-100'
                  }`}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
