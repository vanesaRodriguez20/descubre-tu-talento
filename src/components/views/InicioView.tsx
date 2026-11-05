import React, { useState } from 'react';
import { Actividad, CategoriaTalento, PreferenciasAccesibilidadFrontend, Usuario } from '../../types';
import { StudentHomeDashboard } from './StudentHomeDashboard';
import { MathSimulators } from '../MathSimulators';
import { ACTIVIDADES_INICIALES } from '../../data/initialData';

interface InicioViewProps {
  usuario: Usuario;
  onNavegar: (ruta: string, categoria?: CategoriaTalento | 'todas') => void;
  onAbrirTest: () => void;
  onAbrirLienzo: () => void;
  onAbrirAccesibilidad?: () => void;
  actividades?: Actividad[];
  preferenciasAccesibilidad?: PreferenciasAccesibilidadFrontend;
  onEnviarEntrega?: (idActividad: number, respuesta: string, reaccion?: string) => void;
}

export const InicioView: React.FC<InicioViewProps> = ({
  usuario,
  onNavegar,
  onAbrirTest,
  onAbrirLienzo,
  onAbrirAccesibilidad = () => {},
  actividades = ACTIVIDADES_INICIALES,
  preferenciasAccesibilidad = {
    modoOscuro: false,
    altoContraste: false,
    tamanoTexto: 'normal',
    fuenteDislexia: false,
    lectorCursor: false,
    reglaGuiaLectura: false,
    movimientoReducido: false,
    velocidadVoz: 'normal'
  },
  onEnviarEntrega
}) => {
  const [actividadSimulador, setActividadSimulador] = useState<Actividad | null>(null);

  const handleAbrirSimulador = (actividad: Actividad) => {
    if (actividad.tipoInteractivo) {
      setActividadSimulador(actividad);
    } else {
      onNavegar('actividades', actividad.categoria);
    }
  };

  return (
    <>
      <StudentHomeDashboard
        usuario={usuario}
        actividades={actividades}
        onNavegar={onNavegar}
        onAbrirSimulador={handleAbrirSimulador}
        onAbrirTest={onAbrirTest}
        onAbrirLienzo={onAbrirLienzo}
        onAbrirAccesibilidad={onAbrirAccesibilidad}
        preferenciasAccesibilidad={preferenciasAccesibilidad}
      />

      {/* Modal Interactivo si se pulsa 'Resolver' o 'Jugar' desde el inicio */}
      {actividadSimulador && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/50 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#1a1733] rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-purple-100 dark:border-purple-800 space-y-4 max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-purple-50 dark:border-purple-900 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-purple-100 dark:bg-purple-900/60 rounded-2xl">
                  {actividadSimulador.icono || '🎯'}
                </span>
                <div>
                  <h3 className="font-extrabold text-lg text-[#2b2466] dark:text-purple-100 leading-tight">
                    {actividadSimulador.titulo}
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">
                    {actividadSimulador.descripcion}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActividadSimulador(null)}
                className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/60 hover:bg-purple-100 text-purple-900 dark:text-purple-200 font-bold flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <MathSimulators
              tipo={actividadSimulador.tipoInteractivo || 'general'}
              onSimulacionCompletada={(exp: string) => {
                if (onEnviarEntrega) {
                  onEnviarEntrega(actividadSimulador.id, exp, actividadSimulador.icono || '⭐');
                }
                setActividadSimulador(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
