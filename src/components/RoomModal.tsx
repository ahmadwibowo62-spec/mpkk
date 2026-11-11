import React, { useState, useEffect } from 'react';
import { QrCode, Play, Users, Clock, Flame, Shield, X, Copy, Check } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface RoomModalProps {
  roomCode: string;
  matchTitle: string;
  groupCount: number;
  durationMinutes: number;
  totalQuestions: number;
  isOpen: boolean;
  onClose: () => void;
  onStartMatch: () => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  roomCode,
  matchTitle,
  groupCount,
  durationMinutes,
  totalQuestions,
  isOpen,
  onClose,
  onStartMatch,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        sounds.playCountdown(false);
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      sounds.playCountdown(true);
      sounds.playEngineRev();
      onStartMatch();
    }
    return () => clearTimeout(timer);
  }, [countdown, onStartMatch]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + `?room=${roomCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerCountdown = () => {
    setCountdown(3);
    sounds.playCountdown(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border-2 border-cyan-500/50 w-full max-w-2xl rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="font-racing font-extrabold text-lg text-white">
              Room Briefing & Gabung Pertandingan
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Giant Room Code Display */}
          <div className="text-center p-6 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden">
            <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
              KODE ROOM PERTANDINGAN
            </span>
            <div className="font-digital text-5xl sm:text-6xl font-black text-cyan-400 text-glow-cyan tracking-widest my-2">
              {roomCode}
            </div>
            <p className="text-xs text-slate-400">
              Siswa buka link atau scan QR code di papan interaktif dengan smartphone
            </p>

            <button
              onClick={handleCopyLink}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Tersalin!' : 'Salin Tautan Join Siswa'}
            </button>
          </div>

          {/* Grid: QR Code + Briefing Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* SVG Visual QR Code generator */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl text-slate-950 shadow-inner">
              <svg viewBox="0 0 160 160" className="w-36 h-36">
                {/* Simulated high density QR Pattern */}
                <rect x="0" y="0" width="160" height="160" fill="#ffffff" />
                {/* 3 Position Corners */}
                <rect x="10" y="10" width="40" height="40" fill="#0f172a" />
                <rect x="16" y="16" width="28" height="28" fill="#ffffff" />
                <rect x="22" y="22" width="16" height="16" fill="#0f172a" />

                <rect x="110" y="10" width="40" height="40" fill="#0f172a" />
                <rect x="116" y="16" width="28" height="28" fill="#ffffff" />
                <rect x="122" y="22" width="16" height="16" fill="#0f172a" />

                <rect x="10" y="110" width="40" height="40" fill="#0f172a" />
                <rect x="16" y="116" width="28" height="28" fill="#ffffff" />
                <rect x="22" y="122" width="16" height="16" fill="#0f172a" />

                {/* Data blocks */}
                <rect x="60" y="20" width="12" height="12" fill="#0f172a" />
                <rect x="80" y="20" width="12" height="12" fill="#0f172a" />
                <rect x="60" y="50" width="24" height="12" fill="#0f172a" />
                <rect x="90" y="50" width="12" height="24" fill="#0f172a" />
                <rect x="60" y="80" width="40" height="12" fill="#0f172a" />
                <rect x="60" y="110" width="16" height="24" fill="#0f172a" />
                <rect x="90" y="110" width="24" height="12" fill="#0f172a" />
                <rect x="120" y="70" width="24" height="20" fill="#0f172a" />
                <rect x="120" y="110" width="16" height="30" fill="#0f172a" />
              </svg>
              <span className="text-[11px] font-mono font-bold mt-2 text-slate-800">
                SCAN DENGAN HP SISWA
              </span>
            </div>

            {/* Match Specifications for Smart Board */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-300">
                <span className="text-slate-400">Pertandingan:</span>
                <span className="font-racing font-bold text-cyan-300 text-right">{matchTitle}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-300">
                <span className="text-slate-400">Jumlah Kelompok:</span>
                <span className="text-amber-400 font-bold">{groupCount} Kelompok</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-300">
                <span className="text-slate-400">Durasi Game:</span>
                <span className="text-cyan-400 font-bold">{durationMinutes} Menit</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Total Soal Bank:</span>
                <span className="text-emerald-400 font-bold">{totalQuestions} Soal</span>
              </div>
            </div>
          </div>

          {/* Countdown Overlay if triggered */}
          {countdown !== null && countdown > 0 && (
            <div className="p-8 text-center bg-black/90 rounded-2xl border-2 border-amber-500 animate-pulse">
              <span className="text-xs uppercase font-mono text-amber-400 tracking-widest block mb-2">
                PERTANDINGAN DIMULAI DALAM
              </span>
              <div className="font-digital text-8xl font-black text-amber-400 text-glow-amber">
                {countdown}
              </div>
            </div>
          )}

          {/* Action button */}
          {countdown === null && (
            <button
              onClick={handleTriggerCountdown}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-racing font-extrabold text-xl rounded-2xl shadow-xl shadow-emerald-950 transition active:scale-98 flex items-center justify-center gap-3 touch-target"
            >
              <Play className="w-6 h-6 fill-current" />
              BRIEFING SELESAI • MULAI PERTANDINGAN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default RoomModal;
