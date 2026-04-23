import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedBackground = ({ children }) => {
    const scheme = useColorScheme();
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, { toValue: 1, duration: 8000, useNativeDriver: false }),
                Animated.timing(anim, { toValue: 0, duration: 8000, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    const colors =
        scheme === 'dark'
            ? ['#0f2027', '#203a43', '#2c5364']
            : ['#e0c3fc', '#8ec5fc', '#f093fb'];

    return (
        <AnimatedGradient colors={colors} style={[
            styles.container,
            {
                transform: [
                    {
                        translateY: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -50],
                        }),
                    },
                ],
            },
        ]}>
            {children}
        </AnimatedGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});

export default AnimatedBackground;