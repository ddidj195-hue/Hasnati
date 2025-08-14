import React, { useState, useEffect, useMemo } from 'react';
import { SurahInfo, DisplayAyah } from '../types';
import Spinner from '../components/ui/Spinner';
import TafsirPanel from '../components/quran/TafsirPanel';
import { surahList } from '../data/quranMeta';
import { getSurah } from '../data/quran';
import { getTafsir } from '../data/tafsir';
import TajweedLegendModal from '../components/quran/TajweedLegendModal';

const QuranPage: React.FC = () => {
  const [selectedSurahInfo, setSelectedSurahInfo] = useState<SurahInfo | null>(null);
  const [surahContent, setSurahContent] = useState<DisplayAyah[]>([]);
  const [contentError, setContentError] = useState<string | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<DisplayAyah | null>(null);
  const [showTajweed, setShowTajweed] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  
  // Mobile view state
  const [showContent, setShowContent] = useState(false);

  const isMobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth < 768, []);

  // Set Al-Fatiha as default on initial load
  useEffect(() => {
    if (surahList.length > 0) {
      handleSelectSurah(surahList[0]);
    }
  }, []);
  
  const handleSelectSurah = (surahInfo: SurahInfo) => {
    setSelectedSurahInfo(surahInfo);
    
    const surahData = getSurah(surahInfo.number);
    const tafsirData = getTafsir(surahInfo.number);

    if (surahData && tafsirData) {
      const combinedAyahs: DisplayAyah[] = surahData.ayahs.map((ayah) => {
        const tafsirAyah = tafsirData.ayahs.find(tAyah => tAyah.numberInSurah === ayah.numberInSurah);
        return {
          numberInSurah: ayah.numberInSurah,
          text: ayah.text,
          tafsir: tafsirAyah?.text || 'التفسير غير متوفر لهذه الآية.',
        };
      });
      setSurahContent(combinedAyahs);
      setContentError(null);
    } else {
        setSurahContent([]);
        setContentError('عفواً، محتوى هذه السورة غير متوفر حالياً في التطبيق.');
    }
    
    if (isMobile) {
      setShowContent(true);
    }
    setSelectedAyah(null);
  };

  const handleSelectAyah = (ayah: DisplayAyah) => {
    setSelectedAyah(ayah);
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  }
  
  const SurahListPanel = () => (
    <div className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex flex-col">
      <div className="p-4 border-b dark:border-gray-700 font-bold text-lg text-black dark:text-white">قائمة السور</div>
        <ul className="overflow-y-auto flex-1">
          {surahList.map((surah) => (
            <li key={surah.number}>
              <button
                onClick={() => handleSelectSurah(surah)}
                className={`w-full text-right p-4 transition-colors duration-200 ${
                  selectedSurahInfo?.number === surah.number
                    ? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white border-r-4 border-black dark:border-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-full w-6 h-6 flex items-center justify-center ml-4">
                      {surah.number}
                    </span>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200">{surah.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{surah.englishName}</p>
                    </div>
                  </div>
                  <i className="ph ph-caret-left text-gray-400"></i>
                </div>
              </button>
            </li>
          ))}
        </ul>
    </div>
  );

  const SurahContentPanel = () => (
     <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex flex-col overflow-hidden">
        {selectedSurahInfo ? (
          <>
            <div className="p-4 border-b dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 text-center sticky top-0 z-10 backdrop-blur-sm flex items-center justify-between">
              {isMobile && (
                 <button onClick={() => setShowContent(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <i className="ph-fill ph-arrow-right text-xl text-gray-600 dark:text-gray-300"></i>
                  </button>
              )}
              <div className="flex-grow text-center">
                <h2 className="text-2xl font-arabic font-bold text-black dark:text-white">{selectedSurahInfo.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSurahInfo.englishName} - {selectedSurahInfo.revelationType}</p>
              </div>
              <div className="flex items-center gap-2 pl-2">
                 <button onClick={() => setShowLegend(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="مفتاح ألوان التجويد">
                    <i className="ph-fill ph-info text-xl text-gray-600 dark:text-gray-300"></i>
                  </button>
                <label htmlFor="tajweed-toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input id="tajweed-toggle" type="checkbox" className="sr-only" checked={showTajweed} onChange={() => setShowTajweed(!showTajweed)} />
                        <div className={`block w-12 h-7 rounded-full transition-colors ${showTajweed ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <div className={`dot absolute right-1 top-1 bg-white dark:bg-black w-5 h-5 rounded-full transition-transform ${showTajweed ? 'translate-x-5' : ''}`}></div>
                    </div>
                     <div className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                        تجويد
                    </div>
                </label>
              </div>
            </div>
            <div className="p-4 sm:p-8 overflow-y-auto flex-1 leading-loose text-right">
              {selectedSurahInfo.number !== 1 && selectedSurahInfo.number !== 9 && (
                <p className="font-arabic text-3xl text-center mb-6 text-black dark:text-white">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              )}
              {contentError ? (
                <div className="text-center py-10 text-black dark:text-white font-semibold">
                  <i className="ph-fill ph-warning-circle text-4xl mb-2"></i>
                  <p>{contentError}</p>
                </div>
              ) : (
                surahContent.map((ayah) => (
                   <div
                      key={ayah.numberInSurah}
                      onClick={() => handleSelectAyah(ayah)}
                      className={`mb-4 p-3 rounded-lg cursor-pointer transition-colors ${selectedAyah?.numberInSurah === ayah.numberInSurah ? 'bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                  >
                     {showTajweed ? (
                        <span
                            className="font-arabic text-3xl/relaxed text-gray-900 dark:text-gray-100"
                            dangerouslySetInnerHTML={{ __html: ayah.text }}
                        ></span>
                    ) : (
                        <span className="font-arabic text-3xl/relaxed text-gray-900 dark:text-gray-100">
                           {stripHtml(ayah.text)}
                        </span>
                    )}

                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm mx-3">
                          {ayah.numberInSurah}
                      </span>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
             <Spinner />
          </div>
        )}
      </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-full gap-6" dir="rtl">
      {isMobile ? (
        showContent ? <SurahContentPanel /> : <SurahListPanel />
      ) : (
        <>
          <SurahListPanel />
          <SurahContentPanel />
        </>
      )}
      <TafsirPanel ayah={selectedAyah} onClose={() => setSelectedAyah(null)} />
      <TajweedLegendModal isOpen={showLegend} onClose={() => setShowLegend(false)} />
    </div>
  );
};

export default QuranPage;