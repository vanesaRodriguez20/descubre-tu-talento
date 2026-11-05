import { Actividad, AfinidadTalento, CategoriaTalento } from '../types';

/**
 * Calcula dinámicamente el área de afinidad o talento del estudiante
 * conforme completa actividades en la plataforma.
 * No se asigna de antemano; se descubre progresivamente con sus elecciones.
 */
export function calcularAfinidadDinamica(
  actividadesCompletadasIds: number[],
  todasLasActividades: Actividad[]
): {
  afinidad: AfinidadTalento;
  tituloTalento: string;
  icono: string;
  explicacion: string;
} {
  if (!actividadesCompletadasIds || actividadesCompletadasIds.length === 0) {
    return {
      afinidad: 'descubriendo',
      tituloTalento: 'Descubriendo tu Superpoder...',
      icono: '🌱',
      explicacion: 'Completa tus primeras actividades para que Lumy detecte en qué área brillas con más fuerza.'
    };
  }

  // Contabilizar categorías de las actividades completadas
  const conteo: Record<CategoriaTalento, number> = {
    matematicas: 0,
    crear: 0,
    deporte: 0,
    aprender: 0,
    ayudar: 0
  };

  actividadesCompletadasIds.forEach((id) => {
    const act = todasLasActividades.find((a) => a.id === id);
    if (act && act.categoria) {
      conteo[act.categoria] = (conteo[act.categoria] || 0) + 1;
    }
  });

  // Encontrar la categoría con más actividades
  let categoriaTop: CategoriaTalento = 'matematicas';
  let maxConteo = -1;

  (Object.keys(conteo) as CategoriaTalento[]).forEach((cat) => {
    if (conteo[cat] > maxConteo) {
      maxConteo = conteo[cat];
      categoriaTop = cat;
    }
  });

  if (maxConteo === 0) {
    return {
      afinidad: 'descubriendo',
      tituloTalento: 'Descubriendo tu Superpoder...',
      icono: '🌱',
      explicacion: 'Sigue explorando actividades para revelar tu talento dominante.'
    };
  }

  const descripciones: Record<
    CategoriaTalento,
    { titulo: string; icono: string; explicacion: string }
  > = {
    matematicas: {
      titulo: 'Talento en Razonamiento Matemático & Lógica',
      icono: '🍕',
      explicacion: 'Tu mente comprende intuitivamente fracciones, balanzas y secuencias lógicas.'
    },
    crear: {
      titulo: 'Talento Creativo y Expresión Artística',
      icono: '🎨',
      explicacion: 'Te apasiona ilustrar, crear música con el xilófono y pensar fuera de la caja.'
    },
    deporte: {
      titulo: 'Talento de Coordinación y Movimiento Físico',
      icono: '⚽',
      explicacion: 'Aprendes mejor a través del movimiento, el juego activo y los reflejos.'
    },
    aprender: {
      titulo: 'Talento Científico y Curiosidad Investigadora',
      icono: '🔬',
      explicacion: 'Haces preguntas profundas y te encanta descubrir el porqué de las cosas.'
    },
    ayudar: {
      titulo: 'Talento Empático y Cooperación Social',
      icono: '🤝',
      explicacion: 'Brillas compartiendo con tus compañeros y construyendo armonía en equipo.'
    }
  };

  const info = descripciones[categoriaTop];
  return {
    afinidad: categoriaTop,
    tituloTalento: info.titulo,
    icono: info.icono,
    explicacion: info.explicacion
  };
}
