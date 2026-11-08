import { ZikrItem } from '../types';

export const DEFAULT_ADHKAR: ZikrItem[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    transliteration: 'Subḥān Allāh',
    translation: 'Glory be to Allah',
    meaning: 'Affirming that Allah is free from any defect, deficiency, or partner.',
    defaultTarget: 33,
    category: 'tasbih-fatimah'
  },
  {
    id: 'alhamdulillah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    transliteration: 'Al-ḥamdu lillāh',
    translation: 'All praise is due to Allah',
    meaning: 'Gratitude and recognition that all blessings, visible and hidden, emanate from the Creator.',
    defaultTarget: 33,
    category: 'tasbih-fatimah'
  },
  {
    id: 'allahu-akbar',
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is the Greatest',
    meaning: 'Proclaiming that Allah is greater than anything in existence, worldly worry, or obstacle.',
    defaultTarget: 34,
    category: 'tasbih-fatimah'
  },
  {
    id: 'la-ilaha-illallah',
    arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
    transliteration: 'Lā ilāha illallāh',
    translation: 'There is no deity worthy of worship except Allah',
    meaning: 'The central pillar of Tawhid and the supreme declaration of faith.',
    defaultTarget: 100,
    category: 'daily'
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
    transliteration: 'Astaghfirullāh',
    translation: 'I seek forgiveness from Allah',
    meaning: 'Purification of the soul, opening gates of sustenance, tranquility, and divine mercy.',
    defaultTarget: 100,
    category: 'forgiveness'
  },
  {
    id: 'subhanallahi-wa-bihamdihi',
    arabic: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ',
    transliteration: 'Subḥānallāhi wa bi-ḥamdih',
    translation: 'Glory be to Allah and all Praise is His',
    meaning: 'Whoever says this 100 times daily will have their sins forgiven even if they were like the foam of the sea.',
    defaultTarget: 100,
    category: 'daily'
  },
  {
    id: 'salawat',
    arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ',
    transliteration: 'Allāhumma ṣalli ‘alā Muḥammad',
    translation: 'O Allah, send blessings upon Muhammad and his family',
    meaning: 'Whoever sends blessings upon the Prophet ﷺ once, Allah sends ten blessings upon him.',
    defaultTarget: 33,
    category: 'praise'
  },
  {
    id: 'hasbunallah',
    arabic: 'حَسْبُنَا ٱللَّٰهُ وَنِعْمَ ٱلْوَكِيلُ',
    transliteration: 'Ḥasbunallāhu wa ni‘mal-Wakīl',
    translation: 'Allah is sufficient for us, and He is the best Disposer of affairs',
    meaning: 'Uttered by Prophet Ibrahim (AS) and the Companions in times of distress and trial.',
    defaultTarget: 33,
    category: 'praise'
  },
  {
    id: 'la-hawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ',
    transliteration: 'Lā ḥawla wa lā quwwata illā billāh',
    translation: 'There is no power nor might except with Allah',
    meaning: 'A treasure from beneath the Throne of the Most Merciful.',
    defaultTarget: 33,
    category: 'daily'
  },
  {
    id: 'sayyidul-istighfar',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ',
    transliteration: 'Allāhumma Anta Rabbī lā ilāha illā Anta',
    translation: 'Master supplication for forgiveness',
    meaning: 'The chief prayer for seeking divine forgiveness with absolute devotion.',
    defaultTarget: 10,
    category: 'forgiveness'
  }
];
