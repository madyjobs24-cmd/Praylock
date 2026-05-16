export const MOCK_USER = {
  name: 'Ahmed',
  city: 'Paris',
  streakCount: 14,
};

export const MOCK_PRAYERS_TODAY = [
  { name: 'Fajr', time: '05:30', status: 'completed' },
  { name: 'Dhuhr', time: '13:45', status: 'completed' },
  { name: 'Asr', time: '17:15', status: 'late' },
  { name: 'Maghrib', time: '20:10', status: 'upcoming' },
  { name: 'Isha', time: '21:40', status: 'upcoming' },
];

export const MOCK_DUAS = [
  {
    id: 1,
    category: 'Matin et Soir',
    title: 'Protection du matin',
    text_ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration: 'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namut, wa ilaykan-nushur.',
    translation: 'Ô Allah, c\'est par Toi que nous nous retrouvons au matin, c\'est par Toi que nous nous retrouvons au soir, c\'est par Toi que nous vivons, c\'est par Toi que nous mourons et c\'est vers Toi que sera la Résurrection.',
    source: 'At-Tirmidhi, Abu Dawood'
  },
  {
    id: 2,
    category: 'Après la Prière',
    title: 'Demande de pardon',
    text_ar: 'أَسْتَغْفِرُ اللهَ (ثَلَاثاً) اللَّهُمَّ أَنْتَ السَّلامُ وَمِنْكَ السَّلامُ، تَبَارَكْتَ يَا ذَا الجَلالِ وَالإِكْرَامِ',
    transliteration: 'Astaghfiru-llah (3x). Allahumma Antas-Salamu wa minkas-salamu, tabarakta ya dhal-jalali wal-ikram.',
    translation: 'Je demande pardon à Allah (3 fois). Ô Allah, Tu es la Paix et la paix vient de Toi. Béni sois-Tu, ô Détenteur de la majesté et de la générosité.',
    source: 'Sahih Muslim'
  },
  {
    id: 3,
    category: 'Besoin',
    title: 'Facilitation des affaires',
    text_ar: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا ، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    transliteration: 'Allahumma la sahla illa ma ja\'altahu sahlan, wa Anta taj\'alul-hazna idha shi\'ta sahlan.',
    translation: 'Ô Allah, rien n\'est facile sauf ce que Tu rends facile, et Tu rends la difficulté facile si Tu le veux.',
    source: 'Ibn Hibban, Al-Bayhaqi'
  },
  {
    id: 4,
    category: 'Protection',
    title: 'Contre les soucis',
    text_ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ',
    transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan, wal-\'ajzi wal-kasal, wal-bukhli wal-jubn.',
    translation: 'Ô Allah, je cherche protection auprès de Toi contre les soucis et la tristesse, l\'impuissance et la paresse, l\'avarice et la lâcheté.',
    source: 'Sahih Al-Bukhari'
  }
];

export const MOCK_FAMILY = [
  { id: '1', name: 'Papa', streak: 45 },
  { id: '2', name: 'Maman', streak: 120 },
  { id: '3', name: 'Youssef', streak: 3 },
];
