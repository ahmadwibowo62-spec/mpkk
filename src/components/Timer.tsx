import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Flame, Clock } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface TimerProps {
  initialMinutes?: number;
  initialMode?: 'turun' | 'naik';
  onTimeEnd?: () => void;
  onTick?: (secondsRemaining: number, elapsedSeconds: number) => void;
  className?: string;
  isCompact?: boolean;
}

export const DigitalTimer: React.FC<TimerProps> = ({
  initialMinutes = 15,
  initialMode = 'turun',
  onTimeEnd,
  onTick,
  className = '',
  isCompact = false,
}) => {
  const [mode, setMode] = useState<'turun' | 'naik'>(initialMode);
  const [totalSeconds, setTotalSeconds] = useState<number>(initialMinutes * 60);
  const [currentSeconds, setCurrentSeconds] = useState<number>(
    initialMode === 'turun' ? initialMinutes * 60 : 0
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setCurrentSeconds(prev => {
          if (mode === 'turun') {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              setIsRunning(false);
              sounds.playBuzzer();
              if (onTimeEnd) onTimeEnd();
              return 0;
            }
            if (prev <= 10 && prev > 1) {
              sounds.playCountdown(false);
            }
            const next = prev - 1;
            if (onTick) onTick(next, totalSeconds - next);
            return next;
          } else {
            const next = prev + 1;
            if (onTick) onTick(0, next);
            return next;
          }
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, totalSeconds, onTimeEnd, onTick]);

  const handleStart = () => {
    sounds.playCountdown(true);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'turun') {
      setCurrentSeconds(totalSeconds);
    } else {
      setCurrentSeconds(0);
    }
  };

  const handleModeChange = (newMode: 'turun' | 'naik') => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'turun') {
      setCurrentSeconds(totalSeconds);
    } else {
      setCurrentSeconds(0);
    }
  };

  const handleMinutesChange = (mins: number) => {
    setIsRunning(false);
    setTotalSeconds(mins * 60);
    if (mode === 'turun') {
      setCurrentSeconds(mins * 60);
    }
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  // Format HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = mode === 'turun' && currentSeconds <= 60 && currentSeconds > 0;
  const isCriticalTime = mode === 'turun' && currentSeconds <= 15 && currentSeconds > 0;

  if (isCompact) {
    return (
      <div className={`flex items-center gap-3 bg-slate-900/90 border border-cyan-500/30 px-3 py-1.5 rounded-xl ${className}`}>
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Clock className="w-4 h-4 animate-pulse" />
          <span className="text-xs uppercase font-bold tracking-wider">{mode === 'turun' ? 'Timer' : 'Elapsed'}</span>
        </div>
        <div className={`font-digital text-xl tracking-widest font-black ${isCriticalTime ? 'text-red-500 text-glow-red animate-pulse' : isLowTime ? 'text-amber-400 text-glow-amber' : 'text-cyan-400 text-glow-cyan'}`}>
          {formatTime(currentSeconds)}
        </div>
        <button
          onClick={isRunning ? handlePause : handleStart}
          className={`p-1.5 rounded-lg text-white font-bold text-xs transition ${isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-b from-slate-900 via-slate-950 to-black p-5 sm:p-7 rounded-2xl border-2 ${isCriticalTime ? 'border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)]'} ${className}`}>
      {/* Top Header & Mode Select */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs sm:text-sm font-racing tracking-widest uppercase font-bold text-cyan-300">
            Smart Board Race Chronometer
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => handleModeChange('turun')}
              className={`px-3 py-1 rounded transition ${mode === 'turun' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              Hitung Turun
            </button>
            <button
              onClick={() => handleModeChange('naik')}
              className={`px-3 py-1 rounded transition ${mode === 'naik' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              Hitung Naik
            </button>
          </div>

          {/* Quick presets */}
          {mode === 'turun' && (
            <div className="hidden sm:flex items-center gap-1 text-xs">
              {[5, 10, 15, 20].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleMinutesChange(mins)}
                  className={`px-2 py-1 rounded border ${totalSeconds === mins * 60 ? 'bg-slate-700 border-cyan-400 text-cyan-300' : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'}`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          )}

          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* GIANT LED DIGITAL DISPLAY */}
      <div className="relative py-4 px-6 rounded-xl bg-black/90 border border-slate-800 flex items-center justify-center overflow-hidden">
        {/* Subtle grid pattern for LED matrix feel */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:8px_8px]" />

        <div
          className={`font-digital text-5xl sm:text-7xl md:text-8xl tracking-widest font-black transition-all duration-300 select-none ${
            isCriticalTime
              ? 'text-red-500 text-glow-red scale-105 animate-pulse'
              : isLowTime
              ? 'text-amber-400 text-glow-amber'
              : 'text-cyan-400 text-glow-cyan'
          }`}
        >
          {formatTime(currentSeconds)}
        </div>
      </div>

      {/* Progress Bar for Countdown */}
      {mode === 'turun' && (
        <div className="mt-3 w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-1000 ${
              isCriticalTime ? 'bg-red-500 glow-red' : isLowTime ? 'bg-amber-400 glow-amber' : 'bg-cyan-500 glow-cyan'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, (currentSeconds / totalSeconds) * 100))}%` }}
          />
        </div>
      )}

      {/* CONTROLS BUTTONS */}
      <div className="grid grid-cols-3 gap-3 mt-5">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="col-span-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-racing font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition active:scale-95 touch-target"
          >
            <Play className="w-5 h-5 fill-current" />
            START RACING
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="col-span-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-racing font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-950 transition active:scale-95 touch-target"
          >
            <Pause className="w-5 h-5 fill-current" />
            PAUSE
          </button>
        )}

        <button
          onClick={handleReset}
          className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-racing font-semibold text-lg flex items-center justify-center gap-2 border border-slate-700 transition active:scale-95 touch-target"
        >
          <RotateCcw className="w-5 h-5" />
          RESET
        </button>
      </div>
    </div>
  );
};
export default DigitalTimer;
