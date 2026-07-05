import React, { useState, useEffect } from 'react';
import { 
  User, Clock, ChevronLeft, ChevronRight, CheckCircle, 
  AlertTriangle, LogOut, MonitorPlay, Users, FileText, 
  Key, UserPlus, Settings, Trash2, RotateCcw, Shield, XCircle
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, remove } from 'firebase/database';

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyCwlRLdIWco7euHya5j7gOpYNp8WrOdjXE",
  authDomain: "simulasi-tka-sdn-cidahu.firebaseapp.com",
  databaseURL: "https://simulasi-tka-sdn-cidahu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "simulasi-tka-sdn-cidahu",
  storageBucket: "simulasi-tka-sdn-cidahu.firebasestorage.app",
  messagingSenderId: "222861202622",
  appId: "1:222861202622:web:f8ba7409cbd901a2257aef",
  measurementId: "G-YX9CQN0QX3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- 25 SOAL UNIK (LITERASI, NUMERASI, SURVEI KARAKTER) ---
const mockQuestions = [
  // LITERASI (1-10)
  { id: 1, type: 'literasi', title: 'Literasi - Cerita Fabel', text: 'Suatu hari di hutan, Kancil melihat Buaya sedang menangis karena tertimpa batang pohon. Kancil yang cerdik menggunakan sebatang bambu sebagai pengungkit untuk menolong Buaya. Namun, setelah ditolong, Buaya justru ingin menerkam Kancil.', question: 'Bagaimana sifat Kancil dalam cerita di atas?', options: ['Sombong', 'Licik', 'Penolong dan Cerdik', 'Pemarah'], correctAnswer: 2 },
  { id: 2, type: 'literasi', title: 'Literasi - Cerita Fabel', text: 'Suatu hari di hutan, Kancil melihat Buaya sedang menangis karena tertimpa batang pohon. Kancil yang cerdik menggunakan sebatang bambu sebagai pengungkit untuk menolong Buaya. Namun, setelah ditolong, Buaya justru ingin menerkam Kancil.', question: 'Apa pesan moral dari cerita tersebut?', options: ['Jangan suka tidur di hutan', 'Berhati-hatilah saat menolong orang yang tidak tahu berterima kasih', 'Batang pohon sangat berbahaya', 'Buaya adalah hewan air'], correctAnswer: 1 },
  { id: 3, type: 'literasi', title: 'Literasi - Teks Informasi Sains', text: 'Proses fotosintesis pada tumbuhan membutuhkan cahaya matahari, air, dan karbon dioksida. Dari proses ini, tumbuhan menghasilkan glukosa (makanan) dan oksigen yang sangat penting bagi pernapasan manusia dan hewan.', question: 'Berdasarkan teks, gas apa yang dihasilkan oleh tumbuhan yang berguna bagi manusia?', options: ['Karbon dioksida', 'Oksigen', 'Hidrogen', 'Nitrogen'], correctAnswer: 1 },
  { id: 4, type: 'literasi', title: 'Literasi - Teks Informasi Sains', text: 'Proses fotosintesis pada tumbuhan membutuhkan cahaya matahari, air, dan karbon dioksida. Dari proses ini, tumbuhan menghasilkan glukosa (makanan) dan oksigen yang sangat penting bagi pernapasan manusia dan hewan.', question: 'Bahan baku apa saja yang dibutuhkan untuk fotosintesis?', options: ['Oksigen dan Air', 'Cahaya matahari, Air, dan Karbon dioksida', 'Glukosa dan Oksigen', 'Air dan Tanah'], correctAnswer: 1 },
  { id: 5, type: 'literasi', title: 'Literasi - Puisi', text: 'Pahlawanku...\nKeringatmu membasahi bumi pertiwi\nDarahmu mengalir demi kemerdekaan\nTanpa pamrih engkau berjuang\nAgar kami bisa tersenyum hari ini.', question: 'Apa tema dari penggalan puisi di atas?', options: ['Keindahan alam', 'Perjuangan pahlawan', 'Kesedihan anak', 'Pendidikan sekolah'], correctAnswer: 1 },
  { id: 6, type: 'literasi', title: 'Literasi - Puisi', text: 'Pahlawanku...\nKeringatmu membasahi bumi pertiwi\nDarahmu mengalir demi kemerdekaan\nTanpa pamrih engkau berjuang\nAgar kami bisa tersenyum hari ini.', question: 'Makna kata "tanpa pamrih" dalam puisi tersebut adalah...', options: ['Minta dibayar', 'Tidak mengharapkan imbalan', 'Dengan terpaksa', 'Sangat lambat'], correctAnswer: 1 },
  { id: 7, type: 'literasi', title: 'Literasi - Iklan/Poster', text: '[POSTER]\n"Buanglah Sampah pada Tempatnya!\nSatu sampah yang kamu buang sembarangan, akan menjadi ribuan penyakit bagi keluargamu."\n(Dinas Kesehatan Daerah)', question: 'Siapa sasaran utama dari pesan poster di atas?', options: ['Seluruh masyarakat', 'Hanya petugas kebersihan', 'Hanya anak sekolah', 'Hanya dokter'], correctAnswer: 0 },
  { id: 8, type: 'literasi', title: 'Literasi - Iklan/Poster', text: '[POSTER]\n"Buanglah Sampah pada Tempatnya!\nSatu sampah yang kamu buang sembarangan, akan menjadi ribuan penyakit bagi keluargamu."\n(Dinas Kesehatan Daerah)', question: 'Apa tujuan dari poster tersebut?', options: ['Mengajak orang menanam pohon', 'Mengimbau masyarakat agar menjaga kebersihan', 'Menjual tempat sampah', 'Mencari pegawai Dinas Kesehatan'], correctAnswer: 1 },
  { id: 9, type: 'literasi', title: 'Literasi - Biografi Tokoh', text: 'Ki Hajar Dewantara lahir di Yogyakarta pada tanggal 2 Mei 1889. Beliau mendirikan perguruan Taman Siswa yang memberikan kesempatan bagi kaum pribumi untuk memperoleh pendidikan seperti halnya para priyayi dan orang Belanda.', question: 'Apa jasa utama Ki Hajar Dewantara berdasarkan teks di atas?', options: ['Memimpin perang di Yogyakarta', 'Mendirikan sekolah untuk rakyat biasa', 'Menjadi presiden pertama', 'Mengusir penjajah Belanda sendirian'], correctAnswer: 1 },
  { id: 10, type: 'literasi', title: 'Literasi - Biografi Tokoh', text: 'Ki Hajar Dewantara lahir di Yogyakarta pada tanggal 2 Mei 1889. Beliau mendirikan perguruan Taman Siswa yang memberikan kesempatan bagi kaum pribumi untuk memperoleh pendidikan seperti halnya para priyayi dan orang Belanda.', question: 'Kapan Ki Hajar Dewantara dilahirkan?', options: ['2 Mei 1889', '20 Mei 1908', '17 Agustus 1945', '2 Mei 1922'], correctAnswer: 0 },
  
  // NUMERASI (11-20)
  { id: 11, type: 'numerasi', title: 'Numerasi - Aritmatika', text: 'Ibu pergi ke pasar membeli 3 kg telur seharga Rp 25.000 per kg dan 2 kg minyak goreng seharga Rp 15.000 per kg.', question: 'Berapa total uang yang harus dibayarkan Ibu?', options: ['Rp 100.000', 'Rp 105.000', 'Rp 95.000', 'Rp 110.000'], correctAnswer: 1 },
  { id: 12, type: 'numerasi', title: 'Numerasi - Aritmatika', text: 'Ibu membawa uang selembar Rp 100.000 dan selembar Rp 50.000. Setelah berbelanja, total belanjaan Ibu adalah Rp 105.000.', question: 'Berapa sisa uang kembalian yang diterima Ibu?', options: ['Rp 35.000', 'Rp 40.000', 'Rp 45.000', 'Rp 50.000'], correctAnswer: 2 },
  { id: 13, type: 'numerasi', title: 'Numerasi - Pecahan', text: 'Siti memiliki sebuah kue ulang tahun berbentuk lingkaran. Ia memotong kue tersebut menjadi 8 bagian yang sama besar. Siti memberikan 3 potong kue kepada Budi dan 2 potong kepada adiknya.', question: 'Berapa bagian kue yang masih tersisa untuk Siti?', options: ['1/8 bagian', '2/8 bagian', '3/8 bagian', '4/8 bagian'], correctAnswer: 2 },
  { id: 14, type: 'numerasi', title: 'Numerasi - Pecahan', text: 'Di papan tulis terdapat pecahan 2/4.', question: 'Pecahan manakah di bawah ini yang nilainya sama (senilai) dengan 2/4?', options: ['1/3', '1/2', '3/4', '2/8'], correctAnswer: 1 },
  { id: 15, type: 'numerasi', title: 'Numerasi - Geometri', text: 'Sebuah taman sekolah berbentuk persegi panjang. Panjang taman tersebut adalah 10 meter dan lebarnya 6 meter.', question: 'Berapakah luas taman sekolah tersebut?', options: ['60 meter persegi', '32 meter persegi', '16 meter persegi', '600 meter persegi'], correctAnswer: 0 },
  { id: 16, type: 'numerasi', title: 'Numerasi - Geometri', text: 'Sebuah taman sekolah berbentuk persegi panjang. Panjang taman tersebut adalah 10 meter dan lebarnya 6 meter.', question: 'Jika Pak Guru ingin memasang pagar di sekeliling taman tersebut, berapa panjang pagar yang dibutuhkan?', options: ['16 meter', '32 meter', '60 meter', '100 meter'], correctAnswer: 1 },
  { id: 17, type: 'numerasi', title: 'Numerasi - Konversi Satuan', text: 'Jarak rumah Andi ke sekolah adalah 2 kilometer (km) lebih 500 meter (m).', question: 'Jika dinyatakan dalam satuan meter (m) seluruhnya, berapakah jarak rumah Andi ke sekolah?', options: ['250 meter', '2050 meter', '2500 meter', '25000 meter'], correctAnswer: 2 },
  { id: 18, type: 'numerasi', title: 'Numerasi - Analisis Data', text: 'Data hasil panen buah di Desa Sukamaju:\n- Mangga: 120 kg\n- Jeruk: 90 kg\n- Pisang: 150 kg\n- Apel: 80 kg', question: 'Buah apakah yang hasil panennya paling banyak dan paling sedikit secara berurutan?', options: ['Mangga dan Apel', 'Pisang dan Apel', 'Pisang dan Jeruk', 'Mangga dan Jeruk'], correctAnswer: 1 },
  { id: 19, type: 'numerasi', title: 'Numerasi - Analisis Data', text: 'Data hasil panen buah di Desa Sukamaju:\n- Mangga: 120 kg\n- Jeruk: 90 kg\n- Pisang: 150 kg\n- Apel: 80 kg', question: 'Berapa selisih hasil panen buah Pisang dengan buah Jeruk?', options: ['40 kg', '50 kg', '60 kg', '70 kg'], correctAnswer: 2 },
  { id: 20, type: 'numerasi', title: 'Numerasi - Pola Bilangan', text: 'Perhatikan urutan bilangan berikut: 2, 5, 8, 11, ...', question: 'Berapakah bilangan selanjutnya dari pola tersebut?', options: ['12', '13', '14', '15'], correctAnswer: 2 },

  // SURVEI KARAKTER (21-25)
  { id: 21, type: 'survei', title: 'Survei Lingkungan Belajar - Gotong Royong', text: 'Saat jam istirahat, kamu melihat seorang teman barumu kesulitan membawa banyak buku tebal menuju perpustakaan. Sementara itu, kamu sedang asyik bermain dengan teman-temanmu.', question: 'Tindakan apa yang mencerminkan profil Pelajar Pancasila dalam situasi ini?', options: ['Menertawakannya bersama teman-teman yang lain.', 'Membiarkannya saja karena itu bukan urusanku.', 'Meninggalkan permainan sejenak untuk membantunya membawakan sebagian buku.', 'Menyuruh teman lain untuk membantunya.'], correctAnswer: 2 },
  { id: 22, type: 'survei', title: 'Survei Lingkungan Belajar - Toleransi Beragama', text: 'Kamu sedang mengerjakan tugas kelompok di rumah temanmu. Saat azan ashar berkumandang, temanmu yang beragama Islam meminta izin untuk shalat sebentar.', question: 'Sikap toleransi yang paling tepat untuk kamu lakukan adalah...', options: ['Mendesaknya agar shalatnya ditunda sampai tugas selesai.', 'Mempersilakannya beribadah dan menunggu dengan tenang.', 'Pulang ke rumah karena marah ditinggal.', 'Menyalakan televisi dengan suara keras.'], correctAnswer: 1 },
  { id: 23, type: 'survei', title: 'Survei Lingkungan Belajar - Integritas', text: 'Dalam perjalanan pulang sekolah, kamu menemukan sebuah dompet berisi uang yang cukup banyak tergeletak di jalan. Di dalamnya ada KTP tetanggamu.', question: 'Apa yang akan kamu lakukan?', options: ['Mengambil uangnya dan membuang dompetnya.', 'Menyerahkan dompet beserta isinya kepada tetanggamu secara utuh.', 'Memberikan dompet itu ke teman agar ia yang mengurus.', 'Membiarkan dompet itu di jalan karena takut dituduh mencuri.'], correctAnswer: 1 },
  { id: 24, type: 'survei', title: 'Survei Lingkungan Belajar - Tanggung Jawab', text: 'Guru membagi kelas menjadi kelompok. Di kelompokmu, ada satu teman yang diam saja dan tidak mau membantu mengerjakan bagian tugasnya.', question: 'Tindakan terbaik untuk menghadapi masalah kelompok ini adalah...', options: ['Mengerjakan semua tugas sendiri dan memarahi teman tersebut.', 'Mengajaknya berdiskusi pelan-pelan dan memberinya tugas yang mudah terlebih dahulu.', 'Melaporkannya langsung ke guru agar dia dihukum.', 'Memusuhi teman tersebut.'], correctAnswer: 1 },
  { id: 25, type: 'survei', title: 'Survei Lingkungan Belajar - Bernalar Kritis', text: 'Kamu menerima pesan berantai di WhatsApp grup kelas yang mengatakan bahwa "Besok sekolah diliburkan sebulan penuh tanpa alasan". Kamu belum mendengar pengumuman resmi dari guru.', question: 'Sebagai siswa yang cerdas bermedia sosial, apa yang kamu lakukan?', options: ['Langsung meneruskan pesan itu ke grup keluarga.', 'Bersenang-senang dan langsung mematikan alarm sekolah.', 'Menanyakan kebenarannya (klarifikasi) langsung kepada wali kelas.', 'Membantah pesan itu dengan marah-marah di grup.'], correctAnswer: 2 }
];

export default function App() {
  const [currentView, setCurrentView] = useState('login'); 
  const [currentUser, setCurrentUser] = useState(null);
  
  // State tersinkronisasi dengan Firebase
  const [activeToken, setActiveToken] = useState(''); 
  const [studentsDb, setStudentsDb] = useState([]);
  const [proctorCredentials, setProctorCredentials] = useState({ username: 'proktor', password: 'admin123' });
  const [isConnected, setIsConnected] = useState(false); 
  const [dbError, setDbError] = useState(''); 

  useEffect(() => {
    const studentsRef = ref(db, 'students');
    const tokenRef = ref(db, 'token');
    const proctorRef = ref(db, 'proctor');

    const handleFirebaseError = (error) => {
      setDbError(error.message);
      setIsConnected(true); 
    };

    const unsubStudents = onValue(studentsRef, (snapshot) => {
      if (snapshot.exists()) {
        setStudentsDb(Object.values(snapshot.val()));
      } else {
        setStudentsDb([]); // Jika database benar-benar kosong
      }
      setIsConnected(true);
      setDbError('');
    }, handleFirebaseError);

    const unsubToken = onValue(tokenRef, (snapshot) => {
      setActiveToken(snapshot.val() || '');
    }, handleFirebaseError);

    const unsubProctor = onValue(proctorRef, (snapshot) => {
      if (snapshot.exists()) {
        setProctorCredentials(snapshot.val());
      } else {
        set(proctorRef, { username: 'proktor', password: 'admin123' }).catch(handleFirebaseError);
      }
    }, handleFirebaseError);

    return () => {
      unsubStudents();
      unsubToken();
      unsubProctor();
    };
  }, []);

  const handleLogin = (role, userData) => {
    setCurrentUser(userData);
    if (role === 'student') {
      setCurrentView('konfirmasi'); 
    } else {
      setCurrentView(role);
    }
  };

  const handleAbsenDanMulai = () => {
    const waktuHadir = new Date().toLocaleTimeString('id-ID');
    const studentRef = ref(db, `students/${currentUser.id}`);
    update(studentRef, { status: 'Sedang Mengerjakan', waktuAbsen: waktuHadir });
    setCurrentUser(prev => ({ ...prev, status: 'Sedang Mengerjakan', waktuAbsen: waktuHadir }));
    setCurrentView('student');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  // Diperbarui: Menambahkan parameter finalStatus (Bisa 'Selesai' atau 'Waktu Habis')
  const handleStudentSubmit = (studentId, answers, score, finalStatus = 'Selesai') => {
    const studentRef = ref(db, `students/${studentId}`);
    update(studentRef, { status: finalStatus, answers, score });
    setCurrentView('login');
    setCurrentUser(null);
  };

  const handleSetToken = (newToken) => {
    set(ref(db, 'token'), newToken);
  };

  const handleSetProctorCredentials = (newCreds) => {
    set(ref(db, 'proctor'), newCreds);
  };

  const handleAddStudent = (newStudent) => {
    set(ref(db, `students/${newStudent.id}`), newStudent);
  };

  const handleDeleteStudent = (studentId) => {
    remove(ref(db, `students/${studentId}`));
  };

  const handleResetStudent = (studentId) => {
    const studentRef = ref(db, `students/${studentId}`);
    update(studentRef, { status: 'Belum Login', score: 0, answers: {}, waktuAbsen: '-' });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {!isConnected && (
        <div className="bg-yellow-500 text-white text-center py-1 text-sm font-bold animate-pulse">
          Menyambungkan ke Server Cloud Firebase...
        </div>
      )}
      
      {dbError && (
        <div className="bg-red-600 text-white text-center py-2 text-sm font-bold shadow-md">
          <span className="animate-pulse">⚠️ AKSES DITOLAK:</span> Database belum di-publish (Rules belum true). {dbError}
        </div>
      )}

      {currentView === 'login' && (
        <LoginScreen 
          onLogin={handleLogin} 
          activeToken={activeToken}
          studentsDb={studentsDb}
          proctorCredentials={proctorCredentials}
        />
      )}
      {currentView === 'konfirmasi' && (
        <KonfirmasiDataScreen 
          user={currentUser} 
          onConfirm={handleAbsenDanMulai} 
          onLogout={handleLogout} 
        />
      )}
      {currentView === 'student' && (
        <ClientBrowser 
          user={currentUser} 
          onLogout={handleLogout} 
          onSubmit={handleStudentSubmit} 
        />
      )}
      {currentView === 'proctor' && (
        <ProctorBrowser 
          students={studentsDb} 
          onLogout={handleLogout} 
          activeToken={activeToken}
          onSetToken={handleSetToken}
          onAddStudent={handleAddStudent}
          onDeleteStudent={handleDeleteStudent}
          onResetStudent={handleResetStudent}
          proctorCredentials={proctorCredentials}
          onUpdateProctorCredentials={handleSetProctorCredentials}
        />
      )}
    </div>
  );
}

function LoginScreen({ onLogin, activeToken, studentsDb, proctorCredentials }) {
  const [loginType, setLoginType] = useState('student');
  const [error, setError] = useState('');
  
  const [nisn, setNisn] = useState('');
  const [password, setPassword] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  
  const [proctorUser, setProctorUser] = useState('');
  const [proctorPass, setProctorPass] = useState('');

  const handleSimulateLogin = (e) => {
    e.preventDefault();
    setError('');

    if (loginType === 'student') {
      if (!activeToken) {
        setError('Token belum di-generate oleh Proktor. Harap tunggu.');
        return;
      }
      if (tokenInput.toUpperCase() !== activeToken) {
        setError('Token ujian tidak valid!');
        return;
      }
      const student = studentsDb.find(s => s.id === nisn);
      if (student) {
        if (student.password === password) {
          onLogin('student', student);
        } else {
          setError('Password Siswa salah!');
        }
      } else {
        setError('NISN tidak terdaftar! Minta proktor menambahkan data Anda.');
      }
    } else {
      if (proctorUser === proctorCredentials.username && proctorPass === proctorCredentials.password) {
        onLogin('proctor', { name: 'Bpk/Ibu Guru (Proktor)' });
      } else {
        setError('Username atau Password Proktor salah!');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-600">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">APLIKASI SIMULASI TKA SDN CIDAHU</h1>
          <p className="text-gray-500 text-sm mt-2">Pusat Asesmen Pendidikan</p>
        </div>

        <div className="flex mb-6 space-x-2">
          <button 
            onClick={() => { setLoginType('student'); setError(''); }}
            className={`flex-1 py-2 rounded font-semibold transition-colors ${loginType === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            Siswa (Client)
          </button>
          <button 
            onClick={() => { setLoginType('proctor'); setError(''); }}
            className={`flex-1 py-2 rounded font-semibold transition-colors ${loginType === 'proctor' ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            Proktor
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSimulateLogin} className="space-y-4">
          {loginType === 'student' ? (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Username (NISN)</label>
                <input type="text" value={nisn} onChange={(e) => setNisn(e.target.value)} className="w-full px-4 py-2 border rounded-md" placeholder="Masukkan NISN" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" placeholder="Password Siswa" required />
              </div>
              <div className="pt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-center text-blue-700">Token Ujian</label>
                <input type="text" value={tokenInput} onChange={(e) => setTokenInput(e.target.value.toUpperCase())} className="w-full px-4 py-3 border-2 border-blue-400 rounded-md font-mono text-center text-xl tracking-widest uppercase bg-blue-50" placeholder="XXXXXX" required />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Username Proktor</label>
                <input type="text" value={proctorUser} onChange={(e) => setProctorUser(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Password Proktor</label>
                <input type="password" value={proctorPass} onChange={(e) => setProctorPass(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
              </div>
            </>
          )}
          <button type="submit" className={`w-full py-3 mt-4 rounded-md font-bold text-white transition-colors shadow ${loginType === 'student' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-700 hover:bg-indigo-800'}`}>
            LOGIN {loginType === 'proctor' ? 'PROKTOR' : 'UJIAN'}
          </button>
        </form>
      </div>
    </div>
  );
}

function KonfirmasiDataScreen({ user, onConfirm, onLogout }) {
  const [typedName, setTypedName] = useState('');
  const [typedDob, setTypedDob] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleConfirm = () => {
    if (!typedName.trim() || !typedDob) {
      setErrorMsg('Silakan ketik nama lengkap dan isi tanggal lahir Anda untuk melanjutkan.');
      return;
    }
    if (typedName.trim().toLowerCase() !== user.name.toLowerCase()) {
      setErrorMsg('Nama yang diketik salah! Pastikan ejaannya sesuai dengan data di atas.');
      return;
    }
    if (typedDob !== user.dob) {
      setErrorMsg('Tanggal lahir salah! Perhatikan tanggal lahir yang tertera di atas.');
      return;
    }
    onConfirm();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Konfirmasi Data & Latihan Mengetik</h2>
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6 shadow-inner">
          <div className="grid grid-cols-3 gap-4 mb-3">
            <span className="text-gray-600 font-semibold">NISN / Username</span><span className="col-span-2 font-bold">: {user.id}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <span className="text-gray-600 font-semibold">Nama Peserta</span><span className="col-span-2 font-bold">: {user.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <span className="text-gray-600 font-semibold">Tanggal Lahir</span><span className="col-span-2 font-bold text-red-600">: {user.dob || '-'}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <span className="text-gray-600 font-semibold">Mata Ujian</span><span className="col-span-2 font-bold text-blue-600">: Simulasi TKA (Literasi & Numerasi)</span>
          </div>
        </div>

        <div className="mb-6 p-5 border rounded-lg bg-gray-50 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase text-center border-b pb-2">Form Latihan Input Data</h3>
          {errorMsg && <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm font-semibold rounded text-center">{errorMsg}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Ketik Ulang Nama Lengkap Anda</label>
              <input type="text" value={typedName} onChange={(e) => setTypedName(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-md" placeholder="Ketik nama di sini..." />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Tanggal Lahir Anda</label>
              <input type="date" value={typedDob} onChange={(e) => setTypedDob(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-md" />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button onClick={handleConfirm} className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-md font-bold shadow flex items-center justify-center text-lg">
            <CheckCircle size={20} className="mr-2" /> Konfirmasi Hadir & Mulai Ujian
          </button>
          <button onClick={onLogout} className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-bold shadow flex items-center justify-center">
            <LogOut size={20} className="mr-2" /> Batal & Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

function ClientBrowser({ user, onLogout, onSubmit }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [doubtful, setDoubtful] = useState({});
  // Set waktu ujian: 7200 detik (2 Jam). Ubah angka ini untuk testing lebih cepat.
  const [timeLeft, setTimeLeft] = useState(7200); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showNavModal, setShowNavModal] = useState(false);

  const question = mockQuestions[currentQIndex];

  // Efek Timer Waktu Habis (Auto-Submit)
  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeOut(); // Waktu habis!
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex) => {
    setAnswers(prev => ({ ...prev, [currentQIndex]: optionIndex }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    mockQuestions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) correctCount++;
    });
    return Math.round((correctCount / mockQuestions.length) * 100);
  };

  const finishExam = () => {
    const score = calculateScore();
    onSubmit(user.id, answers, score, 'Selesai');
  };

  const handleTimeOut = () => {
    setShowTimeoutModal(true); // Tampilkan modal paksa tutup
    setTimeout(() => {
      const score = calculateScore();
      // Status 'Waktu Habis' akan dikirim ke Proktor
      onSubmit(user.id, answers, score, 'Waktu Habis'); 
    }, 4000); // 4 detik membaca peringatan sebelum auto-logout
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-[#1976d2] text-white p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-white text-[#1976d2] p-2 rounded-full"><FileText size={24} /></div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider">CBT - Client Browser</h1>
            <p className="text-xs opacity-80">SDN Cidahu</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-sm opacity-80">Peserta Ujian (NISN: {user.id})</p>
          </div>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 p-2 rounded-full transition" title="Keluar"><LogOut size={20} /></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto">
          <div className="flex justify-between items-center bg-white p-3 rounded-t-lg border-b shadow-sm">
            <div className="font-bold text-gray-700">Soal: <span className="text-blue-600 text-xl">{currentQIndex + 1}</span> / {mockQuestions.length}</div>
            
            {/* Indikator Waktu Berubah Merah saat sisa < 5 Menit */}
            <div className={`flex items-center space-x-2 font-bold px-4 py-1 rounded-full border 
              ${timeLeft < 300 ? 'bg-red-600 text-white border-red-700 animate-pulse' : 'bg-red-50 text-red-600 border-red-200'}`}>
              <Clock size={18} />
              <span>{formatTime(timeLeft)}</span>
            </div>
            
            <button onClick={() => setShowNavModal(!showNavModal)} className="md:hidden bg-blue-100 text-blue-700 px-3 py-1 rounded font-semibold">
              Daftar Soal
            </button>
          </div>

          <div className="bg-white p-6 rounded-b-lg shadow-sm flex-1 mb-4 flex flex-col">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">{question.title}</h2>
            <div className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-line bg-gray-50 p-4 border rounded">{question.text}</div>
            <div className="font-semibold text-gray-800 text-lg mb-4">{question.question}</div>
            <div className="space-y-3 mt-auto">
              {question.options.map((opt, idx) => (
                <label key={idx} className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${answers[currentQIndex] === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name={`q-${currentQIndex}`} value={idx} checked={answers[currentQIndex] === idx} onChange={() => handleAnswer(idx)} className="w-5 h-5 mt-0.5 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-3 text-gray-700 font-medium"><span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto pb-4">
            <button onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))} disabled={currentQIndex === 0} className={`flex items-center px-4 py-2 rounded shadow font-bold ${currentQIndex === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
              <ChevronLeft size={20} className="mr-1 hidden sm:block" /> Sebelumnya
            </button>
            <button onClick={() => setDoubtful(prev => ({ ...prev, [currentQIndex]: !prev[currentQIndex] }))} className={`flex items-center px-6 py-2 rounded shadow font-bold transition-colors ${doubtful[currentQIndex] ? 'bg-yellow-500 text-white' : 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'}`}>
              <AlertTriangle size={18} className="mr-1 hidden sm:block" /> Ragu-ragu
            </button>
            {currentQIndex < mockQuestions.length - 1 ? (
              <button onClick={() => setCurrentQIndex(prev => Math.min(mockQuestions.length - 1, prev + 1))} className="flex items-center px-4 py-2 rounded shadow font-bold bg-blue-600 text-white hover:bg-blue-700">
                Berikutnya <ChevronRight size={20} className="ml-1 hidden sm:block" />
              </button>
            ) : (
              <button onClick={() => setShowConfirmModal(true)} className="flex items-center px-6 py-2 rounded shadow font-bold bg-green-500 text-white hover:bg-green-600">
                <CheckCircle size={20} className="mr-1 hidden sm:block" /> Selesai
              </button>
            )}
          </div>
        </div>

        <div className={`w-80 bg-white border-l p-4 flex-col hidden md:flex overflow-y-auto`}>
          <h3 className="font-bold text-gray-700 mb-4 text-center border-b pb-2">Daftar Soal ({mockQuestions.length})</h3>
          <div className="grid grid-cols-5 gap-2">
            {mockQuestions.map((q, idx) => {
              let btnClass = "w-10 h-10 rounded-md font-bold text-sm flex items-center justify-center border-2 transition-all ";
              if (currentQIndex === idx) btnClass += "border-blue-600 ring-2 ring-blue-200 ";
              else btnClass += "border-gray-200 ";

              if (doubtful[idx]) btnClass += "bg-yellow-400 text-white border-yellow-500 ";
              else if (answers[idx] !== undefined) btnClass += "bg-blue-600 text-white border-blue-700 ";
              else btnClass += "bg-white text-gray-700 hover:bg-gray-100 ";

              return (
                <button key={idx} onClick={() => setCurrentQIndex(idx)} className={btnClass}>{idx + 1}</button>
              );
            })}
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Konfirmasi Selesai</h2>
            <p className="text-gray-600 mb-6">Yakin ingin mengakhiri ujian? Jawaban tidak bisa diubah setelah klik Selesai.</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 border rounded font-semibold text-gray-700 hover:bg-gray-100">Batal</button>
              <button onClick={finishExam} className="px-4 py-2 bg-green-500 rounded font-semibold text-white hover:bg-green-600">Ya, Selesai</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KETIKA WAKTU HABIS (AUTO SUBMIT) */}
      {showTimeoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 text-center border-t-8 border-red-600">
            <XCircle size={56} className="mx-auto text-red-500 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold mb-2 text-red-600">WAKTU UJIAN HABIS!</h2>
            <p className="text-gray-700 mb-4 font-semibold">Layar Anda telah dikunci oleh sistem.</p>
            <p className="text-gray-500 text-sm">Sistem sedang menyimpan seluruh jawaban Anda secara otomatis. Anda akan dikeluarkan dari kelas virtual ini.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProctorBrowser({ students, onLogout, activeToken, onSetToken, onAddStudent, onDeleteStudent, onResetStudent, proctorCredentials, onUpdateProctorCredentials }) {
  const [activeTab, setActiveTab] = useState('monitoring'); 
  const [newNisn, setNewNisn] = useState('');
  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [editProctorUser, setEditProctorUser] = useState(proctorCredentials.username);
  const [editProctorPass, setEditProctorPass] = useState(proctorCredentials.password);
  const [studentToAction, setStudentToAction] = useState(null);
  const [actionType, setActionType] = useState(''); 

  useEffect(() => {
    setEditProctorUser(proctorCredentials.username);
    setEditProctorPass(proctorCredentials.password);
  }, [proctorCredentials]);

  const handleGenerateToken = () => {
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    onSetToken(token);
    showMessage('Token baru berhasil di-generate!', 'success');
  };

  const showMessage = (text, type) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const submitAddStudent = (e) => {
    e.preventDefault();
    if (students.find(s => s.id === newNisn)) { showMessage('Gagal: NISN sudah terdaftar!', 'error'); return; }
    onAddStudent({ id: newNisn, password: newPassword, name: newName, dob: newDob, status: 'Belum Login', score: 0, answers: {}, waktuAbsen: '-' });
    setNewNisn(''); setNewName(''); setNewDob(''); setNewPassword('123456');
    showMessage('Siswa ditambahkan!', 'success');
  };

  const handleUpdateProctor = (e) => {
    e.preventDefault();
    onUpdateProctorCredentials({ username: editProctorUser, password: editProctorPass });
    showMessage('Kredensial proktor tersimpan!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-indigo-800 text-white p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center space-x-3">
          <MonitorPlay size={24} />
          <h1 className="text-xl font-bold hidden sm:block">Proktor Browser - Simulasi ANBK</h1>
          <h1 className="text-xl font-bold sm:hidden">Proktor</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={onLogout} className="flex items-center text-sm font-semibold hover:text-indigo-200 transition">
            <LogOut size={16} className="mr-1" /> Keluar
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-16 md:w-64 bg-white shadow-md flex flex-col z-0 shrink-0">
          <nav className="flex-1 p-2 md:p-3 space-y-2 mt-4">
            <button onClick={() => setActiveTab('monitoring')} className={`w-full flex items-center justify-center md:justify-start px-2 md:px-4 py-3 rounded-lg text-left font-semibold transition-colors ${activeTab === 'monitoring' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Users size={20} className="md:mr-3" /> <span className="hidden md:inline">Monitoring</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center justify-center md:justify-start px-2 md:px-4 py-3 rounded-lg text-left font-semibold transition-colors ${activeTab === 'settings' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Settings size={20} className="md:mr-3" /> <span className="hidden md:inline">Pengaturan</span>
            </button>
          </nav>
        </div>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-sm text-gray-500 font-bold uppercase mb-1">Token Ujian Aktif (Cloud)</h2>
              {activeToken ? <div className="text-4xl font-mono font-bold text-indigo-700 tracking-widest">{activeToken}</div> : <div className="text-lg font-bold text-red-500">Belum di-generate</div>}
            </div>
            <button onClick={handleGenerateToken} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold flex items-center shadow transition-transform transform active:scale-95">
              <Key size={20} className="mr-2" /> Generate Token
            </button>
          </div>

          {msg.text && (
            <div className={`mb-6 p-4 border-l-4 rounded shadow-sm font-semibold flex items-center ${msg.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'}`}>
              {msg.type === 'error' ? <AlertTriangle size={20} className="mr-2"/> : <CheckCircle size={20} className="mr-2"/>}
              {msg.text}
            </div>
          )}

          {activeTab === 'monitoring' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                 <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"><p className="text-xs font-bold text-gray-500">TOTAL SISWA</p><p className="text-2xl font-bold">{students.length}</p></div>
                 <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500"><p className="text-xs font-bold text-gray-500">UJIAN AKTIF</p><p className="text-2xl font-bold">{students.filter(s => s.status === 'Sedang Mengerjakan').length}</p></div>
                 <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500"><p className="text-xs font-bold text-gray-500">SELESAI</p><p className="text-2xl font-bold text-green-600">{students.filter(s => s.status === 'Selesai').length}</p></div>
                 <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500"><p className="text-xs font-bold text-gray-500">WAKTU HABIS</p><p className="text-2xl font-bold text-red-600">{students.filter(s => s.status === 'Waktu Habis').length}</p></div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="p-4 border-b bg-gray-50 flex flex-wrap justify-between items-center gap-2">
                  <h2 className="font-bold text-gray-800 text-lg">Monitoring Ujian Real-time</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="p-4 text-sm font-semibold text-gray-600">NISN</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Nama Siswa</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Waktu Hadir</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="p-4 text-sm font-semibold text-gray-600 text-center">Skor Akhir</th>
                        <th className="p-4 text-sm font-semibold text-gray-600 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-mono text-sm text-gray-600">{student.id}</td>
                          <td className="p-4 font-semibold text-gray-800">{student.name}</td>
                          <td className="p-4 text-sm text-gray-500 font-mono font-semibold">
                            {student.waktuAbsen && student.waktuAbsen !== '-' ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded">{student.waktuAbsen}</span> : '-'}
                          </td>
                          <td className="p-4">
                            {/* PEWARNAAN STATUS DIPERBARUI */}
                            <span className={`px-2 py-1 rounded text-xs font-bold 
                              ${student.status === 'Selesai' ? 'bg-green-100 text-green-800 border border-green-200' : 
                                student.status === 'Waktu Habis' ? 'bg-red-100 text-red-800 border border-red-200' : 
                                student.status === 'Sedang Mengerjakan' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                                'bg-gray-200 text-gray-700'}`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {student.status === 'Selesai' || student.status === 'Waktu Habis' ? <span className="font-bold text-xl text-blue-700">{student.score}</span> : <span className="text-gray-400">-</span>}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <button onClick={() => { setStudentToAction(student); setActionType('reset'); }} className="p-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-md transition" title="Reset Ujian"><RotateCcw size={16} /></button>
                              <button onClick={() => { setStudentToAction(student); setActionType('delete'); }} className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition" title="Hapus Siswa"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {students.length === 0 && <tr><td colSpan="6" className="p-6 text-center text-gray-500">Belum ada data siswa. Daftarkan di Pengaturan.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex items-center">
                  <UserPlus className="mr-2 text-green-600" size={20} />
                  <h2 className="font-bold text-gray-800 text-lg">Tambah Data Siswa</h2>
                </div>
                <div className="p-4 md:p-6">
                  <form onSubmit={submitAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div><label className="block text-gray-700 text-sm font-bold mb-2">NISN</label><input type="text" value={newNisn} onChange={(e) => setNewNisn(e.target.value)} className="w-full px-4 py-2 border rounded-md bg-gray-50" required /></div>
                    <div><label className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label><input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-4 py-2 border rounded-md bg-gray-50" required /></div>
                    <div><label className="block text-gray-700 text-sm font-bold mb-2">Tanggal Lahir</label><input type="date" value={newDob} onChange={(e) => setNewDob(e.target.value)} className="w-full px-4 py-2 border rounded-md bg-gray-50" required /></div>
                    <div><label className="block text-gray-700 text-sm font-bold mb-2">Password Login</label><input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md bg-gray-50" required /></div>
                    <div className="md:col-span-4 pt-2"><button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-bold shadow flex items-center justify-center">Daftarkan Siswa</button></div>
                  </form>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex items-center">
                  <Shield className="mr-2 text-indigo-600" size={20} />
                  <h2 className="font-bold text-gray-800 text-lg">Keamanan Akun Proktor</h2>
                </div>
                <div className="p-4 md:p-6">
                  <form onSubmit={handleUpdateProctor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-gray-700 text-sm font-bold mb-2">Username Proktor</label><input type="text" value={editProctorUser} onChange={(e) => setEditProctorUser(e.target.value)} className="w-full px-4 py-2 border rounded-md" required /></div>
                    <div><label className="block text-gray-700 text-sm font-bold mb-2">Password Proktor</label><input type="text" value={editProctorPass} onChange={(e) => setEditProctorPass(e.target.value)} className="w-full px-4 py-2 border rounded-md" required /></div>
                    <div className="md:col-span-2 pt-2"><button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-bold shadow flex items-center justify-center">Simpan Perubahan Akun</button></div>
                  </form>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <h2 className="font-bold text-gray-800 text-lg">Daftar Akun Siswa ({students.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="p-3 text-sm font-semibold text-gray-600 w-12 text-center">No</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">NISN</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Nama</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Tgl Lahir</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Password</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, i) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-center text-sm font-bold text-gray-400">{i + 1}</td>
                          <td className="p-3 font-mono text-sm text-indigo-700 font-bold">{student.id}</td>
                          <td className="p-3 font-semibold">{student.name}</td>
                          <td className="p-3 text-sm text-gray-600">{student.dob || '-'}</td>
                          <td className="p-3 font-mono text-sm text-gray-600">{student.password}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {studentToAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            {actionType === 'delete' ? <Trash2 size={48} className="mx-auto text-red-500 mb-4" /> : <RotateCcw size={48} className="mx-auto text-yellow-500 mb-4" />}
            <h2 className="text-xl font-bold mb-2">{actionType === 'delete' ? 'Hapus Data Siswa' : 'Reset Ujian Siswa'}</h2>
            <p className="text-gray-600 mb-6 text-sm">
              {actionType === 'delete' ? <>Yakin hapus data <b>{studentToAction.name}</b>?</> : <>Yakin reset ujian <b>{studentToAction.name}</b>?</>}
            </p>
            <div className="flex justify-center space-x-3">
              <button onClick={() => setStudentToAction(null)} className="px-4 py-2 border rounded font-semibold hover:bg-gray-100">Batal</button>
              <button onClick={() => { actionType === 'delete' ? onDeleteStudent(studentToAction.id) : onResetStudent(studentToAction.id); setStudentToAction(null); }} className={`px-4 py-2 rounded font-semibold text-white ${actionType === 'delete' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                Ya, {actionType === 'delete' ? 'Hapus' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}