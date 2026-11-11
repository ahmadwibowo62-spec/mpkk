import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebaseConfig';
import { SEED_QUESTIONS, SEED_STUDENTS, CLASSES_LIST, EngineComponent } from '../data/componentsData';

export interface UserDoc {
  uid: string;
  nama: string;
  email?: string;
  role: 'admin' | 'guru' | 'siswa';
  kelas: string;
}

export interface KelasDoc {
  id: string;
  namaKelas: string;
  jurusan: string;
}

export interface SoalDoc {
  id: string;
  namaKomponen: string;
  gambar: string;
  jawaban: string;
  kategori: string;
  level: 'mudah' | 'sedang' | 'sulit';
  pilihan?: string[];
  penjelasan?: string;
  poin: number;
  tipe?: string;
}

export interface PertandinganDoc {
  id: string;
  judul: string;
  kodeRoom: string;
  waktuMenit: number;
  tanggal: string;
  status: 'persiapan' | 'aktif' | 'selesai';
  modePermainan: string;
  jumlahKelompok: number;
  kelas: string;
  currentRound: number;
  timerMode: 'turun' | 'naik';
  buzzerActive: boolean;
  activeBuzzerTeam?: string | null;
  buzzerTime?: number | null;
}

export interface KelompokDoc {
  id: string;
  pertandinganId: string;
  namaKelompok: string;
  skor: number;
  waktu: number; // in seconds
  anggota: string[];
  warna: string;
  jawabanBenarCount: number;
  jawabanSalahCount: number;
}

export interface HasilDoc {
  id: string;
  pertandinganId: string;
  siswa: string;
  kelompok: string;
  skorBenar: number;
  kecepatan: number;
  nilai: number;
  waktu: number;
  tanggal: string;
  badges: string[];
}

// Local storage key for fallback simulation
const LS_STORAGE_KEY = 'speed_battle_tkro_data';

interface AppStateStorage {
  users: UserDoc[];
  kelas: KelasDoc[];
  soal: SoalDoc[];
  pertandingan: PertandinganDoc[];
  kelompok: KelompokDoc[];
  hasil: HasilDoc[];
}

// Initialize seed store
function getInitialStore(): AppStateStorage {
  if (typeof window === 'undefined') {
    return { users: [], kelas: [], soal: [], pertandingan: [], kelompok: [], hasil: [] };
  }

  const stored = localStorage.getItem(LS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // parse error, fallback
    }
  }

  const initialSoal: SoalDoc[] = SEED_QUESTIONS.map(q => ({
    id: q.id,
    namaKomponen: q.komponenId,
    gambar: q.komponenId,
    jawaban: q.jawabanBenar,
    kategori: 'Mekanikal Mesin',
    level: q.poin > 15 ? 'sulit' : q.poin > 10 ? 'sedang' : 'mudah',
    pilihan: q.pilihan,
    penjelasan: q.penjelasan,
    poin: q.poin,
    tipe: q.tipe,
  }));

  const initialUsers: UserDoc[] = [
    { uid: 'admin-1', nama: 'Bambang Sudarsono, S.Pd (Admin TKRO)', email: 'admin@smk-tkro.sch.id', role: 'admin', kelas: 'Semua Kelas' },
    { uid: 'guru-1', nama: 'Ir. Hendra Gunawan, M.T. (Guru Mesin)', email: 'guru.hendra@smk-tkro.sch.id', role: 'guru', kelas: 'XII TKRO 1' },
    ...SEED_STUDENTS.map(s => ({
      uid: s.uid,
      nama: s.nama,
      email: `${s.nis.toLowerCase()}@siswa.smk.id`,
      role: 'siswa' as const,
      kelas: s.kelas,
    })),
  ];

  const initialMatch: PertandinganDoc = {
    id: 'match-default-1',
    judul: 'Kompetisi Komponen Mesin XII TKRO 1',
    kodeRoom: 'TKRO2026',
    waktuMenit: 15,
    tanggal: new Date().toISOString().split('T')[0],
    status: 'aktif',
    modePermainan: 'Speed Battle',
    jumlahKelompok: 4,
    kelas: 'XII TKRO 1',
    currentRound: 1,
    timerMode: 'turun',
    buzzerActive: true,
    activeBuzzerTeam: null,
  };

  const initialKelompok: KelompokDoc[] = [
    { id: 'kel-a', pertandinganId: 'match-default-1', namaKelompok: 'Kelompok A (Viper Piston)', skor: 950, waktu: 492, anggota: ['Ahmad Rizki Maulana', 'Budi Santoso', 'Chandra Wijaya', 'Danu Pratama'], warna: '#06b6d4', jawabanBenarCount: 19, jawabanSalahCount: 1 },
    { id: 'kel-b', pertandinganId: 'match-default-1', namaKelompok: 'Kelompok B (Turbo Charged)', skor: 900, waktu: 570, anggota: ['Eko Wahyudi', 'Fajar Nugraha', 'Gilang Ramadhan', 'Hadi Setiawan'], warna: '#f59e0b', jawabanBenarCount: 18, jawabanSalahCount: 2 },
    { id: 'kel-c', pertandinganId: 'match-default-1', namaKelompok: 'Kelompok C (VTEC Camshaft)', skor: 850, waktu: 610, anggota: ['Ilham Kurniawan', 'Joko Susilo', 'Kevin Aditya', 'Lukman Hakim'], warna: '#10b981', jawabanBenarCount: 17, jawabanSalahCount: 3 },
    { id: 'kel-d', pertandinganId: 'match-default-1', namaKelompok: 'Kelompok D (Rotary Apex)', skor: 780, waktu: 680, anggota: ['Muhammad Farhan', 'Naufal Al-Ghifari', 'Oki Prasetyo', 'Pandu Dewanata'], warna: '#ec4899', jawabanBenarCount: 16, jawabanSalahCount: 4 },
  ];

  const initialHasil: HasilDoc[] = [
    { id: 'h1', pertandinganId: 'match-default-1', siswa: 'Ahmad Rizki Maulana', kelompok: 'Kelompok A (Viper Piston)', skorBenar: 95, kecepatan: 88, nilai: 93, waktu: 492, tanggal: new Date().toISOString().split('T')[0], badges: ['Juara Mesin', 'Tercepat', 'Master Komponen Mesin'] },
    { id: 'h2', pertandinganId: 'match-default-1', siswa: 'Budi Santoso', kelompok: 'Kelompok A (Viper Piston)', skorBenar: 95, kecepatan: 88, nilai: 93, waktu: 492, tanggal: new Date().toISOString().split('T')[0], badges: ['Juara Mesin', 'Master Komponen Mesin'] },
    { id: 'h3', pertandinganId: 'match-default-1', siswa: 'Eko Wahyudi', kelompok: 'Kelompok B (Turbo Charged)', skorBenar: 90, kecepatan: 82, nilai: 88, waktu: 570, tanggal: new Date().toISOString().split('T')[0], badges: ['Teknisi Andal'] },
    { id: 'h4', pertandinganId: 'match-default-1', siswa: 'Ilham Kurniawan', kelompok: 'Kelompok C (VTEC Camshaft)', skorBenar: 85, kecepatan: 78, nilai: 83, waktu: 610, tanggal: new Date().toISOString().split('T')[0], badges: ['Calon Mekanik Hebat'] },
    { id: 'h5', pertandinganId: 'match-default-1', siswa: 'Muhammad Farhan', kelompok: 'Kelompok D (Rotary Apex)', skorBenar: 78, kecepatan: 74, nilai: 77, waktu: 680, tanggal: new Date().toISOString().split('T')[0], badges: [] },
  ];

  const store: AppStateStorage = {
    users: initialUsers,
    kelas: CLASSES_LIST,
    soal: initialSoal,
    pertandingan: [initialMatch],
    kelompok: initialKelompok,
    hasil: initialHasil,
  };

  localStorage.setItem(LS_STORAGE_KEY, JSON.stringify(store));
  return store;
}

// Event emitter for local multi-tab / local reactive updates
type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach(cb => cb());
}

export function subscribeToStore(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getLocalStore(): AppStateStorage {
  return getInitialStore();
}

export function saveLocalStore(store: AppStateStorage) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LS_STORAGE_KEY, JSON.stringify(store));
    notifyListeners();
  }
}

// ================= FIRESTORE CRUD SERVICES ==================

// 1. Soal
export async function fetchAllSoal(): Promise<SoalDoc[]> {
  const store = getLocalStore();
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'soal'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as SoalDoc));
      }
    } catch (e) {
      console.warn('Firestore fetch failed, using local store:', e);
    }
  }
  return store.soal;
}

export async function saveSoal(soal: SoalDoc): Promise<void> {
  const store = getLocalStore();
  const idx = store.soal.findIndex(s => s.id === soal.id);
  if (idx >= 0) {
    store.soal[idx] = soal;
  } else {
    store.soal.unshift(soal);
  }
  saveLocalStore(store);

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'soal', soal.id), soal);
    } catch (e) {
      console.warn('Firestore saveSoal error:', e);
    }
  }
}

export async function deleteSoal(id: string): Promise<void> {
  const store = getLocalStore();
  store.soal = store.soal.filter(s => s.id !== id);
  saveLocalStore(store);

  if (isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'soal', id));
    } catch (e) {
      console.warn('Firestore deleteSoal error:', e);
    }
  }
}

// 2. Pertandingan & Kelompok
export async function fetchPertandinganList(): Promise<PertandinganDoc[]> {
  const store = getLocalStore();
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'pertandingan'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as PertandinganDoc));
      }
    } catch (e) {
      console.warn('Firestore fetchPertandingan error:', e);
    }
  }
  return store.pertandingan;
}

export async function savePertandingan(match: PertandinganDoc): Promise<void> {
  const store = getLocalStore();
  const idx = store.pertandingan.findIndex(m => m.id === match.id);
  if (idx >= 0) {
    store.pertandingan[idx] = match;
  } else {
    store.pertandingan.unshift(match);
  }
  saveLocalStore(store);

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'pertandingan', match.id), match);
    } catch (e) {
      console.warn('Firestore savePertandingan error:', e);
    }
  }
}

export async function fetchKelompokByMatch(pertandinganId: string): Promise<KelompokDoc[]> {
  const store = getLocalStore();
  return store.kelompok.filter(k => k.pertandinganId === pertandinganId);
}

export async function updateKelompokScore(
  kelompokId: string,
  deltaScore: number,
  isCorrect: boolean,
  deltaSeconds: number = 0
): Promise<void> {
  const store = getLocalStore();
  const kel = store.kelompok.find(k => k.id === kelompokId);
  if (kel) {
    kel.skor = Math.max(0, kel.skor + deltaScore);
    kel.waktu += deltaSeconds;
    if (isCorrect) kel.jawabanBenarCount += 1;
    else kel.jawabanSalahCount += 1;
    saveLocalStore(store);
  }
}

export async function distributeStudentsRandomly(pertandinganId: string, groupCount: number): Promise<KelompokDoc[]> {
  const store = getLocalStore();
  const students = [...SEED_STUDENTS];

  // Shuffle array
  for (let i = students.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [students[i], students[j]] = [students[j], students[i]];
  }

  const groupColors = ['#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#3b82f6'];
  const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const groupNicknames = ['Viper Piston', 'Turbo Charged', 'VTEC Camshaft', 'Rotary Apex', 'Nitrous Boost', 'Dyno Master'];

  const newGroups: KelompokDoc[] = [];

  for (let g = 0; g < groupCount; g++) {
    const letter = groupLetters[g] || `G${g + 1}`;
    const nickname = groupNicknames[g] || `Kelompok ${letter}`;
    newGroups.push({
      id: `kel-${letter.toLowerCase()}-${Date.now()}`,
      pertandinganId,
      namaKelompok: `Kelompok ${letter} (${nickname})`,
      skor: 0,
      waktu: 0,
      anggota: [],
      warna: groupColors[g % groupColors.length],
      jawabanBenarCount: 0,
      jawabanSalahCount: 0,
    });
  }

  // Distribute students equally
  students.forEach((student, index) => {
    const targetGroup = newGroups[index % groupCount];
    targetGroup.anggota.push(student.nama);
  });

  // Replace or merge in store
  store.kelompok = store.kelompok.filter(k => k.pertandinganId !== pertandinganId).concat(newGroups);
  saveLocalStore(store);
  return newGroups;
}

// 3. Hasil & Leaderboard
export async function fetchHasilList(): Promise<HasilDoc[]> {
  const store = getLocalStore();
  return store.hasil.sort((a, b) => b.nilai - a.nilai);
}

export async function saveHasil(hasil: HasilDoc): Promise<void> {
  const store = getLocalStore();
  store.hasil.unshift(hasil);
  saveLocalStore(store);
}

// 4. Users & Kelas
export async function fetchAllUsers(): Promise<UserDoc[]> {
  const store = getLocalStore();
  return store.users;
}

export async function fetchAllKelas(): Promise<KelasDoc[]> {
  const store = getLocalStore();
  return store.kelas;
}

export async function saveUserDoc(user: UserDoc): Promise<void> {
  const store = getLocalStore();
  const idx = store.users.findIndex(u => u.uid === user.uid);
  if (idx >= 0) {
    store.users[idx] = user;
  } else {
    store.users.push(user);
  }
  saveLocalStore(store);
}

export async function saveKelasDoc(kelas: KelasDoc): Promise<void> {
  const store = getLocalStore();
  const idx = store.kelas.findIndex(k => k.id === kelas.id);
  if (idx >= 0) {
    store.kelas[idx] = kelas;
  } else {
    store.kelas.push(kelas);
  }
  saveLocalStore(store);
}
