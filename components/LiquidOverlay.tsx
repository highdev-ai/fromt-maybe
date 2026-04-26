import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const LiquidOverlay = () => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -20],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          transform: [{ translateX }, { translateY }],
          opacity: 0.05,
          backgroundColor: 'white',
        },
      ]}
    />
  );
};

export default LiquidOverlay;