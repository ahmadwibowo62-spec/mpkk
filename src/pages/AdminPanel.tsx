import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  GraduationCap,
  School,
  BookOpen,
  Trophy,
  BarChart3,
  Plus,
  Trash2,
  CheckCircle,
  Settings,
} from 'lucide-react';
import { UserDoc, KelasDoc, saveUserDoc, saveKelasDoc } from '../firebase/firestore';

interface AdminPanelProps {
  users: UserDoc[];
  classes: KelasDoc[];
  onRefresh: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ users, classes, onRefresh }) => {
  const [tab, setTab] = useState<'guru' | 'siswa' | 'kelas'>('guru');

  // Add user modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'guru' | 'siswa'>('guru');
  const [newClass, setNewClass] = useState('XII TKRO 1');

  // Add class state
  const [newClassName, setNewClassName] = useState('');
  const [newJurusan, setNewJurusan] = useState('Teknik Kendaraan Ringan Otomotif');

  const teachers = users.filter(u => u.role === 'guru');
  const students = users.filter(u => u.role === 'siswa');

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserDoc = {
      uid: `user-${Date.now()}`,
      nama: newName,
      email: newEmail,
      role: newRole,
      kelas: newClass,
    };
    await saveUserDoc(newUser);
    setIsModalOpen(false);
    setNewName('');
    setNewEmail('');
    onRefresh();
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;
    const newK: KelasDoc = {
      id: `c-${Date.now()}`,
      namaKelas: newClassName,
      jurusan: newJurusan,
    };
    await saveKelasDoc(newK);
    setNewClassName('');
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Admin Cockpit Banner */}
      <div className="p-6 bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-950 rounded-3xl border-2 border-rose-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-racing uppercase tracking-widest text-rose-400 font-bold bg-rose-950 border border-rose-800 px-3 py-1 rounded-full">
            🛡️ Super Admin Master TKRO
          </span>
          <h2 className="font-racing font-extrabold text-2xl sm:text-3xl text-white mt-2">
            Manajemen Pengguna, Kelas & Hak Akses
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Total {users.length} Akun terdaftar ({teachers.length} Guru, {students.length} Siswa, {classes.length} Rombel Kelas)
          </p>
        </div>

        <button
          onClick={() => {
            setNewRole(tab === 'guru' ? 'guru' : 'siswa');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-racing font-bold text-sm rounded-xl shadow-lg shadow-rose-950 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengguna Baru
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setTab('guru')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-racing font-bold text-sm transition ${
            tab === 'guru' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Daftar Guru ({teachers.length})
        </button>

        <button
          onClick={() => setTab('siswa')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-racing font-bold text-sm transition ${
            tab === 'siswa' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Daftar Siswa ({students.length})
        </button>

        <button
          onClick={() => setTab('kelas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-racing font-bold text-sm transition ${
            tab === 'kelas' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <School className="w-4 h-4" />
          Daftar Kelas ({classes.length})
        </button>
      </div>

      {/* Teachers / Students Table */}
      {(tab === 'guru' || tab === 'siswa') && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-xs uppercase font-mono tracking-wider border-b border-slate-800">
                <th className="py-3 px-5">Nama Lengkap</th>
                <th className="py-3 px-5">Email / NIS</th>
                <th className="py-3 px-5">Peran</th>
                <th className="py-3 px-5">Kelas Binaan</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-sm">
              {(tab === 'guru' ? teachers : students).map((u) => (
                <tr key={u.uid} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-5 font-racing font-bold text-slate-200">
                    {u.nama}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-xs text-slate-400">
                    {u.email || '-'}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`text-[10px] font-racing font-bold uppercase px-2 py-0.5 rounded-full ${
                      u.role === 'guru' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-xs text-slate-300 font-mono">
                    {u.kelas}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                      <CheckCircle className="w-3.5 h-3.5" /> Aktif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Classes Panel */}
      {tab === 'kelas' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveClass} className="flex gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <input
              type="text"
              required
              placeholder="Nama Kelas Baru (e.g. XII TKRO 3)"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-racing font-bold text-xs rounded-xl"
            >
              Tambah Kelas
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {classes.map(c => (
              <div key={c.id} className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                <div className="font-racing font-bold text-lg text-white">{c.namaKelas}</div>
                <div className="text-xs text-slate-400 mt-1">{c.jurusan}</div>
                <div className="mt-3 text-[11px] text-cyan-400 font-mono">
                  Kurikulum Merdeka SMK
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="font-racing font-extrabold text-lg text-white mb-4">
              Tambah Pengguna Baru
            </h3>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-racing uppercase text-slate-400 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-racing uppercase text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-racing uppercase text-slate-400 mb-1">Peran</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'admin' | 'guru' | 'siswa')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  >
                    <option value="guru">Guru</option>
                    <option value="siswa">Siswa</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-racing uppercase text-slate-400 mb-1">Kelas</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  >
                    <option value="XII TKRO 1">XII TKRO 1</option>
                    <option value="XII TKRO 2">XII TKRO 2</option>
                    <option value="XI TKRO 1">XI TKRO 1</option>
                    <option value="X TKRO 1">X TKRO 1</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-xs font-racing"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-racing font-bold text-xs rounded-xl"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminPanel;
