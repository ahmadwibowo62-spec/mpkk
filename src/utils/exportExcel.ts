/**
 * Excel / CSV Import and Export Utility for Bank Soal & Nilai Siswa TKRO
 */
import { SoalDoc, HasilDoc } from '../firebase/firestore';

export function exportSoalToCSV(soalList: SoalDoc[]) {
  const headers = ['ID', 'Nama Komponen', 'Pertanyaan/Jawaban', 'Kategori', 'Tingkat Kesulitan', 'Poin', 'Tipe'];
  const rows = soalList.map(s => [
    `"${s.id}"`,
    `"${s.namaKomponen}"`,
    `"${s.jawaban.replace(/"/g, '""')}"`,
    `"${s.kategori}"`,
    `"${s.level}"`,
    s.poin,
    `"${s.tipe || 'tebak-nama'}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Bank_Soal_Komponen_Mesin_TKRO_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportNilaiToCSV(hasilList: HasilDoc[]) {
  const headers = ['ID', 'Nama Siswa', 'Kelompok', 'Skor Benar', 'Kecepatan', 'Nilai Akhir', 'Waktu Tempuh (dtk)', 'Tanggal'];
  const rows = hasilList.map(h => [
    `"${h.id}"`,
    `"${h.siswa}"`,
    `"${h.kelompok}"`,
    h.skorBenar,
    h.kecepatan,
    h.nilai,
    h.waktu,
    `"${h.tanggal}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Rekap_Nilai_Speed_Battle_TKRO_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSVToSoal(csvText: string): Partial<SoalDoc>[] {
  const lines = csvText.split('\n').filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const results: Partial<SoalDoc>[] = [];
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
    if (parts.length >= 4) {
      results.push({
        id: parts[0] || `soal-import-${Date.now()}-${i}`,
        namaKomponen: parts[1] || 'Komponen Mesin',
        gambar: parts[1]?.toLowerCase().replace(/\s+/g, '-') || 'piston',
        jawaban: parts[2] || parts[1] || 'Jawaban',
        kategori: parts[3] || 'Mekanikal Mesin',
        level: (parts[4] as 'mudah' | 'sedang' | 'sulit') || 'sedang',
        poin: parseInt(parts[5] || '10', 10) || 10,
        tipe: parts[6] || 'tebak-nama',
      });
    }
  }
  return results;
}
