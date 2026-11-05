import React, { useState } from 'react';
import { Search, Volume2, VolumeX, LogOut, Accessibility, GraduationCap } from 'lucide-react';
import { Usuario } from '../types';
import { soundManager } from '../utils/audio';
import { AvatarUI } from './IconoUI';

interface HeaderProps {
  usuarioActual: Usuario;
  onLogout: () => void;
  onAbrirAccesibilidad: () => void;
  onToggleModoOscuro?: () => void;
  busqueda: string;
  setBusqueda: (text: string) => void;
  onNavegar: (ruta: string) => void;
  modoOscuro?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  usuarioActual,
  onLogout,
  onAbrirAccesibilidad,
  busqueda,
  setBusqueda
}) => {
  const [sonidoActivo, setSonidoActivo] = useState(true);
  const esDocente = usuarioActual.rol === 'docente';

  const toggleSonido = () => {
    soundManager.enabled = !sonidoActivo;
    setSonidoActivo(!sonidoActivo);
    if (!sonidoActivo) {
      soundManager.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-8 py-3.5 bg-white/85 dark:bg-[#18162e]/90 backdrop-blur-md border-b border-purple-100 dark:border-purple-900/50 shadow-sm transition-colors">
      {/* 1. Zona de Búsqueda */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={
              esDocente
                ? 'Buscar alumnos por alias o entregas...'
                : 'Buscar retos o conceptos matemáticos...'
            }
            className="w-full pl-10 pr-4 py-2 bg-purple-50/70 dark:bg-purple-950/40 focus:bg-white dark:focus:bg-[#201d3d] text-sm rounded-full border border-purple-100 dark:border-purple-800 outline-none text-[#2b2466] dark:text-purple-100 placeholder:text-purple-300 transition-all font-medium"
          />
        </div>
      </div>

      {/* 2. Controles Ordenados de la Derecha */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Alternar Sonido */}
        <button
          onClick={toggleSonido}
          title={sonidoActivo ? 'Silenciar sonidos' : 'Activar sonidos'}
          className="p-2 text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/80 rounded-full border border-purple-200/60 dark:border-purple-800 transition-colors cursor-pointer"
          aria-label="Alternar sonido"
        >
          {sonidoActivo ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Botón Central de Accesibilidad Universal (Todo lo de accesibilidad se gestiona aquí) */}
        <button
          onClick={() => {
            soundManager.playClick();
            onAbrirAccesibilidad();
          }}
          title="Centro de Inclusión y Accesibilidad Universal"
          className="px-3 py-2 text-xs font-black rounded-full bg-purple-100/70 dark:bg-purple-950/70 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <Accessibility className="w-4 h-4" aria-hidden="true" />
          <span className="font-black">Accesibilidad</span>
        </button>

        {/* Cápsula de Usuario Limpia */}
        <div className="flex items-center gap-2.5 p-1.5 pr-2.5 bg-purple-50 dark:bg-purple-950/60 rounded-full border border-purple-200/60 dark:border-purple-800">
          {esDocente ? (
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-sm"
              aria-hidden="true"
            >
              <GraduationCap className="w-4 h-4" />
            </div>
          ) : (
            <AvatarUI
              avatar={usuarioActual.avatar}
              alias={usuarioActual.alias}
              className="w-8 h-8 text-sm rounded-full"
            />
          )}
          <div className="text-left hidden md:block leading-tight">
            <p className="text-xs font-extrabold text-[#2b2466] dark:text-purple-100 truncate max-w-[130px]">
              {esDocente ? usuarioActual.nombre : `@${usuarioActual.alias}`}
            </p>
            <p className="text-[10px] font-bold text-purple-600 dark:text-purple-300">
              {esDocente ? 'Docente' : usuarioActual.apodo || 'Alumno'}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onLogout();
            }}
            title="Cerrar Sesión y salir"
            aria-label="Cerrar sesión"
            className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-full transition-colors cursor-pointer ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};