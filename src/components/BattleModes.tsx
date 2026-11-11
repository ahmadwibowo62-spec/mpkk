import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Volume2,
  Timer as TimerIcon,
  RotateCcw,
  Layers,
  Search,
  Shuffle,
} from 'lucide-react';
import { ENGINE_COMPONENTS, EngineComponent, SEED_QUESTIONS, QuizQuestion } from '../data/componentsData';
import { ComponentIllustration } from './ComponentIllustration';
import { VirtualBuzzer } from './Buzzer';
import { sounds } from '../utils/soundEffects';

interface BattleModesProps {
  currentRound: number;
  activeTeamName: string;
  onScoreUpdate: (deltaScore: number, isCorrect: boolean) => void;
  onNextRound: () => void;
}

export const BattleModes: React.FC<BattleModesProps> = ({
  currentRound,
  activeTeamName,
  onScoreUpdate,
  onNextRound,
}) => {
  // Round 1 state: Tebak Nama Komponen
  const [r1Index, setR1Index] = useState(0);
  const [r1BuzzerTeam, setR1BuzzerTeam] = useState<string | null>(null);
  const [r1AnswerRevealed, setR1AnswerRevealed] = useState(false);

  // Round 2 state: Drag and Drop
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [r2Matches, setR2Matches] = useState<Record<string, string>>({});
  const [r2Feedback, setR2Feedback] = useState<string | null>(null);

  // Round 3 state: Puzzle Mesin
  const puzzleTargetOrder = [
    { id: 'crankshaft', label: '1. Crankshaft (Poros Engkol - Pondasi Rotasi)' },
    { id: 'connecting-rod', label: '2. Connecting Rod (Batang Piston)' },
    { id: 'piston', label: '3. Piston & Ring Piston' },
    { id: 'blok-silinder', label: '4. Blok Silinder (Cylinder Block)' },
    { id: 'kepala-silinder', label: '5. Kepala Silinder (Cylinder Head)' },
    { id: 'camshaft', label: '6. Camshaft (Poros Nok Pengatur Katup)' },
    { id: 'timing-belt', label: '7. Timing Belt / Chain Penyelaras' },
  ];
  const [assembledParts, setAssembledParts] = useState<string[]>([]);
  const [puzzleComplete, setPuzzleComplete] = useState<boolean>(false);

  // Round 4 state: Speed Quiz (10 detik)
  const speedQuestions = SEED_QUESTIONS.filter(q => q.tipe === 'speed-quiz');
  const [sqIndex, setSqIndex] = useState(0);
  const [sqTimer, setSqTimer] = useState(10);
  const [sqSelected, setSqSelected] = useState<string | null>(null);
  const [sqAnswered, setSqAnswered] = useState(false);

  // Round 5 state: Find The Component
  const [targetFindId, setTargetFindId] = useState<string>('water-pump');
  const [foundSuccess, setFoundSuccess] = useState<boolean | null>(null);

  // Round 6 state: Match Component Function
  const functionPairs = [
    { compId: 'piston', compName: 'Piston', functionText: 'Menerima tekanan gas pembakaran dan meneruskannya ke kruk as' },
    { compId: 'crankshaft', compName: 'Crankshaft', functionText: 'Mengubah gerak naik-turun piston menjadi gerak putar' },
    { compId: 'camshaft', compName: 'Camshaft', functionText: 'Mengatur waktu buka-tutup katup hisap dan katup buang' },
    { compId: 'injektor', compName: 'Injektor', functionText: 'Mengabutkan bensin bertekanan tinggi ke silinder / intake' },
    { compId: 'koil', compName: 'Ignition Coil', functionText: 'Menaikkan tegangan 12V aki menjadi 20-45 kV untuk percikan busi' },
  ];
  const [selectedMatchComp, setSelectedMatchComp] = useState<string | null>(null);
  const [matchedFunctions, setMatchedFunctions] = useState<Record<string, string>>({});

  // Bonus state:
  const bonusQuestion = SEED_QUESTIONS.find(q => q.tipe === 'bonus') || SEED_QUESTIONS[0];
  const [bonusTimer, setBonusTimer] = useState(20);
  const [bonusSelected, setBonusSelected] = useState<string | null>(null);

  // Read question text with Text-To-Speech
  const handleTTS = (text: string) => {
    sounds.speakQuestion(text);
  };

  // Speed Quiz 10s Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentRound === 4 && !sqAnswered && sqTimer > 0) {
      timer = setInterval(() => {
        setSqTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setSqAnswered(true);
            sounds.playWrong();
            onScoreUpdate(-5, false);
            return 0;
          }
          if (prev <= 4) {
            sounds.playCountdown(false);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentRound, sqTimer, sqAnswered, onScoreUpdate]);

  // Round 1 components list for guessing
  const r1Components = [
    ENGINE_COMPONENTS.find(c => c.id === 'piston')!,
    ENGINE_COMPONENTS.find(c => c.id === 'camshaft')!,
    ENGINE_COMPONENTS.find(c => c.id === 'koil')!,
    ENGINE_COMPONENTS.find(c => c.id === 'flywheel')!,
    ENGINE_COMPONENTS.find(c => c.id === 'injektor')!,
  ];
  const activeR1Component = r1Components[r1Index % r1Components.length];

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-cyan-500/30 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      {/* MODE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-racing uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/70 border border-cyan-800 px-3 py-1 rounded-full">
            Round {currentRound} of 6
          </span>
          <h2 className="text-xl sm:text-2xl font-racing font-extrabold text-white mt-2 flex items-center gap-2">
            {currentRound === 1 && '🏁 Mode 1: Tebak Nama Komponen Mesin'}
            {currentRound === 2 && '🧩 Mode 2: Drag and Drop Hotspot Komponen'}
            {currentRound === 3 && '⚙️ Mode 3: Puzzle Perakitan Komponen Mesin'}
            {currentRound === 4 && '⚡ Mode 4: Speed Quiz 10 Detik'}
            {currentRound === 5 && '🔍 Mode 5: Find The Component Mesin'}
            {currentRound === 6 && '🔗 Mode 6: Match Component Function'}
            {currentRound === 7 && '🔥 BONUS CHALLENGE (+50 POIN)'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Kelompok Aktif</span>
            <span className="font-racing font-bold text-cyan-300 text-sm">{activeTeamName}</span>
          </div>

          <button
            onClick={onNextRound}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-racing font-bold text-sm rounded-xl shadow-lg transition active:scale-95"
          >
            Lanjut Ronde <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= ROUND 1: TEBAK NAMA KOMPONEN ================= */}
      {currentRound === 1 && (
        <div className="mt-6 space-y-6">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <p className="text-sm sm:text-base text-slate-300">
              <strong className="text-cyan-400">Aturan Ronde:</strong> Tekan Virtual Buzzer secepatnya! Kelompok tercepat berhak menjawab. Benar = <span className="text-emerald-400 font-bold">+10 poin</span>, Salah = <span className="text-red-400 font-bold">-5 poin</span>.
            </p>
            <button
              onClick={() => handleTTS(`Komponen mesin apakah ini? Perhatikan gambar dengan teliti!`)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg border border-slate-700 transition"
              title="Bacakan Soal (Text-To-Speech)"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Component Visual Exhibition */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-3">
                Identifikasi Komponen #{r1Index + 1}
              </span>
              <ComponentIllustration type={activeR1Component.id} className="w-56 h-56 sm:w-64 sm:h-64" />

              {r1AnswerRevealed && (
                <div className="mt-4 p-4 rounded-xl bg-cyan-950/40 border border-cyan-800 text-center animate-fadeIn">
                  <h4 className="font-racing font-extrabold text-xl text-cyan-300">{activeR1Component.nama}</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm">{activeR1Component.fungsi}</p>
                </div>
              )}
            </div>

            {/* Virtual Buzzer & Controls */}
            <div className="flex flex-col items-center justify-center">
              <VirtualBuzzer
                teamName={activeTeamName}
                activeBuzzTeam={r1BuzzerTeam}
                onBuzz={(team) => {
                  setR1BuzzerTeam(team);
                }}
                canAnswer={true}
                onAnswer={(isCorrect) => {
                  if (isCorrect) {
                    onScoreUpdate(10, true);
                  } else {
                    onScoreUpdate(-5, false);
                  }
                  setR1AnswerRevealed(true);
                  setTimeout(() => {
                    setR1BuzzerTeam(null);
                    setR1AnswerRevealed(false);
                    setR1Index(prev => prev + 1);
                  }, 1800);
                }}
              />

              {/* Quick Choice Buttons for Smart Board Touch Screen */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-6">
                {[
                  activeR1Component.nama,
                  r1Index % 2 === 0 ? 'Crankshaft' : 'Connecting Rod',
                  r1Index % 3 === 0 ? 'Water Pump' : 'Flywheel',
                  'Camshaft',
                ]
                  .sort(() => 0.5 - Math.random())
                  .map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (opt === activeR1Component.nama) {
                          sounds.playCorrect();
                          onScoreUpdate(10, true);
                          setR1AnswerRevealed(true);
                        } else {
                          sounds.playWrong();
                          onScoreUpdate(-5, false);
                        }
                        setTimeout(() => {
                          setR1AnswerRevealed(false);
                          setR1Index(prev => prev + 1);
                        }, 1200);
                      }}
                      className="p-3 bg-slate-800 hover:bg-cyan-900/60 border border-slate-700 hover:border-cyan-400 rounded-xl text-slate-200 font-racing font-bold text-sm text-center transition active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ROUND 2: DRAG AND DROP ================= */}
      {currentRound === 2 && (
        <div className="mt-6 space-y-6">
          <p className="text-sm text-slate-300">
            Tarik (Drag) atau klik nama komponen, kemudian letakkan pada kotak gambar komponen yang sesuai!
          </p>

          {/* Draggable Component Names */}
          <div className="flex flex-wrap gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
            {['Piston', 'Crankshaft', 'Camshaft', 'Busi', 'Injektor'].map((name) => {
              const isUsed = Object.values(r2Matches).includes(name);
              return (
                <button
                  key={name}
                  onClick={() => setDraggedItem(name)}
                  className={`px-4 py-2.5 rounded-xl font-racing font-bold text-sm transition cursor-pointer select-none ${
                    draggedItem === name
                      ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-400/50 scale-105'
                      : isUsed
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 line-through'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-400 hover:text-white'
                  }`}
                >
                  ⚡ {name}
                </button>
              );
            })}
          </div>

          {/* Drop Targets */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { id: 'piston', expected: 'Piston' },
              { id: 'crankshaft', expected: 'Crankshaft' },
              { id: 'camshaft', expected: 'Camshaft' },
              { id: 'spark-plug', expected: 'Busi' },
              { id: 'injektor', expected: 'Injektor' },
            ].map(slot => {
              const matched = r2Matches[slot.id];
              const isCorrect = matched === slot.expected;

              return (
                <div
                  key={slot.id}
                  onClick={() => {
                    if (draggedItem) {
                      setR2Matches(prev => ({ ...prev, [slot.id]: draggedItem }));
                      if (draggedItem === slot.expected) {
                        sounds.playCorrect();
                        onScoreUpdate(10, true);
                      } else {
                        sounds.playWrong();
                        onScoreUpdate(-5, false);
                      }
                      setDraggedItem(null);
                    }
                  }}
                  className={`p-3 bg-slate-950 rounded-xl border-2 transition flex flex-col items-center justify-between gap-2 min-h-[190px] cursor-pointer ${
                    matched
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-950/20'
                        : 'border-red-500 bg-red-950/20'
                      : draggedItem
                      ? 'border-cyan-500/80 border-dashed animate-pulse'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <ComponentIllustration type={slot.id} className="w-24 h-24" />
                  <div className="w-full text-center">
                    {matched ? (
                      <span className={`text-xs font-racing font-bold px-2 py-1 rounded-md block ${isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'}`}>
                        {matched} {isCorrect ? '✓' : '✗'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 uppercase font-mono">
                        Ketuk untuk Pasang
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= ROUND 3: PUZZLE MESIN ================= */}
      {currentRound === 3 && (
        <div className="mt-6 space-y-6">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-racing font-bold text-white text-base">Susun Urutan Perakitan Blok Mesin (Exploded Engine Assembly)</h4>
            <p className="text-xs text-slate-400 mt-1">
              Urutkan komponen dari bawah kruk as sampai atas katup camshaft secara mekanis yang tepat!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unassembled Pool */}
            <div className="space-y-2">
              <h5 className="text-xs uppercase font-mono tracking-wider text-slate-400">Pilihan Bagian Mesin:</h5>
              {puzzleTargetOrder.map((part) => {
                const isSelected = assembledParts.includes(part.id);
                return (
                  <button
                    key={part.id}
                    disabled={isSelected}
                    onClick={() => {
                      const next = [...assembledParts, part.id];
                      setAssembledParts(next);
                      sounds.playCountdown(false);
                      if (next.length === puzzleTargetOrder.length) {
                        sounds.playCorrect();
                        onScoreUpdate(30, true);
                        setPuzzleComplete(true);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl border font-racing text-sm font-semibold transition ${
                      isSelected
                        ? 'bg-slate-900 text-slate-600 border-slate-800 line-through'
                        : 'bg-slate-800 hover:bg-cyan-950/50 text-slate-200 border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    + {part.label}
                  </button>
                );
              })}
            </div>

            {/* Assembled Stack Diagram */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h5 className="text-xs uppercase font-mono tracking-wider text-cyan-400 mb-3">
                  Status Perakitan Mesin ({assembledParts.length}/{puzzleTargetOrder.length})
                </h5>
                <div className="space-y-2">
                  {assembledParts.map((id, idx) => {
                    const info = puzzleTargetOrder.find(p => p.id === id);
                    return (
                      <div
                        key={id}
                        className="p-2.5 bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-800/80 rounded-lg text-cyan-300 font-racing font-bold text-sm flex items-center justify-between"
                      >
                        <span>{idx + 1}. {info?.label.split('(')[0]}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    );
                  })}
                  {assembledParts.length === 0 && (
                    <div className="text-center py-10 text-slate-500 font-mono text-xs">
                      Mesin masih terurai. Klik komponen di sebelah kiri untuk merakit!
                    </div>
                  )}
                </div>
              </div>

              {assembledParts.length > 0 && (
                <button
                  onClick={() => setAssembledParts([])}
                  className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white py-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Ulang Perakitan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= ROUND 4: SPEED QUIZ ================= */}
      {currentRound === 4 && (
        <div className="mt-6 space-y-6">
          {/* 10-Second Speed Timer */}
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <TimerIcon className={`w-6 h-6 ${sqTimer <= 3 ? 'text-red-500 animate-bounce' : 'text-amber-400'}`} />
              <div>
                <span className="text-xs uppercase font-mono text-slate-400">Time Attack</span>
                <div className="text-xs text-slate-300">10 Detik Per Soal</div>
              </div>
            </div>
            <div className={`font-digital text-4xl font-black ${sqTimer <= 3 ? 'text-red-500 text-glow-red animate-pulse' : 'text-amber-400 text-glow-amber'}`}>
              00:0{sqTimer}
            </div>
          </div>

          {/* Current Question */}
          {speedQuestions[sqIndex] && (
            <div className="space-y-4">
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                  Pertanyaan #{sqIndex + 1}
                </span>
                <h3 className="font-racing font-bold text-lg sm:text-xl text-white">
                  {speedQuestions[sqIndex].pertanyaan}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {speedQuestions[sqIndex].pilihan?.map((opt, i) => {
                  const isCorrect = opt === speedQuestions[sqIndex].jawabanBenar;
                  const isChosen = sqSelected === opt;

                  return (
                    <button
                      key={i}
                      disabled={sqAnswered}
                      onClick={() => {
                        setSqSelected(opt);
                        setSqAnswered(true);
                        if (isCorrect) {
                          sounds.playCorrect();
                          onScoreUpdate(15, true);
                        } else {
                          sounds.playWrong();
                          onScoreUpdate(-5, false);
                        }
                      }}
                      className={`p-4 rounded-xl text-left font-racing font-semibold text-sm transition border ${
                        sqAnswered
                          ? isCorrect
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                            : isChosen
                            ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                          : 'bg-slate-800/80 hover:bg-cyan-950/50 border-slate-700 hover:border-cyan-400 text-slate-200'
                      }`}
                    >
                      <span className="inline-block w-6 h-6 rounded-md bg-slate-700 text-center leading-6 text-xs mr-2 font-mono">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {sqAnswered && (
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 animate-fadeIn">
                  <p className="text-xs text-slate-300">{speedQuestions[sqIndex].penjelasan}</p>
                  <button
                    onClick={() => {
                      setSqIndex(prev => (prev + 1) % speedQuestions.length);
                      setSqTimer(10);
                      setSqSelected(null);
                      setSqAnswered(false);
                    }}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-racing font-bold text-xs rounded-lg transition"
                  >
                    Soal Berikutnya →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= ROUND 5: FIND THE COMPONENT ================= */}
      {currentRound === 5 && (
        <div className="mt-6 space-y-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-mono text-cyan-400">Misi Deteksi:</span>
              <h3 className="font-racing font-extrabold text-xl text-white">
                Cari & Sentuh Komponen: <span className="text-amber-400">WATER PUMP</span>
              </h3>
            </div>
            <button
              onClick={() => handleTTS('Cari dan ketuk letak Water Pump pada diagram mesin!')}
              className="p-2 bg-slate-800 text-cyan-400 rounded-lg border border-slate-700"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Schematic Diagram Engine Blueprint */}
          <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden carbon-pattern flex items-center justify-center p-4">
            <svg viewBox="0 0 800 500" className="w-full h-full">
              {/* Engine Block Silhouette Blueprint */}
              <rect x="250" y="150" width="300" height="240" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6,4" />
              <rect x="230" y="80" width="340" height="80" rx="12" fill="#334155" stroke="#64748b" strokeWidth="3" />

              {/* Radiator on far left */}
              <rect x="50" y="120" width="80" height="260" rx="8" fill="#0369a1" stroke="#38bdf8" strokeWidth="3" />
              <text x="90" y="250" textAnchor="middle" fill="#bae6fd" fontSize="14" fontWeight="bold">RADIATOR</text>

              {/* Flywheel on far right */}
              <circle cx="680" cy="360" r="70" fill="#475569" stroke="#f59e0b" strokeWidth="4" />
              <text x="680" y="365" textAnchor="middle" fill="#fef08a" fontSize="13" fontWeight="bold">FLYWHEEL</text>

              {/* Hotspot 1: Cylinder Head */}
              <circle
                cx="400"
                cy="120"
                r="30"
                fill="rgba(6, 182, 212, 0.2)"
                stroke="#06b6d4"
                strokeWidth="2"
                className="cursor-pointer hover:fill-cyan-500/50"
                onClick={() => {
                  sounds.playWrong();
                  setFoundSuccess(false);
                  onScoreUpdate(-5, false);
                }}
              />
              <text x="400" y="125" textAnchor="middle" fill="#67e8f9" fontSize="11">Kepala Silinder</text>

              {/* Hotspot 2: Water Pump (CORRECT TARGET) */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  sounds.playCorrect();
                  setFoundSuccess(true);
                  onScoreUpdate(20, true);
                }}
              >
                <circle
                  cx="180"
                  cy="250"
                  r="36"
                  fill="rgba(34, 197, 94, 0.25)"
                  stroke="#22c55e"
                  strokeWidth="3"
                  className="animate-pulse"
                />
                <circle cx="180" cy="250" r="16" fill="#15803d" />
                <text x="180" y="305" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="bold">
                  WATER PUMP
                </text>
              </g>

              {/* Hotspot 3: Oil Pump */}
              <circle
                cx="350"
                cy="420"
                r="26"
                fill="rgba(245, 158, 11, 0.2)"
                stroke="#f59e0b"
                strokeWidth="2"
                className="cursor-pointer"
                onClick={() => {
                  sounds.playWrong();
                  setFoundSuccess(false);
                  onScoreUpdate(-5, false);
                }}
              />
              <text x="350" y="425" textAnchor="middle" fill="#fcd34d" fontSize="11">Oil Pump</text>
            </svg>

            {foundSuccess !== null && (
              <div className={`absolute bottom-4 inset-x-4 p-3 rounded-xl text-center font-racing font-bold text-sm ${foundSuccess ? 'bg-emerald-600 text-white animate-bounce' : 'bg-rose-600 text-white'}`}>
                {foundSuccess ? '✓ TEPAT SEKALI! Water pump mengalirkan coolant antara radiator dan water jacket mesin (+20 Pts)' : '✗ BUKAN DISITU! Itu bukan letak pompa air pendingin (-5 Pts)'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= ROUND 6: MATCH FUNCTION ================= */}
      {currentRound === 6 && (
        <div className="mt-6 space-y-6">
          <p className="text-sm text-slate-300">
            Hubungkan Komponen di kolom kiri dengan Fungsi Mekanikal yang sesuai di kolom kanan:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Component Cards */}
            <div className="space-y-3">
              <h5 className="text-xs font-mono uppercase text-cyan-400">Pilih Komponen:</h5>
              {functionPairs.map(p => {
                const isSelected = selectedMatchComp === p.compId;
                const isDone = Boolean(matchedFunctions[p.compId]);

                return (
                  <button
                    key={p.compId}
                    disabled={isDone}
                    onClick={() => setSelectedMatchComp(p.compId)}
                    className={`w-full p-3.5 rounded-xl text-left font-racing font-bold text-sm transition border flex items-center justify-between ${
                      isDone
                        ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                        : isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 ring-2 ring-cyan-300'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <span>⚡ {p.compName}</span>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Function Cards */}
            <div className="space-y-3">
              <h5 className="text-xs font-mono uppercase text-amber-400">Pilih Fungsi Yang Cocok:</h5>
              {functionPairs
                .slice()
                .reverse()
                .map((p, idx) => {
                  const isMatched = Object.values(matchedFunctions).includes(p.functionText);

                  return (
                    <button
                      key={idx}
                      disabled={isMatched || !selectedMatchComp}
                      onClick={() => {
                        if (!selectedMatchComp) return;
                        const matchTarget = functionPairs.find(item => item.compId === selectedMatchComp);
                        if (matchTarget && matchTarget.functionText === p.functionText) {
                          sounds.playCorrect();
                          setMatchedFunctions(prev => ({ ...prev, [selectedMatchComp]: p.functionText }));
                          onScoreUpdate(15, true);
                        } else {
                          sounds.playWrong();
                          onScoreUpdate(-5, false);
                        }
                        setSelectedMatchComp(null);
                      }}
                      className={`w-full p-3 rounded-xl text-left font-racing text-xs sm:text-sm transition border ${
                        isMatched
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 line-through'
                          : selectedMatchComp
                          ? 'bg-slate-900 border-amber-500/50 hover:bg-amber-950/40 text-slate-200 cursor-pointer'
                          : 'bg-slate-950/60 border-slate-800 text-slate-500'
                      }`}
                    >
                      {p.functionText}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ================= BONUS ROUND (+50 POIN) ================= */}
      {currentRound === 7 && (
        <div className="mt-6 space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950 via-amber-950 to-red-950 border-2 border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.3)]">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 rounded-full font-racing font-black text-xs uppercase tracking-wider animate-pulse">
                <Flame className="w-4 h-4 fill-current" />
                SUPER BONUS ROUND (+50 POIN)
              </span>
              <span className="font-digital text-2xl text-amber-300 font-bold">20s</span>
            </div>

            <h3 className="font-racing font-extrabold text-xl text-white mb-4">
              {bonusQuestion.pertanyaan}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bonusQuestion.pilihan?.map((opt, i) => (
                <button
                  key={i}
                  disabled={!!bonusSelected}
                  onClick={() => {
                    setBonusSelected(opt);
                    if (opt === bonusQuestion.jawabanBenar) {
                      sounds.playFanfare();
                      onScoreUpdate(50, true);
                    } else {
                      sounds.playWrong();
                      onScoreUpdate(-10, false);
                    }
                  }}
                  className={`p-4 rounded-xl text-left font-racing font-semibold text-sm transition border ${
                    bonusSelected === opt
                      ? opt === bonusQuestion.jawabanBenar
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-rose-600 text-white border-rose-400'
                      : 'bg-slate-900/90 hover:bg-amber-950/50 border-amber-500/40 text-slate-100 hover:border-amber-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {bonusSelected && (
              <div className="mt-4 p-4 rounded-xl bg-black/60 border border-amber-500/40 text-amber-200 text-xs">
                {bonusQuestion.penjelasan}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default BattleModes;
