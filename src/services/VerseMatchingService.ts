import { QuranVerse, Correction } from '../types';

export class VerseMatchingService {
  private readonly SIMILARITY_THRESHOLD = 0.7;

  calculateSimilarity(text1: string, text2: string): number {
    const normalized1 = this.normalizeArabicText(text1);
    const normalized2 = this.normalizeArabicText(text2);

    return this.levenshteinSimilarity(normalized1, normalized2);
  }

  private normalizeArabicText(text: string): string {
    return text
      .replace(/[\u064B-\u065F\u0670\u0671]/g, '') // Remove diacritics
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim()
      .toLowerCase();
  }

  private levenshteinSimilarity(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }

    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : (maxLength - matrix[str2.length][str1.length]) / maxLength;
  }

  findBestMatch(recognizedText: string, verses: QuranVerse[]): QuranVerse | null {
    let bestMatch: QuranVerse | null = null;
    let bestScore = 0;

    for (const verse of verses) {
      const similarity = this.calculateSimilarity(recognizedText, verse.text);
      if (similarity > bestScore && similarity >= this.SIMILARITY_THRESHOLD) {
        bestScore = similarity;
        bestMatch = verse;
      }
    }

    return bestMatch;
  }

  generateCorrection(
    expectedVerse: QuranVerse,
    recognizedText: string
  ): Correction {
    const accuracy = this.calculateSimilarity(expectedVerse.text, recognizedText);
    
    return {
      id: `correction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      verseId: expectedVerse.id,
      expectedText: expectedVerse.text,
      recognizedText,
      timestamp: new Date(),
      accuracy
    };
  }

  identifyMistakes(expected: string, recognized: string): string[] {
    const expectedWords = this.normalizeArabicText(expected).split(' ');
    const recognizedWords = this.normalizeArabicText(recognized).split(' ');
    const mistakes: string[] = [];

    const maxLength = Math.max(expectedWords.length, recognizedWords.length);
    
    for (let i = 0; i < maxLength; i++) {
      const expectedWord = expectedWords[i] || '';
      const recognizedWord = recognizedWords[i] || '';
      
      if (expectedWord !== recognizedWord) {
        if (recognizedWord) {
          mistakes.push(`Word ${i + 1}: Expected "${expectedWord}", got "${recognizedWord}"`);
        } else {
          mistakes.push(`Word ${i + 1}: Missing word "${expectedWord}"`);
        }
      }
    }

    return mistakes;
  }
}