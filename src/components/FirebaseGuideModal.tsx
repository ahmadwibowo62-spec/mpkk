import React, { useState } from 'react';
import { Database, ShieldCheck, Server, Cloud, Copy, Check, X, FileCode, CheckCircle2 } from 'lucide-react';

interface FirebaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseGuideModal: React.FC<FirebaseGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'firestore' | 'rules' | 'storage'>('tutorial');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const firestoreRulesCode = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return request.auth.token.role == "admin";
    }

    function isTeacher() {
      return request.auth.token.role == "guru";
    }

    function isStudent() {
      return request.auth.token.role == "siswa";
    }

    // Profil Pengguna (Admin, Guru, Siswa)
    match /users/{userId} {
      allow read: if signedIn();
      allow write: if isAdmin();
    }

    // Bank Soal Komponen Mesin
    match /soal/{doc} {
      allow read: if signedIn();
      allow create, update, delete: if isAdmin() || isTeacher();
    }

    // Pertandingan Speed Battle
    match /pertandingan/{doc} {
      allow read: if signedIn();
      allow create, update: if isAdmin() || isTeacher();
    }

    // Skor Kelompok
    match /kelompok/{doc} {
      allow read: if signedIn();
      allow write: if isAdmin() || isTeacher();
    }

    // Hasil Akhir Siswa
    match /hasil/{doc} {
      allow read: if signedIn();
      allow create: if signedIn();
      allow update: if isAdmin() || isTeacher();
    }
  }
}`;

  const storageRulesCode = `rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == "admin" || request.auth.token.role == "guru";
    }
  }
}`;

  const deployTerminalCode = `# 1. Install Firebase CLI secara global
npm install -g firebase-tools

# 2. Login akun Google / Firebase Anda
firebase login

# 3. Inisialisasi Firebase pada folder project ini
firebase init hosting

# Pilih opsi:
# - What do you want to use as your public directory? dist
# - Configure as a single-page app (rewrite all urls to /index.html)? Yes
# - Set up automatic builds and deploys with GitHub? No (opsional)

# 4. Build aplikasi React produksi
npm run build

# 5. Deploy ke Firebase Hosting (Live Online!)
firebase deploy --only hosting`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-5 h-5 text-amber-400" />
            <h3 className="font-racing font-extrabold text-lg text-white">
              Panduan Deployment Firebase Hosting & Integrasi Firestore Efisien
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto text-xs font-racing font-bold">
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`px-4 py-2.5 border-b-2 transition ${activeTab === 'tutorial' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            🚀 Tutorial Deploy Hosting
          </button>
          <button
            onClick={() => setActiveTab('firestore')}
            className={`px-4 py-2.5 border-b-2 transition ${activeTab === 'firestore' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            ⚡ Manajemen Firestore Efisien
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2.5 border-b-2 transition ${activeTab === 'rules' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            🛡️ Firestore Security Rules
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2.5 border-b-2 transition ${activeTab === 'storage' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            📦 Firebase Storage Rules
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
          {activeTab === 'tutorial' && (
            <div className="space-y-4">
              <div className="p-4 bg-cyan-950/40 border border-cyan-800/80 rounded-2xl">
                <h4 className="font-racing font-bold text-cyan-300 text-base mb-1">
                  Langkah Deployment Cepat ke Firebase Hosting
                </h4>
                <p className="text-xs text-slate-300">
                  Firebase Hosting menyediakan CDN global berkecepatan tinggi dengan sertifikat SSL gratis otomatis, sangat ideal untuk smart board sekolah maupun akses smartphone siswa di kelas.
                </p>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between bg-slate-950 px-4 py-2 rounded-t-xl border border-b-0 border-slate-800 text-xs font-mono text-slate-400">
                  <span>Terminal Bash Command</span>
                  <button
                    onClick={() => copyToClipboard(deployTerminalCode, 'deploy')}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                  >
                    {copiedCode === 'deploy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode === 'deploy' ? 'Tersalin' : 'Salin Perintah'}
                  </button>
                </div>
                <pre className="p-4 bg-black/90 border border-slate-800 rounded-b-xl text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  {deployTerminalCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'firestore' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-2xl">
                <h4 className="font-racing font-bold text-amber-300 text-base mb-1">
                  Strategi Manajemen Firestore Efisien & Real-time
                </h4>
                <p className="text-xs text-slate-300">
                  Untuk menghemat kuota pembacaan (reads/writes) Firestore saat pertandingan kelas berlangsung:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-racing font-bold text-cyan-400 text-sm">1. Batch Writes & Local Buffering</span>
                  <p className="text-xs text-slate-400">
                    Kumpulkan update skor minor per ronde dan commit ke dokumen kelompok per babak untuk menekan write count.
                  </p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-racing font-bold text-cyan-400 text-sm">2. Snapshot Listener Targeted</span>
                  <p className="text-xs text-slate-400">
                    Dengarkan hanya dokumen pertandingan aktif menggunakan <code>onSnapshot(doc(db, 'pertandingan', id))</code> agar tidak query seluruh database.
                  </p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-racing font-bold text-cyan-400 text-sm">3. Composite Indexes</span>
                  <p className="text-xs text-slate-400">
                    Tambahkan index pada collection <code>hasil</code> dengan field <code>pertandinganId (ASC)</code> dan <code>nilai (DESC)</code> untuk rendering leaderboard instan.
                  </p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-racing font-bold text-cyan-400 text-sm">4. Offline Persistence</span>
                  <p className="text-xs text-slate-400">
                    Aktifkan <code>enableIndexedDbPersistence</code> agar game tetap berjalan mulus meskipun sinyal WiFi lab otomotif tersendat.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-racing font-bold text-slate-300">
                  File: firestore.rules
                </span>
                <button
                  onClick={() => copyToClipboard(firestoreRulesCode, 'rules')}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  {copiedCode === 'rules' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === 'rules' ? 'Tersalin' : 'Salin Rules'}
                </button>
              </div>
              <pre className="p-4 bg-black/90 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                {firestoreRulesCode}
              </pre>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-racing font-bold text-slate-300">
                  File: storage.rules
                </span>
                <button
                  onClick={() => copyToClipboard(storageRulesCode, 'storage')}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  {copiedCode === 'storage' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === 'storage' ? 'Tersalin' : 'Salin Storage Rules'}
                </button>
              </div>
              <pre className="p-4 bg-black/90 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                {storageRulesCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FirebaseGuideModal;
