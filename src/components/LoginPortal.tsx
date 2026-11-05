import React, { useState } from 'react';
import { KeyRound, User, Lock, Volume2, ArrowRight, ShieldCheck, Delete } from 'lucide-react';
import { Usuario } from '../types';
import { PIN_VISUAL_CATALOGO } from '../data/initialData';
import { soundManager } from '../utils/audio';

interface LoginPortalProps {
  usuarios: Usuario[];
  onLoginExitoso: (usuario: Usuario) => void;
  modoOscuro?: boolean;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ usuarios, onLoginExitoso, modoOscuro = false }) => {
  const [rolSeleccionado, setRolSeleccionado] = useState<'estudiante' | 'docente'>('estudiante');

  // Modo de PIN estudiante: 'numerico' o 'visual_iconos'
  const [modoPinEstudiante, setModoPinEstudiante] = useState<'numerico' | 'visual_iconos'>('numerico');

  // Campos estudiante (SOLO ALIAS, CERO CORREO DEL NIÑO)
  const [aliasEstudiante, setAliasEstudiante] = useState('');
  const [pinEstudiante, setPinEstudiante] = useState('');
  const [pinVisualSeleccionado, setPinVisualSeleccionado] = useState<string[]>([]);
  const [errorEstudiante, setErrorEstudiante] = useState('');

  // Campos docente
  const [emailDocente, setEmailDocente] = useState('docente@lum.edu');
  const [passwordDocente, setPasswordDocente] = useState('1000');
  // Modo docente: 'login' o 'registro'
  const [modoDocente, setModoDocente] = useState<'login' | 'registro'>('login');
  const [nombreDocenteReg, setNombreDocenteReg] = useState('');
  const [emailDocenteReg, setEmailDocenteReg] = useState('');
  const [passwordDocenteReg, setPasswordDocenteReg] = useState('');
  const [passwordConfirmDocenteReg, setPasswordConfirmDocenteReg] = useState('');
  const [errorDocente, setErrorDocente] = useState('');

  const estudiantes = usuarios.filter((u) => u.rol === 'niño');
  const docentes = usuarios.filter((u) => u.rol === 'docente');
  const docentePorDefecto = docentes[0] || usuarios[usuarios.length - 1];

  const handleSeleccionarIconoVisual = (iconoId: string) => {
    soundManager.playClick();
    if (pinVisualSeleccionado.length < 4) {
      setPinVisualSeleccionado([...pinVisualSeleccionado, iconoId]);
    }
  };

  const handleBorrarUltimoIcono = () => {
    soundManager.playClick();
    setPinVisualSeleccionado(pinVisualSeleccionado.slice(0, -1));
  };

  const handleLoginEstudiante = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorEstudiante('');

    const query = aliasEstudiante.trim().toLowerCase().replace('@', '');
    const estudianteEncontrado = estudiantes.find((est) => est.alias.toLowerCase() === query);

    if (!estudianteEncontrado) {
      soundManager.playClick();
      setErrorEstudiante('El usuario no existe. Revisa tu alias o pide a tu docente que te registre.');
      return;
    }

    let pinValido = false;
    if (modoPinEstudiante === 'numerico') {
      pinValido = estudianteEncontrado.pin === pinEstudiante.trim();
    } else {
      const secuenciaEstudiante = estudianteEncontrado.pinVisual || ['estrella', 'cohete', 'manzana', 'delfin'];
      pinValido =
        pinVisualSeleccionado.length === 4 &&
        secuenciaEstudiante.every((val, index) => val === pinVisualSeleccionado[index]);
    }

    if (pinValido) {
      soundManager.playSuccessChime();
      onLoginExitoso(estudianteEncontrado);
    } else {
      soundManager.playClick();
      setErrorEstudiante(
        modoPinEstudiante === 'numerico'
          ? 'Contraseña o PIN incorrecto. Revisa los 4 números de tu tarjeta.'
          : 'Las 4 figuras mágicas no coinciden con tu clave secreta. Revisa el orden en tu tarjeta.'
      );
    }
  };

  const handleLoginDocente = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDocente('');

    const emailTrim = emailDocente.trim().toLowerCase();
    const passTrim = passwordDocente.trim();

    // Buscar entre los docentes registrados
    const docenteEncontrado = docentes.find(
      (d) =>
        (d.correo && d.correo.toLowerCase() === emailTrim) ||
        d.alias.toLowerCase() === emailTrim ||
        (emailTrim === 'docente@lum.edu' && d.id === 100)
    );

    if (!docenteEncontrado && emailTrim !== 'docente@lum.edu') {
      soundManager.playClick();
      setErrorDocente('El usuario no existe. Revisa tu correo institucional o regístrate en la pestaña "Registrarme como Docente".');
      return;
    }

    const docenteTarget = docenteEncontrado || docentePorDefecto;
    const passEsperada = docenteTarget.password || docenteTarget.pin || '1000';

    if (passTrim === passEsperada || passTrim === '1000') {
      soundManager.playSuccessChime();
      onLoginExitoso(docenteTarget);
    } else {
      soundManager.playClick();
      setErrorDocente('Contraseña incorrecta. Por favor verifica tu contraseña (Demo: 1000).');
    }
  };

  const handleRegistroDocente = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDocente('');

    if (!nombreDocenteReg.trim() || !emailDocenteReg.trim() || !passwordDocenteReg.trim()) {
      setErrorDocente('Por favor complete todos los campos requeridos.');
      return;
    }

    if (passwordDocenteReg !== passwordConfirmDocenteReg) {
      setErrorDocente('Las contraseñas no coinciden.');
      return;
    }

    if (passwordDocenteReg.length < 4) {
      setErrorDocente('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    const emailTrim = emailDocenteReg.trim().toLowerCase();
    const existe = docentes.some((d) => d.correo && d.correo.toLowerCase() === emailTrim);
    if (existe) {
      setErrorDocente('Ya existe un docente registrado con ese correo institucional.');
      return;
    }

    const nuevoDocente: Usuario = {
      id: Date.now(),
      nombre: nombreDocenteReg.trim(),
      correo: emailTrim,
      password: passwordDocenteReg.trim(),
      alias: 'profe_' + nombreDocenteReg.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15),
      pin: passwordDocenteReg.trim(),
      rol: 'docente',
      progreso: 100,
      categoriaTalento: 'mixto',
      avatar: '👩‍🏫',
      actividadesCompletadas: []
    };

    soundManager.playAchievementFanfare();
    onLoginExitoso(nuevoDocente);
  };


  const ayudaVozLumy = () => {
    if (rolSeleccionado === 'estudiante') {
      soundManager.speakText(
        modoPinEstudiante === 'visual_iconos'
          ? '¡Hola! Escribe tu alias y toca tus cuatro figuras mágicas en orden, como estrella o cohete. ¡No necesitas correo ni nombres largos!'
          : '¡Hola! Escribe tu alias y tu número PIN de cuatro dígitos. No necesitas correo electrónico.'
      );
    } else {
      soundManager.speakText(
        'Bienvenida Profesora Laura. El portal docente de LUM le permite gestionar su aula con privacidad por defecto y crear retos interactivos.'
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#efe9fd] dark:bg-[#121124] flex items-center justify-center p-4 sm:p-6 transition-colors">
      <div className="max-w-lg w-full bg-white dark:bg-[#1b1933] rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 dark:border-purple-900/60 space-y-6 relative overflow-hidden transition-colors m-auto">
        {/* Decoración mágica superior */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-amber-300 to-yellow-200 dark:from-purple-800 dark:to-indigo-900 rounded-full blur-2xl opacity-40 pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-white flex items-center justify-center shadow-lg shadow-amber-200 ring-4 ring-white dark:ring-purple-900 animate-float overflow-hidden">
          <img
          src="src\assets\images\icon.png"
          alt="Descubre tu Talento"
          className="w-full h-full object-contain p-1"
        />

</div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#2b2466] dark:text-purple-100 tracking-tight">
              LUM
            </h1>
          </div>
        </div>

        {/* Selector de Rol: Estudiante vs Docente */}
        <div className="grid grid-cols-2 gap-2 bg-purple-50 dark:bg-purple-950/60 p-1.5 rounded-2xl border border-purple-100 dark:border-purple-800">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setRolSeleccionado('estudiante');
              setErrorEstudiante('');
              setErrorDocente('');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              rolSeleccionado === 'estudiante'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-900 dark:text-purple-200 hover:bg-purple-100/60 dark:hover:bg-purple-900/40'
            }`}
          >
            <span>Soy Estudiante</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setRolSeleccionado('docente');
              setErrorEstudiante('');
              setErrorDocente('');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              rolSeleccionado === 'docente'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-900 dark:text-purple-200 hover:bg-purple-100/60 dark:hover:bg-purple-900/40'
            }`}
          >
            <span>Soy Docente</span>
          </button>
        </div>

        {/* FORMULARIO ESTUDIANTE: SOLO ALIAS + PIN */}
        {rolSeleccionado === 'estudiante' && (
          <form onSubmit={handleLoginEstudiante} className="space-y-4 text-xs animate-in fade-in">
            {/* Alias del niño */}
            <div className="space-y-1">
              <label className="font-extrabold text-[#2b2466] dark:text-purple-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Alias del Alumno</span>
                </span>
              </label>
              <input
                type="text"
                required
                value={aliasEstudiante}
                onChange={(e) => {
                  setAliasEstudiante(e.target.value);
                  setErrorEstudiante('');
                }}
                placeholder="Ej: ana_estrella, carlos_rayo, sofia_luna..."
                className="w-full p-3 bg-purple-50/60 dark:bg-purple-950/40 focus:bg-white dark:focus:bg-[#201d3d] rounded-2xl border border-purple-100 dark:border-purple-800 outline-none text-sm font-bold text-[#2b2466] dark:text-purple-100 placeholder:text-purple-300 dark:placeholder:text-purple-600 transition-all"
              />
            </div>

            {/* Alternar entre PIN numérico y PIN visual con figuras */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-extrabold text-[#2b2466] dark:text-purple-200 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Tu Clave Secreta:</span>
              </span>
              <div className="inline-flex p-0.5 bg-purple-100/60 dark:bg-purple-900/60 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setModoPinEstudiante('numerico');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    modoPinEstudiante === 'numerico'
                      ? 'bg-white dark:bg-purple-800 text-purple-900 dark:text-white shadow-xs'
                      : 'text-purple-600 dark:text-purple-300'
                  }`}
                >
                  Números
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setModoPinEstudiante('visual_iconos');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    modoPinEstudiante === 'visual_iconos'
                      ? 'bg-white dark:bg-purple-800 text-purple-900 dark:text-white shadow-xs'
                      : 'text-purple-600 dark:text-purple-300'
                  }`}
                >
                  PIN Visual
                </button>
              </div>
            </div>

            {/* Selector de PIN Numérico */}
            {modoPinEstudiante === 'numerico' && (
              <div className="space-y-1">
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={pinEstudiante}
                  onChange={(e) => setPinEstudiante(e.target.value)}
                  placeholder="••••"
                  className="w-full p-3 bg-purple-50/60 dark:bg-purple-950/40 focus:bg-white dark:focus:bg-[#201d3d] rounded-2xl border border-purple-100 dark:border-purple-800 outline-none text-center text-xl font-black tracking-widest text-[#2b2466] dark:text-purple-100 transition-all"
                />
              </div>
            )}

            {/* Selector de PIN Visual con Iconos */}
            {modoPinEstudiante === 'visual_iconos' && (
              <div className="p-3 bg-purple-50/50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-900 dark:text-purple-200">
                    Tus 4 figuras mágicas ({pinVisualSeleccionado.length}/4):
                  </span>
                  {pinVisualSeleccionado.length > 0 && (
                    <button
                      type="button"
                      onClick={handleBorrarUltimoIcono}
                      className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Delete className="w-3.5 h-3.5" />
                      <span>Borrar</span>
                    </button>
                  )}
                </div>

                {/* Casillas de figuras */}
                <div className="flex justify-center gap-2.5">
                  {[0, 1, 2, 3].map((slot) => {
                    const iconoId = pinVisualSeleccionado[slot];
                    const item = PIN_VISUAL_CATALOGO.find((i) => i.id === iconoId);
                    return (
                      <div
                        key={slot}
                        className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-2xl transition-all ${
                          item
                            ? 'bg-white dark:bg-purple-800 border-purple-400 shadow-sm scale-105'
                            : 'bg-purple-100/60 dark:bg-purple-950/60 border-dashed border-purple-200 dark:border-purple-800 text-purple-300'
                        }`}
                      >
                        {item ? item.emoji : slot + 1}
                      </div>
                    );
                  })}
                </div>

                {/* Teclado visual de iconos */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {PIN_VISUAL_CATALOGO.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSeleccionarIconoVisual(item.id)}
                      disabled={pinVisualSeleccionado.length >= 4}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        item.color
                      } hover:scale-105 disabled:opacity-40 shadow-xs`}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-[10px] font-bold leading-tight">{item.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {errorEstudiante && (
              <p className="p-2.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                {errorEstudiante}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm rounded-full shadow-lg hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Entrar a mis Retos</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Ficha de recordatorio con solo Alias (Sin nombres reales) */}
            <div className="p-3 bg-amber-50/80 dark:bg-amber-950/20 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <span>Ficha de Recordatorio para Alumnos</span>
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">1 Clic para rellenar</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {estudiantes.slice(0, 3).map((est) => (
                  <button
                    key={est.id}
                    type="button"
                    onClick={() => {
                      setAliasEstudiante(est.alias);
                      setPinEstudiante(est.pin);
                      setPinVisualSeleccionado(est.pinVisual || ['estrella', 'cohete', 'manzana', 'delfin']);
                      soundManager.playClick();
                    }}
                    className="p-1.5 bg-white dark:bg-purple-900/60 hover:bg-amber-100 dark:hover:bg-purple-800 text-left rounded-xl border border-amber-200 dark:border-purple-800 shadow-xs cursor-pointer text-[11px]"
                  >
                    <p className="font-extrabold text-[#2b2466] dark:text-purple-100 truncate">@{est.alias}</p>
                    <p className="text-[10px] text-purple-700 dark:text-purple-300 font-mono font-bold">PIN: {est.pin}</p>
                    <div className="text-[11px] tracking-tighter">
                      {(est.pinVisual || ['⭐', '🚀', '🍎', '🐬']).map((v, i) => {
                        const item = PIN_VISUAL_CATALOGO.find((cat) => cat.id === v);
                        return <span key={i}>{item ? item.emoji : '⭐'}</span>;
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* SECCIÓN DOCENTE: LOGIN O REGISTRO */}
        {rolSeleccionado === 'docente' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Sub-pestañas: Iniciar Sesión vs Registrarse */}
            <div className="flex rounded-xl bg-purple-100/70 dark:bg-purple-950/70 p-1 border border-purple-200/80 dark:border-purple-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setModoDocente('login');
                  setErrorDocente('');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  modoDocente === 'login'
                    ? 'bg-white dark:bg-purple-900 text-purple-900 dark:text-white shadow-xs font-black'
                    : 'text-purple-700 dark:text-purple-300 hover:text-purple-900'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setModoDocente('registro');
                  setErrorDocente('');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  modoDocente === 'registro'
                    ? 'bg-white dark:bg-purple-900 text-purple-900 dark:text-white shadow-xs font-black'
                    : 'text-purple-700 dark:text-purple-300 hover:text-purple-900'
                }`}
              >
                Registrarme como Docente
              </button>
            </div>

            {/* FORMULARIO LOGIN DOCENTE */}
            {modoDocente === 'login' && (
              <form onSubmit={handleLoginDocente} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-extrabold text-[#2b2466] dark:text-purple-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Correo Institucional del Docente</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={emailDocente}
                    onChange={(e) => {
                      setEmailDocente(e.target.value);
                      setErrorDocente('');
                    }}
                    placeholder="example@colegio.edu"
                    className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 focus:bg-white dark:focus:bg-[#201d3d] rounded-2xl border border-purple-100 dark:border-purple-800 outline-none text-sm font-bold text-[#2b2466] dark:text-purple-100 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-[#2b2466] dark:text-purple-200 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Contraseña / PIN Docente</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordDocente}
                    onChange={(e) => {
                      setPasswordDocente(e.target.value);
                      setErrorDocente('');
                    }}
                    placeholder="1000"
                    className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 focus:bg-white dark:focus:bg-[#201d3d] rounded-2xl border border-purple-100 dark:border-purple-800 outline-none text-center text-lg font-black tracking-widest text-[#2b2466] dark:text-purple-100 transition-all"
                  />
                </div>

                {errorDocente && (
                  <p className="p-2.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                    {errorDocente}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm rounded-full shadow-lg hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Acceder al Panel Docente</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* FORMULARIO REGISTRO DOCENTE */}
            {modoDocente === 'registro' && (
              <form onSubmit={handleRegistroDocente} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-extrabold text-[#2b2466] dark:text-purple-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Nombre Completo del Docente</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nombreDocenteReg}
                    onChange={(e) => setNombreDocenteReg(e.target.value)}
                    placeholder="Ej. Profesor Carlos Mendoza"
                    className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 focus:bg-white dark:focus:bg-[#201d3d] rounded-2xl border border-purple-100 dark:border-purple-800 outline-none text-xs font-bold text-[#2b2466] dark:text-purple-100 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-[#2b2466] dark:text-purple-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Correo Electrónico Institucional</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={emailDocenteReg}
                    onChange={(e) => setEmailDocenteReg(e.target.value)}
                    placeholder="example@colegio.edu"
                    className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 focus:bg-white dark:focus:bg-[#201d3d] rounded-2xl border border-purple-100 dark:border-purple-800 outline-none text-xs font-bold text-[#2b2466] dark:text-purple-100 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-extrabold text-[#2b2466] dark:text-purple-200 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      <span>Contraseña</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordDocenteReg}
                      onChange={(e) => setPasswordDocenteReg(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 focus:bg-white dark:focus:bg-[#201d3d] rounded-2xl border border-purple-100 dark:border-purple-800 outline-none text-xs font-bold text-[#2b2466] dark:text-purple-100 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-extrabold text-[#2b2466] dark:text-purple-200 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      <span>Confirmar</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordConfirmDocenteReg}
                      onChange={(e) => setPasswordConfirmDocenteReg(e.target.value)}
                      placeholder="Repetir contraseña"
                      className="w-full p-2.5 bg-purple-50/60 dark:bg-purple-950/40 focus:bg-white dark:focus:bg-[#201d3d] rounded-2xl border border-purple-100 dark:border-purple-800 outline-none text-xs font-bold text-[#2b2466] dark:text-purple-100 transition-all"
                    />
                  </div>
                </div>

                {errorDocente && (
                  <p className="p-2.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                    {errorDocente}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-sm rounded-full shadow-lg hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Crear Cuenta & Entrar al Aula</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}


        {/* Voz de Lumy en Login */}
        <div className="pt-2 border-t border-purple-50 dark:border-purple-900/50 flex items-center justify-center">
          <button
            type="button"
            onClick={ayudaVozLumy}
            className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-yellow-300 hover:text-amber-900 bg-amber-50 dark:bg-purple-950/80 py-1.5 px-3.5 rounded-full border border-amber-200/80 dark:border-purple-800 cursor-pointer transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-300" />
            <span>Escuchar ayuda de Lumy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
