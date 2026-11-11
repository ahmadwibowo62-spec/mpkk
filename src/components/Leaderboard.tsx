import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Medal, Flame, Zap, Clock, Users, Award, Sparkles } from 'lucide-react';
import { KelompokDoc } from '../firebase/firestore';
import { formatDuration } from '../utils/calculateScore';
import { sounds } from '../utils/soundEffects';

interface LeaderboardProps {
  groups: KelompokDoc[];
  showPodium?: boolean;
  celebrateWinner?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  groups,
  showPodium = true,
  celebrateWinner = false,
}) => {
  // Sort by score desc, then by time asc
  const sorted = [...groups].sort((a, b) => {
    if (b.skor !== a.skor) {
      return b.skor - a.skor;
    }
    return a.waktu - b.waktu;
  });

  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  useEffect(() => {
    if (celebrateWinner && top1) {
      sounds.playFanfare();
      // Launch confetti blast
      const end = Date.now() + 3.5 * 1000;
      const colors = ['#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [celebrateWinner, top1]);

  return (
    <div className="w-full space-y-8">
      {/* 3D RACING PODIUM */}
      {showPodium && top1 && (
        <div className="relative pt-6 pb-2">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 font-racing font-bold text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Podium Kejuaraan Mekanik TKRO
            </div>
          </div>

          <div className="grid grid-cols-3 items-end gap-2 sm:gap-4 max-w-2xl mx-auto px-2">
            {/* Rank 2 (Silver) */}
            {top2 && (
              <div className="flex flex-col items-center">
                <div className="mb-2 text-center animate-bounce">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-full bg-slate-700 border-2 border-slate-400 flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                    🥈
                  </div>
                  <div className="mt-1 font-racing font-bold text-xs sm:text-sm text-slate-200 line-clamp-1">
                    {top2.namaKelompok.split('(')[0]}
                  </div>
                  <div className="text-cyan-400 font-digital font-bold text-xs sm:text-sm">
                    {top2.skor} Pts
                  </div>
                </div>
                <div className="w-full h-28 sm:h-36 bg-gradient-to-t from-slate-900 to-slate-800 rounded-t-xl border-t-4 border-slate-400 flex flex-col items-center justify-center shadow-lg shadow-black/60 relative overflow-hidden">
                  <span className="font-racing font-black text-3xl sm:text-4xl text-slate-400/80">2</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">{formatDuration(top2.waktu)}</span>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold - Center highest) */}
            <div className="flex flex-col items-center -mt-6">
              <div className="mb-2 text-center">
                <div className="w-14 h-14 sm:w-18 sm:h-18 mx-auto rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 border-4 border-yellow-200 flex items-center justify-center text-2xl sm:text-3xl shadow-xl shadow-amber-500/40 animate-pulse">
                  🏆
                </div>
                <div className="mt-1.5 font-racing font-extrabold text-sm sm:text-base text-yellow-300 line-clamp-1">
                  {top1.namaKelompok.split('(')[0]}
                </div>
                <div className="text-yellow-400 font-digital font-black text-sm sm:text-lg">
                  {top1.skor} Pts
                </div>
              </div>
              <div className="w-full h-40 sm:h-52 bg-gradient-to-t from-amber-950 via-yellow-900 to-amber-700 rounded-t-xl border-t-4 border-yellow-400 flex flex-col items-center justify-center shadow-2xl shadow-yellow-500/30 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-yellow-300 animate-pulse" />
                <span className="font-racing font-black text-5xl sm:text-6xl text-yellow-300 drop-shadow-md">1</span>
                <span className="text-xs font-mono font-bold text-yellow-200 mt-2 bg-black/40 px-2 py-0.5 rounded-full">
                  ⏱ {formatDuration(top1.waktu)}
                </span>
                <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider mt-1">JUARA MESIN</span>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            {top3 && (
              <div className="flex flex-col items-center">
                <div className="mb-2 text-center animate-bounce">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-full bg-amber-900/80 border-2 border-amber-600 flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                    🥉
                  </div>
                  <div className="mt-1 font-racing font-bold text-xs sm:text-sm text-amber-200 line-clamp-1">
                    {top3.namaKelompok.split('(')[0]}
                  </div>
                  <div className="text-cyan-400 font-digital font-bold text-xs sm:text-sm">
                    {top3.skor} Pts
                  </div>
                </div>
                <div className="w-full h-20 sm:h-28 bg-gradient-to-t from-slate-900 to-amber-950/60 rounded-t-xl border-t-4 border-amber-700 flex flex-col items-center justify-center shadow-lg shadow-black/60 relative overflow-hidden">
                  <span className="font-racing font-black text-2xl sm:text-3xl text-amber-600/80">3</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">{formatDuration(top3.waktu)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REAL-TIME SPEED BATTLE TABLE */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="font-racing text-lg font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Live Leaderboard Realtime
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800 px-3 py-1 rounded-full">
            Auto-Sync Aktif
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 text-slate-400 text-xs uppercase font-mono tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-4 sm:px-6">Rank</th>
                <th className="py-3.5 px-4 sm:px-6">Kelompok Otomotif</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Anggota</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Akurasi</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Waktu Tempuh</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Total Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-sm">
              {sorted.map((item, idx) => {
                const isLeader = idx === 0;
                const totalAnswers = item.jawabanBenarCount + item.jawabanSalahCount;
                const accuracy = totalAnswers > 0 ? Math.round((item.jawabanBenarCount / totalAnswers) * 100) : 100;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-200 hover:bg-slate-800/50 ${
                      isLeader ? 'bg-amber-500/10 border-l-4 border-l-amber-400' : ''
                    }`}
                  >
                    <td className="py-4 px-4 sm:px-6 font-racing font-bold text-base">
                      {idx === 0 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/40">
                          1
                        </span>
                      ) : idx === 1 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black">
                          2
                        </span>
                      ) : idx === 2 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-white font-black">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono pl-2">#{idx + 1}</span>
                      )}
                    </td>

                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3.5 h-3.5 rounded-full ring-2 ring-slate-700"
                          style={{ backgroundColor: item.warna || '#06b6d4' }}
                        />
                        <div>
                          <div className="font-racing font-bold text-slate-100 text-base">
                            {item.namaKelompok}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">
                            {item.anggota.join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        {item.anggota.length} Siswa
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-mono text-xs text-emerald-400 font-bold">
                          {accuracy}%
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.jawabanBenarCount} Benar / {item.jawabanSalahCount} Salah
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-center font-mono text-slate-300">
                      <div className="inline-flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {formatDuration(item.waktu)}
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <span className={`font-digital text-xl sm:text-2xl font-black ${isLeader ? 'text-amber-400 text-glow-amber' : 'text-cyan-400'}`}>
                        {item.skor}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Leaderboard;
