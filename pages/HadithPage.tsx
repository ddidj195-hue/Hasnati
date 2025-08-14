import React, { useState } from 'react';
import { hadithBooks } from '../data/hadith';
import { Hadith, HadithBook, HadithChapter } from '../types';

const HadithPage: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<HadithBook>(hadithBooks[0]);
  const [selectedChapter, setSelectedChapter] = useState<HadithChapter | null>(null);

  const handleSelectChapter = (chapter: HadithChapter) => {
    setSelectedChapter(chapter);
  };

  if (selectedChapter) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-fade-in">
        <div className="p-4 border-b dark:border-gray-700 flex items-center sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
          <button onClick={() => setSelectedChapter(null)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-4">
            <i className="ph-fill ph-arrow-right text-xl text-gray-600 dark:text-gray-300"></i>
          </button>
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white">{selectedChapter.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{selectedBook.name}</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {selectedChapter.hadiths.map(hadith => (
            <div key={hadith.id} className="p-4 border-r-4 border-black dark:border-white bg-gray-50 dark:bg-gray-800/40 rounded-lg">
              <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">{hadith.text}</p>
              {hadith.narrator && <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">الراوي: {hadith.narrator}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-fade-in">
      <div className="text-center p-8 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-4xl font-bold text-black dark:text-white">مكتبة الحديث</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">{selectedBook.name}</p>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {selectedBook.chapters.map(chapter => (
          <li key={chapter.id}>
            <button onClick={() => handleSelectChapter(chapter)} className="w-full text-right p-5 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{chapter.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{chapter.hadiths.length} حديث</p>
              </div>
              <i className="ph-fill ph-caret-left text-2xl text-gray-400"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HadithPage;