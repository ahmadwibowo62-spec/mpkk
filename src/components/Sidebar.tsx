import React from 'react';
import {
  Home,
  GraduationCap,
  Users,
  School,
  BookOpen,
  Gamepad2,
  Trophy,
  BarChart3,
  Settings,
  LogOut,
  Flame,
  Gauge,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type DashboardView =
  | 'dashboard'
  | 'guru'
  | 'siswa'
  | 'kelas'
  | 'bank-soal'
  | 'pertandingan'
  | 'leaderboard'
  | 'analisis-nilai'
  | 'pengaturan';

interface SidebarProps {
  currentView: DashboardView;
  onSelectView: (view: DashboardView) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpen,
  onClose,
}) => {
  const { user, logout, switchRole } = useAuth();

  const menuItems: { id: DashboardView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'pertandingan', label: 'Pertandingan', icon: <Gamepad2 className="w-5 h-5 text-cyan-400" />, badge: 'LIVE' },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5 text-amber-400" /> },
    { id: 'bank-soal', label: 'Bank Soal', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'analisis-nilai', label: 'Analisis Nilai', icon: <BarChart3 className="w-5 h-5 text-emerald-400" /> },
    { id: 'guru', label: 'Guru', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'siswa', label: 'Siswa', icon: <Users className="w-5 h-5" /> },
    { id: 'kelas', label: 'Kelas', icon: <School className="w-5 h-5" /> },
    { id: 'pengaturan', label: 'Pengaturan', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Modern Automotive Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 sm:w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-black border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950 ring-2 ring-cyan-400/40">
                <Gauge className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="font-racing font-extrabold text-base tracking-wider text-white">
                  SPEED BATTLE
                </h1>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 block -mt-0.5">
                  KOMPONEN MESIN TKRO
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Badge & Quick Switch */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Peran Pengguna:
              </span>
              <span
                className={`text-[10px] font-racing font-bold uppercase px-2 py-0.5 rounded-full ${
                  user?.role === 'admin'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : user?.role === 'guru'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                }`}
              >
                {user?.role || 'Siswa'}
              </span>
            </div>
            <div className="font-racing font-bold text-sm text-slate-100 line-clamp-1">
              {user?.nama || 'Ahmad Rizki Maulana'}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              {user?.kelas || 'XII TKRO 1'}
            </div>

            {/* Quick Demo Switcher */}
            <div className="grid grid-cols-3 gap-1 mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] font-racing font-bold">
              <button
                onClick={() => switchRole('admin')}
                className={`py-1 rounded text-center transition ${user?.role === 'admin' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              >
                Admin
              </button>
              <button
                onClick={() => switchRole('guru')}
                className={`py-1 rounded text-center transition ${user?.role === 'guru' ? 'bg-amber-500 text-slate-950 font-extrabold' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              >
                Guru
              </button>
              <button
                onClick={() => switchRole('siswa')}
                className={`py-1 rounded text-center transition ${user?.role === 'siswa' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              >
                Siswa
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            {menuItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-racing font-bold text-sm transition-all duration-150 touch-target ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/20 text-cyan-300 border-l-4 border-cyan-400 shadow-md shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 font-racing font-bold text-sm transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
