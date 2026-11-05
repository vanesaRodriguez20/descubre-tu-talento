import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Award,
  Star,
  Printer,
  Volume2,
  CheckCircle2,
  Flame,
  Brain,
  Shield,
  Palette,
  Heart,
  TrendingUp,
  X
} from 'lucide-react';
import { Actividad, EntregaActividad, Usuario } from '../../types';
import { soundManager } from '../../utils/audio';

interface EstadisticasViewProps {
  usuario: Usuario;
  todasLasActividades: Actividad[];
  entregas: EntregaActividad[];
  modoOscuro?: boolean;
}

export const EstadisticasView: React.FC<EstadisticasViewProps> = ({
  usuario,
  todasLasActividades,
  entregas,
  modoOscuro = false
}) => {
  const [modalDiplomaAbierto, setModalDiplomaAbierto] = useState(false);
  const [leyendoDiploma, setLeyendoDiploma] = useState(false);

  // Estadísticas calculadas
  const misEntregas = entregas.filter((e) => e.idEstudiante === usuario.id);
  const entregasEvaluadas = misEntregas.filter((e) => e.estado === 'evaluada');
  const estrellasTotales = usuario.estrellas || 18;
  const actividadesHechas = usuario.actividadesCompletadas.length;
  const actividadesVisibles = todasLasActividades.filter((act) => {
    if (act.destinatarioTipo === 'especifico') {
      return Number(act.estudianteIdEspecifico) === Number(usuario.id);
    }
    return true;
  });
  const totalActividades = actividadesVisibles.length || 8;
  const porcentaje = Math.min(100, Math.round((actividadesHechas / Math.max(1, totalActividades)) * 100));

  // Título de honor según afinidad
  const getTituloHonorifico = () => {
    switch (usuario.categoriaTalento) {
      case 'matematicas':
        return 'Gran Maestra(o) de la Lógica & Fracciones Cósmicas 🌟';
      case 'crear':
        return 'Pintor(a) y Compositor(a) de las Estrellas 🎨';
      case 'deporte':
        return 'Atleta Astral de Alta Energía & Reflejos ⚡';
      case 'ayudar':
        return 'Guardián(a) Supremo de la Empatía y el Compañerismo 🤝';
      default:
        return 'Explorador(a) Cósmico Multitalento en Pleno Ascenso 🚀';
    }
  };

  const hablarEstadisticasLumy = () => {
    soundManager.playClick();
    soundManager.speakText(
      `¡Hola @${usuario.alias}! Tienes un avance del ${porcentaje} por ciento con ${estrellasTotales} estrellas ganadas. Tu superpoder principal es el pensamiento lógico y la perseverancia matemática. ¡Toca el botón para ver tu diploma oficial!`
    );
  };

  const abrirDiploma = () => {
    soundManager.playAchievementFanfare();
    setModalDiplomaAbierto(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const hablarDiplomaLumy = () => {
    setLeyendoDiploma(true);
    soundManager.playSuccessChime();
    soundManager.speakText(
      `¡Atención universo de LUM! Certificamos con inmenso orgullo que @${usuario.alias}, conocido como ${
        usuario.apodo || 'Explorador Astral'
      }, ha demostrado perseverancia, curiosidad y brillantez, obteniendo el título oficial de: ${getTituloHonorifico()}. ¡Felicidades por tus logros!`
    );
    setTimeout(() => setLeyendoDiploma(false), 7000);
  };

  const celebrarDiploma = () => {
    soundManager.playAchievementFanfare();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  const imprimirDiploma = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header con Lumy */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-700 to-amber-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-purple-950/15 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Muro de Talentos & Progreso Estudiantil</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Mis Estadísticas Galácticas 📊
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 font-medium max-w-xl leading-relaxed">
            Aquí ves cómo crecen tus habilidades día a día, cuántas misiones has conquistado y puedes generar tu <strong className="text-amber-300">Diploma Oficial Galáctico</strong> para compartirlo con tu familia.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={hablarEstadisticasLumy}
            className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-black flex items-center gap-2 backdrop-blur-md border border-white/30 cursor-pointer transition-transform hover:scale-105"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>Escuchar con Lumy</span>
          </button>

          <button
            onClick={abrirDiploma}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-purple-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-300/30 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <Award className="w-5 h-5 text-purple-950" />
            <span>Ver Mi Diploma Oficial ⭐</span>
          </button>
        </div>
      </div>

      {/* 2. Tarjetas de Métricas Clave */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1c1836] border border-purple-100 dark:border-purple-900/60 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center text-2xl shadow-inner">
            ⭐
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-purple-300 uppercase tracking-wider">
              Estrellas
            </p>
            <p className="text-2xl font-black text-[#2b2466] dark:text-white">
              {estrellasTotales} <span className="text-xs text-amber-500">pts</span>
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1c1836] border border-purple-100 dark:border-purple-900/60 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-2xl shadow-inner">
            🎯
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-purple-300 uppercase tracking-wider">
              Retos Resueltos
            </p>
            <p className="text-2xl font-black text-[#2b2466] dark:text-white">
              {actividadesHechas} <span className="text-xs text-slate-400">/ {totalActividades}</span>
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1c1836] border border-purple-100 dark:border-purple-900/60 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 flex items-center justify-center text-2xl shadow-inner">
            🔥
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-purple-300 uppercase tracking-wider">
              Racha Estelar
            </p>
            <p className="text-2xl font-black text-[#2b2466] dark:text-white">
              {Math.max(3, actividadesHechas)} <span className="text-xs text-orange-500">días</span>
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1c1836] border border-purple-100 dark:border-purple-900/60 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 flex items-center justify-center text-2xl shadow-inner">
            💖
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-purple-300 uppercase tracking-wider">
              Feedback Profe
            </p>
            <p className="text-2xl font-black text-[#2b2466] dark:text-white">
              {entregasEvaluadas.length} <span className="text-xs text-emerald-500">revisadas</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Banner del Diploma Oficial */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 text-purple-950 shadow-xl border-4 border-amber-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <span className="px-3 py-1 bg-purple-900 text-amber-300 rounded-full text-[11px] font-black uppercase tracking-wider">
            Reconocimiento Oficial LUM
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-purple-950">
            ¡Tu Diploma Galáctico está listo para ti! 🎓
          </h3>
          <p className="text-xs sm:text-sm font-bold text-purple-900/90 max-w-xl">
            Lumy y tu docente certifican tus descubrimientos y tu dedicación. Puedes abrirlo, escuchar la ceremonia oficial con la voz de Lumy e imprimirlo para decorar tu rincón de estudio.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={abrirDiploma}
            className="px-6 py-3.5 rounded-2xl bg-purple-950 hover:bg-purple-900 text-amber-300 font-black text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <span>✨ Abrir Mi Diploma</span>
            <Award className="w-5 h-5 text-amber-400" />
          </button>
        </div>

        {/* Estrellas de fondo decorativas */}
        <div className="absolute -right-8 -bottom-8 text-8xl opacity-20 pointer-events-none select-none">
          ⭐
        </div>
      </div>

      {/* 4. Desglose Cualitativo de Dimensiones & Habilidades */}
      <div className="bg-white dark:bg-[#1c1836] rounded-3xl border border-purple-100 dark:border-purple-900/60 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-purple-50 dark:border-purple-900/50 pb-4">
          <div>
            <h3 className="text-lg font-black text-[#2b2466] dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Mapa de Habilidades & Superpoderes de @{usuario.alias}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300 font-medium">
              Evaluación comprensiva dinámica basada en simuladores y perseverancia ante el error
            </p>
          </div>
          <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 text-xs font-black rounded-full border border-purple-200 dark:border-purple-800">
            {getTituloHonorifico()}
          </span>
        </div>

        <div className="space-y-5">
          {/* Habilidad 1: Pensamiento Lógico-Matemático */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                <span>🍕</span>
                <span>Pensamiento Lógico & Comprensión de Fracciones</span>
              </span>
              <span className="text-amber-700 dark:text-amber-300">85% · Nivel Avanzado</span>
            </div>
            <div className="w-full h-3 bg-amber-200/50 dark:bg-amber-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full w-[85%]" />
            </div>
            <p className="text-xs text-amber-950/80 dark:text-amber-200/80 font-medium leading-relaxed">
              Comprende el equilibrio de las ecuaciones como una balanza física y visualiza particiones de pizzas y figuras geométricas con agilidad.
            </p>
          </div>

          {/* Habilidad 2: Resiliencia Creativa */}
          <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-200/60 dark:border-pink-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="flex items-center gap-2 text-pink-900 dark:text-pink-200">
                <span>🎨</span>
                <span>Resiliencia & Curiosidad Creativa</span>
              </span>
              <span className="text-pink-700 dark:text-pink-300">90% · Nivel Destacado</span>
            </div>
            <div className="w-full h-3 bg-pink-200/50 dark:bg-pink-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full w-[90%]" />
            </div>
            <p className="text-xs text-pink-950/80 dark:text-pink-200/80 font-medium leading-relaxed">
              No teme equivocarse: cuando un reto es complejo, reintenta cambiando de táctica y expresa sus respuestas con entusiasmo visual.
            </p>
          </div>

          {/* Habilidad 3: Percepción Espacial & Geometría */}
          <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="flex items-center gap-2 text-sky-900 dark:text-sky-200">
                <span>📐</span>
                <span>Percepción Espacial & Geometría Visual</span>
              </span>
              <span className="text-sky-700 dark:text-sky-300">80% · Sólido</span>
            </div>
            <div className="w-full h-3 bg-sky-200/50 dark:bg-sky-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full w-[80%]" />
            </div>
            <p className="text-xs text-sky-950/80 dark:text-sky-200/80 font-medium leading-relaxed">
              Distingue fácilmente entre el borde de un patio (perímetro) y el césped interior (área), resolviendo retos espaciales paso a paso.
            </p>
          </div>

          {/* Habilidad 4: Empatía y Compañerismo */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                <span>🤝</span>
                <span>Cooperación, Empatía y Convivencia</span>
              </span>
              <span className="text-emerald-700 dark:text-emerald-300">85% · Muy Alto</span>
            </div>
            <div className="w-full h-3 bg-emerald-200/50 dark:bg-emerald-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full w-[85%]" />
            </div>
            <p className="text-xs text-emerald-950/80 dark:text-emerald-200/80 font-medium leading-relaxed">
              Participa con amabilidad en las dinámicas y comparte ánimos estelares con los demás compañeros del aula.
            </p>
          </div>
        </div>
      </div>

      {/* 5. MODAL DEL DIPLOMA OFICIAL GALÁCTICO */}
      {modalDiplomaAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="relative max-w-3xl w-full my-auto space-y-4">
            {/* Barra de Herramientas del Diploma */}
            <div className="flex items-center justify-between bg-purple-950/90 text-white px-5 py-3 rounded-2xl backdrop-blur-md border border-purple-800 print:hidden shadow-lg">
              <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Diploma Oficial de Talentos LUM</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={hablarDiplomaLumy}
                  disabled={leyendoDiploma}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform hover:scale-105"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{leyendoDiploma ? 'Lumy proclamando...' : 'Lumy: Proclamar Diploma'}</span>
                </button>

                <button
                  onClick={celebrarDiploma}
                  className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>🎉 Celebrar</span>
                </button>

                <button
                  onClick={imprimirDiploma}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir</span>
                </button>

                <button
                  onClick={() => setModalDiplomaAbierto(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-sm cursor-pointer ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CUERPO DEL DIPLOMA (ESTILIZADO PARA IMPRESIÓN Y PANTALLA) */}
            <div className="bg-[#fffdf7] text-[#2b2466] p-8 sm:p-12 rounded-3xl border-8 border-amber-400 shadow-2xl relative overflow-hidden space-y-6 text-center select-none ring-4 ring-amber-600/30">
              {/* Marco Interior de Estilo Pergamino Real */}
              <div className="absolute inset-3 border-2 border-dashed border-amber-300 rounded-2xl pointer-events-none" />

              {/* Decoraciones en Esquinas */}
              <div className="absolute top-4 left-4 text-2xl">⭐</div>
              <div className="absolute top-4 right-4 text-2xl">⭐</div>
              <div className="absolute bottom-4 left-4 text-2xl">🚀</div>
              <div className="absolute bottom-4 right-4 text-2xl">🌟</div>

              {/* Encabezado */}
              <div className="space-y-1 relative z-10">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 flex items-center justify-center text-3xl shadow-lg ring-4 ring-amber-200">
                  ⭐
                </div>
                <p className="text-[11px] font-black tracking-widest text-amber-800 uppercase mt-2">
                  República Galáctica del Aprendizaje · Plataforma LUM
                </p>
                <h2 className="text-2xl sm:text-4xl font-black text-purple-950 uppercase tracking-tight">
                  Diploma de Honor Cósmico
                </h2>
                <p className="text-xs sm:text-sm font-bold text-amber-700 italic">
                  Por el brillo de su curiosidad, razonamiento y perseverancia
                </p>
              </div>

              {/* Declaración */}
              <div className="space-y-3 relative z-10 max-w-lg mx-auto py-2">
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  El Consejo de Mentoría de LUM y la Asistente de Voz <strong>Lumy</strong> certifican con gran alegría y orgullo a:
                </p>

                {/* Nombre / Alias del Niño */}
                <div className="py-2.5 px-6 rounded-2xl bg-amber-50 border-2 border-amber-300 inline-block shadow-inner">
                  <div className="text-2xl sm:text-3xl font-black text-purple-900 flex items-center justify-center gap-2">
                    <span>{usuario.avatar}</span>
                    <span>@{usuario.alias}</span>
                  </div>
                  <p className="text-xs font-extrabold text-amber-800 mt-0.5">
                    "{usuario.apodo || 'Explorador Astral de Talentos'}"
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Quien ha superado con éxito las misiones estelares de comprensión conceptual, alcanzando con mérito sobresaliente el título de:
                </p>

                <div className="p-3 bg-gradient-to-r from-purple-900 to-indigo-900 text-amber-300 rounded-2xl shadow-md font-black text-sm sm:text-base border border-amber-300/40">
                  {getTituloHonorifico()}
                </div>
              </div>

              {/* Sellos y Firmas */}
              <div className="pt-6 border-t border-amber-200 grid grid-cols-3 items-end gap-4 relative z-10 text-center">
                {/* Firma Docente */}
                <div className="space-y-1">
                  <div className="h-9 flex items-center justify-center">
                    <span className="font-serif italic text-purple-900 font-black text-sm">
                      Prof. Laura Salcedo
                    </span>
                  </div>
                  <div className="w-28 mx-auto border-t border-slate-400" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Docente Mentora
                  </p>
                </div>

                {/* Sello de Oro de Lumy */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 border-4 border-amber-600 flex flex-col items-center justify-center shadow-lg text-purple-950 font-black relative animate-pulse-glow">
                    <span className="text-xl sm:text-2xl">⭐</span>
                    <span className="text-[8px] font-black uppercase tracking-tight">SELLO LUMY</span>
                  </div>
                  <span className="text-[9px] font-bold text-amber-900 mt-1">Certificado Oficial</span>
                </div>

                {/* Fecha y Asistente */}
                <div className="space-y-1">
                  <div className="h-9 flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-900">
                      {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="w-28 mx-auto border-t border-slate-400" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Emisión Galáctica
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
