import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import AnimatedBackground from './AnimatedBackground';
import GlassView from './GlassView';

const SkeletonItem = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <GlassView style={styles.card}>
      <Animated.View style={{ opacity }}>
      <View style={styles.title} />
      <View style={styles.text} />
      <View style={styles.textShort} />
      </Animated.View>
    </GlassView>
  );
};

const SkeletonList = () => {
  return (
    <AnimatedBackground>
      <View style={styles.container}>
        {[...Array(5)].map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </View>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 24,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
  },
  title: {
    height: 20,
    width: '60%',
    backgroundColor: 'rgba(255,255,255,0.46)',
    marginBottom: 10,
    borderRadius: 6,
  },
  text: {
    height: 14,
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.34)',
    marginBottom: 6,
    borderRadius: 6,
  },
  textShort: {
    height: 14,
    width: '70%',
    backgroundColor: 'rgba(255,255,255,0.34)',
    borderRadius: 6,
  },
});

export default SkeletonList;
