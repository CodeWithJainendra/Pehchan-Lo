import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import AuthSelectionScreen from '../screens/AuthSelectionScreen';
import OTPAuthScreen from '../screens/OTPAuthScreen';
import BiometricAuthScreen from '../screens/BiometricAuthScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          cardStyle: { backgroundColor: '#F8FAFC' }
        }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{
            animationTypeForReplace: 'push'
          }}
        />
        <Stack.Screen 
          name="AuthSelection" 
          component={AuthSelectionScreen}
          options={{
            animationTypeForReplace: 'push'
          }}
        />
        <Stack.Screen 
          name="OTPAuth" 
          component={OTPAuthScreen}
          options={{
            gestureEnabled: true
          }}
        />
        <Stack.Screen 
          name="BiometricAuth" 
          component={BiometricAuthScreen}
          options={{
            gestureEnabled: true
          }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            gestureEnabled: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;