import { Surah } from '../types';
// Data for all 114 Surahs, unabridged.
// In a full production app, this might be loaded dynamically or from a more efficient format.
import { quranText } from './quran-full';

// This function now effectively just retrieves the pre-structured data.
// It's kept for consistency in case the data storage method changes.
export function getSurah(surahNumber: number): Surah | undefined {
  const surahData = (quranText as Record<string, Surah>)[surahNumber.toString()];
  return surahData;
}