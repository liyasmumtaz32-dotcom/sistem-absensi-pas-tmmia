
import React from 'react';
import { X, Database, History, Search } from 'lucide-react';
import { LogEntry } from '../types';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
}

const ActivityLogModal: React.FC<ActivityLogModalProps> = ({ isOpen, onClose, logs }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  if (!isOpen) return null;

  const filteredLogs = logs
    .filter(log => 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.timestamp - a.timestamp); // Newest first

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-slate-50 rounded-t-xl">
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <Database size={20} className="text-blue-600" />
            </div>
            <div>
                <h3 className="font-bold text-lg">Database Log Aktivitas</h3>
                <p className="text-xs text-gray-500">Memantau siapa yang melakukan perubahan data</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 bg-white">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Cari berdasarkan nama user, aksi, atau detail..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <History size={48} className="mb-2 opacity-20" />
                <p>Belum ada riwayat aktivitas</p>
            </div>
          ) : (
            <div className="space-y-3">
                {filteredLogs.map((log) => (
                    <div key={log.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-50 text-blue-600 font-bold text-xs px-2 py-1 rounded uppercase tracking-wider min-w-[60px] text-center mt-1">
                                {new Date(log.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-800 text-sm">{log.user}</span>
                                    <span className="text-xs text-gray-400">• {new Date(log.timestamp).toLocaleDateString('id-ID')}</span>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">{log.action}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{log.details}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-white rounded-b-xl flex justify-between items-center text-xs text-gray-400">
            <span>Total Record: {filteredLogs.length}</span>
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

export default ActivityLogModal;
