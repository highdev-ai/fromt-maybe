import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedBackground = ({ children }: any) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const startY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const endY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  return (
    <>
      <AnimatedGradient
        colors={[
          '#d2e6c8',
          '#b4d2be',
          '#a0c8aa',
          '#d2e6c8',
        ]}
        start={{ x: 0, y: startY }}
        end={{ x: 1, y: endY }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </>
  );
};

export default AnimatedBackground;