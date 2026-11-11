import React from 'react';

interface ComponentIllustrationProps {
  type: string;
  className?: string;
  showLabels?: boolean;
}

export const ComponentIllustration: React.FC<ComponentIllustrationProps> = ({
  type,
  className = 'w-32 h-32',
  showLabels = false,
}) => {
  switch (type) {
    case 'cylinder-block':
    case 'blok-silinder':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            <rect x="25" y="40" width="150" height="120" rx="8" fill="#334155" stroke="#64748b" strokeWidth="4" />
            {/* 4 cylinders */}
            <circle cx="50" cy="85" r="18" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
            <circle cx="83" cy="85" r="18" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
            <circle cx="117" cy="85" r="18" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
            <circle cx="150" cy="85" r="18" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
            {/* Water jackets / cooling passages */}
            <path d="M 45 125 Q 100 135 155 125" stroke="#38bdf8" strokeWidth="4" fill="none" strokeDasharray="6,4" />
            {/* Crankcase bottom */}
            <path d="M 25 160 L 45 185 L 155 185 L 175 160 Z" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
            {/* Oil pan bolts */}
            <circle cx="55" cy="180" r="3" fill="#94a3b8" />
            <circle cx="100" cy="180" r="3" fill="#94a3b8" />
            <circle cx="145" cy="180" r="3" fill="#94a3b8" />
            {showLabels && <text x="100" y="30" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">BLOK SILINDER</text>}
          </svg>
        </div>
      );

    case 'cylinder-head':
    case 'kepala-silinder':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            <rect x="20" y="70" width="160" height="60" rx="6" fill="#475569" stroke="#94a3b8" strokeWidth="4" />
            {/* Combustion chambers */}
            <ellipse cx="50" cy="100" rx="16" ry="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
            <ellipse cx="83" cy="100" rx="16" ry="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
            <ellipse cx="117" cy="100" rx="16" ry="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
            <ellipse cx="150" cy="100" rx="16" ry="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
            {/* Spark plug holes */}
            <circle cx="50" cy="98" r="4" fill="#ef4444" />
            <circle cx="83" cy="98" r="4" fill="#ef4444" />
            <circle cx="117" cy="98" r="4" fill="#ef4444" />
            <circle cx="150" cy="98" r="4" fill="#ef4444" />
            {/* Camshaft towers top */}
            <rect x="40" y="45" width="20" height="25" fill="#64748b" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="90" y="45" width="20" height="25" fill="#64748b" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="140" y="45" width="20" height="25" fill="#64748b" stroke="#cbd5e1" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'piston':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Piston Crown & Skirt */}
            <path d="M 50 40 Q 100 32 150 40 L 150 140 Q 130 155 100 155 Q 70 155 50 140 Z" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="4" />
            {/* Piston Rings slots */}
            <line x1="50" y1="52" x2="150" y2="52" stroke="#1e293b" strokeWidth="4" />
            <line x1="50" y1="64" x2="150" y2="64" stroke="#1e293b" strokeWidth="4" />
            <line x1="50" y1="76" x2="150" y2="76" stroke="#1e293b" strokeWidth="4" />
            {/* Wrist pin boss (Piston Pin) */}
            <circle cx="100" cy="110" r="18" fill="#475569" stroke="#cbd5e1" strokeWidth="4" />
            <circle cx="100" cy="110" r="8" fill="#0f172a" />
            {/* Cutout on skirt */}
            <path d="M 75 145 C 85 135 115 135 125 145" fill="none" stroke="#64748b" strokeWidth="3" />
          </svg>
        </div>
      );

    case 'piston-ring':
    case 'ring-piston':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            <ellipse cx="100" cy="70" rx="65" ry="25" fill="none" stroke="#38bdf8" strokeWidth="6" />
            {/* Ring gap */}
            <line x1="155" y1="65" x2="165" y2="75" stroke="#0f172a" strokeWidth="8" />
            <ellipse cx="100" cy="110" rx="65" ry="25" fill="none" stroke="#f59e0b" strokeWidth="6" />
            <ellipse cx="100" cy="150" rx="65" ry="25" fill="none" stroke="#a855f7" strokeWidth="6" strokeDasharray="4,4" />
          </svg>
        </div>
      );

    case 'connecting-rod':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Small end (Pin eye) */}
            <circle cx="100" cy="35" r="18" fill="#64748b" stroke="#cbd5e1" strokeWidth="4" />
            <circle cx="100" cy="35" r="9" fill="#0f172a" />
            {/* Beam (I-beam) */}
            <path d="M 94 53 L 90 135 L 110 135 L 106 53 Z" fill="#475569" stroke="#94a3b8" strokeWidth="3" />
            {/* Big end (Journal) */}
            <circle cx="100" cy="155" r="32" fill="#64748b" stroke="#cbd5e1" strokeWidth="5" />
            <circle cx="100" cy="155" r="18" fill="#0f172a" />
            {/* Rod bolts */}
            <circle cx="68" cy="155" r="4" fill="#facc15" />
            <circle cx="132" cy="155" r="4" fill="#facc15" />
          </svg>
        </div>
      );

    case 'crankshaft':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            <line x1="20" y1="100" x2="180" y2="100" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />
            {/* Counterweights */}
            <path d="M 45 100 Q 55 45 80 50 Q 80 100 65 100" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="65" cy="55" r="8" fill="#38bdf8" />
            <path d="M 105 100 Q 115 155 140 150 Q 140 100 125 100" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="125" cy="145" r="8" fill="#38bdf8" />
            {/* Flywheel flange at right */}
            <rect x="170" y="80" width="12" height="40" rx="3" fill="#f59e0b" />
          </svg>
        </div>
      );

    case 'camshaft':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            <rect x="25" y="93" width="150" height="14" rx="4" fill="#64748b" stroke="#cbd5e1" strokeWidth="2" />
            {/* Cam lobes */}
            <path d="M 50 93 C 45 70 70 70 65 93 Z" fill="#38bdf8" stroke="#bae6fd" strokeWidth="2" />
            <path d="M 85 107 C 80 130 105 130 100 107 Z" fill="#38bdf8" stroke="#bae6fd" strokeWidth="2" />
            <path d="M 120 93 C 115 65 140 65 135 93 Z" fill="#38bdf8" stroke="#bae6fd" strokeWidth="2" />
            {/* Sprocket gear at left */}
            <circle cx="25" cy="100" r="18" fill="#0f172a" stroke="#f59e0b" strokeWidth="4" strokeDasharray="4,2" />
          </svg>
        </div>
      );

    case 'katup-masuk':
    case 'katup-buang':
    case 'intake-valve':
    case 'exhaust-valve':
      const isExhaust = type.includes('buang') || type.includes('exhaust');
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Valve stem */}
            <rect x="96" y="25" width="8" height="120" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            {/* Valve spring around stem */}
            <path d="M 88 50 Q 112 58 88 66 Q 112 74 88 82 Q 112 90 88 98" fill="none" stroke="#f59e0b" strokeWidth="5" />
            {/* Valve head / poppet */}
            <path d="M 60 160 L 140 160 L 108 140 L 92 140 Z" fill={isExhaust ? '#ef4444' : '#06b6d4'} stroke="#f8fafc" strokeWidth="3" />
            {/* Retainer top */}
            <rect x="86" y="32" width="28" height="10" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'timing-chain':
    case 'timing-belt':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Top cam sprockets */}
            <circle cx="70" cy="60" r="22" fill="#1e293b" stroke="#f59e0b" strokeWidth="4" />
            <circle cx="130" cy="60" r="22" fill="#1e293b" stroke="#f59e0b" strokeWidth="4" />
            {/* Bottom crank sprocket */}
            <circle cx="100" cy="150" r="16" fill="#1e293b" stroke="#06b6d4" strokeWidth="4" />
            {/* Belt loop */}
            <path d="M 50 65 L 85 145 A 16 16 0 0 0 115 145 L 150 65 A 22 22 0 0 0 130 38 L 70 38 A 22 22 0 0 0 50 65" fill="none" stroke="#e2e8f0" strokeWidth="7" strokeDasharray="6,4" />
            {/* Tensioner */}
            <circle cx="135" cy="115" r="12" fill="#94a3b8" stroke="#38bdf8" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'flywheel':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            <circle cx="100" cy="100" r="75" fill="#334155" stroke="#94a3b8" strokeWidth="6" />
            {/* Ring gear teeth on perimeter */}
            <circle cx="100" cy="100" r="78" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="3,3" />
            {/* Friction surface */}
            <circle cx="100" cy="100" r="50" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
            {/* Center mounting holes */}
            <circle cx="100" cy="100" r="18" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="100" cy="88" r="4" fill="#fbbf24" />
            <circle cx="100" cy="112" r="4" fill="#fbbf24" />
            <circle cx="88" cy="100" r="4" fill="#fbbf24" />
            <circle cx="112" cy="100" r="4" fill="#fbbf24" />
          </svg>
        </div>
      );

    case 'injektor':
    case 'injector':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Connector top */}
            <rect x="80" y="25" width="40" height="25" rx="4" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2" />
            {/* Body */}
            <rect x="88" y="50" width="24" height="75" rx="3" fill="#64748b" stroke="#cbd5e1" strokeWidth="2" />
            {/* O-rings */}
            <rect x="85" y="60" width="30" height="8" rx="2" fill="#10b981" />
            <rect x="85" y="115" width="30" height="8" rx="2" fill="#10b981" />
            {/* Nozzle tip */}
            <polygon points="94,125 106,125 102,145 98,145" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
            {/* Fuel spray cone */}
            <path d="M 100 148 L 75 185 L 125 185 Z" fill="rgba(6, 182, 212, 0.3)" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3,2" />
          </svg>
        </div>
      );

    case 'spark-plug':
    case 'busi':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Terminal */}
            <rect x="94" y="20" width="12" height="15" rx="2" fill="#f59e0b" />
            {/* Ceramic insulator with ribs */}
            <rect x="88" y="35" width="24" height="45" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="88" y1="45" x2="112" y2="45" stroke="#94a3b8" strokeWidth="2" />
            <line x1="88" y1="55" x2="112" y2="55" stroke="#94a3b8" strokeWidth="2" />
            <line x1="88" y1="65" x2="112" y2="65" stroke="#94a3b8" strokeWidth="2" />
            {/* Hex nut */}
            <polygon points="80,85 120,85 115,105 85,105" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
            {/* Threaded steel shell */}
            <rect x="88" y="105" width="24" height="40" fill="#64748b" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,2" />
            {/* Ground electrode & spark gap */}
            <path d="M 96 145 L 96 165 L 105 165" fill="none" stroke="#cbd5e1" strokeWidth="4" />
            <rect x="100" y="145" width="3" height="12" fill="#f59e0b" />
            {/* Spark flash */}
            <circle cx="102" cy="160" r="5" fill="#38bdf8" />
          </svg>
        </div>
      );

    case 'ignition-coil':
    case 'koil':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Electronic module head */}
            <rect x="65" y="30" width="70" height="35" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
            {/* Plug connector pins */}
            <rect x="55" y="38" width="12" height="18" fill="#334155" />
            {/* Long boot shaft */}
            <rect x="88" y="65" width="24" height="85" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
            {/* Rubber seal ribs */}
            <ellipse cx="100" cy="80" rx="16" ry="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <ellipse cx="100" cy="140" rx="16" ry="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            {/* Internal spark spring tip */}
            <circle cx="100" cy="165" r="8" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'turbocharger':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Snail shell housing */}
            <path d="M 100 30 C 145 30 175 65 175 110 C 175 155 140 180 95 180 C 50 180 30 145 30 110 C 30 75 55 55 90 55" fill="none" stroke="#06b6d4" strokeWidth="18" strokeLinecap="round" />
            {/* Center compressor wheel */}
            <circle cx="100" cy="110" r="30" fill="#1e293b" stroke="#e2e8f0" strokeWidth="3" />
            {/* Turbine blades */}
            <path d="M 100 85 Q 110 95 100 110 Q 90 95 100 85" fill="#38bdf8" />
            <path d="M 100 135 Q 110 125 100 110 Q 90 125 100 135" fill="#38bdf8" />
            <path d="M 75 110 Q 85 100 100 110 Q 85 120 75 110" fill="#38bdf8" />
            <path d="M 125 110 Q 115 100 100 110 Q 115 120 125 110" fill="#38bdf8" />
            {/* Wastegate actuator */}
            <rect x="145" y="35" width="22" height="35" rx="4" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'ecu':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Aluminium ECU casing */}
            <rect x="30" y="40" width="140" height="120" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="4" />
            {/* Cooling fins */}
            <line x1="45" y1="60" x2="155" y2="60" stroke="#334155" strokeWidth="3" />
            <line x1="45" y1="75" x2="155" y2="75" stroke="#334155" strokeWidth="3" />
            <line x1="45" y1="90" x2="155" y2="90" stroke="#334155" strokeWidth="3" />
            {/* Processor chip */}
            <rect x="75" y="105" width="50" height="35" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="100" y="127" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">EFI-ECU</text>
            {/* Harness multi-pin connectors */}
            <rect x="50" y="160" width="40" height="15" fill="#f59e0b" />
            <rect x="110" y="160" width="40" height="15" fill="#06b6d4" />
          </svg>
        </div>
      );

    case 'radiator':
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Upper tank */}
            <rect x="35" y="30" width="130" height="20" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            {/* Cap */}
            <rect x="90" y="18" width="20" height="12" rx="2" fill="#facc15" stroke="#eab308" strokeWidth="2" />
            {/* Core with cooling tubes and fins */}
            <rect x="40" y="50" width="120" height="100" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <line x1="45" y1="65" x2="155" y2="65" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="3,3" />
            <line x1="45" y1="85" x2="155" y2="85" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="3,3" />
            <line x1="45" y1="105" x2="155" y2="105" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="3,3" />
            <line x1="45" y1="125" x2="155" y2="125" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="3,3" />
            <line x1="45" y1="145" x2="155" y2="145" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="3,3" />
            {/* Lower tank */}
            <rect x="35" y="150" width="130" height="20" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          </svg>
        </div>
      );

    default:
      // Generic high tech automotive component fallback
      return (
        <div className={`relative flex items-center justify-center p-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-inner ${className}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            <circle cx="100" cy="100" r="60" fill="#1e293b" stroke="#06b6d4" strokeWidth="4" />
            <path d="M 60 100 L 140 100 M 100 60 L 100 140" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="100" cy="100" r="25" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" />
            <text x="100" y="185" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">TKRO ENGINE</text>
          </svg>
        </div>
      );
  }
};
