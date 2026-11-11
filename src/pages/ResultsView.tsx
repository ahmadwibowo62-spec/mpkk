import React, { useEffect } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  RotateCcw,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Gauge,
  Flame,
  FileSpreadsheet,
} from 'lucide-react';
import { Leaderboard } from '../components/Leaderboard';
import { KelompokDoc, HasilDoc, saveHasil } from '../firebase/firestore';
import { calculateFinalScore, formatDuration, ScoreBreakdown } from '../utils/calculateScore';
import { exportNilaiToCSV } from '../utils/exportExcel';
import { sounds } from '../utils/soundEffects';

interface ResultsViewProps {
  groups: KelompokDoc[];
  results: HasilDoc[];
  onPlayAgain: () => void;
  onRefresh: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  groups,
  results,
  onPlayAgain,
  onRefresh,
}) => {
  const sorted = [...groups].sort((a, b) => b.skor - a.skor || a.waktu - b.waktu);
  const top1 = sorted[0];

  // Calculate detailed grades for top groups using the formula:
  // Nilai Akhir = (70% Skor Benar) + (30% Kecepatan Menyelesaikan)
  const gradedList = sorted.map((g, idx) => {
    const accuracy = g.jawabanBenarCount + g.jawabanSalahCount > 0
      ? Math.round((g.jawabanBenarCount / (g.jawabanBenarCount + g.jawabanSalahCount)) * 100)
      : 90;

    // Normalizing speed score based on time (faster = higher speed score, up to 100)
    const speedScore = Math.max(50, Math.min(100, Math.round(100 - (g.waktu / 15))));
    const breakdown = calculateFinalScore(
      accuracy,
      speedScore,
      g.jawabanBenarCount + g.jawabanSalahCount,
      g.jawabanBenarCount,
      g.jawabanSalahCount,
      g.waktu,
      idx + 1
    );

    return {
      kelompok: g,
      rank: idx + 1,
      breakdown,
    };
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* VICTORY ANNOUNCEMENT HERO */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-yellow-950 border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.3)] text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-racing font-bold text-xs uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          PERTANDINGAN SELESAI • REKAPITULASI PENILAIAN OTOMATIS
        </div>

        <h2 className="font-racing font-black text-3xl sm:text-5xl text-white tracking-wide uppercase">
          Selamat Kepada <span className="text-yellow-400 drop-shadow-md">{top1 ? top1.namaKelompok : 'Kelompok A'}</span>!
        </h2>

        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl mx-auto">
          Seluruh kelompok telah menuntaskan ronde identifikasi komponen mesin. Penilaian akhir dihitung otomatis berdasarkan akumulasi 70% Skor Benar + 30% Kecepatan Menyelesaikan.
        </p>

        {/* Formula Explanatory Card */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-3.5 bg-black/60 border border-amber-500/40 rounded-2xl text-xs sm:text-sm font-mono text-amber-200">
          <span className="font-bold">RUMUS PENILAIAN TKRO:</span>
          <span className="bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-700 text-yellow-300 font-bold">
            Nilai Akhir = (70% × Skor Benar) + (30% × Kecepatan)
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={() => exportNilaiToCSV(results)}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-racing font-bold text-sm rounded-xl border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export Rekap Nilai Excel
          </button>

          <button
            onClick={onPlayAgain}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-racing font-extrabold text-sm rounded-xl shadow-lg transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Mainkan Pertandingan Baru
          </button>
        </div>
      </div>

      {/* 3D PODIUM & LEADERBOARD CELEBRATION */}
      <Leaderboard groups={groups} showPodium={true} celebrateWinner={true} />

      {/* REKAP NILAI DETAIL PER KELOMPOK & BADGES */}
      <div className="space-y-4">
        <h3 className="font-racing font-extrabold text-xl text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Rincian Nilai & Gamifikasi Lencana Keahlian (Badges)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gradedList.map(({ kelompok, rank, breakdown }) => (
            <div
              key={kelompok.id}
              className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-racing font-black text-sm ${
                    rank === 1 ? 'bg-amber-400 text-slate-950' : rank === 2 ? 'bg-slate-300 text-slate-950' : 'bg-amber-800 text-white'
                  }`}>
                    #{rank}
                  </span>
                  <div>
                    <h4 className="font-racing font-bold text-white text-base">
                      {kelompok.namaKelompok}
                    </h4>
                    <span className="text-xs text-slate-400">
                      ⏱ Waktu: {formatDuration(kelompok.waktu)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Nilai Akhir</span>
                  <span className="font-digital text-2xl font-black text-cyan-400 text-glow-cyan">
                    {breakdown.nilaiAkhir}
                  </span>
                </div>
              </div>

              {/* Formula Breakdown Breakdown Visual */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block">70% Skor Benar:</span>
                  <span className="text-emerald-400 font-bold">
                    {breakdown.skorMurni} × 0.7 = {(breakdown.skorMurni * 0.7).toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">30% Kecepatan:</span>
                  <span className="text-amber-400 font-bold">
                    {breakdown.skorKecepatan} × 0.3 = {(breakdown.skorKecepatan * 0.3).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Earned Badges */}
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-2">
                  Lencana Diperoleh (Badges):
                </span>
                <div className="flex flex-wrap gap-2">
                  {breakdown.badges.map(b => (
                    <span
                      key={b.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-700 rounded-xl text-xs font-racing font-bold text-slate-200"
                    >
                      <span>{b.icon}</span>
                      <span>{b.nama}</span>
                    </span>
                  ))}
                  {breakdown.badges.length === 0 && (
                    <span className="text-xs text-slate-500 font-mono">
                      Mekanik Pemula
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ResultsView;
