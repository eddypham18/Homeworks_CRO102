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
        {/* Không cần NavigationContainer vì expo-router đã bao bọc sẵn */}
        <Stack.Navigator
          initialRouteName="Bai1Screen"
          screenOptions={{
            headerShown: false,
            // Nếu cần sử dụng theme, bạn có thể áp dụng vào các screen qua props
            // Hoặc cấu hình trực tiếp trong từng screen
          }}
        >
          <Stack.Screen name="Bai1Screen" component={Bai1Screen} />
          <Stack.Screen name="Bai2Screen" component={Bai2Screen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </Provider>
  );
}
