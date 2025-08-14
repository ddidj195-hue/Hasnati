import { Surah } from '../types';
import { tafsirText } from './tafsir-full';

// This function now effectively just retrieves the pre-structured tafsir data.
export function getTafsir(surahNumber: number): Surah | undefined {
   const tafsirData = (tafsirText as Record<string, Surah>)[surahNumber.toString()];
   return tafsirData;
}