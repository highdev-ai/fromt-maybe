import React from 'react';
import { StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';

interface Props {
    children: React.ReactNode;
    style?: ViewStyle;
}

const GlassView: React.FC<Props> = ({ children, style }) => {
    const scheme = useColorScheme(); // ✅ ТЕПЕР ВСЕРЕДИНІ

    return (
        <BlurView
            intensity={40}
            tint={scheme === 'dark' ? 'dark' : 'light'}
            style={[styles.container, style]}
        >
            {children}
        </BlurView>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});

export default GlassView;