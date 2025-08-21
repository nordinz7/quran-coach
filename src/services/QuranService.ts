import { QuranVerse } from '../types';

export class QuranService {
  private verses: QuranVerse[] = [
    {
      id: 1,
      surah: 1,
      ayah: 1,
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Bismillāhi r-raḥmāni r-raḥīm',
      translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'
    },
    {
      id: 2,
      surah: 1,
      ayah: 2,
      text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      transliteration: 'Al-ḥamdu lillāhi rabbi l-ʿālamīn',
      translation: 'All praise is due to Allah, Lord of the worlds.'
    },
    {
      id: 3,
      surah: 1,
      ayah: 3,
      text: 'الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Ar-raḥmāni r-raḥīm',
      translation: 'The Entirely Merciful, the Especially Merciful,'
    }
  ];

  async getVerses(surah: number, startAyah?: number, endAyah?: number): Promise<QuranVerse[]> {
    let filtered = this.verses.filter(verse => verse.surah === surah);
    
    if (startAyah) {
      filtered = filtered.filter(verse => verse.ayah >= startAyah);
    }
    
    if (endAyah) {
      filtered = filtered.filter(verse => verse.ayah <= endAyah);
    }
    
    return filtered;
  }

  async getVerseById(id: number): Promise<QuranVerse | null> {
    return this.verses.find(verse => verse.id === id) || null;
  }

  async searchVerses(query: string): Promise<QuranVerse[]> {
    const normalizedQuery = query.toLowerCase().trim();
    return this.verses.filter(verse => 
      verse.text.includes(query) ||
      verse.transliteration.toLowerCase().includes(normalizedQuery) ||
      verse.translation.toLowerCase().includes(normalizedQuery)
    );
  }

  async getAllSurahs(): Promise<{ number: number; name: string; arabicName: string }[]> {
    return [
      { number: 1, name: 'Al-Fatihah', arabicName: 'الفاتحة' },
      { number: 2, name: 'Al-Baqarah', arabicName: 'البقرة' },
      { number: 3, name: 'Ali \'Imran', arabicName: 'آل عمران' }
    ];
  }
}