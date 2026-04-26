import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AnimatedBackground from './AnimatedBackground';
import GlassView from './GlassView';

const LoadingSpinner: React.FC = () => {
  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <GlassView style={styles.panel}>
          <ActivityIndicator size="large" color="#344054" />
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
  },
  panel: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingSpinner;
