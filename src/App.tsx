import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, DashboardView as ViewType } from './components/Sidebar';
import { DashboardView } from './pages/DashboardView';
import { BattleArena } from './pages/BattleArena';
import { Leaderboard } from './components/Leaderboard';
import { BankSoalPanel } from './components/BankSoalPanel';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TeacherPanel } from './pages/TeacherPanel';
import { StudentPanel } from './pages/StudentPanel';
import { AdminPanel } from './pages/AdminPanel';
import { ResultsView } from './pages/ResultsView';
import { SettingsView } from './pages/SettingsView';
import { RoomModal } from './components/RoomModal';
import { FirebaseGuideModal } from './components/FirebaseGuideModal';
import { LoginModal } from './pages/LoginModal';
import {
  getLocalStore,
  saveLocalStore,
  subscribeToStore,
  KelompokDoc,
  SoalDoc,
  HasilDoc,
  UserDoc,
  KelasDoc,
  PertandinganDoc,
} from './firebase/firestore';
import { sounds } from './utils/soundEffects';

function MainApp() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isFirebaseGuideOpen, setIsFirebaseGuideOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMatchFinished, setIsMatchFinished] = useState(false);

  // App store states
  const [groups, setGroups] = useState<KelompokDoc[]>([]);
  const [soalList, setSoalList] = useState<SoalDoc[]>([]);
  const [results, setResults] = useState<HasilDoc[]>([]);
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [classes, setClasses] = useState<KelasDoc[]>([]);
  const [activeMatch, setActiveMatch] = useState<PertandinganDoc | null>(null);

  const loadData = () => {
    const store = getLocalStore();
    setGroups(store.kelompok);
    setSoalList(store.soal);
    setResults(store.hasil);
    setUsers(store.users);
    setClasses(store.kelas);
    setActiveMatch(store.pertandingan[0] || null);
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStore(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  const handleStartGame = () => {
    sounds.playEngineRev();
    setIsMatchFinished(false);
    setCurrentView('pertandingan');
  };

  const handleFinishMatch = () => {
    setIsMatchFinished(true);
    sounds.playFanfare();
  };

  const handleResetData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('speed_battle_tkro_data');
      loadData();
      alert('Data game berhasil direset ke pengaturan awal!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={(view) => {
            setIsMatchFinished(false);
            setCurrentView(view);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onOpenRoomModal={() => setIsRoomModalOpen(true)}
            onOpenFirebaseGuide={() => setIsFirebaseGuideOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {/* MATCH FINISHED RESULTS OR CURRENT VIEW */}
            {isMatchFinished ? (
              <ResultsView
                groups={groups}
                results={results}
                onPlayAgain={() => {
                  setIsMatchFinished(false);
                  setCurrentView('pertandingan');
                }}
                onRefresh={loadData}
              />
            ) : (
              <>
                {currentView === 'dashboard' && (
                  <DashboardView
                    onStartGame={handleStartGame}
                    onOpenLeaderboard={() => setCurrentView('leaderboard')}
                    onOpenBankSoal={() => setCurrentView('bank-soal')}
                    groups={groups}
                  />
                )}

                {currentView === 'pertandingan' && (
                  <BattleArena
                    groups={groups}
                    matchTitle={activeMatch?.judul || 'Kompetisi Komponen Mesin XII TKRO 1'}
                    onFinishMatch={handleFinishMatch}
                    onRefresh={loadData}
                  />
                )}

                {currentView === 'leaderboard' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
                      <div>
                        <h2 className="font-racing font-extrabold text-2xl text-white">
                          Klasemen & Podium Juara Speed Battle
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Peringkat realtime kelompok mesin berdasarkan akumulasi poin dan kecepatan
                        </p>
                      </div>
                      <button
                        onClick={handleStartGame}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-racing font-bold text-xs rounded-xl shadow-md"
                      >
                        Mulai Battle Arena
                      </button>
                    </div>
                    <Leaderboard groups={groups} showPodium={true} celebrateWinner={true} />
                  </div>
                )}

                {currentView === 'bank-soal' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl">
                      <h2 className="font-racing font-extrabold text-2xl text-white">
                        Bank Soal Komponen Mesin Mobil TKRO
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Kelola pertanyaan, unggah gambar komponen, impor dan ekspor data ke Excel
                      </p>
                    </div>
                    <BankSoalPanel soalList={soalList} onRefresh={loadData} />
                  </div>
                )}

                {currentView === 'analisis-nilai' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="font-racing font-extrabold text-2xl text-white">
                          Analisis Nilai & Ketuntasan Belajar Kurikulum Merdeka
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Evaluasi capaian pembelajaran (CP) dan indikator kompetensi siswa (Chart.js)
                        </p>
                      </div>
                    </div>
                    <AnalyticsCharts groups={groups} results={results} />
                  </div>
                )}

                {currentView === 'guru' && (
                  <TeacherPanel
                    groups={groups}
                    onGroupsUpdated={(newGroups) => setGroups(newGroups)}
                    onStartMatchWithConfig={(match) => {
                      setActiveMatch(match);
                      setIsMatchFinished(false);
                      setCurrentView('pertandingan');
                    }}
                  />
                )}

                {currentView === 'siswa' && (
                  <StudentPanel
                    groups={groups}
                    onScoreUpdate={(delta, isCorrect) => {
                      // Score update from student buzzer
                      if (groups[0]) {
                        sounds.playCorrect();
                      }
                      loadData();
                    }}
                    onEnterBattleArena={() => setCurrentView('pertandingan')}
                  />
                )}

                {(currentView === 'kelas') && (
                  <AdminPanel
                    users={users}
                    classes={classes}
                    onRefresh={loadData}
                  />
                )}

                {currentView === 'pengaturan' && (
                  <SettingsView
                    onResetData={handleResetData}
                    onOpenFirebaseGuide={() => setIsFirebaseGuideOpen(true)}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* MODALS */}
      <RoomModal
        roomCode="TKRO2026"
        matchTitle={activeMatch?.judul || 'Kompetisi Komponen Mesin XII TKRO 1'}
        groupCount={groups.length || 4}
        durationMinutes={activeMatch?.waktuMenit || 15}
        totalQuestions={soalList.length}
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onStartMatch={() => {
          setIsRoomModalOpen(false);
          handleStartGame();
        }}
      />

      <FirebaseGuideModal
        isOpen={isFirebaseGuideOpen}
        onClose={() => setIsFirebaseGuideOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
