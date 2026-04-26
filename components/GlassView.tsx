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
      intensity={Math.min(72, 42 + scrollY / 8)}
      tint={scheme === 'dark' ? 'dark' : 'extraLight'}
      style={[
        styles.container,
        {
          backgroundColor:
            scheme === 'dark'
              ? 'rgba(18,24,32,0.38)'
              : 'rgba(255,255,255,0.32)',
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
    borderColor: 'rgba(255,255,255,0.62)',
    shadowColor: '#647080',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
});

export default GlassView;
