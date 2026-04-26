import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

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
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.title} />
      <View style={styles.text} />
      <View style={styles.textShort} />
    </Animated.View>
  );
};

const SkeletonList = () => {
  return (
    <View style={{ padding: 16 }}>
      {[...Array(5)].map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  title: {
    height: 20,
    width: '60%',
    backgroundColor: '#ccc',
    marginBottom: 10,
    borderRadius: 6,
  },
  text: {
    height: 14,
    width: '90%',
    backgroundColor: '#ddd',
    marginBottom: 6,
    borderRadius: 6,
  },
  textShort: {
    height: 14,
    width: '70%',
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
});

export default SkeletonList;
