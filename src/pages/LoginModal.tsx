import React, { useState } from 'react';
import { LogIn, Key, Mail, Lock, Shield, Sparkles, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/soundEffects';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginEmail, loginGoogle, switchRole, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'guru' | 'siswa'>('guru');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await loginEmail(email, password);
      sounds.playCountdown(true);
      onClose();
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Gagal login. Periksa email & password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      await loginGoogle();
      sounds.playFanfare();
      onClose();
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Login Google gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (role: 'admin' | 'guru' | 'siswa') => {
    switchRole(role);
    sounds.playCorrect();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-cyan-500/40 w-full max-w-md rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-cyan-400" />
            <h3 className="font-racing font-extrabold text-lg text-white">
              Sistem Login Multi-Role TKRO
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Smart Board Demo Selector */}
          <div>
            <label className="block text-[11px] font-racing uppercase tracking-wider text-slate-400 mb-2">
              Masuk Cepat Mode Smart Board:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-racing font-bold">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 transition text-center"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('guru')}
                className="p-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-300 transition text-center"
              >
                👨‍🏫 Guru TKRO
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('siswa')}
                className="p-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 transition text-center"
              >
                🏎️ Siswa
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] uppercase font-mono text-slate-500 absolute">
              atau via Firebase Auth
            </span>
          </div>

          {/* Email Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1">
                Email Pengguna
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="nama@smk-tkro.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-racing font-bold text-sm rounded-xl shadow-lg transition active:scale-95"
            >
              {isLoading ? 'Memproses...' : 'Masuk dengan Email'}
            </button>
          </form>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-racing font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.36 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.005 10.05.005 12s.455 3.8 1.265 5.42l4.01-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Masuk dengan Akun Google
          </button>
        </div>
      </div>
    </div>
  );
};
export default LoginModal;
