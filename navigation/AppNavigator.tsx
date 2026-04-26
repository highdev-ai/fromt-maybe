import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import GlassBottomTabBar from '../components/GlassBottomTabBar';
import LogoutScreen from '../screens/LogoutScreen';
import MainScreen from '../screens/MainScreen';
import TestScreen from '../screens/TestScreen';

export type AppTabParamList = {
  Home: undefined;
  Test1: undefined;
  Logout: undefined;
};

type AppNavigatorProps = {
  setIsAuthenticated: (value: boolean) => void;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const AppNavigator: React.FC<AppNavigatorProps> = ({ setIsAuthenticated }) => {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tab.Screen name="Home" component={MainScreen} options={{ tabBarLabel: 'home' }} />
      <Tab.Screen name="Test1" component={TestScreen} options={{ tabBarLabel: 'test1' }} />
      <Tab.Screen name="Logout" options={{ tabBarLabel: 'logout' }}>
        {() => <LogoutScreen setIsAuthenticated={setIsAuthenticated} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default AppNavigator;
