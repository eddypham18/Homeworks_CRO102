import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import store from './configs/store';
import Bai1Screen from './screens/Bai1Screen';
import Bai2Screen from './screens/Bai2Screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Lab5 from './screens/Lab5';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Stack.Navigator
          initialRouteName="Lab5"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Bai1Screen" component={Bai1Screen} />
          <Stack.Screen name="Bai2Screen" component={Bai2Screen} />
          <Stack.Screen name="Lab5" component={Lab5} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </Provider>
  );
}
