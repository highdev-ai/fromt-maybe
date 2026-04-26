import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { authService } from '../services/auth';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const RootNavigator: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status on app start
    const checkAuth = async () => {
      try {
        const auth = await authService.isAuthenticated();
        setIsAuthenticated(auth);
      } catch (e) {
        console.log('Auth error:', e);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator setIsAuthenticated={setIsAuthenticated} />;
};

export default RootNavigator;
