import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginPortal } from './components/LoginPortal';
import { InicioView } from './components/views/InicioView';
import { ActividadesView } from './components/views/ActividadesView';
import { EstadisticasView } from './components/views/EstadisticasView';
import { MiniEstudioView } from './components/views/MiniEstudioView';
import { LogrosView } from './components/views/LogrosView';
import { PerfilView } from './components/views/PerfilView';
import { DocenteView } from './components/views/DocenteView';
import { LumyAssistant } from './components/LumyAssistant';
import { AccessibilityModal } from './components/AccessibilityModal';
import { ACTIVIDADES_INICIALES, ALERTAS_INICIALES, ENTREGAS_INICIALES, LOGROS_BASE, USUARIOS_INICIALES } from './data/initialData';
import { Actividad, AlertaSeguridad, CategoriaTalento, EntregaActividad, Logro, PreferenciasAccesibilidadFrontend, Usuario } from './types';
import { calcularAfinidadDinamica } from './utils/talentDiscovery';
import { soundManager } from './utils/audio';

export default function App() {
  // Lista de usuarios persistida en localStorage
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const guardado = localStorage.getItem('lum_usuarios');
    if (guardado) {
      try {
        return JSON.parse(guardado);
      } catch (e) {}
    }
    return USUARIOS_INICIALES;
  });

  // Sesión activa (null al principio para exigir login diferenciado)
  const [usuarioActualId, setUsuarioActualId] = useState<number | null>(() => {
    const sesion = localStorage.getItem('lum_usuario_sesion_id');
    return sesion ? Number(sesion) : null;
  });

  // Lista de actividades
  const [actividades, setActividades] = useState<Actividad[]>(() => {
    const guardado = localStorage.getItem('lum_actividades');
    if (guardado) {
      try {
        return JSON.parse(guardado);
      } catch (e) {}
    }
    return ACTIVIDADES_INICIALES;
  });

  // Lista de entregas y evaluaciones
  const [entregas, setEntregas] = useState<EntregaActividad[]>(() => {
    const guardado = localStorage.getItem('lum_entregas');
    if (guardado) {
      try {
        return JSON.parse(guardado);
      } catch (e) {}
    }
    return ENTREGAS_INICIALES;
  });

  // Lista de alertas de convivencia escolar de Lumy
  const [alertasSeguridad, setAlertasSeguridad] = useState<AlertaSeguridad[]>(() => {
    const guardado = localStorage.getItem('lum_alertas_seguridad');
    if (guardado) {
      try {
        return JSON.parse(guardado);
      } catch (e) {}
    }
    return ALERTAS_INICIALES;
  });

  // Lista de logros
  const [logros, setLogros] = useState<Logro[]>(() => {
    const guardado = localStorage.getItem('lum_logros');
    if (guardado) {
      try {
        return JSON.parse(guardado);
      } catch (e) {}
    }
    return LOGROS_BASE;
  });

  // UI state
  const [rutaActual, setRutaActual] = useState<string>('inicio');
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaTalento | 'todas'>('todas');
  const [busqueda, setBusqueda] = useState('');
  const [miniEstudioTab, setMiniEstudioTab] = useState<'lienzo' | 'test' | 'musica'>('lienzo');


  // Modal Accesibilidad
  const [modalAccesibilidad, setModalAccesibilidad] = useState(false);

  // Configuración de accesibilidad universal 100% funcional y persistida
  const [preferenciasAccesibilidad, setPreferenciasAccesibilidad] = useState<PreferenciasAccesibilidadFrontend>(() => {
    const guardado = localStorage.getItem('lum_preferencias_accesibilidad');
    if (guardado) {
      try {
        return JSON.parse(guardado);
      } catch (e) {}
    }
    return {
      modoOscuro: false,
      altoContraste: false,
      tamanoTexto: 'normal',
      fuenteDislexia: false,
      lectorCursor: false,
      reglaGuiaLectura: false,
      movimientoReducido: false,
      velocidadVoz: 'normal'
    };
  });

  // Seguimiento de posición Y del ratón para la regla guía de lectura (TDAH)
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    if (!preferenciasAccesibilidad.reglaGuiaLectura) return;
    const handleMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [preferenciasAccesibilidad.reglaGuiaLectura]);

  // Lector de pantalla al pasar el ratón (Cursor reader)
  useEffect(() => {
    soundManager.lectorCursorActivo = preferenciasAccesibilidad.lectorCursor;
    if (!preferenciasAccesibilidad.lectorCursor) return;

    let debounceTimer: any = null;
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const texto = target.getAttribute('aria-label') || target.getAttribute('title') || target.innerText?.trim();
      if (texto && texto.length > 1 && texto.length < 120) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          soundManager.readOnHover(texto);
        }, 350);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      clearTimeout(debounceTimer);
    };
  }, [preferenciasAccesibilidad.lectorCursor]);

  // Aplicar clases y estilos reales al DOM
  useEffect(() => {
    localStorage.setItem('lum_preferencias_accesibilidad', JSON.stringify(preferenciasAccesibilidad));

    // Tema y contraste
    document.documentElement.classList.toggle('dark', preferenciasAccesibilidad.modoOscuro);
    document.documentElement.classList.toggle('high-contrast', preferenciasAccesibilidad.altoContraste);
    document.documentElement.classList.toggle('motion-reduce', preferenciasAccesibilidad.movimientoReducido);

    // Escala del tamaño de letra
    if (preferenciasAccesibilidad.tamanoTexto === 'grande') {
      document.documentElement.style.fontSize = '18px';
    } else if (preferenciasAccesibilidad.tamanoTexto === 'muy-grande') {
      document.documentElement.style.fontSize = '20px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }

    // Velocidad de voz de Lumy
    const rate =
      preferenciasAccesibilidad.velocidadVoz === 'lenta'
        ? 0.75
        : preferenciasAccesibilidad.velocidadVoz === 'rapida'
        ? 1.15
        : 0.95;
    soundManager.defaultRate = rate;
  }, [preferenciasAccesibilidad]);

  // Persistencia de datos principales
  useEffect(() => {
    localStorage.setItem('lum_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    if (usuarioActualId !== null) {
      localStorage.setItem('lum_usuario_sesion_id', String(usuarioActualId));
    } else {
      localStorage.removeItem('lum_usuario_sesion_id');
    }
  }, [usuarioActualId]);

  useEffect(() => {
    localStorage.setItem('lum_actividades', JSON.stringify(actividades));
  }, [actividades]);

  useEffect(() => {
    localStorage.setItem('lum_entregas', JSON.stringify(entregas));
  }, [entregas]);

  useEffect(() => {
    localStorage.setItem('lum_alertas_seguridad', JSON.stringify(alertasSeguridad));
  }, [alertasSeguridad]);

  const usuarioActual = usuarios.find((u) => u.id === usuarioActualId) || null;
  const esDocente = usuarioActual?.rol === 'docente';

  // Alerta de seguridad detectada por Lumy
  const handleNuevaAlertaSeguridad = (alerta: AlertaSeguridad) => {
    setAlertasSeguridad((prev) => [alerta, ...prev]);
  };

  const handleMarcarAlertaAtendida = (id: string) => {
    setAlertasSeguridad((prev) =>
      prev.map((a) => (a.id === id ? { ...a, atendida: true } : a))
    );
  };

  // Navegación fluida
  const handleNavegar = (ruta: string, cat: CategoriaTalento | 'todas' = 'todas') => {
    setRutaActual(ruta);
    setCategoriaFiltro(cat);
    window.scrollTo({
      top: 0,
      behavior: preferenciasAccesibilidad.movimientoReducido ? 'auto' : 'smooth'
    });
  };

  // Login y Logout
  const handleLoginExitoso = (usuario: Usuario) => {
    // Si es un docente recién registrado que no está en la lista de usuarios, agregarlo
    if (!usuarios.some((u) => u.id === usuario.id)) {
      setUsuarios((prev) => [...prev, usuario]);
    }

    setUsuarioActualId(usuario.id);
    if (usuario.rol === 'docente') {
      setRutaActual('estudiantes');
    } else {
      setRutaActual('inicio');
    }
  };

  const handleLogout = () => {
    setUsuarioActualId(null);
    localStorage.removeItem('lum_usuario_sesion_id');
    soundManager.playClick();
  };

  const handleToggleModoOscuroRapido = () => {
    setPreferenciasAccesibilidad((prev) => ({
      ...prev,
      modoOscuro: !prev.modoOscuro,
      altoContraste: false
    }));
  };


  // Enviar entrega de actividad (Solo Estudiante, con respuesta visual/sello/voz)
  const handleEnviarEntrega = (idActividad: number, respuesta: string, reaccion?: string) => {
    if (!usuarioActual || esDocente) return;

    const nuevaEntrega: EntregaActividad = {
      idActividad,
      idEstudiante: usuarioActual.id,
      fechaEntrega: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
      respuestaOTrabajo: respuesta,
      simulacionCompletada: true,
      estado: 'enviada',
      reaccionIcono: reaccion
    };

    setEntregas((prev) => [
      nuevaEntrega,
      ...prev.filter((e) => !(e.idActividad === idActividad && e.idEstudiante === usuarioActual.id))
    ]);

    // Marcar como completada por el estudiante y sumar puntos
    const act = actividades.find((a) => a.id === idActividad);
    const puntos = act?.puntos || 10;
    const nuevasCompletadas = usuarioActual.actividadesCompletadas.includes(idActividad)
      ? usuarioActual.actividadesCompletadas
      : [...usuarioActual.actividadesCompletadas, idActividad];

    // Descubrimiento dinámico del talento según avance acumulado
    const afinidadInfo = calcularAfinidadDinamica(nuevasCompletadas, actividades);

    const nuevoProgreso = Math.min(100, usuarioActual.progreso + puntos);
    const nuevasEstrellas = (usuarioActual.estrellas || 0) + 3;

    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuarioActual.id
          ? {
              ...u,
              actividadesCompletadas: nuevasCompletadas,
              categoriaTalento:
                afinidadInfo.afinidad !== 'descubriendo' && afinidadInfo.afinidad !== 'mixto'
                  ? (afinidadInfo.afinidad as CategoriaTalento)
                  : u.categoriaTalento,
              progreso: nuevoProgreso,
              estrellas: nuevasEstrellas
            }
          : u
      )
    );

    if (!preferenciasAccesibilidad.movimientoReducido) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    soundManager.playSuccess();
  };

  // Docente evalúa entrega y envía mensaje motivador
  const handleEvaluarEntrega = (idActividad: number, idEstudiante: number, estrellas: number, mensajeMotivador: string) => {
    const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

    setEntregas((prev) =>
      prev.map((e) =>
        e.idActividad === idActividad && e.idEstudiante === idEstudiante
          ? {
              ...e,
              estado: 'evaluada',
              calificacionEstrellas: estrellas,
              mensajeMotivadorDocente: mensajeMotivador,
              fechaEvaluacion: fecha
            }
          : e
      )
    );

    // Sumar estrellas al alumno evaluado
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === idEstudiante
          ? {
              ...u,
              estrellas: (u.estrellas || 0) + estrellas
            }
          : u
      )
    );
  };

  // Docente añade nuevo estudiante (Solo Alias, Pin, Avatar y Correo del tutor)
  const handleCrearEstudiante = (nuevo: Omit<Usuario, 'id'>) => {
    const id = Date.now();
    const estudianteCreado: Usuario = { id, ...nuevo };
    setUsuarios((prev) => [...prev, estudianteCreado]);
  };

  // Docente actualiza información del estudiante
  const handleActualizarEstudiante = (id: number, datos: Partial<Usuario>) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...datos } : u))
    );
  };

  // Docente crea nueva actividad con fecha de entrega
  const handleCrearActividad = (nueva: Omit<Actividad, 'id'>) => {
    const id = Date.now();
    setActividades((prev) => [{ id, ...nueva }, ...prev]);
  };

  // Docente guarda nota general
  const handleGuardarNotaDocente = (idEstudiante: number, nuevaNota: string) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === idEstudiante ? { ...u, notasDocente: nuevaNota } : u))
    );
  };

  // Estudiante descubre talento desde el quiz/miniestudio
  const handleTalentoDescubierto = (cat: CategoriaTalento) => {
    if (!usuarioActual) return;
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuarioActual.id
          ? {
              ...u,
              categoriaTalento: cat,
              progreso: Math.min(100, u.progreso + 15),
              estrellas: (u.estrellas || 0) + 5
            }
          : u
      )
    );
  };

  // Estudiante cambia avatar
  const handleActualizarAvatar = (nuevoAvatar: string) => {
    if (!usuarioActual) return;
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioActual.id ? { ...u, avatar: nuevoAvatar } : u))
    );
  };

  // Estudiante reinicia progreso
  const handleReiniciarProgreso = () => {
    if (!usuarioActual) return;
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuarioActual.id
          ? {
              ...u,
              progreso: 0,
              actividadesCompletadas: [],
              estrellas: 0
            }
          : u
      )
    );
    soundManager.playClick();
  };

  // Docente elimina estudiante (CRUD completo)
  const handleEliminarEstudiante = (idEstudiante: number) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== idEstudiante));
    setEntregas((prev) => prev.filter((e) => e.idEstudiante !== idEstudiante));
  };

  const getContainerClasses = () => {
    let classes = 'min-h-screen flex transition-colors ';
    if (preferenciasAccesibilidad.altoContraste) {
      classes += 'bg-[#0f172a] text-slate-100 high-contrast ';
    } else if (preferenciasAccesibilidad.modoOscuro) {
      classes += 'bg-[#100e23] text-purple-100 dark ';
    } else {
      classes += 'bg-[#efe9fd] text-[#2b2466] ';
    }
    if (preferenciasAccesibilidad.fuenteDislexia) {
      classes += 'tracking-wide font-medium font-sans ';
    }
    return classes;
  };


  // SI NO HAY SESIÓN ACTIVA: Mostrar Portal de Login LUM perfectamente centrado
  if (!usuarioActual) {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center ${preferenciasAccesibilidad.modoOscuro ? 'dark' : ''} ${preferenciasAccesibilidad.altoContraste ? 'high-contrast' : ''}`}>
        <LoginPortal
          usuarios={usuarios}
          onLoginExitoso={handleLoginExitoso}
          modoOscuro={preferenciasAccesibilidad.modoOscuro}
        />
      </div>
    );
  }

  return (
    <div className={getContainerClasses()}>
      {/* Regla Guía de Lectura para seguimiento visual (TDAH / Dislexia) */}
      {preferenciasAccesibilidad.reglaGuiaLectura && (
        <div
          className="fixed left-0 right-0 h-10 pointer-events-none z-50 bg-amber-400/25 border-y-2 border-amber-500/70 shadow-sm"
          style={{ top: `${Math.max(0, mouseY - 20)}px` }}
        />
      )}

      {/* Barra Lateral (Desktop) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          rutaActual={rutaActual}
          onNavegar={handleNavegar}
          usuario={usuarioActual}
          onAbrirAccesibilidad={() => setModalAccesibilidad(true)}
          onLogout={handleLogout}
          modoOscuro={preferenciasAccesibilidad.modoOscuro}
        />
      </div>

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* Header Superior */}
        <Header
          usuarioActual={usuarioActual}
          onLogout={handleLogout}
          onAbrirAccesibilidad={() => setModalAccesibilidad(true)}
          onToggleModoOscuro={handleToggleModoOscuroRapido}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          onNavegar={handleNavegar}
          modoOscuro={preferenciasAccesibilidad.modoOscuro}
        />

        {/* Barra Móvil Compacta */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-white/70 dark:bg-[#18162e]/80 border-b border-purple-100 dark:border-purple-900/50 scrollbar-none">
          {esDocente ? (
            [
              { id: 'estudiantes', label: 'Alumnos', icon: '👥' },
              { id: 'entregas', label: 'Entregas', icon: '📝' },
              { id: 'actividades', label: 'Retos', icon: '🎯' },
              { id: 'alertas', label: 'Alertas', icon: '⚠️' }
            ].map((item) => {
              const activo = (rutaActual === item.id) || (rutaActual === 'docente' && item.id === 'estudiantes');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavegar(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    activo
                      ? 'bg-purple-600 text-white font-black'
                      : 'bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })
          ) : (
            [
              { id: 'inicio', label: 'Inicio', icon: '🏠' },
              { id: 'actividades', label: 'Mis Retos', icon: '🎯' },
              { id: 'estadisticas', label: 'Estadísticas & Diploma', icon: '📊' },
              { id: 'estudio', label: 'Mini-Estudio', icon: '🎨' },
              { id: 'logros', label: 'Logros', icon: '🏆' },
              { id: 'perfil', label: 'Perfil', icon: '👤' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavegar(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  rutaActual === item.id
                    ? 'bg-purple-600 text-white font-black'
                    : 'bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))
          )}
        </div>

        {/* Área de Vistas Específicas por Rol */}
        <main className="flex-1 px-4 sm:px-8 py-6">
          {/* VISTA EXCLUSIVA DOCENTE */}
          {esDocente && (
            <DocenteView
              usuarios={usuarios}
              todasLasActividades={actividades}
              entregas={entregas}
              alertasSeguridad={alertasSeguridad}
              onMarcarAlertaAtendida={handleMarcarAlertaAtendida}
              onGuardarNotaDocente={handleGuardarNotaDocente}
              onCrearActividad={handleCrearActividad}
              onCrearEstudiante={handleCrearEstudiante}
              onActualizarEstudiante={handleActualizarEstudiante}
              onEliminarEstudiante={handleEliminarEstudiante}
              onEvaluarEntrega={handleEvaluarEntrega}
              modoOscuro={preferenciasAccesibilidad.modoOscuro}
              pestanaActiva={
                ['estudiantes', 'entregas', 'actividades', 'alertas'].includes(rutaActual)
                  ? (rutaActual as 'estudiantes' | 'entregas' | 'actividades' | 'alertas')
                  : 'estudiantes'
              }
              onCambiarPestana={(p) => setRutaActual(p)}
            />
          )}

          {/* VISTAS EXCLUSIVAS ESTUDIANTE */}
          {!esDocente && (
            <>
              {rutaActual === 'inicio' && (
                <InicioView
                  usuario={usuarioActual}
                  onNavegar={handleNavegar}
                  onAbrirTest={() => {
                    setMiniEstudioTab('test');
                    handleNavegar('estudio');
                  }}
                  onAbrirLienzo={() => {
                    setMiniEstudioTab('lienzo');
                    handleNavegar('estudio');
                  }}
                  onAbrirAccesibilidad={() => setModalAccesibilidad(true)}
                  actividades={actividades}
                  preferenciasAccesibilidad={preferenciasAccesibilidad}
                  onEnviarEntrega={handleEnviarEntrega}
                />
              )}

              {rutaActual === 'actividades' && (
                <ActividadesView
                  actividades={actividades}
                  usuarioActual={usuarioActual}
                  entregas={entregas}
                  categoriaActiva={categoriaFiltro}
                  onCambiarCategoria={setCategoriaFiltro}
                  onEnviarEntrega={handleEnviarEntrega}
                  busqueda={busqueda}
                />
              )}

              {rutaActual === 'estadisticas' && (
                <EstadisticasView
                  usuario={usuarioActual}
                  todasLasActividades={actividades}
                  entregas={entregas}
                  modoOscuro={preferenciasAccesibilidad.modoOscuro}
                />
              )}

              {rutaActual === 'estudio' && (
                <MiniEstudioView
                  usuarioActual={usuarioActual}
                  onTalentoDescubierto={handleTalentoDescubierto}
                  tabInicial={miniEstudioTab}
                />
              )}

              {rutaActual === 'logros' && (
                <LogrosView usuario={usuarioActual} logros={logros} />
              )}

              {rutaActual === 'perfil' && (
                <PerfilView
                  usuario={usuarioActual}
                  todasLasActividades={actividades}
                  onActualizarAvatar={handleActualizarAvatar}
                  onReiniciarProgreso={handleReiniciarProgreso}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Asistente de Voz Lumy (Estrellita Proactiva e Inmersiva) */}
      <LumyAssistant
        usuarioActual={usuarioActual}
        onNuevaAlertaSeguridad={handleNuevaAlertaSeguridad}
        modoOscuro={preferenciasAccesibilidad.modoOscuro}
      />


      {/* Modal de Accesibilidad Universal Inclusiva */}
      <AccessibilityModal
        abierto={modalAccesibilidad}
        onCerrar={() => setModalAccesibilidad(false)}
        preferencias={preferenciasAccesibilidad}
        onActualizarPreferencias={(nuevas) => {
          setPreferenciasAccesibilidad((prev) => ({ ...prev, ...nuevas }));
        }}
        onRestablecer={() => {
          setPreferenciasAccesibilidad({
            modoOscuro: false,
            altoContraste: false,
            tamanoTexto: 'normal',
            fuenteDislexia: false,
            lectorCursor: false,
            reglaGuiaLectura: false,
            movimientoReducido: false,
            velocidadVoz: 'normal'
          });
          soundManager.speakText('Ajustes de accesibilidad restablecidos a los valores iniciales.');
        }}
      />
    </div>
  );
}
