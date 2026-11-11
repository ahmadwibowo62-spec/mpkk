import React, { useState } from 'react';
import {
  Gamepad2,
  Clock,
  Users,
  Settings,
  Plus,
  Play,
  Shuffle,
  BarChart3,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';
import { GroupManager } from '../components/GroupManager';
import { KelompokDoc, PertandinganDoc, savePertandingan } from '../firebase/firestore';
import { sounds } from '../utils/soundEffects';

interface TeacherPanelProps {
  groups: KelompokDoc[];
  onGroupsUpdated: (groups: KelompokDoc[]) => void;
  onStartMatchWithConfig: (match: PertandinganDoc) => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({
  groups,
  onGroupsUpdated,
  onStartMatchWithConfig,
}) => {
  const [matchTitle, setMatchTitle] = useState('Kompetisi Komponen Mesin XII TKRO 1');
  const [targetClass, setTargetClass] = useState('XII TKRO 1');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [groupCount, setGroupCount] = useState(4);
  const [gameMode, setGameMode] = useState('Speed Battle');
  const [roomCode, setRoomCode] = useState('TKRO2026');

  const handleCreateMatch = () => {
    sounds.playEngineRev();
    const newMatch: PertandinganDoc = {
      id: `match-${Date.now()}`,
      judul: matchTitle,
      kodeRoom: roomCode,
      waktuMenit: durationMinutes,
      tanggal: new Date().toISOString().split('T')[0],
      status: 'persiapan',
      modePermainan: gameMode,
      jumlahKelompok: groupCount,
      kelas: targetClass,
      currentRound: 1,
      timerMode: 'turun',
      buzzerActive: true,
      activeBuzzerTeam: null,
    };
    savePertandingan(newMatch);
    onStartMatchWithConfig(newMatch);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Teacher Cockpit Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-500/40 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-racing uppercase tracking-widest text-amber-400 font-bold bg-amber-950 border border-amber-800 px-3 py-1 rounded-full">
              👨‍🏫 Panel Kontrol Guru TKRO
            </span>
            <h2 className="font-racing font-extrabold text-2xl sm:text-3xl text-white mt-2">
              Pengaturan Pertandingan & Pembagian Regu Mesin
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Buat pertandingan baru, tetapkan durasi timer papan interaktif, bagi kelompok otomatis, dan pantau penguasaan komponen peserta didik.
            </p>
          </div>

          <button
            onClick={handleCreateMatch}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-racing font-extrabold text-base rounded-2xl shadow-xl shadow-amber-950 transition active:scale-95 touch-target"
          >
            <Play className="w-5 h-5 fill-current" />
            LUNCURKAN PERTANDINGAN
          </button>
        </div>
      </div>

      {/* MATCH CONFIG FORM */}
      <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
        <h3 className="font-racing font-extrabold text-xl text-white mb-6 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-cyan-400" />
          Konfigurasi Pertandingan Baru
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Judul */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1.5">
              Nama Pertandingan / Kompetisi
            </label>
            <input
              type="text"
              value={matchTitle}
              onChange={(e) => setMatchTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 font-medium"
            />
          </div>

          {/* Kode Room */}
          <div>
            <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1.5">
              Kode Room Akses Siswa
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 bg-slate-950 border border-amber-500/60 rounded-xl font-digital text-lg font-bold text-amber-300 focus:outline-none"
            />
          </div>

          {/* Kelas */}
          <div>
            <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1.5">
              Target Kelas
            </label>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="X TKRO 1">X TKRO 1</option>
              <option value="XI TKRO 1">XI TKRO 1</option>
              <option value="XII TKRO 1">XII TKRO 1</option>
              <option value="XII TKRO 2">XII TKRO 2</option>
            </select>
          </div>

          {/* Durasi */}
          <div>
            <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1.5">
              Durasi Waktu Pertandingan
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value={10}>10 Menit (Sprint)</option>
              <option value={15}>15 Menit (Standar)</option>
              <option value={20}>20 Menit (Turnamen Penuh)</option>
              <option value={30}>30 Menit (Eksplorasi Lengkap)</option>
            </select>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1.5">
              Mode Pertandingan
            </label>
            <select
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="Speed Battle">Speed Battle (Buzzer & Time Attack)</option>
              <option value="Team Knockout">Team Knockout</option>
              <option value="Survival Otomotif">Survival Otomotif</option>
            </select>
          </div>
        </div>
      </div>

      {/* GROUP RANDOMIZER SECTION */}
      <GroupManager
        pertandinganId="match-default-1"
        groups={groups}
        onGroupsUpdated={onGroupsUpdated}
      />
    </div>
  );
};
export default TeacherPanel;
