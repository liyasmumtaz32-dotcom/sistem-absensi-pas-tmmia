import React, { useState, useEffect } from 'react';
import { X, Copy, Check, FileText } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, text }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) setCopied(false);
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-emerald-800">
            <FileText size={20} />
            <h3 className="font-bold text-lg">Informasi Jadwal Pengawas</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            {text}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end space-x-3 bg-white rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center px-4 py-2 text-sm font-bold text-white rounded-lg transition-all ${
              copied 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {copied ? (
              <>
                <Check size={16} className="mr-2" />
                Tersalin!
              </>
            ) : (
              <>
                <Copy size={16} className="mr-2" />
                Salin Teks
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;