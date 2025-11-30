
import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus, AlertCircle } from 'lucide-react';
import { ScheduleEntry, Level, Session } from '../types';
import { EXAM_DATES } from '../constants';

interface EditEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: ScheduleEntry) => void;
  initialData?: ScheduleEntry | null; // If null, it's Add mode
}

const EditEntryModal: React.FC<EditEntryModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<ScheduleEntry>>({
    room: '01',
    level: 'SMA',
    day: EXAM_DATES[0].value,
    session: 'I',
    invigilatorName: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        // Reset for Add mode
        setFormData({
          room: '01',
          level: 'SMA',
          day: EXAM_DATES[0].value,
          session: 'I',
          invigilatorName: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.invigilatorName || !formData.room) return;

    // Find date label
    const dateObj = EXAM_DATES.find(d => d.value === formData.day);
    const shortDate = dateObj ? dateObj.label.split(',')[0] + ', ' + dateObj.label.split(' ')[1] + ' Des' : formData.day || '';

    // Construct ID
    const newId = `${formData.room}-${formData.day?.replace(/\s/g, '')}-${formData.session}`;

    const entry: ScheduleEntry = {
      id: newId,
      room: formData.room!,
      level: formData.level as Level,
      day: formData.day!,
      date: shortDate,
      session: formData.session as Session,
      invigilatorName: formData.invigilatorName!
    };

    onSave(entry);
    onClose();
  };

  if (!isOpen) return null;

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
          <div className="flex items-center space-x-2 text-gray-800">
            {isEdit ? <UserPlus size={20} /> : <UserPlus size={20} />}
            <h3 className="font-bold text-lg">{isEdit ? 'Edit / Ganti Pengawas' : 'Tambah Jadwal Baru'}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {isEdit && (
            <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded flex items-start">
              <AlertCircle size={14} className="mt-0.5 mr-2 flex-shrink-0" />
              <span>Jika Anda mengganti nama pengawas, status kehadiran sebelumnya akan di-reset menjadi PENDING.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Level</label>
              <select 
                className="w-full border rounded-lg p-2 text-sm"
                value={formData.level}
                onChange={e => setFormData({...formData, level: e.target.value as Level})}
              >
                <option value="SMA">SMA</option>
                <option value="SMP">SMP</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Ruang</label>
              <input 
                type="text" 
                className="w-full border rounded-lg p-2 text-sm"
                value={formData.room}
                onChange={e => setFormData({...formData, room: e.target.value})}
                placeholder="Contoh: 01"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Hari / Tanggal</label>
            <select 
              className="w-full border rounded-lg p-2 text-sm"
              value={formData.day}
              onChange={e => setFormData({...formData, day: e.target.value})}
            >
              {EXAM_DATES.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sesi</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="session" 
                  value="I" 
                  checked={formData.session === 'I'} 
                  onChange={() => setFormData({...formData, session: 'I'})} 
                  className="mr-2"
                />
                Sesi I
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="session" 
                  value="II" 
                  checked={formData.session === 'II'} 
                  onChange={() => setFormData({...formData, session: 'II'})} 
                  className="mr-2"
                />
                Sesi II
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama Pengawas</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.invigilatorName}
              onChange={e => setFormData({...formData, invigilatorName: e.target.value})}
              placeholder="Masukkan nama lengkap..."
              required
            />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Batal</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium flex items-center">
              <Save size={16} className="mr-2" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEntryModal;
