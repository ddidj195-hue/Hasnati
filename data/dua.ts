import { DuaCategory } from '../types';

export const duaCategories: DuaCategory[] = [
  {
    id: 1,
    name: 'أذكار الصباح',
    icon: 'sun',
    duas: [
      {
        id: 'm1',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
        transliteration: 'Aṣbaḥnā wa aṣbaḥal-mulku lillāh, walḥamdulillāh, lā ilāha illallāh waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa `alā kulli shay’in qadīr.',
        translation: 'We have reached the morning and at this very time all sovereignty belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.',
        reference: 'Muslim 4/2088',
      },
      {
        id: 'm2',
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.',
        transliteration: 'Allāhumma bika aṣbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūt, wa ilaykan-nushūr.',
        translation: 'O Allah, by your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.',
        reference: 'At-Tirmidhi 5/466',
      },
    ],
  },
  {
    id: 2,
    name: 'أذكار المساء',
    icon: 'moon',
    duas: [
      {
        id: 'e1',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.',
        transliteration: 'Amsaynā wa amsal-mulku lillāh, walḥamdulillāh, lā ilāha illallāh waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa `alā kulli shay’in qadīr.',
        translation: 'We have reached the evening and at this very time all sovereignty belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.',
        reference: 'Muslim 4/2088',
      },
    ],
  },
  {
    id: 3,
    name: 'أدعية من القرآن',
    icon: 'book-open',
    duas: [
        {
            id: 'q1',
            arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.',
            transliteration: 'Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā `adhāban-nār.',
            translation: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
            reference: 'Surah Al-Baqarah - 2:201',
        },
        {
            id: 'q2',
            arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ.',
            transliteration: 'Rabbanā lā tuzigh qulūbanā ba`da idh hadaytanā wa hab lanā min ladunka raḥmah, innaka antal-wahhāb.',
            translation: 'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.',
            reference: 'Surah Aal-E-Imran - 3:8',
        },
    ]
  }
];
