import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassView from '../components/GlassView';

const TestScreen: React.FC = () => {
  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <GlassView style={styles.panel}>
          <Text style={styles.title}>Test1</Text>
          <Text style={styles.text}>Glass tab content</Text>
        </GlassView>
      </View>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
    paddingBottom: 110,
  },
  panel: {
    padding: 24,
    borderRadius: 24,
  },
  title: {
    color: '#263323',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    color: '#52624c',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TestScreen;
