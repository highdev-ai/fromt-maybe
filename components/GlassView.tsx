import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const GlassView = ({ children, style }: any) => {
  return (
    <View style={[styles.container, style]}>
      {/* Blur */}
      <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />

      {/* Liquid gradient */}
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.25)',
          'rgba(255,255,255,0.05)',
          'rgba(255,255,255,0.18)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Top highlight */}
      <View style={styles.highlight} />

      {/* Inner glow */}
      <View style={styles.innerGlow} />

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
});

export default GlassView;