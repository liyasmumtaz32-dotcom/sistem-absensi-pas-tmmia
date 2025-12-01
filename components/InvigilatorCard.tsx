
import React from 'react';
import { ScheduleEntry, AttendanceStatus } from '../types';
import { CheckCircle, XCircle, Clock, AlertCircle, User, Pencil, Trash2, History } from 'lucide-react';

interface Props {
  entry: ScheduleEntry;
  status: AttendanceStatus;
  updatedBy?: string; // Add this prop
  onUpdateStatus: (id: string, status: AttendanceStatus) => void;
  onEdit: (entry: ScheduleEntry) => void;
  onDelete: (id: string) => void;
}

const InvigilatorCard: React.FC<Props> = ({ entry, status, updatedBy, onUpdateStatus, onEdit, onDelete }) => {
  const isPresent = status === 'HADIR';
  
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-lg shadow-sm border-l-4 transition-all duration-200 group relative ${
      isPresent ? 'border-l-emerald-500' : status === 'PENDING' ? 'border-l-gray-300' : 'border-l-red-500'
    }`}>
      
      {/* CRUD Actions (Hover or always visible on mobile) */}
      <div className="absolute top-2 right-2 flex space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(entry)}
          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded bg-white shadow-sm border border-gray-100"
          title="Edit / Ganti Pengawas"
        >
          <Pencil size={14} />
        </button>
        <button 
          onClick={() => {
            if (window.confirm('Hapus jadwal ini?')) onDelete(entry.id);
          }}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded bg-white shadow-sm border border-gray-100"
          title="Hapus Jadwal"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Info Section */}
      <div className="flex-1 mb-4 md:mb-0 pr-8">
        <div className="flex items-center space-x-2 mb-1">
          <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${entry.level === 'SMA' ? 'bg-blue-600' : 'bg-orange-500'}`}>
            {entry.level}
          </span>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            Ruang {entry.room}
          </span>
          <span className="text-xs text-gray-700 bg-gray-200 px-2 py-0.5 rounded font-bold">
            Sesi {entry.session}
          </span>
        </div>
        <h4 className="text-lg font-bold text-gray-800 flex items-center">
          <User size={18} className="mr-2 text-gray-400" />
          {entry.invigilatorName}
        </h4>
        <div className="text-sm text-gray-500 mt-1 flex flex-col md:flex-row md:items-center md:space-x-4">
           <span>{entry.date}</span>
           {updatedBy && (
             <div className="flex items-center text-xs text-gray-400 mt-1 md:mt-0">
               <History size={12} className="mr-1" />
               Updated by: {updatedBy}
             </div>
           )}
        </div>
      </div>

      {/* Action Section */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <button
          onClick={() => onUpdateStatus(entry.id, 'HADIR')}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            status === 'HADIR' 
              ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500' 
              : 'bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
          }`}
        >
          <CheckCircle size={16} className="mr-2" />
          Hadir
        </button>

        <button
          onClick={() => onUpdateStatus(entry.id, 'IZIN')}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            status === 'IZIN' 
              ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500' 
              : 'bg-gray-50 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
          }`}
        >
          <Clock size={16} className="mr-2" />
          Izin
        </button>

        <button
          onClick={() => onUpdateStatus(entry.id, 'SAKIT')}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            status === 'SAKIT' 
              ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' 
              : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          }`}
        >
          <AlertCircle size={16} className="mr-2" />
          Sakit
        </button>

        <button
          onClick={() => onUpdateStatus(entry.id, 'ALPHA')}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            status === 'ALPHA' 
              ? 'bg-red-100 text-red-700 ring-2 ring-red-500' 
              : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600'
          }`}
        >
          <XCircle size={16} className="mr-2" />
          Alpha
        </button>
      </div>
    </div>
  );
};

export default InvigilatorCard;
