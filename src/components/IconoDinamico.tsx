import React from 'react';
import {
  Smile, Star, Rocket, Cat, Dog, Heart, Sparkles, Flower2, Sun, Pizza, Shapes,
  Puzzle, Scale, Ruler, Palette, Music, Brain, Target, Trophy, Calculator,
  BookOpen, GraduationCap, LucideIcon
} from 'lucide-react';

// Traduce un valor guardado en los datos (clave de texto o emoji heredado)
// a un icono lucide, para que se vea igual en cualquier dispositivo.
const ICONOS: Record<string, LucideIcon> = {
  // Claves de texto (recomendado guardar estas)
  sonrisa: Smile,
  estrella: Star,
  cohete: Rocket,
  gato: Cat,
  perro: Dog,
  corazon: Heart,
  brillo: Sparkles,
  flor: Flower2,
  sol: Sun,
  pizza: Pizza,
  figuras: Shapes,
  puzzle: Puzzle,
  balanza: Scale,
  regla: Ruler,
  paleta: Palette,
  musica: Music,
  cerebro: Brain,
  diana: Target,
  trofeo: Trophy,
  calculadora: Calculator,
  libro: BookOpen,
  docente: GraduationCap,

  // Emojis heredados que ya pueden estar guardados
  '⭐': Star, '🌟': Star, '🍕': Pizza, '🔷': Shapes, '🚀': Rocket,
  '🐱': Cat, '🐶': Dog, '❤': Heart, '✨': Sparkles, '🌸': Flower2,
  '☀': Sun, '👧': Smile, '👦': Smile, '🧩': Puzzle, '⚖': Scale,
  '📐': Ruler, '🎨': Palette, '🎵': Music, '🧠': Brain, '🎯': Target,
  '🏆': Trophy, '🔢': Calculator, '📚': BookOpen, '👩‍🏫': GraduationCap,
};

interface IconoDinamicoProps {
  valor?: string | null;
  porDefecto: LucideIcon;
  className?: string;
}

export const IconoDinamico: React.FC<IconoDinamicoProps> = ({
  valor,
  porDefecto,
  className = 'w-5 h-5'
}) => {
  const clave = (valor || '').replace(/\uFE0F/g, '').trim();
  const Icono = ICONOS[clave] || ICONOS[clave.toLowerCase()] || porDefecto;
  return <Icono className={className} aria-hidden="true" />;
};