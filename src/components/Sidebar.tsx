import React from 'react';
import {
  Home, Target, Palette, Trophy, User, BarChart3, Users, Award, Calendar,
  AlertTriangle, LogOut, Star, Smile, GraduationCap, Rocket, Cat, Dog,
  Heart, Sparkles, Flower2, Sun, LucideIcon
} from 'lucide-react';
import { Usuario } from '../types';
import { soundManager } from '../utils/audio';

interface SidebarProps {
  rutaActual: string;
  onNavegar: (ruta: string) => void;
  usuario: Usuario;
  onAbrirAccesibilidad: () => void;
  onLogout: () => void;
  modoOscuro?: boolean;
}

// Avatares como iconos (no dependen de que el dispositivo tenga fuente de emojis).
// Si usuario.avatar coincide con una de estas claves se muestra ese icono;
// en cualquier otro caso (incluido un emoji guardado antes) se usa el icono por defecto.
const AVATAR_ICONOS: Record<string, LucideIcon> = {
  sonrisa: Smile,
  estrella: Star,
  cohete: Rocket,
  gato: Cat,
  perro: Dog,
  corazon: Heart,
  brillo: Sparkles,
  flor: Flower2,
  sol: Sun,
};

const AvatarIcono: React.FC<{ avatar?: string; porDefecto: LucideIcon; className?: string }> = ({
  avatar,
  porDefecto,
  className = 'w-5 h-5'
}) => {
  const Icono = (avatar && AVATAR_ICONOS[avatar]) || porDefecto;
  return <Icono className={className} aria-hidden="true" />;
};

export const Sidebar: React.FC<SidebarProps> = ({
  rutaActual,
  onNavegar,
  usuario,
  onLogout
}) => {
  const esDocente = usuario.rol === 'docente';

  // Menús sin duplicación y separados estrictamente por rol
  const menuItemsEstudiante = [
    { id: 'inicio', label: 'Inicio', icon: Home, desc: 'Panel de exploración' },
    { id: 'actividades', label: 'Mis Retos', icon: Target, desc: 'Misiones y juegos visuales' },
    { id: 'estadisticas', label: 'Estadísticas & Diploma', icon: BarChart3, desc: 'Mis talentos y diploma oficial' },
    { id: 'estudio', label: 'Mini-Estudio', icon: Palette, desc: 'Dibuja y xilófono' },
    { id: 'logros', label: 'Mis Logros', icon: Trophy, desc: 'Medallas para la familia' },
    { id: 'perfil', label: 'Mi Perfil', icon: User, desc: 'Avatar y apodo' },
  ];

  const menuItemsDocente = [
    { id: 'estudiantes', label: 'Alumnos', icon: Users, desc: 'Lista y claves secretas' },
    { id: 'entregas', label: 'Evaluar Entregas', icon: Award, desc: 'Revisión y feedback' },
    { id: 'actividades', label: 'Retos & Asignaciones', icon: Calendar, desc: 'Misiones creadas' },
    { id: 'alertas', label: 'Alertas Convivencia', icon: AlertTriangle, desc: 'Seguridad escolar' },
  ];

  const menuItems = esDocente ? menuItemsDocente : menuItemsEstudiante;

  const handleNav = (id: string) => {
    soundManager.playClick();
    onNavegar(id);
  };

  return (
    <aside className="w-64 bg-white/90 dark:bg-[#18162e]/95 backdrop-blur-md border-r border-purple-100 dark:border-purple-900/50 flex flex-col justify-between p-4 shadow-sm h-screen sticky top-0 shrink-0 z-20 transition-colors">
      <div>
        {/* Brand Logo: LUM (Único lugar donde aparece el logo) */}
        <div
          onClick={() => handleNav(esDocente ? 'estudiantes' : 'inicio')}
          className="flex items-center gap-3 px-3 py-3 mb-6 rounded-2xl hover:bg-purple-50/80 dark:hover:bg-purple-950/40 transition-colors cursor-pointer group"
        >
        <img
  src="src/assets/images/icon.png"
  alt="Logo de LUM"
  className="w-12 h-12 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
/>
          <div>
            <h1 className="font-black text-2xl leading-none text-[#2b2466] dark:text-purple-100 tracking-tight">
              LUM
            </h1>
            <p className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider mt-0.5">
              {esDocente ? 'Portal Docente' : 'Portal Estudiante'}
            </p>
          </div>
        </div>

        {/* Menú de Navegación Ordenado */}
        <nav className="flex flex-col gap-1.5" aria-label="Navegación principal">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const activo = rutaActual === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-bold text-sm transition-all text-left cursor-pointer group ${
                  activo
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 translate-x-1'
                    : 'text-[#2b2466]/80 dark:text-purple-200/80 hover:bg-purple-50/80 dark:hover:bg-purple-950/40 hover:text-purple-800 dark:hover:text-white'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    activo
                      ? 'bg-white/20 text-white'
                      : 'text-purple-600 dark:text-purple-300 bg-purple-100/60 dark:bg-purple-950/60 group-hover:bg-purple-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="leading-none">{item.label}</div>
                  <div
                    className={`text-[11px] font-normal truncate mt-0.5 ${
                      activo ? 'text-purple-100' : 'text-slate-400 dark:text-purple-400/60'
                    }`}
                  >
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Zona Inferior: Datos del Usuario + Cerrar Sesión */}
      <div className="pt-4 border-t border-purple-100 dark:border-purple-900/50 flex flex-col gap-2.5">
        {!esDocente && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-200/70 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <AvatarIcono avatar={usuario.avatar} porDefecto={Smile} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  @{usuario.alias}
                </p>
                <p className="flex items-center gap-1 text-sm font-black text-amber-900 dark:text-amber-200">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" aria-hidden="true" />
                  {usuario.estrellas || 0} pts
                </p>
              </div>
            </div>
            <div className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">
              {usuario.progreso}%
            </div>
          </div>
        )}

        {esDocente && (
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900/50 flex items-center gap-2.5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-purple-200 dark:bg-purple-900 text-purple-700 dark:text-purple-200 flex items-center justify-center shrink-0">
              <AvatarIcono avatar={usuario.avatar} porDefecto={GraduationCap} />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="font-extrabold text-xs text-purple-900 dark:text-purple-100 truncate">
                {usuario.nombre || 'Docente'}
              </p>
              <p className="text-[10px] font-bold text-purple-600 dark:text-purple-300">
                Coordinación de Aula
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            soundManager.playClick();
            onLogout();
          }}
          className="flex items-center gap-2.5 p-2 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 ml-1.5" aria-hidden="true" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};