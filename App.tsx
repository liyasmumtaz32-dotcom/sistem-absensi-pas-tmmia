
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Users, 
  CalendarDays, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  School,
  FileSpreadsheet,
  Database,
  FileText,
  Plus,
  Trophy
} from 'lucide-react';
import { FULL_SCHEDULE, EXAM_DATES } from './constants';
import { AttendanceRecord, AttendanceStatus, FilterState, ScheduleEntry } from './types';
import StatCard from './components/StatCard';
import InvigilatorCard from './components/InvigilatorCard';
import InfoModal from './components/InfoModal';
import EditEntryModal from './components/EditEntryModal';
import RecapModal from './components/RecapModal';
import Toast from './components/Toast';

// Default to the first day of exams
const DEFAULT_DATE = '2025-12-01';
const ATTENDANCE_STORAGE_KEY = 'tmmia_attendance_db_v1';
const SCHEDULE_STORAGE_KEY = 'tmmia_schedule_db_v1';

const App: React.FC = () => {
  // 1. Initialize Schedule (Load from DB or fallback to constants)
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(() => {
    try {
      const savedSchedule = localStorage.getItem(SCHEDULE_STORAGE_KEY);
      return savedSchedule ? JSON.parse(savedSchedule) : FULL_SCHEDULE;
    } catch (e) {
      console.error("Error loading schedule", e);
      return FULL_SCHEDULE;
    }
  });

  // 2. Initialize Attendance
  const [attendance, setAttendance] = useState<AttendanceRecord>(() => {
    try {
      const savedData = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.error("Gagal memuat database lokal:", error);
      return {};
    }
  });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    level: 'ALL',
    day: DEFAULT_DATE,
    session: 'ALL',
  });

  const [isSaved, setIsSaved] = useState(true);
  
  // Modals State
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showRecapModal, setShowRecapModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null); // Null means Add mode
  const [generatedInfoText, setGeneratedInfoText] = useState('');

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const isFirstRender = useRef(true);

  // Persist Data Effects
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendance));
    setIsSaved(true);
    setShowToast(true); // Show toast when attendance saves
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedule));
  }, [schedule]);

  // CRUD Handlers
  const handleAddEntry = () => {
    setEditingEntry(null);
    setShowEditModal(true);
  };

  const handleEditEntry = (entry: ScheduleEntry) => {
    setEditingEntry(entry);
    setShowEditModal(true);
  };

  const handleSaveEntry = (newEntry: ScheduleEntry) => {
    setSchedule(prev => {
      if (editingEntry) {
        // Edit Mode
        const isNameChanged = editingEntry.invigilatorName !== newEntry.invigilatorName;
        
        // If critical info changes that affects ID (room/day/session)
        // We actually create a new entry in UI logic, but let's handle the ID change.
        // If ID matches, just update content.
        
        const updated = prev.map(item => item.id === editingEntry.id ? newEntry : item);
        
        // If name changed, RESET attendance status for this slot
        if (isNameChanged) {
          setAttendance(prevAtt => ({
            ...prevAtt,
            [newEntry.id]: { status: 'PENDING', timestamp: Date.now() } // Reset to Pending
          }));
        }
        
        return updated;
      } else {
        // Add Mode
        return [...prev, newEntry];
      }
    });
  };

  const handleDeleteEntry = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
    // Optionally remove attendance record too, but keeping it orphan is fine for logs
  };

  const handleStatusUpdate = (id: string, status: AttendanceStatus) => {
    setIsSaved(false); 
    setAttendance(prev => ({
      ...prev,
      [id]: {
        status,
        timestamp: Date.now()
      }
    }));
  };

  // Filter Logic
  const filteredSchedule = useMemo(() => {
    return schedule.filter(entry => {
      const matchesSearch = entry.invigilatorName.toLowerCase().includes(filters.search.toLowerCase()) || 
                            entry.room.includes(filters.search);
      const matchesLevel = filters.level === 'ALL' || entry.level === filters.level;
      const matchesDay = entry.day === filters.day;
      const matchesSession = filters.session === 'ALL' || entry.session === filters.session;

      return matchesSearch && matchesLevel && matchesDay && matchesSession;
    });
  }, [schedule, filters]);

  // Statistics
  const stats = useMemo(() => {
    const daySchedule = schedule.filter(s => s.day === filters.day);
    const total = daySchedule.length;
    
    let present = 0;
    let absent = 0;
    let pending = 0;

    daySchedule.forEach(entry => {
      const record = attendance[entry.id];
      if (!record || record.status === 'PENDING') {
        pending++;
      } else if (record.status === 'HADIR') {
        present++;
      } else {
        absent++;
      }
    });

    return { total, present, absent, pending };
  }, [attendance, filters.day, schedule]);

  // Generate Info Text
  const generateInfo = () => {
    const currentDayLabel = EXAM_DATES.find(d => d.value === filters.day)?.label || filters.day;
    
    let text = `📋 JADWAL PENGAWAS\n\n`;
    text += `UJIAN PENILAIAN AKHIR SEMESTER (PAS) GANJIL\n`;
    text += `TARBIYATUL MU’ALLIMIN WAL MU’ALLIMAAT AL ISLAMIYAH AL-GHOZALI\n`;
    text += `PONDOK MODERN AL-GHOZALI\n`;
    text += `Tahun Pelajaran 2025/2026\n\n\n`;
    text += `## 📅 ${currentDayLabel}\n\n`;

    const printList = (data: ScheduleEntry[]) => {
      let output = '';
      const sma = data.filter(d => d.level === 'SMA').sort((a,b) => parseInt(a.room) - parseInt(b.room));
      if (sma.length > 0) {
        output += `SMA\n`;
        sma.forEach(d => {
          output += `${parseInt(d.room)}.\t${d.invigilatorName}\n`;
        });
      }
      const smp = data.filter(d => d.level === 'SMP').sort((a,b) => parseInt(a.room) - parseInt(b.room));
      if (smp.length > 0) {
        if (sma.length > 0) output += `\n`; 
        output += `SMP\n`;
        smp.forEach(d => {
          output += `${parseInt(d.room)}.\t${d.invigilatorName}\n`;
        });
      }
      return output;
    };

    const sessions = filters.session === 'ALL' ? ['I', 'II'] : [filters.session];
    
    sessions.forEach(sess => {
       const sessionData = schedule.filter(entry => 
         entry.day === filters.day && 
         entry.session === sess &&
         (filters.level === 'ALL' || entry.level === filters.level)
       );

       if (sessionData.length > 0) {
          text += sessions.length > 1 ? `*** SESI ${sess} ***\n` : '';
          text += `Daftar Pengawas:\n`;
          text += printList(sessionData);
          text += `\n`;
       }
    });

    text += `### 📍 Catatan Penting\n\n`;
    text += `* Para pengawas diharapkan hadir 10 menit sebelum bel ujian dibunyikan.\n`;
    text += `* Jika berhalangan hadir, harap mengonfirmasi kepada panitia serta mencari pengganti.\n`;
    text += `* Bila terdapat kesalahan jadwal, silakan segera hubungi panitia.\n\n`;
    text += `✨ Semoga ujian berjalan lancar, tertib, dan penuh keberkahan`;

    setGeneratedInfoText(text);
    setShowInfoModal(true);
  };

  const handleExportExcel = () => {
    let exportStats = { total: 0, hadir: 0, izin: 0, sakit: 0, alpha: 0, pending: 0 };
    
    let rows = '';
    filteredSchedule.forEach((entry, index) => {
      const record = attendance[entry.id];
      const status = record?.status || 'PENDING';
      const time = record?.timestamp ? new Date(record.timestamp).toLocaleString('id-ID') : '-';
      
      exportStats.total++;
      if (status === 'HADIR') exportStats.hadir++;
      else if (status === 'IZIN') exportStats.izin++;
      else if (status === 'SAKIT') exportStats.sakit++;
      else if (status === 'ALPHA') exportStats.alpha++;
      else exportStats.pending++;

      let statusStyle = 'font-weight: bold; text-align: center;';
      if (status === 'HADIR') statusStyle += 'background-color: #d1fae5; color: #065f46;'; 
      else if (status === 'IZIN') statusStyle += 'background-color: #fef9c3; color: #854d0e;'; 
      else if (status === 'SAKIT') statusStyle += 'background-color: #dbeafe; color: #1e40af;'; 
      else if (status === 'ALPHA') statusStyle += 'background-color: #fee2e2; color: #991b1b;'; 
      else statusStyle += 'background-color: #f3f4f6; color: #4b5563;'; 

      rows += `
        <tr>
          <td style="text-align: center;">${index + 1}</td>
          <td style="text-align: center; mso-number-format:'\@';">${entry.room}</td>
          <td style="text-align: center;">${entry.level}</td>
          <td>${entry.day}</td>
          <td>${entry.date}</td>
          <td style="text-align: center;">${entry.session}</td>
          <td>${entry.invigilatorName}</td>
          <td style="${statusStyle}">${status}</td>
          <td style="mso-number-format:'\@';">${time}</td>
        </tr>
      `;
    });

    const summaryTable = `
      <tr><td colspan="9" style="border: none; height: 20px;"></td></tr>
      <tr>
        <td colspan="3" style="border: 1px solid #000; background-color: #047857; color: white; font-weight: bold;">REKAPITULASI KEHADIRAN</td>
        <td colspan="6" style="border: none;"></td>
      </tr>
      <tr>
        <td colspan="2" style="border: 1px solid #000; font-weight: bold;">Total Pengawas</td>
        <td style="border: 1px solid #000; text-align: center; font-weight: bold;">${exportStats.total}</td>
        <td colspan="6" style="border: none;"></td>
      </tr>
      <tr>
        <td colspan="2" style="border: 1px solid #000;">Hadir</td>
        <td style="border: 1px solid #000; text-align: center; background-color: #d1fae5;">${exportStats.hadir}</td>
        <td colspan="6" style="border: none;"></td>
      </tr>
      <tr>
        <td colspan="2" style="border: 1px solid #000;">Izin</td>
        <td style="border: 1px solid #000; text-align: center; background-color: #fef9c3;">${exportStats.izin}</td>
        <td colspan="6" style="border: none;"></td>
      </tr>
      <tr>
        <td colspan="2" style="border: 1px solid #000;">Sakit</td>
        <td style="border: 1px solid #000; text-align: center; background-color: #dbeafe;">${exportStats.sakit}</td>
        <td colspan="6" style="border: none;"></td>
      </tr>
      <tr>
        <td colspan="2" style="border: 1px solid #000;">Alpha</td>
        <td style="border: 1px solid #000; text-align: center; background-color: #fee2e2;">${exportStats.alpha}</td>
        <td colspan="6" style="border: none;"></td>
      </tr>
      <tr>
        <td colspan="2" style="border: 1px solid #000;">Belum Absen</td>
        <td style="border: 1px solid #000; text-align: center; background-color: #f3f4f6;">${exportStats.pending}</td>
        <td colspan="6" style="border: none;"></td>
      </tr>
    `;

    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000000; padding: 8px; vertical-align: middle; font-size: 11pt; }
          th { background-color: #047857; color: #ffffff; font-weight: bold; text-align: center; height: 30px; }
          .header-title { font-size: 16pt; font-weight: bold; text-align: center; border: none; height: 40px; }
          .header-info { font-size: 12pt; text-align: left; border: none; height: 30px; font-style: italic; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <td colspan="9" class="header-title" style="border: none;">Laporan Absensi Pengawas Ujian TMMIA</td>
            </tr>
            <tr>
              <td colspan="9" class="header-info" style="border: none;">
                Tanggal Filter: ${EXAM_DATES.find(d => d.value === filters.day)?.label || filters.day} | 
                Level: ${filters.level === 'ALL' ? 'Semua' : filters.level} |
                Dicetak: ${new Date().toLocaleString('id-ID')}
              </td>
            </tr>
            <tr><td colspan="9" style="border: none; height: 10px;"></td></tr>
            <tr>
              <th style="width: 40px;">No</th>
              <th style="width: 80px;">Ruang</th>
              <th style="width: 80px;">Level</th>
              <th style="width: 100px;">Hari</th>
              <th style="width: 150px;">Tanggal</th>
              <th style="width: 60px;">Sesi</th>
              <th style="width: 250px;">Nama Pengawas</th>
              <th style="width: 100px;">Status</th>
              <th style="width: 150px;">Waktu Absen</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            ${summaryTable}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Absensi_TMMIA_${filters.day}_${filters.level}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-12 bg-gray-50 font-sans">
      <Toast 
        message="Data kehadiran telah berhasil disimpan di penyimpanan lokal." 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      <InfoModal 
        isOpen={showInfoModal} 
        onClose={() => setShowInfoModal(false)} 
        text={generatedInfoText} 
      />
      
      <EditEntryModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEntry}
        initialData={editingEntry}
      />

      <RecapModal 
        isOpen={showRecapModal}
        onClose={() => setShowRecapModal(false)}
        schedule={schedule}
        attendance={attendance}
      />

      {/* Header */}
      <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-emerald-700 rounded-lg shadow-inner">
                <School size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight">Sistem Absensi PAS</h1>
                <p className="text-emerald-200 text-xs tracking-wide">TMMIA PONDOK MODERN AL GHOZALI • 2025-2026</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full transition-colors ${isSaved ? 'bg-emerald-900/50 text-emerald-200' : 'bg-yellow-600 text-white'}`}>
                <Database size={14} />
                <span>{isSaved ? 'Tersimpan' : 'Menyimpan...'}</span>
              </div>

              <div className="hidden md:flex items-center space-x-4 text-sm bg-emerald-700/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-emerald-600/30">
                <div className="flex items-center">
                  <CalendarDays size={16} className="mr-2 text-emerald-200" />
                  <span className="font-medium">
                    {EXAM_DATES.find(d => d.value === filters.day)?.label.split(',')[0] || filters.day}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Pengawas" value={stats.total} icon={Users} color="blue" />
          <StatCard title="Hadir" value={stats.present} icon={CheckCircle2} color="green" />
          <StatCard title="Belum Hadir" value={stats.pending} icon={Clock} color="yellow" />
          <StatCard title="Absen / Izin" value={stats.absent} icon={AlertTriangle} color="red" />
        </div>

        {/* Filters & Actions */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-end xl:items-center sticky top-24 z-20">
          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
            
            <div className="relative w-full md:w-auto">
              <select 
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-lg focus:bg-white focus:border-emerald-500 w-full md:w-48 font-medium"
                value={filters.day}
                onChange={(e) => setFilters(prev => ({ ...prev, day: e.target.value }))}
              >
                {EXAM_DATES.map(date => (
                  <option key={date.value} value={date.value}>{date.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <CalendarDays size={16} />
              </div>
            </div>

            <div className="flex rounded-lg bg-gray-100 p-1 w-full md:w-auto">
              {['ALL', 'SMA', 'SMP'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilters(prev => ({ ...prev, level: lvl as any }))}
                  className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    filters.level === lvl ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {lvl === 'ALL' ? 'Semua' : lvl}
                </button>
              ))}
            </div>

             <div className="flex rounded-lg bg-gray-100 p-1 w-full md:w-auto">
              {['ALL', 'I', 'II'].map((sess) => (
                <button
                  key={sess}
                  onClick={() => setFilters(prev => ({ ...prev, session: sess as any }))}
                  className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    filters.session === sess ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {sess === 'ALL' ? 'Sesi' : `Sesi ${sess}`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full xl:w-auto justify-end">
            <div className="relative flex-grow md:flex-grow-0 min-w-[200px]">
              <input 
                type="text" 
                placeholder="Cari..." 
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full text-sm"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>

            <button onClick={handleAddEntry} className="btn-icon bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-2.5 rounded-lg flex items-center" title="Tambah Jadwal">
              <Plus size={18} />
              <span className="ml-2 hidden lg:inline">Tambah</span>
            </button>

            <button onClick={() => setShowRecapModal(true)} className="btn-icon bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 px-3 py-2.5 rounded-lg flex items-center" title="Rekap Honor">
              <Trophy size={18} />
              <span className="ml-2 hidden lg:inline">Rekap Honor</span>
            </button>

            <button onClick={generateInfo} className="btn-icon bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-2.5 rounded-lg flex items-center" title="Salin Info WA">
              <FileText size={18} />
              <span className="ml-2 hidden lg:inline">Info</span>
            </button>

            <button onClick={handleExportExcel} className="btn-icon bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-2.5 rounded-lg flex items-center" title="Export Excel">
              <FileSpreadsheet size={18} />
              <span className="ml-2 hidden lg:inline">Excel</span>
            </button>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {filteredSchedule.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Tidak ada jadwal ditemukan</h3>
              <p className="text-gray-500 mt-1">Coba ubah filter atau tambah jadwal baru.</p>
            </div>
          ) : (
            filteredSchedule.map((entry) => (
              <InvigilatorCard 
                key={entry.id} 
                entry={entry} 
                status={attendance[entry.id]?.status || 'PENDING'} 
                onUpdateStatus={handleStatusUpdate}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
