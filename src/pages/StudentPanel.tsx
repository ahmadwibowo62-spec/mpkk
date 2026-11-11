import React, { useState } from 'react';
import {
  Gamepad2,
  Users,
  Trophy,
  Zap,
  CheckCircle2,
  Radio,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VirtualBuzzer } from '../components/Buzzer';
import { KelompokDoc } from '../firebase/firestore';
import { sounds } from '../utils/soundEffects';

interface StudentPanelProps {
  groups: KelompokDoc[];
  onScoreUpdate: (deltaScore: number, isCorrect: boolean) => void;
  onEnterBattleArena: () => void;
}

export const StudentPanel: React.FC<StudentPanelProps> = ({
  groups,
  onScoreUpdate,
  onEnterBattleArena,
}) => {
  const { user } = useAuth();
  const [roomInput, setRoomInput] = useState('TKRO2026');
  const [selectedGroup, setSelectedGroup] = useState<string>(groups[0]?.namaKelompok || 'Kelompok A');
  const [isJoined, setIsJoined] = useState<boolean>(true);
  const [activeBuzzTeam, setActiveBuzzTeam] = useState<string | null>(null);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomInput.trim().toUpperCase() === 'TKRO2026' || roomInput.trim().length > 0) {
      sounds.playCountdown(true);
      setIsJoined(true);
    }
  };

  const currentGroupData = groups.find(g => g.namaKelompok === selectedGroup) || groups[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Student Cockpit Header */}
      <div className="p-6 bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-950 rounded-3xl border-2 border-cyan-500/40 shadow-xl text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950 border border-cyan-800 rounded-full text-cyan-300 font-racing font-bold text-xs mb-3">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          KONTROLER SISWA • SMARTPHONE / TABLET
        </div>

        <h2 className="font-racing font-extrabold text-2xl sm:text-3xl text-white">
          Selamat Datang, {user?.nama || 'Siswa TKRO'}!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Pegang ponsel Anda sebagai Virtual Buzzer kelompok untuk menjawab pertanyaan tercepat di Smart Board kelas.
        </p>
      </div>

      {!isJoined ? (
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1">
                Masukkan Kode Room dari Layar Smart Board
              </label>
              <input
                type="text"
                required
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                placeholder="Contoh: TKRO2026"
                className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-700 rounded-xl font-digital text-center text-2xl font-black text-cyan-400 uppercase tracking-widest focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1">
                Pilih Kelompok Anda
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-racing font-bold text-slate-200"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.namaKelompok}>
                    {g.namaKelompok}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-racing font-extrabold text-base rounded-xl shadow-lg transition active:scale-95"
            >
              GABUNG KE PERTANDINGAN
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status info bar */}
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Kelompok Aktif</span>
              <span className="font-racing font-bold text-cyan-300 text-sm sm:text-base">
                {selectedGroup}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Skor Tim</span>
              <span className="font-digital font-bold text-amber-400 text-lg">
                {currentGroupData ? currentGroupData.skor : 950} Pts
              </span>
            </div>
          </div>

          {/* Group Switcher dropdown if student needs to re-assign */}
          <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">Ganti Kelompok:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-transparent text-cyan-400 font-racing font-bold focus:outline-none"
            >
              {groups.map(g => (
                <option key={g.id} value={g.namaKelompok}>
                  {g.namaKelompok}
                </option>
              ))}
            </select>
          </div>

          {/* VIRTUAL BUZZER CONTROLLER */}
          <div className="p-8 bg-slate-900/90 rounded-3xl border-2 border-cyan-500/30 shadow-2xl flex flex-col items-center">
            <VirtualBuzzer
              teamName={selectedGroup}
              activeBuzzTeam={activeBuzzTeam}
              onBuzz={(team) => {
                setActiveBuzzTeam(team);
              }}
              canAnswer={true}
              onAnswer={(isCorrect) => {
                if (isCorrect) onScoreUpdate(10, true);
                else onScoreUpdate(-5, false);
                setTimeout(() => setActiveBuzzTeam(null), 1500);
              }}
            />
          </div>

          {/* Direct link to Full Battle Arena */}
          <button
            onClick={onEnterBattleArena}
            className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 font-racing font-bold text-sm rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <Gamepad2 className="w-5 h-5" />
            Tampilkan Arena Pertandingan Lengkap
          </button>
        </div>
      )}
    </div>
  );
};
export default StudentPanel;
