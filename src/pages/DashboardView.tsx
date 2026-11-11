import React from 'react';
import {
  Gamepad2,
  Trophy,
  Users,
  Flame,
  Gauge,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';
import { ENGINE_COMPONENTS } from '../data/componentsData';
import { ComponentIllustration } from '../components/ComponentIllustration';
import { DigitalTimer } from '../components/Timer';
import { KelompokDoc } from '../firebase/firestore';

interface DashboardViewProps {
  onStartGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenBankSoal: () => void;
  groups: KelompokDoc[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartGame,
  onOpenLeaderboard,
  onOpenBankSoal,
  groups,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HERO BANNER - MODERN AUTOMOTIVE COCKPIT */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border-2 border-cyan-500/40 p-6 sm:p-10 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
        {/* Decorative Speedometer dial pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none hidden md:block">
          <svg viewBox="0 0 400 400" className="w-full h-full text-cyan-400">
            <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="10,10" />
            <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="6" />
            <line x1="200" y1="200" x2="300" y2="100" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-racing font-bold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4 text-cyan-400 animate-pulse" />
            MPKK Teknik Kendaraan Ringan Otomotif (TKRO) SMK
          </div>

          <h2 className="font-racing font-black text-3xl sm:text-5xl text-white tracking-wide uppercase leading-tight">
            Speed Battle <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Komponen Mesin</span> Mobil
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Arena kompetisi interaktif mengenali 25 komponen mesin motor bakar 4 langkah. Didukung timer LED digital raksasa, virtual buzzer real-time, drag & drop hotspot, dan analitik nilai otomatis untuk Papan Interaktif (Smart Board).
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onStartGame}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-racing font-extrabold text-base sm:text-lg rounded-2xl shadow-xl shadow-cyan-950 transition active:scale-95 touch-target"
            >
              <Gamepad2 className="w-6 h-6 fill-current" />
              MULAI PERTANDINGAN
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="flex items-center gap-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-racing font-bold text-sm sm:text-base rounded-2xl border border-slate-700 transition active:scale-95"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              Klasemen Live
            </button>
          </div>
        </div>
      </div>

      {/* QUICK STATS DASHBOARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono text-slate-400">Komponen Mesin</span>
            <div className="font-digital text-3xl font-black text-cyan-400 text-glow-cyan mt-1">25</div>
            <div className="text-[11px] text-slate-400">Standard MPKK TKRO</div>
          </div>
          <div className="p-3 bg-cyan-950/60 rounded-xl border border-cyan-800 text-cyan-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono text-slate-400">Kelompok Balap</span>
            <div className="font-digital text-3xl font-black text-amber-400 text-glow-amber mt-1">
              {groups.length}
            </div>
            <div className="text-[11px] text-slate-400">Acak Otomatis Siap</div>
          </div>
          <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-800 text-amber-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono text-slate-400">Top Skor Ronde</span>
            <div className="font-digital text-3xl font-black text-emerald-400 text-glow-green mt-1">
              {groups.length > 0 ? Math.max(...groups.map(g => g.skor)) : 950}
            </div>
            <div className="text-[11px] text-slate-400">Akurasi 95%</div>
          </div>
          <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800 text-emerald-400">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono text-slate-400">Waktu Tercepat</span>
            <div className="font-digital text-3xl font-black text-slate-200 mt-1">08:12</div>
            <div className="text-[11px] text-slate-400">Kelompok A (Viper)</div>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-300">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 25 KOMPONEN MESIN OTOMOTIF - CATALOGUE GRID */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-racing font-extrabold text-2xl text-white flex items-center gap-2">
              <Gauge className="w-6 h-6 text-cyan-400" />
              Katalog 25 Komponen Utama Mesin Mobil
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Materi pengenalan komponen motor bakar 4 tak MPKK Fase F Kelas X, XI & XII TKRO
            </p>
          </div>

          <button
            onClick={onOpenBankSoal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 font-racing font-bold text-xs rounded-xl border border-slate-700 transition"
          >
            <BookOpen className="w-4 h-4" />
            Buka Bank Soal Terkait
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {ENGINE_COMPONENTS.map((comp, idx) => (
            <div
              key={comp.id}
              className="p-3.5 bg-slate-900/80 hover:bg-slate-800/80 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 shadow-lg flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
                  <span>#{idx + 1}</span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    comp.difficulty === 'mudah' ? 'text-emerald-400 bg-emerald-950/60' : comp.difficulty === 'sedang' ? 'text-amber-400 bg-amber-950/60' : 'text-rose-400 bg-rose-950/60'
                  }`}>
                    {comp.difficulty}
                  </span>
                </div>

                <ComponentIllustration type={comp.id} className="w-20 h-20 mx-auto my-2 group-hover:scale-105 transition-transform" />

                <h4 className="font-racing font-bold text-sm text-white text-center line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {comp.nama}
                </h4>

                <p className="text-[11px] text-slate-400 text-center mt-1 line-clamp-2">
                  {comp.fungsi}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-center">
                <span className="text-[9px] uppercase font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-full border border-cyan-900">
                  {comp.kategori.split('&')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DashboardView;
