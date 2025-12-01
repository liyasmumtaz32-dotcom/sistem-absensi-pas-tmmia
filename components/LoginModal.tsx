
import React, { useState } from 'react';
import { UserCircle2, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  onLogin: (username: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError('Nama harus minimal 3 karakter');
      return;
    }
    onLogin(name.trim());
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-emerald-900/90 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <UserCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Selamat Datang</h2>
          <p className="text-gray-500 mt-2">Sistem Absensi TMMIA</p>
          <p className="text-sm text-gray-400 mt-1">Silakan masukkan nama Anda untuk akses sistem</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Petugas / Admin</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-center text-lg"
              placeholder="Contoh: Ust. Ahmad"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Masuk Sistem</span>
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Identitas ini akan dicatat dalam riwayat database untuk keperluan audit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
