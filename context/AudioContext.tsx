import React, { createContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { AudioTrack, Qari, SurahInfo } from '../types';
import { qaris } from '../data/qaris';
import { surahList } from '../data/quranMeta';
import { useDownloads } from '../hooks/useDownloads';

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playTrack: (qari: Qari, surah: SurahInfo) => void;
  togglePlayPause: () => void;
  closePlayer: () => void;
  seek: (time: number) => void;
}

export const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { getTrack } = useDownloads();

  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      if(currentTrack?.audioUrl.startsWith('blob:')){
        URL.revokeObjectURL(currentTrack.audioUrl);
      }
      audioRef.current.src = '';
    }
    setCurrentTrack(null);
    setIsPlaying(false);
  }, [currentTrack]);

  const playNext = useCallback(async () => {
    if (!currentTrack) return;

    const nextSurahNumber = currentTrack.surahNumber + 1;
    if (nextSurahNumber > 114) {
      closePlayer();
      return;
    }

    const currentQari = qaris.find(q => q.id === currentTrack.qariId);
    const nextSurahInfo = surahList.find(s => s.number === nextSurahNumber);

    if (currentQari && nextSurahInfo) {
      const key = `${currentQari.id}_${nextSurahInfo.number}`;
      const localTrackData = await getTrack(key);
      const remoteUrl = `${currentQari.server}/${currentQari.path}/${String(nextSurahInfo.number).padStart(3, '0')}.mp3`;
      
      let urlToPlay: string;
      if (localTrackData) {
        urlToPlay = URL.createObjectURL(localTrackData.audioBlob);
      } else {
        urlToPlay = remoteUrl;
      }
      
      // Revoke old blob url if it exists
      if(currentTrack.audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentTrack.audioUrl);
      }

      setCurrentTrack({
        qariId: currentQari.id,
        qariName: currentQari.name,
        surahNumber: nextSurahInfo.number,
        surahName: nextSurahInfo.name,
        audioUrl: urlToPlay,
      });
    }
  }, [currentTrack, closePlayer, getTrack]);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    
    const onTimeUpdate = () => setProgress(audio.currentTime || 0);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => playNext();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    }
  }, [playNext]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (currentTrack) {
        if (audio.src !== currentTrack.audioUrl) {
            audio.src = currentTrack.audioUrl;
        }
        if (isPlaying) {
            audio.play().catch(e => {
                console.error("Audio play failed:", e);
                setIsPlaying(false);
            });
        } else {
            audio.pause();
        }
    } else {
        audio.pause();
        audio.src = '';
    }
  }, [currentTrack, isPlaying]);
  
  const playTrack = useCallback(async (qari: Qari, surah: SurahInfo) => {
    const key = `${qari.id}_${surah.number}`;
    
    if (currentTrack && currentTrack.qariId === qari.id && currentTrack.surahNumber === surah.number) {
        togglePlayPause();
        return;
    }
    
    // Revoke old blob url if it exists
    if(currentTrack?.audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentTrack.audioUrl);
    }

    const localTrackData = await getTrack(key);
    let urlToPlay: string;
    
    if (localTrackData) {
        urlToPlay = URL.createObjectURL(localTrackData.audioBlob);
    } else {
        urlToPlay = `${qari.server}/${qari.path}/${String(surah.number).padStart(3, '0')}.mp3`;
    }

    setCurrentTrack({
        qariId: qari.id,
        qariName: qari.name,
        surahNumber: surah.number,
        surahName: surah.name,
        audioUrl: urlToPlay,
    });
    setIsPlaying(true);
  }, [currentTrack, getTrack]);

  const togglePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(prev => !prev);
    }
  };
  
  const seek = (time: number) => {
    if (audioRef.current && isFinite(time)) {
        audioRef.current.currentTime = time;
    }
  };

  const value = {
    currentTrack,
    isPlaying,
    progress,
    duration,
    playTrack,
    togglePlayPause,
    closePlayer,
    seek,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};