import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AnimatedBackground from './AnimatedBackground';
import GlassView from './GlassView';

interface EmptyStateProps {
  onRefresh: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh }) => {
  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <GlassView style={styles.panel}>
          <Text style={styles.message}>No items found</Text>
          <TouchableOpacity style={styles.button} onPress={onRefresh}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
        </GlassView>
      </View>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panel: {
    width: '100%',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    color: '#42513d',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  button: {
    backgroundColor: 'rgba(105,132,84,0.76)',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  buttonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EmptyState;
