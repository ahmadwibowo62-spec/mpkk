import React, { useState } from 'react';
import { Settings, Volume2, Cloud, RotateCcw, Monitor, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { isFirebaseConfigured, firebaseConfig } from '../firebase/firebaseConfig';
import { sounds } from '../utils/soundEffects';

interface SettingsViewProps {
  onResetData: () => void;
  onOpenFirebaseGuide: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onResetData,
  onOpenFirebaseGuide,
}) => {
  const [smartBoardMode, setSmartBoardMode] = useState(true);
  const [autoTTS, setAutoTTS] = useState(true);

  return (
    <div className="max-w-3xl space-y-6 animate-fadeIn pb-12">
      <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl">
        <h3 className="font-racing font-extrabold text-2xl text-white mb-2 flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          Pengaturan Sistem & Papan Interaktif
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Sesuaikan konfigurasi tampilan, audio efek balap, dan koneksi database Firestore
        </p>
      </div>

      {/* SMART BOARD SETTINGS */}
      <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <h4 className="font-racing font-bold text-lg text-white flex items-center gap-2">
          <Monitor className="w-5 h-5 text-cyan-400" />
          Mode Papan Interaktif Digital (Smart Board)
        </h4>

        <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
          <div>
            <span className="font-racing font-bold text-sm text-slate-200 block">
              Ukuran Touch-Target Ekstra Besar
            </span>
            <span className="text-xs text-slate-400">
              Mengoptimalkan area tombol untuk sentuhan tangan pada Interactive Whiteboard
            </span>
          </div>
          <input
            type="checkbox"
            checked={smartBoardMode}
            onChange={(e) => setSmartBoardMode(e.target.checked)}
            className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
          <div>
            <span className="font-racing font-bold text-sm text-slate-200 block">
              Text-To-Speech (TTS) Otomatis
            </span>
            <span className="text-xs text-slate-400">
              Membacakan pertanyaan otomatis dengan suara narator bahasa Indonesia
            </span>
          </div>
          <input
            type="checkbox"
            checked={autoTTS}
            onChange={(e) => setAutoTTS(e.target.checked)}
            className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* FIREBASE CONNECTION STATUS */}
      <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-racing font-bold text-lg text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-amber-400" />
            Status Firebase & Firestore Database
          </h4>
          <button
            onClick={onOpenFirebaseGuide}
            className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-racing font-bold hover:bg-amber-500/30 transition"
          >
            Lihat Tutorial
          </button>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Firebase Auth:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Aktif (Email & Google Login)
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Cloud Firestore:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Terkoneksi Real-time
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Project ID:</span>
            <span className="text-cyan-400">{firebaseConfig.projectId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Mode Penyimpanan:</span>
            <span className="text-slate-200">Hybrid Reactive (Firestore Cloud + Local Pub/Sub)</span>
          </div>
        </div>
      </div>

      {/* RESET GAME DATA */}
      <div className="p-6 bg-slate-900/90 rounded-3xl border border-rose-950 shadow-xl flex items-center justify-between">
        <div>
          <h4 className="font-racing font-bold text-base text-rose-300">
            Reset Data Game & Skor Siswa
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Mengembalikan seluruh data soal, leaderboard, dan skor ke data awal pabrikan (Seed Data).
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Yakin ingin mereset seluruh data kembali ke setelan default?')) {
              onResetData();
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-racing font-bold text-xs rounded-xl shadow-lg transition active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Default
        </button>
      </div>
    </div>
  );
};
export default SettingsView;
