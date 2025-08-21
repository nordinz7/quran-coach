import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { VerseDisplay } from './src/components/VerseDisplay';
import { RecitationControls } from './src/components/RecitationControls';
import { CorrectionFeedback } from './src/components/CorrectionFeedback';
import { useRecitation } from './src/hooks/useRecitation';

export default function App() {
  const {
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
  } = useRecitation();

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Quran Coach</Text>
        <Text style={styles.subtitle}>Practice your recitation</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {currentVerse && (
          <VerseDisplay
            verse={currentVerse}
            isActive={true}
            showTranslation={true}
            showTransliteration={true}
          />
        )}

        <RecitationControls
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onReset={resetSession}
          disabled={isLoading}
        />

        <CorrectionFeedback
          corrections={corrections}
          mistakes={mistakes}
        />

        <View style={styles.versesSection}>
          <Text style={styles.sectionTitle}>Surah Al-Fatihah</Text>
          {verses.map((verse) => (
            <VerseDisplay
              key={verse.id}
              verse={verse}
              isActive={currentVerse?.id === verse.id}
              onPress={() => selectVerse(verse)}
              showTranslation={false}
              showTransliteration={false}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196f3',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#bbdefb',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
    marginVertical: 16,
  },
  versesSection: {
    marginTop: 20,
  },
});
