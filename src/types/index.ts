export interface QuranVerse {
  id: number;
  surah: number;
  ayah: number;
  text: string;
  transliteration: string;
  translation: string;
}

export interface RecitationSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  verses: QuranVerse[];
  corrections: Correction[];
}

export interface Correction {
  id: string;
  verseId: number;
  expectedText: string;
  recognizedText: string;
  timestamp: Date;
  accuracy: number;
}

export interface AudioConfig {
  sampleRate: number;
  bitDepth: number;
  channels: number;
}