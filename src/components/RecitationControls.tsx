import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface RecitationControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export const RecitationControls: React.FC<RecitationControlsProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onReset,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.primaryButton,
          isRecording && styles.recordingButton,
          disabled && styles.disabledButton,
        ]}
        onPress={isRecording ? onStopRecording : onStartRecording}
        disabled={disabled}
      >
        <Text style={[styles.buttonText, isRecording && styles.recordingText]}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton, disabled && styles.disabledButton]}
        onPress={onReset}
        disabled={disabled}
      >
        <Text style={styles.secondaryButtonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196f3',
  },
  recordingButton: {
    backgroundColor: '#f44336',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  disabledButton: {
    backgroundColor: '#e9ecef',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  recordingText: {
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});