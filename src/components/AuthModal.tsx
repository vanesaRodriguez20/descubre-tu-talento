import React, { useState } from 'react';
import { Sparkles, User, GraduationCap, X, Check } from 'lucide-react';
import { RolUsuario, Usuario } from '../types';
import { soundManager } from '../utils/audio';

interface AuthModalProps {
  abierto: boolean;
  onCerrar: () => void;
  onLoginDemo: (usuarioId: number) => void;
  onCrearUsuario: (nuevo: Omit<Usuario, 'id'>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  abierto,
  onCerrar,
  onLoginDemo,
  onCrearUsuario
}) => {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<RolUsuario>('niño');
  const [avatar, setAvatar] = useState('👧');

  if (!abierto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    soundManager.playSuccessChime();
    const aliasGenerado = nombre.trim().toLowerCase().replace(/\s+/g, '_').slice(0, 10);
    const pinGenerado = '1234';

    onCrearUsuario({
      nombre: nombre.trim(),
      alias: aliasGenerado,
      pin: pinGenerado,
      correoPadres: 'familia@ejemplo.com',
      rol,
      progreso: rol === 'niño' ? 15 : 100,
      categoriaTalento: 'crear',
      avatar: rol === 'docente' ? '👩‍🏫' : avatar,
      actividadesCompletadas: rol === 'niño' ? [1] : [],
      estrellas: rol === 'niño' ? 5 : 0
    });
    onCerrar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/45 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-purple-100 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-xl shadow-xs">
              ⭐
            </div>
            <div>
              <h3 className="font-black text-lg text-[#2b2466]">
                {modo === 'login' ? '¡Hola de nuevo!' : 'Únete a la aventura'}
              </h3>
              <p className="text-xs text-purple-600 font-medium">
                {modo === 'login' ? 'Ingresa para seguir descubriendo talentos' : 'Crea tu perfil de estudiante o docente'}
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="w-7 h-7 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold flex items-center justify-center text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Cuentas de Acceso Rápido / Demo */}
        <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-100 space-y-2">
          <p className="text-[11px] font-black uppercase tracking-wider text-purple-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Accesos Rápidos de Prueba (1 Clic)</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onLoginDemo(1); // Ana
                onCerrar();
              }}
              className="p-2 bg-white hover:bg-purple-100 rounded-xl text-left border border-purple-100 shadow-xs cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-1.5 text-xs font-black text-purple-900">
                <span>👧</span>
                <span>Probar como Ana</span>
              </div>
              <p className="text-[10px] text-slate-500">Estudiante · 75% progreso</p>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onLoginDemo(100); // Profe Laura
                onCerrar();
              }}
              className="p-2 bg-white hover:bg-purple-100 rounded-xl text-left border border-purple-100 shadow-xs cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-1.5 text-xs font-black text-purple-900">
                <span>👩‍🏫</span>
                <span>Profe Laura</span>
              </div>
              <p className="text-[10px] text-slate-500">Docente · Panel completo</p>
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Nombre completo</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Daniel Gómez"
              className="w-full p-2.5 bg-purple-50/50 rounded-xl border border-purple-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">¿Cuál es tu rol?</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRol('niño')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer transition-all ${
                  rol === 'niño'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-purple-50/50 text-slate-700 border-purple-100 hover:bg-purple-100'
                }`}
              >
                <span>🌟</span>
                <span>Estudiante</span>
              </button>
              <button
                type="button"
                onClick={() => setRol('docente')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer transition-all ${
                  rol === 'docente'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-purple-50/50 text-slate-700 border-purple-100 hover:bg-purple-100'
                }`}
              >
                <span>👩‍🏫</span>
                <span>Docente</span>
              </button>
            </div>
          </div>

          {rol === 'niño' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Elige un emoji de avatar</label>
              <div className="flex gap-2">
                {['👧', '👦', '👧🏽', '🧒🏻', '🦁'].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setAvatar(em)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center cursor-pointer transition-transform ${
                      avatar === em ? 'bg-purple-200 ring-2 ring-purple-600 scale-110' : 'bg-purple-50 hover:bg-purple-100'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
          >
            {modo === 'login' ? 'Comenzar Aventura' : 'Crear Cuenta y Entrar'}
          </button>
        </form>

        <div className="text-center pt-1 border-t border-purple-50">
          <button
            onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}
            className="text-xs font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
          >
            {modo === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};
