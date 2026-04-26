import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

type AnimatedBackgroundProps = React.PropsWithChildren;

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 8000, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 8000, useNativeDriver: false }),
      ])
    ).start();
  }, [anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -36],
  });

  const screenFrameStyle = useMemo<ViewStyle>(() => {
    const hasNotch = insets.top >= 40;
    const topGlassWidth = hasNotch ? Math.min(42, Math.max(28, insets.top * 0.72)) : 18;
    const sideGlassWidth = hasNotch ? 16 : 14;
    const bottomGlassWidth = insets.bottom > 12 ? 22 : 16;
    const topRadius = hasNotch ? 58 : 40;
    const bottomRadius = insets.bottom > 12 ? 50 : 38;

    return {
      top: hasNotch ? 2 : 4,
      right: 3,
      bottom: insets.bottom > 12 ? 3 : 4,
      left: 3,
      borderTopWidth: topGlassWidth,
      borderRightWidth: sideGlassWidth,
      borderBottomWidth: bottomGlassWidth,
      borderLeftWidth: sideGlassWidth,
      borderTopLeftRadius: topRadius,
      borderTopRightRadius: topRadius,
      borderBottomLeftRadius: bottomRadius,
      borderBottomRightRadius: bottomRadius,
    };
  }, [insets.bottom, insets.top]);

  const innerFrameStyle = useMemo<ViewStyle>(() => {
    const hasNotch = insets.top >= 40;
    const topRadius = hasNotch ? 42 : 28;
    const bottomRadius = insets.bottom > 12 ? 34 : 26;

    return {
      borderTopLeftRadius: topRadius,
      borderTopRightRadius: topRadius,
      borderBottomLeftRadius: bottomRadius,
      borderBottomRightRadius: bottomRadius,
    };
  }, [insets.bottom, insets.top]);

  return (
    <View style={styles.container}>
      <AnimatedGradient
        colors={['#f8fafc', '#d9dde3', '#f1f4f7', '#b7bdc7']}
        locations={[0, 0.34, 0.68, 1]}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { transform: [{ translateY }] }]}
      />

      {children}

      <View pointerEvents="none" style={[styles.glassFrame, screenFrameStyle]}>
        {/* <View style={[styles.chromaticEdge, styles.coolRefraction, innerFrameStyle]} />
         <View style={[styles.chromaticEdge, styles.warmRefraction, innerFrameStyle]} /> 
        <View style={[styles.innerHighlight, innerFrameStyle]} />*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#d9dde3',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    height: '112%',
  },
  glassFrame: {
    position: 'absolute',
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(255,255,255,0.035)',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.78,
    shadowRadius: 28,
    elevation: 12,
  },
  chromaticEdge: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    opacity: 0.55,
  },
  coolRefraction: {
    margin: 5,
    borderColor: 'rgba(118,220,255,0.62)',
    transform: [{ translateX: -1 }, { translateY: 1 }],
  },
  warmRefraction: {
    margin: 8,
    borderColor: 'rgba(255,176,236,0.46)',
    transform: [{ translateX: 1 }, { translateY: -1 }],
  },
  innerHighlight: {
    flex: 1,
    margin: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.78)',
    backgroundColor: 'rgba(255,255,255,0.028)',
    shadowColor: '#dff7ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
});

export default AnimatedBackground;
