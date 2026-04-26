import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

type AnimatedBackgroundProps = React.PropsWithChildren;

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
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

    return (
        <View style={styles.container}>
            <AnimatedGradient
                colors={['#f8fafc', '#d9dde3', '#f1f4f7', '#b7bdc7']}
                locations={[0, 0.34, 0.68, 1]}
                start={{ x: 0.05, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradient, { transform: [{ translateY }] }]}
            />
            <View style={[styles.cornerGlass, styles.topLeft]} />
            <View style={[styles.cornerGlass, styles.topRight]} />
            <View style={[styles.cornerGlass, styles.bottomLeft]} />
            <View style={[styles.cornerGlass, styles.bottomRight]} />
            {children}
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
    cornerGlass: {
        position: 'absolute',
        width: 148,
        height: 148,
        borderRadius: 34,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.58)',
        backgroundColor: 'rgba(255,255,255,0.16)',
    },
    topLeft: {
        top: -74,
        left: -74,
    },
    topRight: {
        top: -76,
        right: -76,
    },
    bottomLeft: {
        bottom: -78,
        left: -78,
    },
    bottomRight: {
        right: -82,
        bottom: -82,
    },
});

export default AnimatedBackground;
