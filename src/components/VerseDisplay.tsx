import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { QuranVerse } from '../types';

interface VerseDisplayProps {
  verse: QuranVerse;
  isActive?: boolean;
  onPress?: () => void;
  showTranslation?: boolean;
  showTransliteration?: boolean;
}

export const VerseDisplay: React.FC<VerseDisplayProps> = ({
  verse,
  isActive = false,
  onPress,
  showTranslation = true,
  showTransliteration = true,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={styles.surahAyah}>
          {verse.surah}:{verse.ayah}
        </Text>
      </View>
      
      <Text style={[styles.arabicText, isActive && styles.activeText]}>
        {verse.text}
      </Text>
      
      {showTransliteration && (
        <Text style={styles.transliteration}>
          {verse.transliteration}
        </Text>
      )}
      
      {showTranslation && (
        <Text style={styles.translation}>
          {verse.translation}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activeContainer: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  surahAyah: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'right',
    fontFamily: 'System',
    color: '#212529',
    marginBottom: 12,
  },
  activeText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  transliteration: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'left',
  },
  translation: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    textAlign: 'left',
  },
});