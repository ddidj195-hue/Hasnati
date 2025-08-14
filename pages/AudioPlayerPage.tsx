import React, { useState } from 'react';
import { qaris } from '../data/qaris';
import { surahList } from '../data/quranMeta';
import { Qari, SurahInfo } from '../types';
import { useAudio } from '../hooks/useAudio';
import { useDownloads } from '../hooks/useDownloads';

const AudioPlayerPage: React.FC = () => {
    const [selectedQari, setSelectedQari] = useState<Qari | null>(null);
    const { playTrack, currentTrack, isPlaying } = useAudio();
    const { downloadedTracks, downloadingTracks, downloadTrack, deleteTrack } = useDownloads();

    const handleSelectQari = (qari: Qari) => {
        setSelectedQari(qari);
    };

    const handlePlayTrack = (qari: Qari, surah: SurahInfo) => {
        playTrack(qari, surah);
    };

    const DownloadButton: React.FC<{ qari: Qari; surah: SurahInfo }> = ({ qari, surah }) => {
        const trackKey = `${qari.id}_${surah.number}`;
        const isDownloading = downloadingTracks.has(trackKey);
        const isDownloaded = !!downloadedTracks[trackKey];

        if (isDownloading) {
            return (
                <div className="p-2">
                    <i className="ph ph-spinner animate-spin text-2xl text-black dark:text-white"></i>
                </div>
            );
        }

        if (isDownloaded) {
            return (
                <button
                    onClick={() => deleteTrack(trackKey)}
                    className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="حذف"
                >
                    <i className="ph-fill ph-trash text-2xl"></i>
                </button>
            );
        }

        return (
            <button
                onClick={() => downloadTrack(qari, surah)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="تنزيل"
            >
                <i className="ph-fill ph-download-simple text-2xl"></i>
            </button>
        );
    };
    
    if (selectedQari) {
         return (
             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                 <div className="p-4 border-b dark:border-gray-700 flex items-center">
                     <button onClick={() => setSelectedQari(null)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-4">
                         <i className="ph-fill ph-arrow-right text-xl text-gray-600 dark:text-gray-300"></i>
                     </button>
                     <div>
                        <h2 className="text-xl font-bold text-black dark:text-white">اختر سورة من القارئ:</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">{selectedQari.name}</p>
                     </div>
                 </div>
                 <ul className="overflow-y-auto max-h-[calc(100vh-250px)]">
                     {surahList.map(surah => {
                        const isActive = currentTrack?.surahNumber === surah.number && currentTrack?.qariId === selectedQari.id;
                        return (
                         <li key={surah.number} className="flex items-center">
                             <button
                                 onClick={() => handlePlayTrack(selectedQari, surah)}
                                 className={`flex-grow text-right p-4 transition-colors duration-200 flex justify-between items-center ${isActive ? 'bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                             >
                                 <div className="flex items-center">
                                     <span className="text-sm bg-gray-200 dark:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center ml-4">
                                         {surah.number}
                                     </span>
                                     <div>
                                         <p className="font-bold text-gray-800 dark:text-gray-200">{surah.name}</p>
                                         <p className="text-xs text-gray-500 dark:text-gray-400">{surah.englishName}</p>
                                     </div>
                                 </div>
                                 <i className={`ph-fill ${isActive && isPlaying ? 'ph-pause-circle' : 'ph-play-circle'} text-3xl text-black dark:text-white`}></i>
                             </button>
                             <div className="px-4">
                                <DownloadButton qari={selectedQari} surah={surah} />
                             </div>
                         </li>
                     )})}
                 </ul>
             </div>
         );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-black dark:text-white">مشغل القرآن</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">اختر قارئك المفضل للاستماع إلى القرآن الكريم</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {qaris.map(qari => (
                    <button
                        key={qari.id}
                        onClick={() => handleSelectQari(qari)}
                        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-black/50 hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col items-center text-center group"
                    >
                        <img 
                            src={qari.imageUrl} 
                            alt={qari.name} 
                            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-100 dark:border-gray-700 group-hover:border-gray-400 dark:group-hover:border-gray-500 transition-all duration-300 filter grayscale group-hover:grayscale-0"
                        />
                        <h3 className="text-xl font-bold text-black dark:text-white">{qari.name}</h3>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AudioPlayerPage;