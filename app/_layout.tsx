import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AppDataProvider } from '@/contexts/AppDataContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { DATABASE_NAME, initDatabase } from '@/db/schema';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        onInit={initDatabase}
        options={{ enableChangeListener: true }}>
        <ThemeProvider>
          <AppDataProvider>
            <ThemedNavigation />
          </AppDataProvider>
        </ThemeProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}

function ThemedNavigation() {
  const { colors, colorScheme, ready } = useTheme();

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.accent,
          headerTitleStyle: { color: colors.text },
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-task"
          options={{ presentation: 'modal', title: 'Task', headerShown: false }}
        />
        <Stack.Screen
          name="add-habit"
          options={{ presentation: 'modal', title: 'Habit', headerShown: false }}
        />
        <Stack.Screen
          name="weekly-review"
          options={{ title: 'Weekly Review', headerShown: false }}
        />
        <Stack.Screen
          name="my-os"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="evening-reflection"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="primary-focus"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="decision-filter"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen name="faith" options={{ headerShown: false }} />
        <Stack.Screen name="mind" options={{ headerShown: false }} />
        <Stack.Screen name="career" options={{ headerShown: false }} />
        <Stack.Screen name="builder" options={{ headerShown: false }} />
        <Stack.Screen name="character" options={{ headerShown: false }} />
        <Stack.Screen name="finance" options={{ headerShown: false }} />
        <Stack.Screen name="health" options={{ headerShown: false }} />
        <Stack.Screen name="identity" options={{ headerShown: false }} />
        <Stack.Screen name="life-compass" options={{ headerShown: false }} />
        <Stack.Screen name="edit-identity" options={{ headerShown: false }} />
        <Stack.Screen name="mind-notes" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
