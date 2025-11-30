
import React, { useMemo } from 'react';
import { X, Trophy, FileSpreadsheet } from 'lucide-react';
import { ScheduleEntry, AttendanceRecord } from '../types';

interface RecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleEntry[];
  attendance: AttendanceRecord;
}

const RecapModal: React.FC<RecapModalProps> = ({ isOpen, onClose, schedule, attendance }) => {
  const stats = useMemo(() => {
    const map = new Map<string, { present: number; total: number }>();

    schedule.forEach(entry => {
      const name = entry.invigilatorName.trim();
      if (!map.has(name)) {
        map.set(name, { present: 0, total: 0 });
      }
      
      const record = attendance[entry.id];
      const current = map.get(name)!;
      
      current.total += 1;
      if (record?.status === 'HADIR') {
        current.present += 1;
      }
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.present - a.present || a.name.localeCompare(b.name));
  }, [schedule, attendance]);

  const handleDownload = () => {
    // Build Data Rows
    let rows = '';
    stats.forEach((row, index) => {
      const bg = index % 2 === 0 ? '#ffffff' : '#f9fafb';
      rows += `
        <tr style="background-color: ${bg};">
          <td style="text-align: center;">${index + 1}</td>
          <td>${row.name}</td>
          <td style="text-align: center;">${row.total}</td>
          <td style="text-align: center; font-weight: bold; background-color: #d1fae5; color: #065f46;">${row.present}</td>
        </tr>
      `;
    });

    // Construct HTML for Excel
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Arial', sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000000; padding: 8px; vertical-align: middle; font-size: 11pt; }
          th { background-color: #047857; color: #ffffff; font-weight: bold; text-align: center; height: 35px; }
          .header-title { font-size: 16pt; font-weight: bold; text-align: center; border: none; height: 40px; }
          .header-info { font-size: 11pt; text-align: left; border: none; height: 25px; font-style: italic; color: #555; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <td colspan="4" class="header-title" style="border: none;">REKAPITULASI HONOR PENGAWAS UJIAN</td>
            </tr>
            <tr>
              <td colspan="4" class="header-info" style="border: none;">
                Dicetak pada: ${new Date().toLocaleString('id-ID')}
              </td>
            </tr>
             <tr><td colspan="4" style="border: none; height: 10px;"></td></tr>
            <tr>
              <th style="width: 50px;">No</th>
              <th style="width: 300px;">Nama Pengawas</th>
              <th style="width: 100px;">Total Jadwal</th>
              <th style="width: 100px;">Total Hadir (Honor)</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Rekap_Honor_Pengawas_${new Date().toISOString().slice(0,10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-emerald-50 rounded-t-xl">
          <div className="flex items-center space-x-2 text-emerald-800">
            <Trophy size={20} />
            <h3 className="font-bold text-lg">Rekapitulasi Honor Pengawas</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="bg-blue-50 border border-blue-100 text-blue-700 p-3 rounded-lg text-sm mb-4">
            ℹ️ Tabel ini menghitung jumlah sesi di mana pengawas berstatus <strong>HADIR</strong>. Gunakan data ini untuk perhitungan honorarium.
          </div>

          <table className="w-full text-sm text-left text-gray-600 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 border-b">Nama Pengawas</th>
                <th scope="col" className="px-6 py-3 text-center border-b">Total Jadwal</th>
                <th scope="col" className="px-6 py-3 text-center bg-emerald-100 text-emerald-800 border-b border-emerald-200">Total Hadir</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((row, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900 border-r">{row.name}</td>
                  <td className="px-6 py-3 text-center border-r">{row.total}</td>
                  <td className="px-6 py-3 text-center font-bold text-emerald-600 bg-emerald-50/30">{row.present}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end space-x-3 bg-white rounded-b-xl">
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
          >
            <FileSpreadsheet size={16} className="mr-2" />
            Export Excel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecapModal;
