// Type for the list of surahs from local data
export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// Type for a single Ayah from local data
export interface Ayah {
  numberInSurah: number;
  text: string;
}

// Type for Surah data from local data files
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: Ayah[];
}

// Combined Ayah type for display in the app
export interface DisplayAyah {
  numberInSurah: number;
  text: string;
  tafsir: string;
}

export interface NameOfAllah {
  name: string;
  transliteration: string;
  number: number;
  en: {
    meaning: string;
  };
}

export interface ProphetStory {
  id: number;
  name: string;
  description: string;
  story: string;
  gallery: {
    imageUrl: string;
    caption: string;
  }[];
}

export interface Dua {
  id: string;
  arabic: string;
  translation: string;
  transliteration: string;
  reference: string;
}

export interface DuaCategory {
  id: number;
  name: string;
  icon: string;
  duas: Dua[];
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PrayerTimes {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    [key: string]: string;
}

export interface Qari {
    id: string;
    name: string;
    imageUrl: string;
    server: string;
    path: string;
}

export interface AudioTrack {
    surahNumber: number;
    surahName: string;
    qariId: string;
    qariName: string;
    audioUrl: string; // This will be either remote URL or local blob URL
}

export interface DownloadedAudioTrack {
  key: string; // e.g., 'abdul_basit_2'
  qariId: string;
  surahNumber: number;
  qariName: string;
  surahName: string;
  audioBlob: Blob;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  prayerMethod: string;
}

export interface HadithBook {
  id: string;
  name: string;
  chapters: HadithChapter[];
}

export interface HadithChapter {
  id: string;
  name: string;
  hadiths: Hadith[];
}

export interface Hadith {
  id: string;
  text: string;
  narrator?: string;
}

export interface ZakatAssets {
  cash: number;
  gold: number;
  silver: number;
  investments: number;
}