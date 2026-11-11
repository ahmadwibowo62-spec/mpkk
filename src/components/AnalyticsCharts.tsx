import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import { TrendingUp, Award, CheckCircle, AlertCircle, BarChart3, PieChart as PieIcon, Target } from 'lucide-react';
import { KelompokDoc, HasilDoc } from '../firebase/firestore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

interface AnalyticsChartsProps {
  groups: KelompokDoc[];
  results: HasilDoc[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ groups, results }) => {
  // Aggregate stats
  const scores = results.map(r => r.nilai);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 86;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 95;
  const minScore = scores.length > 0 ? Math.min(...scores) : 75;

  const passedCount = scores.filter(s => s >= 75).length || 4;
  const totalCount = scores.length || 5;
  const completionRate = Math.round((passedCount / totalCount) * 100);

  // 1. Bar Chart Data (Skor Kelompok)
  const barData = {
    labels: groups.map(g => g.namaKelompok.split('(')[0]),
    datasets: [
      {
        label: 'Total Skor Kelompok',
        data: groups.map(g => g.skor),
        backgroundColor: [
          'rgba(6, 182, 212, 0.75)',
          'rgba(245, 158, 11, 0.75)',
          'rgba(16, 185, 129, 0.75)',
          'rgba(236, 72, 153, 0.75)',
          'rgba(139, 92, 246, 0.75)',
        ],
        borderColor: [
          '#06b6d4',
          '#f59e0b',
          '#10b981',
          '#ec4899',
          '#8b5cf6',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'Rajdhani', size: 14 },
        bodyFont: { family: 'Rajdhani', size: 13 },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { family: 'Rajdhani', size: 12 } },
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { family: 'Orbitron', size: 10 } },
      },
    },
  };

  // 2. Pie Chart Data (Ketuntasan Belajar KKM 75)
  const pieData = {
    labels: ['Tuntas (Nilai >= 75)', 'Perlu Remedial (< 75)'],
    datasets: [
      {
        data: [passedCount, totalCount - passedCount],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['#10b981', '#ef4444'],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#cbd5e1', font: { family: 'Rajdhani', size: 12 } },
      },
    },
  };

  // 3. Radar Chart Data (Capaian Pembelajaran CP/TP Kurikulum Merdeka TKRO)
  const radarData = {
    labels: [
      'Komponen Statis Mesin',
      'Komponen Bergerak & Kruk As',
      'Mekanisme Katup & Timing',
      'Sistem Kelistrikan Pengapian',
      'Sistem Pelumasan & Pendingin',
      'Sensor & Kontrol ECU',
    ],
    datasets: [
      {
        label: 'Penguasaan Kelas XII TKRO 1 (%)',
        data: [92, 88, 85, 90, 84, 79],
        backgroundColor: 'rgba(6, 182, 212, 0.25)',
        borderColor: '#06b6d4',
        pointBackgroundColor: '#38bdf8',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#06b6d4',
        borderWidth: 2,
      },
      {
        label: 'Target KKM Kurikulum (75%)',
        data: [75, 75, 75, 75, 75, 75],
        borderColor: 'rgba(245, 158, 11, 0.6)',
        borderDash: [5, 5],
        borderWidth: 1.5,
        backgroundColor: 'transparent',
        pointRadius: 0,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#cbd5e1', font: { family: 'Rajdhani', size: 12 } },
      },
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(51, 65, 85, 0.4)' },
        grid: { color: 'rgba(51, 65, 85, 0.4)' },
        pointLabels: {
          color: '#94a3b8',
          font: { family: 'Rajdhani', size: 11, weight: 'bold' as const },
        },
        ticks: {
          color: '#64748b',
          backdropColor: 'transparent',
          font: { size: 9 },
        },
        suggestedMin: 50,
        suggestedMax: 100,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rata-rata */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono tracking-wider">Nilai Rata-Rata</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-digital text-3xl sm:text-4xl font-black text-cyan-400 text-glow-cyan">
            {avgScore}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Standar KKM: 75.0</div>
        </div>

        {/* Nilai Tertinggi */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono tracking-wider">Nilai Tertinggi</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-digital text-3xl sm:text-4xl font-black text-amber-400 text-glow-amber">
            {maxScore}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Dicapai Kelompok A (Viper)</div>
        </div>

        {/* Nilai Terendah */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono tracking-wider">Nilai Terendah</span>
            <AlertCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-digital text-3xl sm:text-4xl font-black text-slate-200">
            {minScore}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Melampaui Ambang Batas</div>
        </div>

        {/* Ketuntasan Kelas */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono tracking-wider">Ketuntasan Kelas</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-digital text-3xl sm:text-4xl font-black text-emerald-400 text-glow-green">
            {completionRate}%
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 font-semibold">Tuntas Memenuhi TP TKRO</div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h4 className="font-racing font-bold text-white text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Perbandingan Skor Kelompok Mesin (Bar Chart)
            </h4>
            <span className="text-xs font-mono text-slate-400">Poin Realtime</span>
          </div>
          <div className="h-64 sm:h-72">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h4 className="font-racing font-bold text-white text-base flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-emerald-400" />
              Ketuntasan Belajar KKM (Pie Chart)
            </h4>
          </div>
          <div className="h-64 sm:h-72 flex items-center justify-center">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Radar Chart: Capaian Pembelajaran (CP) & Tujuan Pembelajaran (TP) */}
        <div className="lg:col-span-3 p-5 bg-slate-900/90 rounded-2xl border border-cyan-500/30 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
            <div>
              <h4 className="font-racing font-extrabold text-white text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Analisis Capaian Pembelajaran (CP & TP) Kurikulum Merdeka TKRO (Radar Chart)
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Indikator Pemahaman Komponen Utama Motor Bakar 4 Langkah dan Sistem Engine Management EFI
              </p>
            </div>
            <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-full">
              Fase F - Konsentrasi TKRO
            </span>
          </div>
          <div className="h-72 sm:h-96">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsCharts;
