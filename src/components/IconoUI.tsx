import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Star,
  Sparkles,
  Rocket,
  Apple,
  Fish,
  Pizza,
  Scale,
  Hexagon,
  Ruler,
  Coins,
  Palette,
  Music,
  Trophy,
  HeartHandshake,
  Lightbulb,
  Gamepad2
} from 'lucide-react';

    

// Aquí le decimos a la app: "cuando veas este nombre (o este emoji), dibuja este icono".
const MAPA_BASE: Record<string, LucideIcon> = {
  // Tipos de actividad
  fracciones: Pizza,
  balanza: Scale,
  patrones: Hexagon,
  geometria: Ruler,
  presupuesto: Coins,
  lienzo: Palette,
  xilofono: Music,
  deporte: Trophy,
  amabilidad: HeartHandshake,

  // PIN visual (ids)
  estrella: Star,
  cohete: Rocket,
  manzana: Apple,
  delfin: Fish,

  // Emojis que todavía viven en tus datos (initialData, utils...)
  '🍕': Pizza,
  '⚖️': Scale,
  '🔷': Hexagon,
  '📐': Ruler,
  '💰': Coins,
  '🎨': Palette,
  '🎵': Music,
  '⚽': Trophy,
  '🤝': HeartHandshake,
  '⭐': Star,
  '🌟': Sparkles,
  '💡': Lightbulb,
  '🎮': Gamepad2,
  '🚀': Rocket,
  '🍎': Apple,
  '🐬': Fish
};

// Los emojis a veces traen un caracter invisible (U+FE0F). Lo quitamos para comparar bien.
const limpiar = (texto: string) => texto.replace(/\uFE0F/g, '');

const MAPA: Record<string, LucideIcon> = Object.fromEntries(
  Object.entries(MAPA_BASE).map(([clave, icono]) => [limpiar(clave), icono])
);

const buscarIcono = (nombre?: string): LucideIcon | undefined =>
  nombre ? MAPA[limpiar(nombre)] : undefined;

// ---------------------------------------------------------------
// IconoUI: dibuja un icono a partir de un nombre o de un emoji.
// Uso:  <IconoUI nombre="fracciones" className="w-5 h-5" />
//       <IconoUI nombre={act.icono} />
// ---------------------------------------------------------------
interface IconoUIProps {
  nombre?: string;
  alterno?: string; // segundo intento si "nombre" no se reconoce
  className?: string;
  fallback?: LucideIcon;
}

export const IconoUI: React.FC<IconoUIProps> = ({
  nombre,
  alterno,
  className = 'w-5 h-5',
  fallback: Fallback = Sparkles
}) => {
  const Icono = buscarIcono(nombre) || buscarIcono(alterno) || Fallback;
  return <Icono className={className} aria-hidden="true" />;
};

// ---------------------------------------------------------------
// AvatarUI: círculo de color con la inicial del alias.
// Si el avatar es un emoji conocido, usa su icono.
// Así cada niño sigue teniendo "su" avatar sin descargar imágenes.
// ---------------------------------------------------------------
const COLORES_AVATAR = [
  'bg-purple-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-pink-500',
  'bg-sky-500',
  'bg-orange-500',
  'bg-indigo-500',
  'bg-rose-500'
];

const colorPorTexto = (texto: string) => {
  let suma = 0;
  for (let i = 0; i < texto.length; i++) suma += texto.charCodeAt(i);
  return COLORES_AVATAR[suma % COLORES_AVATAR.length];
};

interface AvatarUIProps {
  avatar?: string;
  alias: string;
  className?: string; // tamaño del círculo, ej: "w-10 h-10"
}

export const AvatarUI: React.FC<AvatarUIProps> = ({ avatar, alias, className = 'w-10 h-10' }) => {
  const Icono = buscarIcono(avatar);
  const inicial = (alias || '?').charAt(0).toUpperCase();
  // El color depende del avatar (o del alias si no hay avatar), para que sea estable.
  const color = colorPorTexto(avatar || alias);

  return (
    <span
      className={`${className} ${color} rounded-xl flex items-center justify-center text-white font-black shrink-0`}
      aria-hidden="true"
    >
      {Icono ? <Icono className="w-1/2 h-1/2" /> : inicial}
    </span>
  );
};
