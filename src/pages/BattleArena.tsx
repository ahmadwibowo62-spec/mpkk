import React, { useState } from 'react';
import {
  Gamepad2,
  Trophy,
  Volume2,
  ArrowRight,
  Flag,
  Flame,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { DigitalTimer } from '../components/Timer';
import { BattleModes } from '../components/BattleModes';
import { KelompokDoc, updateKelompokScore } from '../firebase/firestore';
import { sounds } from '../utils/soundEffects';

interface BattleArenaProps {
  groups: KelompokDoc[];
  matchTitle: string;
  onFinishMatch: () => void;
  onRefresh: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  groups,
  matchTitle,
  onFinishMatch,
  onRefresh,
}) => {
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);

  const activeGroup = groups[activeGroupIndex % groups.length] || groups[0];

  const handleScoreUpdate = async (deltaScore: number, isCorrect: boolean) => {
    if (activeGroup) {
      await updateKelompokScore(activeGroup.id, deltaScore, isCorrect, 10);
      onRefresh();
    }
  };

  const handleNextRound = () => {
    if (currentRound < 7) {
      setCurrentRound(prev => prev + 1);
      sounds.playCountdown(true);
    } else {
      onFinishMatch();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ARENA HEADER & CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-950">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-racing uppercase tracking-widest text-cyan-400 font-bold block">
              Papan Interaktif Digital • Live Arena
            </span>
            <h2 className="font-racing font-extrabold text-lg sm:text-xl text-white">
              {matchTitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Round selectors */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-racing font-bold">
            {[1, 2, 3, 4, 5, 6, 7].map(r => (
              <button
                key={r}
                onClick={() => setCurrentRound(r)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currentRound === r
                    ? 'bg-cyan-500 text-slate-950 font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 7 ? '🔥 Bonus' : `R${r}`}
              </button>
            ))}
          </div>

          <button
            onClick={onFinishMatch}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-racing font-bold text-xs rounded-xl shadow-lg transition active:scale-95"
          >
            <Flag className="w-4 h-4" />
            Selesaikan Pertandingan
          </button>
        </div>
      </div>

      {/* GIANT DIGITAL TIMER ROW & REALTIME SCORES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* BIG DIGITAL TIMER */}
        <div className="lg:col-span-2">
          <DigitalTimer
            initialMinutes={15}
            initialMode="turun"
            onTimeEnd={() => {
              sounds.playBuzzer();
              alert('WAKTU PERTANDINGAN HABIS! Membuka Rekap Nilai...');
              onFinishMatch();
            }}
          />
        </div>

        {/* COMPACT REALTIME SCORE HUD */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="font-racing font-bold text-sm text-slate-200 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Scoreboard Balap
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded-full animate-pulse">
                Live
              </span>
            </div>

            <div className="space-y-2.5">
              {groups.map((group, idx) => {
                const isSelected = activeGroup?.id === group.id;

                return (
                  <div
                    key={group.id}
                    onClick={() => setActiveGroupIndex(idx)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400/80 shadow-md shadow-cyan-950/50'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full ring-2 ring-slate-700"
                        style={{ backgroundColor: group.warna || '#06b6d4' }}
                      />
                      <div>
                        <div className="font-racing font-bold text-xs text-white">
                          {group.namaKelompok.split('(')[0]}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {group.anggota.length} Siswa
                        </span>
                      </div>
                    </div>

                    <span className="font-digital text-lg font-bold text-cyan-400">
                      {group.skor}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 text-center">
            Ketuk kelompok di atas untuk mengaktifkan giliran menjawab
          </div>
        </div>
      </div>

      {/* ACTIVE BATTLE MODES ROUND ENGINE */}
      <BattleModes
        currentRound={currentRound}
        activeTeamName={activeGroup?.namaKelompok || 'Kelompok A'}
        onScoreUpdate={handleScoreUpdate}
        onNextRound={handleNextRound}
      />
    </div>
  );
};
export default BattleArena;
