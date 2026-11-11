import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  FileSpreadsheet,
  Upload,
  Download,
  Search,
  Filter,
  Check,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { SoalDoc, saveSoal, deleteSoal } from '../firebase/firestore';
import { exportSoalToCSV, parseCSVToSoal } from '../utils/exportExcel';
import { uploadComponentImage } from '../firebase/storage';
import { ComponentIllustration } from './ComponentIllustration';

interface BankSoalPanelProps {
  soalList: SoalDoc[];
  onRefresh: () => void;
}

export const BankSoalPanel: React.FC<BankSoalPanelProps> = ({ soalList, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'mudah' | 'sedang' | 'sulit'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSoal, setEditingSoal] = useState<SoalDoc | null>(null);

  // Form states
  const [formNama, setFormNama] = useState('');
  const [formJawaban, setFormJawaban] = useState('');
  const [formKategori, setFormKategori] = useState('Mekanikal Mesin');
  const [formLevel, setFormLevel] = useState<'mudah' | 'sedang' | 'sulit'>('mudah');
  const [formPoin, setFormPoin] = useState(10);
  const [formGambar, setFormGambar] = useState('piston');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const csvInputRef = useRef<HTMLInputElement | null>(null);

  const filteredSoal = soalList.filter(s => {
    const matchSearch =
      s.namaKomponen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.jawaban.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDiff = selectedDifficulty === 'all' || s.level === selectedDifficulty;
    return matchSearch && matchDiff;
  });

  const handleOpenAdd = () => {
    setEditingSoal(null);
    setFormNama('');
    setFormJawaban('');
    setFormKategori('Mekanikal Mesin');
    setFormLevel('mudah');
    setFormPoin(10);
    setFormGambar('piston');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: SoalDoc) => {
    setEditingSoal(s);
    setFormNama(s.namaKomponen);
    setFormJawaban(s.jawaban);
    setFormKategori(s.kategori);
    setFormLevel(s.level);
    setFormPoin(s.poin);
    setFormGambar(s.gambar);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const docToSave: SoalDoc = {
      id: editingSoal ? editingSoal.id : `soal-${Date.now()}`,
      namaKomponen: formNama,
      gambar: formGambar,
      jawaban: formJawaban,
      kategori: formKategori,
      level: formLevel,
      poin: Number(formPoin),
      tipe: 'tebak-nama',
    };

    await saveSoal(docToSave);
    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus soal ini dari Bank Soal?')) {
      await deleteSoal(id);
      onRefresh();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadComponentImage(file);
      setFormGambar(url);
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      const parsed = parseCSVToSoal(content);
      for (const item of parsed) {
        if (item.id && item.namaKomponen) {
          await saveSoal(item as SoalDoc);
        }
      }
      alert(`Berhasil mengimpor ${parsed.length} soal ke Bank Soal!`);
      onRefresh();
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari komponen mesin atau jawaban..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['all', 'mudah', 'sedang', 'sulit'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg font-racing capitalize transition ${
                  selectedDifficulty === diff
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff === 'all' ? 'Semua' : diff}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={csvInputRef}
            onChange={handleImportCSV}
            accept=".csv,.txt"
            className="hidden"
          />
          <button
            onClick={() => csvInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-racing font-bold rounded-xl border border-slate-700 transition"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            Import Excel/CSV
          </button>

          <button
            onClick={() => exportSoalToCSV(soalList)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-racing font-bold rounded-xl border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export Excel
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-racing font-bold text-xs rounded-xl shadow-lg shadow-cyan-950 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Soal Baru
          </button>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSoal.map((soal) => (
          <div
            key={soal.id}
            className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`text-[10px] font-racing uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                  soal.level === 'mudah'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : soal.level === 'sedang'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  Level {soal.level} • {soal.poin} Poin
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {soal.kategori}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <ComponentIllustration type={soal.gambar} className="w-16 h-16 shrink-0" />
                <div>
                  <h4 className="font-racing font-bold text-base text-white">
                    {soal.namaKomponen}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                    {soal.jawaban}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
              <span className="text-[11px] font-mono text-cyan-400">
                Mode: {soal.tipe || 'Tebak Komponen'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(soal)}
                  className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
                  title="Edit Soal"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(soal.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                  title="Hapus Soal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSoal.length === 0 && (
        <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 font-mono text-sm">
          Tidak ada soal yang cocok dengan kriteria pencarian.
        </div>
      )}

      {/* Modal Tambah / Edit Soal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scaleUp">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <h3 className="font-racing font-extrabold text-lg text-white">
                {editingSoal ? 'Edit Soal Komponen' : 'Tambah Soal Komponen Mesin'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1">
                  Nama Komponen Mesin
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Piston, Crankshaft, Injektor..."
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1">
                  Deskripsi / Kunci Jawaban
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Fungsi atau kunci jawaban utama komponen..."
                  value={formJawaban}
                  onChange={(e) => setFormJawaban(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Komponen Statis">Komponen Statis</option>
                    <option value="Komponen Bergerak">Komponen Bergerak</option>
                    <option value="Mekanisme Katup">Mekanisme Katup</option>
                    <option value="Sistem Kelistrikan">Sistem Kelistrikan</option>
                    <option value="Sistem Bahan Bakar">Sistem Bahan Bakar</option>
                    <option value="Sistem Pendingin & Pelumasan">Sistem Pendingin & Pelumasan</option>
                    <option value="Sensor & ECU">Sensor & ECU</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1">
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as 'mudah' | 'sedang' | 'sulit')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="mudah">Mudah (+10 Pts)</option>
                    <option value="sedang">Sedang (+15 Pts)</option>
                    <option value="sulit">Sulit (+20 Pts)</option>
                  </select>
                </div>
              </div>

              {/* Upload image */}
              <div>
                <label className="block text-xs font-racing font-bold uppercase text-slate-300 mb-1">
                  Gambar Komponen Mesin (SVG / Upload)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-racing font-bold text-slate-200 rounded-xl border border-slate-700 flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    {isUploading ? 'Mengunggah...' : 'Pilih Gambar dari Komputer'}
                  </button>

                  <select
                    value={formGambar}
                    onChange={(e) => setFormGambar(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300"
                  >
                    <option value="piston">Vektor: Piston</option>
                    <option value="crankshaft">Vektor: Crankshaft</option>
                    <option value="camshaft">Vektor: Camshaft</option>
                    <option value="blok-silinder">Vektor: Blok Silinder</option>
                    <option value="kepala-silinder">Vektor: Kepala Silinder</option>
                    <option value="injektor">Vektor: Injektor</option>
                    <option value="spark-plug">Vektor: Busi</option>
                    <option value="koil">Vektor: Koil</option>
                    <option value="turbocharger">Vektor: Turbocharger</option>
                    <option value="radiator">Vektor: Radiator</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-racing text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-racing font-bold text-sm rounded-xl shadow-lg shadow-cyan-950 transition active:scale-95"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default BankSoalPanel;
