
import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[slideIn_0.3s_ease-out] drop-shadow-xl">
      <div className="bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 border-l-4 border-emerald-500 min-w-[300px]">
        <div className="bg-emerald-500/20 p-1 rounded-full">
          <CheckCircle className="text-emerald-400" size={20} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm text-gray-100">Berhasil Disimpan</p>
          <p className="text-xs text-gray-400">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Toast;
