/**
 * Formula Penilaian Otomatis & Gamifikasi Badges
 * Sesuai panduan MPKK TKRO:
 * Nilai Akhir = (70% Skor Benar) + (30% Kecepatan Menyelesaikan)
 */

export interface ScoreBreakdown {
  skorMurni: number;
  skorKecepatan: number;
  nilaiAkhir: number;
  akurasiPersen: number;
  totalSoal: number;
  totalBenar: number;
  totalSalah: number;
  waktuDetik: number;
  badges: BadgeInfo[];
}

export interface BadgeInfo {
  id: string;
  nama: string;
  icon: string;
  deskripsi: string;
  warna: string;
}

export const AVAILABLE_BADGES: Record<string, BadgeInfo> = {
  juara1: {
    id: 'juara-mesin',
    nama: 'Juara Mesin',
    icon: '🥇',
    deskripsi: 'Meraih Peringkat 1 dalam Speed Battle Komponen Mesin',
    warna: 'from-amber-400 to-yellow-600',
  },
  juara2: {
    id: 'teknisi-andal',
    nama: 'Teknisi Andal',
    icon: '🥈',
    deskripsi: 'Meraih Peringkat 2 dengan performa mekanik sangat memuaskan',
    warna: 'from-slate-300 to-slate-500',
  },
  juara3: {
    id: 'calon-mekanik-hebat',
    nama: 'Calon Mekanik Hebat',
    icon: '🥉',
    deskripsi: 'Meraih Peringkat 3 dengan pemahaman komponen yang solid',
    warna: 'from-amber-700 to-yellow-900',
  },
  tercepat: {
    id: 'tercepat',
    nama: '🏎 Tercepat',
    icon: '🏎️',
    deskripsi: 'Menyelesaikan seluruh tantangan ronde dengan catatan waktu terbaik',
    warna: 'from-cyan-400 to-blue-600',
  },
  perfect: {
    id: 'perfect-score',
    nama: '🔥 Perfect Score',
    icon: '🔥',
    deskripsi: 'Menjawab seluruh pertanyaan tanpa satu pun kesalahan (Akurasi 100%)',
    warna: 'from-red-500 to-rose-700',
  },
  master: {
    id: 'master-komponen-mesin',
    nama: '⭐ Master Komponen Mesin',
    icon: '⭐',
    deskripsi: 'Memperoleh nilai akhir di atas 85 pada kategori keahlian TKRO',
    warna: 'from-emerald-400 to-teal-600',
  },
};

export function calculateFinalScore(
  skorBenar: number,
  kecepatanScore: number,
  totalSoal: number = 10,
  totalBenar: number = 8,
  totalSalah: number = 2,
  waktuDetik: number = 120,
  rank: number = 1
): ScoreBreakdown {
  // Nilai Akhir = (70% Skor Benar) + (30% Kecepatan Menyelesaikan)
  const clampedSkor = Math.max(0, Math.min(100, skorBenar));
  const clampedKecepatan = Math.max(0, Math.min(100, kecepatanScore));

  const nilaiAkhir = Math.round((clampedSkor * 0.7) + (clampedKecepatan * 0.3));
  const akurasiPersen = totalSoal > 0 ? Math.round((totalBenar / totalSoal) * 100) : 0;

  const badges: BadgeInfo[] = [];

  if (rank === 1) badges.push(AVAILABLE_BADGES.juara1);
  else if (rank === 2) badges.push(AVAILABLE_BADGES.juara2);
  else if (rank === 3) badges.push(AVAILABLE_BADGES.juara3);

  if (clampedKecepatan >= 85) {
    badges.push(AVAILABLE_BADGES.tercepat);
  }

  if (totalSalah === 0 && totalBenar >= 5) {
    badges.push(AVAILABLE_BADGES.perfect);
  }

  if (nilaiAkhir >= 85) {
    badges.push(AVAILABLE_BADGES.master);
  }

  return {
    skorMurni: clampedSkor,
    skorKecepatan: clampedKecepatan,
    nilaiAkhir,
    akurasiPersen,
    totalSoal,
    totalBenar,
    totalSalah,
    waktuDetik,
    badges,
  };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
