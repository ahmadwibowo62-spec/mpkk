import React, { useState, useEffect } from 'react';
import { Volume2, Zap, ShieldAlert, Award, CheckCircle2, XCircle } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface BuzzerProps {
  teamName: string;
  teamColor?: string;
  isLocked?: boolean;
  activeBuzzTeam?: string | null;
  onBuzz: (teamName: string) => void;
  onAnswer?: (isCorrect: boolean) => void;
  canAnswer?: boolean;
  disabled?: boolean;
  countdownSeconds?: number;
}

export const VirtualBuzzer: React.FC<BuzzerProps> = ({
  teamName,
  teamColor = '#06b6d4',
  isLocked = false,
  activeBuzzTeam = null,
  onBuzz,
  onAnswer,
  canAnswer = false,
  disabled = false,
  countdownSeconds = 5,
}) => {
  const [pressed, setPressed] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(countdownSeconds);

  const isCurrentBuzz = activeBuzzTeam === teamName;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCurrentBuzz && canAnswer && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            sounds.playWrong();
            if (onAnswer) onAnswer(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCurrentBuzz, canAnswer, timeLeft, onAnswer]);

  const handlePress = () => {
    if (disabled || isLocked || activeBuzzTeam) return;
    setPressed(true);
    sounds.playBuzzer();
    onBuzz(teamName);
    setTimeLeft(countdownSeconds);
    setTimeout(() => setPressed(false), 300);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Status banner */}
      <div className="mb-4 text-center">
        {activeBuzzTeam ? (
          isCurrentBuzz ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500 rounded-full text-emerald-400 font-racing font-bold text-sm sm:text-base animate-bounce">
              <Zap className="w-5 h-5 fill-current" />
              BUZZER DIREBUT! GILIRAN {teamName.toUpperCase()} MENJAWAB ({timeLeft}s)
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-950/60 border border-red-800/80 rounded-full text-red-400 text-xs sm:text-sm">
              <ShieldAlert className="w-4 h-4" />
              Terkunci: {activeBuzzTeam} sedang menjawab...
            </div>
          )
        ) : (
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono animate-pulse">
            SIAP-SIAP TEKAN BUZZER TERCEPAT!
          </div>
        )}
      </div>

      {/* GIANT 3D RACING PUSH BUTTON */}
      <div className="relative group">
        {/* Outer Glow Halo */}
        <div
          className={`absolute -inset-4 rounded-full blur-xl transition duration-500 opacity-60 ${
            isCurrentBuzz
              ? 'bg-emerald-500'
              : activeBuzzTeam
              ? 'bg-slate-800'
              : 'bg-red-600 group-hover:opacity-100'
          }`}
        />

        <button
          onClick={handlePress}
          disabled={disabled || isLocked || !!activeBuzzTeam}
          className={`relative w-44 h-44 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center transition-all duration-150 transform active:scale-90 border-8 touch-target select-none shadow-2xl ${
            isCurrentBuzz
              ? 'bg-gradient-to-b from-emerald-500 to-green-700 border-emerald-300 text-white shadow-[0_15px_0_#14532d]'
              : activeBuzzTeam
              ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed shadow-[0_10px_0_#0f172a]'
              : 'bg-gradient-to-b from-red-500 via-red-600 to-red-800 border-red-300 hover:brightness-110 text-white shadow-[0_16px_0_#7f1d1d]'
          } ${pressed ? 'translate-y-3 shadow-[0_4px_0_#7f1d1d]' : ''}`}
        >
          {/* Inner ring & reflections */}
          <div className="absolute inset-3 rounded-full border-2 border-white/30 pointer-events-none" />
          <div className="absolute top-4 left-8 right-8 h-12 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none" />

          <Zap className={`w-12 h-12 sm:w-16 sm:h-16 mb-1 ${pressed ? 'scale-125' : ''} transition-transform`} />
          <span className="font-racing font-extrabold text-2xl sm:text-3xl tracking-wider drop-shadow-md">
            {isCurrentBuzz ? 'MENJAWAB' : 'BUZZ!'}
          </span>
          <span className="text-xs uppercase tracking-widest font-mono text-white/80">
            {teamName}
          </span>
        </button>
      </div>

      {/* Teacher / Referee evaluation buttons if active */}
      {isCurrentBuzz && onAnswer && (
        <div className="flex items-center gap-4 mt-6 animate-fadeIn">
          <button
            onClick={() => {
              sounds.playCorrect();
              onAnswer(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-racing font-bold text-lg rounded-xl shadow-lg shadow-emerald-950 transition active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5" />
            BENAR (+10)
          </button>
          <button
            onClick={() => {
              sounds.playWrong();
              onAnswer(false);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-racing font-bold text-lg rounded-xl shadow-lg shadow-rose-950 transition active:scale-95"
          >
            <XCircle className="w-5 h-5" />
            SALAH (-5)
          </button>
        </div>
      )}
    </div>
  );
};
export default VirtualBuzzer;
