import { useState, useEffect, useCallback } from 'react';
import { QuranVerse, Correction, AudioConfig } from '../types';
import { AudioRecognitionService } from '../services/AudioRecognitionService';
import { VerseMatchingService } from '../services/VerseMatchingService';
import { QuranService } from '../services/QuranService';

export const useRecitation = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentVerse, setCurrentVerse] = useState<QuranVerse | null>(null);
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioService = new AudioRecognitionService();
  const matchingService = new VerseMatchingService();
  const quranService = new QuranService();

  const audioConfig: AudioConfig = {
    sampleRate: 44100,
    bitDepth: 16,
    channels: 1,
  };

  useEffect(() => {
    initializeServices();
    loadInitialVerses();
  }, []);

  const initializeServices = async () => {
    try {
      await audioService.initialize();
    } catch (err) {
      setError('Failed to initialize audio services');
      console.error('Audio initialization error:', err);
    }
  };

  const loadInitialVerses = async () => {
    try {
      const surah1Verses = await quranService.getVerses(1);
      setVerses(surah1Verses);
      if (surah1Verses.length > 0) {
        setCurrentVerse(surah1Verses[0]);
      }
    } catch (err) {
      setError('Failed to load verses');
      console.error('Verse loading error:', err);
    }
  };

  const startRecording = useCallback(async () => {
    if (isRecording) return;

    try {
      setIsLoading(true);
      setError(null);
      await audioService.startRecording(audioConfig);
      setIsRecording(true);
    } catch (err) {
      setError('Failed to start recording');
      console.error('Recording start error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isRecording]);

  const stopRecording = useCallback(async () => {
    if (!isRecording) return;

    try {
      setIsLoading(true);
      const audioUri = await audioService.stopRecording();
      setIsRecording(false);

      if (audioUri && currentVerse) {
        const recognizedText = await audioService.processAudio(audioUri);
        await processRecognizedText(recognizedText);
      }
    } catch (err) {
      setError('Failed to process recording');
      console.error('Recording processing error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isRecording, currentVerse]);

  const processRecognizedText = async (recognizedText: string) => {
    if (!currentVerse) return;

    const bestMatch = matchingService.findBestMatch(recognizedText, verses);
    
    if (bestMatch) {
      const correction = matchingService.generateCorrection(bestMatch, recognizedText);
      setCorrections(prev => [...prev, correction]);

      if (correction.accuracy < 0.8) {
        const newMistakes = matchingService.identifyMistakes(
          bestMatch.text,
          recognizedText
        );
        setMistakes(prev => [...prev, ...newMistakes]);
      }

      // Move to next verse if accuracy is good
      if (correction.accuracy >= 0.8) {
        moveToNextVerse();
      }
    } else {
      setMistakes(prev => [...prev, 'No matching verse found. Please try again.']);
    }
  };

  const moveToNextVerse = () => {
    if (!currentVerse) return;

    const currentIndex = verses.findIndex(v => v.id === currentVerse.id);
    if (currentIndex < verses.length - 1) {
      setCurrentVerse(verses[currentIndex + 1]);
    }
  };

  const resetSession = useCallback(() => {
    setCurrentVerse(verses[0] || null);
    setCorrections([]);
    setMistakes([]);
    setError(null);
  }, [verses]);

  const selectVerse = useCallback((verse: QuranVerse) => {
    setCurrentVerse(verse);
    setError(null);
  }, []);

  return {
    isRecording,
    currentVerse,
    verses,
    corrections,
    mistakes,
    isLoading,
    error,
    startRecording,
    stopRecording,
    resetSession,
    selectVerse,
  };
};