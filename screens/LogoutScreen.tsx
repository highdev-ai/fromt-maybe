import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassView from '../components/GlassView';
import { authService } from '../services/auth';

type LogoutScreenProps = {
  setIsAuthenticated: (value: boolean) => void;
};

const LogoutScreen: React.FC<LogoutScreenProps> = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <GlassView style={styles.panel}>
          <TouchableOpacity style={styles.button} onPress={handleLogout} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#f8fafc" />
            ) : (
              <Text style={styles.buttonText}>Logout</Text>
            )}
          </TouchableOpacity>
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
    borderRadius: 28,
  },
  button: {
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(105,132,84,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
  },
  buttonText: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default LogoutScreen;
