import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Correction } from '../types';

interface CorrectionFeedbackProps {
  corrections: Correction[];
  mistakes: string[];
}

export const CorrectionFeedback: React.FC<CorrectionFeedbackProps> = ({
  corrections,
  mistakes,
}) => {
  if (corrections.length === 0 && mistakes.length === 0) {
    return null;
  }

  const averageAccuracy = corrections.length > 0 
    ? corrections.reduce((sum, c) => sum + c.accuracy, 0) / corrections.length 
    : 0;

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 0.9) return '#4caf50';
    if (accuracy >= 0.7) return '#ff9800';
    return '#f44336';
  };

  const getAccuracyLabel = (accuracy: number): string => {
    if (accuracy >= 0.9) return 'Excellent';
    if (accuracy >= 0.7) return 'Good';
    if (accuracy >= 0.5) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recitation Feedback</Text>
      
      {corrections.length > 0 && (
        <View style={styles.section}>
          <View style={styles.accuracyContainer}>
            <Text style={styles.sectionTitle}>Overall Accuracy</Text>
            <View style={styles.accuracyRow}>
              <Text style={[styles.accuracyPercentage, { color: getAccuracyColor(averageAccuracy) }]}>
                {Math.round(averageAccuracy * 100)}%
              </Text>
              <Text style={[styles.accuracyLabel, { color: getAccuracyColor(averageAccuracy) }]}>
                {getAccuracyLabel(averageAccuracy)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {mistakes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Areas for Improvement</Text>
          <ScrollView style={styles.mistakesContainer} nestedScrollEnabled>
            {mistakes.map((mistake, index) => (
              <View key={index} style={styles.mistakeItem}>
                <Text style={styles.mistakeText}>{mistake}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {corrections.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Attempts</Text>
          <ScrollView style={styles.correctionsContainer} nestedScrollEnabled>
            {corrections.slice(-3).map((correction) => (
              <View key={correction.id} style={styles.correctionItem}>
                <View style={styles.correctionHeader}>
                  <Text style={styles.correctionTime}>
                    {correction.timestamp.toLocaleTimeString()}
                  </Text>
                  <Text style={[styles.correctionAccuracy, { color: getAccuracyColor(correction.accuracy) }]}>
                    {Math.round(correction.accuracy * 100)}%
                  </Text>
                </View>
                <Text style={styles.correctionExpected}>Expected: {correction.expectedText}</Text>
                <Text style={styles.correctionRecognized}>Recognized: {correction.recognizedText}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  accuracyContainer: {
    alignItems: 'center',
  },
  accuracyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accuracyPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  accuracyLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  mistakesContainer: {
    maxHeight: 120,
  },
  mistakeItem: {
    backgroundColor: '#fff3cd',
    padding: 8,
    marginVertical: 2,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },
  mistakeText: {
    fontSize: 14,
    color: '#856404',
  },
  correctionsContainer: {
    maxHeight: 200,
  },
  correctionItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  correctionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  correctionTime: {
    fontSize: 12,
    color: '#6c757d',
  },
  correctionAccuracy: {
    fontSize: 14,
    fontWeight: '600',
  },
  correctionExpected: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
    textAlign: 'right',
  },
  correctionRecognized: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'right',
  },
});