import React, { useEffect, useRef } from 'react';
import { StyleProp, StyleSheet, useColorScheme, Animated, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

const AnimatedBlur = Animated.createAnimatedComponent(BlurView);

type GlassViewProps = React.PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  scrollY?: number;
}>;

const GlassView: React.FC<GlassViewProps> = ({ children, style, scrollY = 0 }) => {
  const scheme = useColorScheme();
  const blur = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blur, { toValue: 70, duration: 3000, useNativeDriver: false }),
        Animated.timing(blur, { toValue: 30, duration: 3000, useNativeDriver: false }),
      ])
    ).start();
  }, [blur]);

  return (
    <AnimatedBlur
      intensity={Math.min(80, 30 + scrollY / 5)}
      tint={scheme === 'dark' ? 'dark' : 'light'}
      style={[
        styles.container,
        {
          backgroundColor:
            scheme === 'dark'
              ? 'rgba(0,0,0,0.3)'
              : 'rgba(255,255,255,0.2)',
        },
        style,
      ]}
    >
      {children}
    </AnimatedBlur>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});

export default GlassView;
