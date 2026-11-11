import React, { useState } from 'react';
import { Shuffle, Users, Plus, Trash2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { KelompokDoc, distributeStudentsRandomly } from '../firebase/firestore';
import { sounds } from '../utils/soundEffects';

interface GroupManagerProps {
  pertandinganId: string;
  groups: KelompokDoc[];
  onGroupsUpdated: (groups: KelompokDoc[]) => void;
}

export const GroupManager: React.FC<GroupManagerProps> = ({
  pertandinganId,
  groups,
  onGroupsUpdated,
}) => {
  const [groupCount, setGroupCount] = useState<number>(groups.length || 4);
  const [isRandomizing, setIsRandomizing] = useState<boolean>(false);

  const handleRandomize = async () => {
    setIsRandomizing(true);
    sounds.playEngineRev();
    try {
      const distributed = await distributeStudentsRandomly(pertandinganId, groupCount);
      onGroupsUpdated(distributed);
    } finally {
      setTimeout(() => {
        setIsRandomizing(false);
        sounds.playFanfare();
      }, 700);
    }
  };

  const totalMembers = groups.reduce((acc, g) => acc + g.anggota.length, 0);

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h3 className="font-racing font-extrabold text-xl text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Manajemen & Pembagian Kelompok Siswa
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Total {groups.length} Kelompok aktif • {totalMembers} Siswa terdaftar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">Jumlah Kelompok:</span>
            <select
              value={groupCount}
              onChange={(e) => setGroupCount(Number(e.target.value))}
              className="bg-transparent text-cyan-400 font-bold focus:outline-none"
            >
              <option value={2}>2 Kelompok</option>
              <option value={3}>3 Kelompok</option>
              <option value={4}>4 Kelompok (Standar)</option>
              <option value={5}>5 Kelompok</option>
              <option value={6}>6 Kelompok</option>
            </select>
          </div>

          <button
            onClick={handleRandomize}
            disabled={isRandomizing}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-racing font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-950 transition active:scale-95 touch-target"
          >
            <Shuffle className={`w-4 h-4 ${isRandomizing ? 'animate-spin' : ''}`} />
            {isRandomizing ? 'MENGACAK SISWA...' : 'ACAK OTOMATIS'}
          </button>
        </div>
      </div>

      {/* GROUPS ROSTER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups.map((group, idx) => {
          return (
            <div
              key={group.id}
              className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full ring-2 ring-slate-700"
                      style={{ backgroundColor: group.warna || '#06b6d4' }}
                    />
                    <h4 className="font-racing font-extrabold text-base text-white">
                      {group.namaKelompok}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2.5 py-0.5 rounded-full">
                    {group.anggota.length} Siswa
                  </span>
                </div>

                {/* Member List */}
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {group.anggota.map((studentName, sIdx) => (
                    <div
                      key={sIdx}
                      className="px-3 py-1.5 bg-slate-950/70 rounded-lg text-xs font-medium text-slate-300 flex items-center justify-between border border-slate-800/60"
                    >
                      <span className="truncate">{sIdx + 1}. {studentName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">TKRO</span>
                    </div>
                  ))}
                  {group.anggota.length === 0 && (
                    <div className="text-center py-6 text-slate-500 font-mono text-xs">
                      Belum ada siswa. Klik "Acak Otomatis".
                    </div>
                  )}
                </div>
              </div>

              {/* Footer stats */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Skor Saat Ini:</span>
                <span className="font-digital text-base font-bold text-cyan-400">
                  {group.skor} Pts
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default GroupManager;
