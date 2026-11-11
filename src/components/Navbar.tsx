import React, { useState } from 'react';
import {
  Menu,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Cloud,
  QrCode,
  Flame,
  Radio,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenRoomModal: () => void;
  onOpenFirebaseGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenRoomModal,
  onOpenFirebaseGuide,
}) => {
  const { user } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Smartboard status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/60 border border-cyan-800 rounded-full text-cyan-300 font-racing font-bold text-xs tracking-wider">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            SMART BOARD TKRO ARENA
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Join / Room Info */}
        <button
          onClick={onOpenRoomModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-racing font-extrabold text-xs rounded-xl shadow-md transition active:scale-95"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>KODE ROOM: TKRO2026</span>
        </button>

        {/* Firebase deploy guide */}
        <button
          onClick={onOpenFirebaseGuide}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-racing font-semibold text-xs rounded-xl border border-slate-700 transition"
          title="Panduan Deployment Firebase Hosting & Firestore"
        >
          <Cloud className="w-3.5 h-3.5 text-amber-400" />
          <span>Firebase Setup</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
          title={isMuted ? 'Nyalakan Audio' : 'Bisukan Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Fullscreen for Interactive Smart Board */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
          title="Mode Papan Interaktif (Layar Penuh)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-slate-300" />}
        </button>
      </div>
    </header>
  );
};
export default Navbar;
