import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { DownloadedAudioTrack, Qari, SurahInfo } from '../types';
import * as idb from '../utils/idb';

interface DownloadsContextType {
  downloadedTracks: Record<string, DownloadedAudioTrack>;
  downloadingTracks: Set<string>;
  downloadTrack: (qari: Qari, surah: SurahInfo) => Promise<void>;
  deleteTrack: (key: string) => Promise<void>;
  getTrack: (key: string) => Promise<DownloadedAudioTrack | undefined>;
}

export const DownloadsContext = createContext<DownloadsContextType | undefined>(undefined);

interface DownloadsProviderProps {
  children: ReactNode;
}

export const DownloadsProvider: React.FC<DownloadsProviderProps> = ({ children }) => {
  const [downloadedTracks, setDownloadedTracks] = useState<Record<string, DownloadedAudioTrack>>({});
  const [downloadingTracks, setDownloadingTracks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadDownloads = async () => {
      await idb.initDB();
      const tracks = await idb.getAll<DownloadedAudioTrack>();
      const tracksRecord = tracks.reduce((acc, track) => {
        acc[track.key] = track;
        return acc;
      }, {} as Record<string, DownloadedAudioTrack>);
      setDownloadedTracks(tracksRecord);
    };
    loadDownloads();
  }, []);

  const downloadTrack = useCallback(async (qari: Qari, surah: SurahInfo) => {
    const key = `${qari.id}_${surah.number}`;
    if (downloadedTracks[key] || downloadingTracks.has(key)) return;

    try {
      setDownloadingTracks(prev => new Set(prev).add(key));
      const paddedSurahNumber = String(surah.number).padStart(3, '0');
      const url = `${qari.server}/${qari.path}/${paddedSurahNumber}.mp3`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch audio: ${response.statusText}`);
      
      const audioBlob = await response.blob();
      
      const newTrack: DownloadedAudioTrack = {
        key,
        qariId: qari.id,
        surahNumber: surah.number,
        qariName: qari.name,
        surahName: surah.name,
        audioBlob,
      };

      await idb.set(newTrack);
      setDownloadedTracks(prev => ({ ...prev, [key]: newTrack }));
    } catch (error) {
      console.error('Download failed:', error);
      // Optionally show a user-facing error
    } finally {
      setDownloadingTracks(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  }, [downloadedTracks, downloadingTracks]);

  const deleteTrack = useCallback(async (key: string) => {
    try {
      await idb.remove(key);
      setDownloadedTracks(prev => {
        const newTracks = { ...prev };
        delete newTracks[key];
        return newTracks;
      });
    } catch (error) {
      console.error('Failed to delete track:', error);
    }
  }, []);

  const getTrack = useCallback(async (key: string) => {
    return await idb.get<DownloadedAudioTrack>(key);
  }, []);

  const value = {
    downloadedTracks,
    downloadingTracks,
    downloadTrack,
    deleteTrack,
    getTrack,
  };

  return <DownloadsContext.Provider value={value}>{children}</DownloadsContext.Provider>;
};