import { ScheduleEntry, Level, Session } from './types';

// Helper to create IDs
const mkId = (room: string, date: string, session: string) => `${room}-${date.replace(/\s/g, '')}-${session}`;

// Dates mapped from the PDF headers
export const EXAM_DATES = [
  { label: 'Senin, 1 Desember 2025', value: '2025-12-01' },
  { label: 'Selasa, 2 Desember 2025', value: '2025-12-02' },
  { label: 'Rabu, 3 Desember 2025', value: '2025-12-03' },
  { label: 'Kamis, 4 Desember 2025', value: '2025-12-04' },
  { label: 'Jumat, 5 Desember 2025', value: '2025-12-05' },
  { label: 'Sabtu, 6 Desember 2025', value: '2025-12-06' },
];

// Extracted Names from OCR for realistic data generation
const SMA_NAMES = [
  'QOSIM IKHSAN, S.Ag', 'VENTI RAKHMAWATI, M.PD', 'BAYU NIRPANA, M.H', 'HAMZAH ROBBANI, S.Sos',
  'YAYAT FITRIYAH, M.PD', 'VERRARY PRATAMA S.E', 'SISKA YUNITA DEWI', 'DONI SUBIANTO',
  'NAILUL KUNNI FUROIDA, S.Gz', 'PADLIN', 'NURLAILA, S.Ag', 'FADILLAH ABIDANA, S.S, M.Pd',
  'AINI SYIFA, S.S', 'RAHMAWATI', 'ANNISA SITI NABILA, S.Pd', 'HILDA MAULIDA',
  'MUHAMMAD HANIF FAUZI, M.Pd', 'LIYAS SYARIFUDDIN, M.PD', 'SADAM HAMZAH, S.HI',
  'DAVA NUR PEBRIANTO, S.Pd', 'IR. RAHMAWATI', 'ANNIDA AZMA', 'AHDINI RAHMATILLAH, S.Si., Lc.',
  'LULU ZAHROTUN NISA, S.PD', 'ILMI MIFTAHUL JANNAH', 'SOFIYAH AL WIDAD',
  'AHMAD FATHURACHMAN', 'NASR RAFA', 'MUHAMMAD SUHAIL, S.Pd.I', 'SATRIA NUR OKTAVIANTO',
  'AHMAD FACHRUDDIN', 'KHAIRIL FAHMI, S.Pd.', 'AHMAD LUJAENILMA', 'MUHAMMAD FARID,S.Pd.I.',
  'M. IRHAM AL BAIHAQI', 'TONI, S.Pd.', 'AHMAD HASAN MUNJAJI', 'SUBHAN, S.Pd',
  'RAHUL SAYYID', 'MUHAMMAD YADZKI', 'M. ZAKY', 'M. IHSAN'
];

const SMP_NAMES = [
  'NUR AILA', 'DEA AMANDA', 'SALMA RIZQIA', 'M. JAELANI BASRI, S.Pd', 'AHMAD SUKANTA',
  'NOVIANTI PUTRI', 'SANDY AULIA', 'AULIA SABILA', 'SALWA BINTA TSANIYAH', 'ALFI NURFADILAH',
  'PRITA FATIMAH', 'SITI FATIMAH ZAHRA', 'M. ALIEF NUGRAHA', 'SYAFON OKTAVIA RAHMA',
  'NAZWA YUNITA', 'HANIFAH DEWI', 'ABDUL FATTAH AZZAM', 'M. MASHUR', 'NURIZAL MUZAKKI',
  'RIZAL FIRDAUS', 'FAHRU ROJI MALIK', 'M. AKBAR ALGHIFARI', 'M. RIFKI RIPALDI',
  'AHMAD FAUZI RAHMAN', 'ASEP TARUNA JAYA', 'RIFQI RAHMATULOH', 'ALMAAS JHOUNG ASRI',
  'AHMAD FAHRUDIN', 'ADE IHSAN FIRDAUS', 'ABDUL HARIZ NAUFAL, S.Ag.', 'AFRIZA TRI WARDANA',
  'DAMAR ATMA ANGGORO', 'FIKRY NUR HIDAYAT', 'UMAM HABIMUHTADA', 'IMAM AHMADI',
  'M. FIKRI AL- ANSHORY', 'M. FIKRI AMRULLAH', 'M. HASBY', 'MUHAMMAD ZAKY'
];

// Raw Data Sample (Manual entries to match start of PDF exactly)
const RAW_SCHEDULE_DATA: ScheduleEntry[] = ([
  // --- SMA SENIN (Monday) Full Schedule ---
  { room: '01', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'QOSIM IKHSAN, S.Ag' },
  { room: '01', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'VENTI RAKHMAWATI, M.PD' },
  { room: '02', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'NURLAILA, S.Ag' },
  { room: '02', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'QOSIM IKHSAN, S.Ag' },
  { room: '03', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'MUHAMMAD HANIF FAUZI, M.Pd' },
  { room: '03', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'NURLAILA, S.Ag' },
  { room: '04', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'SADAM HAMZAH, S.HI' },
  { room: '04', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'MUHAMMAD HANIF FAUZI, M.Pd' },
  { room: '05', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'AHDINI RAHMATILLAH, S.Si., Lc.' },
  { room: '05', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'SADAM HAMZAH, S.HI' },
  { room: '06', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'VENTI RAKHMAWATI, M.PD' },
  { room: '06', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'AHDINI RAHMATILLAH, S.Si., Lc.' },
  { room: '07', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'AHMAD FATHURACHMAN' },
  { room: '07', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'NASR RAFA' },
  { room: '08', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'AHMAD HASAN MUNJAJI' },
  { room: '08', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'AHMAD FATHURACHMAN' },
  { room: '09', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'TONI, S.Pd.' },
  { room: '09', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'AHMAD HASAN MUNJAJI' },
  { room: '10', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'KHAIRIL FAHMI, S.Pd.' },
  { room: '10', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'TONI, S.Pd.' },
  { room: '11', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'M. ZAKY' },
  { room: '11', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'KHAIRIL FAHMI, S.Pd.' },
  { room: '12', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'NASR RAFA' },
  { room: '12', level: 'SMA', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'M. ZAKY' },

  // --- SMP SENIN (Monday) Full Schedule ---
  { room: '13', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'NUR AILA' },
  { room: '13', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'DEA AMANDA' },
  { room: '14', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'AULIA SABILA' },
  { room: '14', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'NUR AILA' },
  { room: '15', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'ALFI NURFADILAH' },
  { room: '15', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'AULIA SABILA' },
  { room: '16', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'M. JAELANI BASRI, S.Pd' },
  { room: '16', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'ALFI NURFADILAH' },
  { room: '17', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'SALMA RIZQIA' },
  { room: '17', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'M. JAELANI BASRI, S.Pd' },
  { room: '18', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'NOVIANTI PUTRI' },
  { room: '18', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'SALMA RIZQIA' },
  { room: '19', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'SALWA SALSABILA' },
  { room: '19', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'NOVIANTI PUTRI' },
  { room: '20', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'SOFIYAH AL WIDAD' },
  { room: '20', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'SALWA SALSABILA' },
  { room: '21', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'DEA AMANDA' },
  { room: '21', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'SOFIYAH AL WIDAD' },
  { room: '22', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'ABDUL FATTAH AZZAM' },
  { room: '22', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'M. MASHUR' },
  { room: '23', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'ADE IHSAN FIRDAUS' },
  { room: '23', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'ABDUL FATTAH AZZAM' },
  { room: '24', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'AHMAD FAHRUDIN' },
  { room: '24', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'ADE IHSAN FIRDAUS' },
  { room: '25', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'MUHAMMAD ZAKY' },
  { room: '25', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'AHMAD FAHRUDIN' },
  { room: '26', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'SUBHAN, S.Pd' },
  { room: '26', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'MUHAMMAD ZAKY' },
  { room: '27', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'FIKRY NUR HIDAYAT' },
  { room: '27', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'SUBHAN, S.Pd' },
  { room: '28', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'M. AKBAR ALGHIFARI' },
  { room: '28', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'FIKRY NUR HIDAYAT' },
  { room: '29', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'UMAM HABIMUHTADA' },
  { room: '29', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'M. AKBAR ALGHIFARI' },
  { room: '30', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'MUHAMMAD YADZKI' },
  { room: '30', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'UMAM HABIMUHTADA' },
  { room: '31', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'I', invigilatorName: 'M. MASHUR' },
  { room: '31', level: 'SMP', day: '2025-12-01', date: 'Senin, 1 Des', session: 'II', invigilatorName: 'MUHAMMAD YADZKI' },
] as const).map(item => ({
  ...item,
  id: mkId(item.room, item.day, item.session)
}));

const GENERATED_DATA: ScheduleEntry[] = [];

// SMA Rooms 01-12
const roomsSMA = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')); 
// SMP Rooms 13-31
const roomsSMP = Array.from({ length: 19 }, (_, i) => (i + 13).toString().padStart(2, '0'));

// Helper to fill empty slots
const fillSchedule = (roomList: string[], level: Level, nameList: string[]) => {
  let nameIndex = 0;
  roomList.forEach(room => {
    EXAM_DATES.forEach((dateObj, dIdx) => {
      ['I', 'II'].forEach((sess, sIdx) => {
        // Skip if exists in RAW_DATA
        const exists = RAW_SCHEDULE_DATA.find(r => r.room === room && r.day === dateObj.value && r.session === sess);
        if (!exists) {
          // Simple rotation algorithm to pick names
          // Shift start index by room and day to distribute names
          const idx = (parseInt(room) * 2 + dIdx * 5 + sIdx + nameIndex) % nameList.length;
          
          GENERATED_DATA.push({
            id: mkId(room, dateObj.value, sess),
            room,
            level,
            day: dateObj.value,
            date: dateObj.label.split(',')[0] + ', ' + dateObj.label.split(' ')[1] + ' Des',
            session: sess as Session,
            invigilatorName: nameList[idx]
          });
        }
      });
    });
    nameIndex += 3; // Shift for next room
  });
};

fillSchedule(roomsSMA, 'SMA', SMA_NAMES);
fillSchedule(roomsSMP, 'SMP', SMP_NAMES);

export const FULL_SCHEDULE = [...RAW_SCHEDULE_DATA, ...GENERATED_DATA].sort((a, b) => {
  return parseInt(a.room) - parseInt(b.room) || a.day.localeCompare(b.day) || a.session.localeCompare(b.session);
});