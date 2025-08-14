import React from 'react';
import { DisplayAyah } from '../../types';

interface TafsirPanelProps {
  ayah: DisplayAyah | null;
  onClose: () => void;
}

const TafsirPanel: React.FC<TafsirPanelProps> = ({ ayah, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-20 transition-opacity duration-300
        ${ayah ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-30 flex flex-col
        ${ayah ? 'translate-x-0' : 'translate-x-full'}`}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tafsir-heading"
      >
        {ayah && (
          <>
            <div className="p-4 flex justify-between items-center border-b dark:border-gray-700 bg-gray-100 dark:bg-gray-900 sticky top-0">
              <h3 id="tafsir-heading" className="text-xl font-bold text-black dark:text-white">
                التفسير الميسر - الآية {ayah.numberInSurah}
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="إغلاق">
                <i className="ph-fill ph-x text-2xl text-gray-600 dark:text-gray-300"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6 pb-6 border-b dark:border-gray-700">
                <p className="font-arabic text-2xl/loose text-gray-800 dark:text-gray-200 mb-4">{ayah.text}</p>
              </div>
              <div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-loose">{ayah.tafsir}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TafsirPanel;